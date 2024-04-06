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
import { formatISO } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useRentersQuery } from '../../api/renters/renters.api';
import {
  createCarParkFetch,
  editCarParkFetch
} from 'store/carPark/carParkSlice';
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
import { DateIcon } from './DateIcon';

const defaultValues = {
  description: '',
  vehiclePlate: ''
};

const labelStyle = {
  pb: '4px',
  pl: '12px'
};

export default function AddCarDialog({ show, handleClose, edit }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [date, setDate] = useState(null);
  const [carNumber, setCarNumber] = useState('');
  const [carDescription, setCarDescription] = useState('');
  const [renter, setRenter] = useState('');
  const [submited, setSubmited] = useState(true);
  const { data: renters } = useRentersQuery();
  const carParkEdit = useSelector((state) => state.carPark.carParkEdit);
  const isError = useSelector((state) => state.carPark.isErrorFetch);
  const urlStatus = useParams();

  useEffect(() => {
    if (show && edit && carParkEdit) {
      setCarDescription(carParkEdit.description);
      setRenter(carParkEdit.renter ? carParkEdit.renter : '');
      setCarNumber(carParkEdit.vehicle_plate.full_plate);
      setDate(new Date(carParkEdit.valid_until));
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
          status: urlStatus['*'],
          renter: renter,
          id: carParkEdit.id
        };
        dispatch(editCarParkFetch(payload));
        if (!isError) {
          enqueueSnackbar('Машина сохранена', { variant: 'success' });
        }
      } else if (description !== '' && vehiclePlate !== '') {
        date.setHours(23, 59, 0, 0);
        const payload = {
          valid_until: formatISO(date),
          description: description,
          vehicle_plate: vehiclePlate,
          status: urlStatus['*'],
          renter: renter,
          is_active: true
        };
        dispatch(createCarParkFetch(payload));
        if (!isError) {
          enqueueSnackbar('Машина добавлена', { variant: 'success' });
        }
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

  const handleRenterChange = (event) => {
    if (carNumber !== '' && carDescription !== '') {
      setSubmited(false);
    }
    setRenter(event.target.value);
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
        {edit ? 'Редактировать машину' : 'Добавить машину'}
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
              Пропуск активен до
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
            <InputLabel htmlFor="description" sx={labelStyle}>
              Описание
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
            <InputLabel htmlFor="renter" sx={labelStyle}>
              Арендатор
            </InputLabel>
            <Select
              id="renter"
              displayEmpty
              value={renter}
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
