import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Typography,
  InputLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { formatISO } from 'date-fns';
import { useParams } from 'react-router-dom';
import {
  createBlackListFetch,
  editBlackListFetch
} from 'store/blackList/blackListSlice';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import {
  primaryButtonStyle,
  listStyle,
  secondaryButtonStyle,
  CarNumberInput,
  DateInputStyle
} from '../../theme/styles';
import { DateIcon } from '../Icons/DateIcon';
import {useTranslation} from "react-i18next";

const defaultValues = {
  description: '',
  vehiclePlate: ''
};

const labelStyle = {
  pb: '4px',
  pl: '12px'
};

export default function AddCarDialog({ show, handleClose, edit }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [date, setDate] = useState(null);
  const [carNumber, setCarNumber] = useState('');
  const [carDescription, setCarDescription] = useState('');
  const [submited, setSubmited] = useState(true);
  const blackListEdit = useSelector((state) => state.blackList.blackListEdit);
  const isError = useSelector((state) => state.blackList.isErrorFetch);
  const urlStatus = useParams();
  const theme = useTheme();

  useEffect(() => {
    if (show && edit && blackListEdit) {
      setCarDescription(blackListEdit.description);
      setCarNumber(blackListEdit.vehicle_plate.full_plate);
      setDate(new Date(blackListEdit.valid_until));
      setSubmited(true);
    }
  }, [show, edit]);

  const formik = useFormik({
    initialValues: defaultValues,
    onSubmit: (values) => {
      const { description, vehiclePlate } = values;
      if (edit) {
        const payload = {
          valid_until: formatISO(date),
          description: description || carDescription,
          vehicle_plate: vehiclePlate || carNumber,
          id: blackListEdit.id
        };
        dispatch(editBlackListFetch(payload));
      } else if (description !== '' && vehiclePlate !== '') {
        date.setHours(23, 59, 0, 0);
        const payload = {
          valid_until: formatISO(date),
          description: description,
          vehicle_plate: vehiclePlate
        };
        dispatch(createBlackListFetch(payload));
      }
      resetHandle();
    }
  });

  const handleDateChange = (newValue) => {
    if (newValue) {
      setDate(newValue);
      if (carNumber !== '' && carDescription !== '') {
        setSubmited(false);
      }
    }
  };

  const handleChangeNumber = (event) => {
    setCarNumber(event.target.value);
    if (event.target.value !== '' && carDescription !== '') {
      setSubmited(false);
    } else {
      setSubmited(true);
    }
    formik.handleChange(event);
  };

  const handleChangeDescription = (event) => {
    setCarDescription(event.target.value);
    if (event.target.value !== '' && carNumber !== '') {
      setSubmited(false);
    } else {
      setSubmited(true);
    }
    formik.handleChange(event);
  };

  const handleCloseDialog = () => {
    resetHandle();
    handleClose();
  };

  const resetHandle = () => {
    formik.resetForm();
    setDate(null);
    setCarNumber('');
    setCarDescription('');
    setSubmited(true);
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      scroll="body"
      sx={{
        '& .MuiDialog-container': {
          ...listStyle({ ...theme }),
          position: 'relative'
        }
      }}
      PaperProps={{
        style: {
          borderRadius: '24px',
          width: '100%',
          maxWidth: '500px',
          minWidth: '320px',
          margin: 0
        }
      }}
    >
      <IconButton
        disableRipple
        onClick={handleCloseDialog}
        sx={[
          secondaryButtonStyle({ ...theme }),
          {
            position: 'absolute',
            right: '16px',
            top: '16px',
            '&, &:link, &.visited': {
              px: '11px'
            }
          }
        ]}
      >
        <img style={{ width: '24px' }} src={closeIcon} />
      </IconButton>
      <DialogTitle
        sx={{
          fontSize: '1.5rem',
          lineHeight: '1.75rem',
          p: '22px 48px',
          textAlign: 'center'
        }}
      >
        {edit ? t('components.blackListAddCarDialog.editCar') : t('components.blackListAddCarDialog.addBlackList')}
      </DialogTitle>
      <DialogActions sx={{ justifyContent: 'center', p: 0 }}>
        <Box
          maxWidth="sm"
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
          sx={{
            display: 'flex',
            padding: '16px',
            paddingTop: 0,
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '16px',
            flexGrow: 1,
            maxWidth: '500px'
          }}
        >
          <Stack>
            <InputLabel htmlFor="date" sx={labelStyle}>
              {t('components.blackListAddCarDialog.accessDeniedTo')}
            </InputLabel>
            <DatePicker
              id="date"
              value={date}
              format={'dd.MM.yyyy'}
              minDate={Date.now()}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  variant: 'filled',
                  sx: DateInputStyle({ ...theme }),
                  placeholder: t('components.blackListAddCarDialog.date')
                },
                openPickerButton: { disableRipple: true }
              }}
              slots={{
                openPickerIcon: DateIcon
              }}
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="description" sx={labelStyle}>
              {t('components.blackListAddCarDialog.description')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="description"
              name="description"
              value={carDescription}
              onChange={handleChangeDescription}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="vehiclePlate" sx={labelStyle}>
              {t('components.blackListAddCarDialog.vehiclePlate')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="vehiclePlate"
              name="vehiclePlate"
              value={carNumber}
              onChange={handleChangeNumber}
              onBlur={formik.handleBlur}
              error={
                formik.touched.vehiclePlate &&
                Boolean(formik.errors.vehiclePlate)
              }
            />
          </Stack>
          <Button
            disableRipple
            disabled={submited}
            variant="contained"
            type="submit"
            sx={primaryButtonStyle({ ...theme })}
          >
            {edit ? t('components.blackListAddCarDialog.save') : t('components.blackListAddCarDialog.add')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
