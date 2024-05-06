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
  Select,
  Typography,
  MenuItem,
  InputLabel,
  styled
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { format, parse } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useRentersQuery } from '../../api/renters/renters.api';
import {
  createApplicationsFetch,
  editApplicationFetch
} from 'store/applications/applicationSlice';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import {
  closeButtonStyle,
  listStyle,
  secondaryButtonStyle,
  CarNumberInput,
  DateInputStyle,
  selectMenuStyle
} from '../../theme/styles';
import { colors } from '../../theme/colors';
import { DateIcon } from '../Icons/DateIcon';

const defaultValues = {
  vehiclePlate: ''
};

const labelStyle = {
  pb: '4px',
  pl: '12px'
};

export default function AddApplicationDialog({ show, handleClose, edit }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [date, setDate] = useState(null);
  const [carNumber, setCarNumber] = useState('');
  const [renter, setRenter] = useState('');
  const [submited, setSubmited] = useState(true);
  const { data: renters } = useRentersQuery();
  const applicationEdit = useSelector(
    (state) => state.applications.editApplication
  );
  const isError = useSelector((state) => state.applications.isErrorFetch);

  useEffect(() => {
    if (show && edit && applicationEdit && applicationEdit.application) {
      if (renters.length > 0) {
        const currentRenter = renters.find(
          (renter) =>
            renter.company_name === applicationEdit.application.company_name
        );
        if (currentRenter) {
          setRenter(currentRenter);
        } else {
          setRenter('');
        }
      }
      setCarNumber(
        applicationEdit.application.vehicle_plate?.full_plate
          ? applicationEdit.application.vehicle_plate.full_plate
          : ''
      );
      setDate(
        applicationEdit.application.valid_for_date
          ? parse(
              applicationEdit.application.valid_for_date,
              'yyyy-MM-dd',
              new Date()
            )
          : null
      );
      setSubmited(true);
    }
  }, [show, edit, applicationEdit]);

  const formik = useFormik({
    initialValues: defaultValues,
    onSubmit: (values) => {
      const { vehiclePlate } = values;
      if (edit) {
        const payload = {
          valid_for_date: format(date, 'yyyy-MM-dd'),
          vehicle_plate: vehiclePlate || carNumber,
          company_name: renter.company_name,
          id: applicationEdit.application.id
        };
        dispatch(editApplicationFetch(payload));
      } else if (vehiclePlate !== '') {
        const payload = {
          valid_for_date: format(date, 'yyyy-MM-dd'),
          vehicle_plate: vehiclePlate,
          company_id: renter.id
        };
        dispatch(createApplicationsFetch(payload));
      }
      resetHandle();
      handleClose();
    }
  });

  const handleDateChange = (newValue) => {
    if (newValue) {
      setDate(newValue);
      if (carNumber !== '') {
        setSubmited(false);
      }
    }
  };

  const handleChangeNumber = (event) => {
    setCarNumber(event.target.value);
    if (event.target.value !== '') {
      setSubmited(false);
    } else {
      setSubmited(true);
    }
    formik.handleChange(event);
  };

  const handleRenterChange = (event) => {
    if (carNumber !== '') {
      setSubmited(false);
    }
    if (renters.length > 0) {
      const currentRenter = renters.find(
        (renter) => renter.company_name === event.target.value
      );
      if (currentRenter) {
        setRenter(currentRenter);
      } else {
        setRenter('');
      }
    }
  };

  const handleCloseDialog = () => {
    resetHandle();
    handleClose();
  };

  const resetHandle = () => {
    formik.resetForm();
    setDate(null);
    setCarNumber('');
    setRenter('');
    setSubmited(true);
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      scroll="body"
      sx={{ '& .MuiDialog-container': { ...listStyle, position: 'relative' } }}
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
          secondaryButtonStyle,
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
        {edit ? 'Редактировать заявку' : 'Добавить заявку'}
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
            <InputLabel htmlFor="vehiclePlate" sx={labelStyle}>
              Номер машины
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
          <Stack>
            <InputLabel htmlFor="date" sx={labelStyle}>
              Дата
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
                  sx: DateInputStyle,
                  placeholder: 'Дата'
                },
                openPickerButton: { disableRipple: true }
              }}
              slots={{
                openPickerIcon: DateIcon
              }}
            />
          </Stack>

          <Stack>
            <InputLabel htmlFor="renter" sx={labelStyle}>
              Арендатор
            </InputLabel>
            <Select
              id="renter"
              displayEmpty
              value={renter.company_name || ''}
              onChange={handleRenterChange}
              variant="filled"
              IconComponent={(props) => (
                <IconButton
                  disableRipple
                  {...props}
                  sx={{ top: `${0} !important`, right: `4px !important` }}
                >
                  <img
                    style={{
                      width: '24px'
                    }}
                    src={selectIcon}
                    alt="select"
                  />
                </IconButton>
              )}
              sx={selectMenuStyle}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: '8px',
                    border: '1px solid ' + colors.outline.default
                  }
                },
                MenuListProps: {
                  sx: { py: '4px' }
                }
              }}
              renderValue={(selected) => {
                if (selected === '') {
                  return <em></em>;
                } else {
                  return (
                    <Typography
                      component={'h5'}
                      noWrap
                      sx={{ fontWeight: 500 }}
                    >
                      {selected}
                    </Typography>
                  );
                }
              }}
            >
              <MenuItem disabled value="">
                <em> </em>
              </MenuItem>
              {renters &&
                renters.map((r) => (
                  <MenuItem
                    key={r.company_name}
                    id={r.company_name}
                    selected={r.company_name === renter}
                    value={r.company_name}
                  >
                    <Typography
                      component={'h5'}
                      noWrap
                      sx={{ fontWeight: 500, p: 0 }}
                    >
                      {r.company_name}
                    </Typography>
                  </MenuItem>
                ))}
            </Select>
          </Stack>
          <Button
            disableRipple
            disabled={submited}
            variant="contained"
            type="submit"
            sx={closeButtonStyle}
          >
            {edit ? 'Сохранить' : 'Добавить'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
