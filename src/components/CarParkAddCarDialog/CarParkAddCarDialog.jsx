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
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import { formatISO } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useRentersQuery } from '../../api/renters/renters.api';
import { accessPointsOnlyFetch } from 'store/accessPoints/accessPointsSlice';
import {
  createCarParkFetch,
  editCarParkFetch
} from 'store/carPark/carParkSlice';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import checkIcon from '../../assets/svg/multiselect_check_icon.svg';
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

const labelStyle = {
  pb: '4px',
  pl: '12px'
};

const validationSchema = yup.object({
  description: yup.string().required('Введите описание'),
  vehicle_plate: yup.string().required('Введите номер машины'),
  access_points: yup.string()
});

export default function AddCarDialog({ show, handleClose, edit }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [date, setDate] = useState(null);
  const [renter, setRenter] = useState('');
  const [submited, setSubmited] = useState(true);
  const { data: renters } = useRentersQuery();
  const accessPoints = useSelector((state) => state.accessPoints.accessPoints);
  const [actualAccessPoints, setActualAccessPoints] = useState([]);
  const carParkEdit = useSelector((state) => state.carPark.carParkEdit);
  const isError = useSelector((state) => state.carPark.isErrorFetch);
  const urlStatus = useParams();

  const defaultValues = useMemo(() => {
    if (carParkEdit && !_.isEmpty(carParkEdit)) {
      return {
        description: carParkEdit.description,
        vehicle_plate: carParkEdit.vehicle_plate?.full_plate || '',
        access_points: carParkEdit.access_points.join(',')
      };
    } else {
      return {
        description: '',
        vehicle_plate: '',
        access_points: ''
      };
    }
  }, [carParkEdit]);

  useEffect(() => {
    if (show && edit && carParkEdit) {
      setRenter(carParkEdit.renter ? carParkEdit.renter : '');
      setDate(new Date(carParkEdit.valid_until));
      setSubmited(true);
    }
  }, [show, edit]);

  useEffect(() => {
    dispatch(accessPointsOnlyFetch());
  }, []);

  useEffect(() => {
    if (accessPoints) {
      setActualAccessPoints(accessPoints);
    }
  }, [accessPoints]);

  const formik = useFormik({
    initialValues: defaultValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      date.setHours(23, 59, 0, 0);
      let payload = {
        ...values,
        valid_until: formatISO(date),
        status: urlStatus['*'],
        renter: renter,
        access_points: values.access_points
          .split(',')
          .map((i) => parseInt(i, 10))
          .filter((i) => !isNaN(i))
      };
      if (edit) {
        payload = {
          ...payload,
          id: carParkEdit.id
        };
        dispatch(editCarParkFetch(payload));
      } else {
        payload = {
          ...payload,
          is_active: true
        };
        dispatch(createCarParkFetch(payload));
      }
      resetHandle();
    }
  });

  const handleValidate = useCallback(() => {
    if (!_.isEmpty(formik.errors)) {
      Object.entries(formik.errors).map((error) => {
        enqueueSnackbar(`${error[1]}`, {
          variant: 'error',
          iconVariant: 'warning'
        });
      });
    }
  }, [formik.errors]);

  const handleSubmit = (event) => {
    handleValidate();
    formik.handleSubmit(event);
  };

  const handleValueChange = (event) => {
    formik.handleChange(event);
    setSubmited(false);
  };

  const handleMultiSelectChange = (event) => {
    const {
      target: { value }
    } = event;
    const points = value.map((item) => item).join(',');
    formik.setFieldValue('access_points', points);
    setSubmited(false);
  };

  const handleDateChange = (newValue) => {
    if (newValue) {
      setDate(newValue);
      setSubmited(false);
    }
  };

  const handleRenterChange = (event) => {
    if (event.target.value !== '') {
      const renter = renters.find((renter) => renter.id === event.target.value);
      if (renter) {
        const filteredItems = accessPoints.filter((item) =>
          renter.access_points.includes(item.id)
        );
        setActualAccessPoints(filteredItems);
      }
    } else {
      setActualAccessPoints(accessPoints);
    }
    setSubmited(false);
    setRenter(event.target.value);
  };

  const handleCloseDialog = () => {
    resetHandle();
    handleClose();
  };

  const resetHandle = () => {
    formik.resetForm();
    setDate(null);
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
          onSubmit={handleSubmit}
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
              value={formik.values.description}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="vehicle_plate" sx={labelStyle}>
              Номер машины
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="vehicle_plate"
              name="vehicle_plate"
              value={formik.values.vehicle_plate}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.vehicle_plate &&
                Boolean(formik.errors.vehicle_plate)
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
                  return <Typography component={'h5'}>...</Typography>;
                } else {
                  const selectedRenter = renters.find((r) => r.id === selected);
                  return (
                    <Typography
                      component={'h5'}
                      noWrap
                      sx={{ fontWeight: 500 }}
                    >
                      {selectedRenter?.company_name}
                    </Typography>
                  );
                }
              }}
            >
              <MenuItem value="">
                <Typography component={'h5'}>...</Typography>
              </MenuItem>
              {renters &&
                renters.map((r) => (
                  <MenuItem
                    key={r.id}
                    id={r.id}
                    selected={r.id === renter}
                    value={r.id}
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
          <Stack>
            <InputLabel htmlFor="access_points" sx={labelStyle}>
              Доступ к точкам доступа
            </InputLabel>
            <Select
              id="access_points"
              name="access_points"
              multiple
              displayEmpty
              value={formik.values.access_points.split(',')}
              onChange={handleMultiSelectChange}
              onBlur={formik.handleBlur}
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
                const selectedItems = accessPoints.filter((item) =>
                  selected.includes(item.id.toString())
                );
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selectedItems.map((item) => item.description).join(', ') ||
                      '...'}
                  </Typography>
                );
              }}
              error={
                formik.touched.access_points &&
                Boolean(formik.errors.access_points)
              }
            >
              <MenuItem
                disableRipple
                value=""
                sx={{
                  p: '8px',
                  pl: '40px',
                  '&.Mui-selected': { backgroundColor: 'transparent' }
                }}
              >
                <Typography component={'h5'}>...</Typography>
              </MenuItem>
              {actualAccessPoints.map((p) => {
                const selected = formik.values.access_points
                  .split(',')
                  .some((item) => item === p.id?.toString());
                return (
                  <MenuItem
                    key={p.id}
                    id={p.id}
                    disableRipple
                    selected={selected}
                    value={p.id?.toString() || ''}
                    sx={{
                      p: '8px',
                      '&.Mui-selected': { backgroundColor: 'transparent' }
                    }}
                  >
                    <Stack
                      direction={'row'}
                      gap={'8px'}
                      sx={{ height: '24px' }}
                      alignItems={'center'}
                    >
                      <Box sx={{ width: '24px' }}>
                        {selected && <img src={checkIcon} alt="checked" />}
                      </Box>
                      <Typography
                        component={'h5'}
                        noWrap
                        sx={{ fontWeight: 500, p: 0 }}
                      >
                        {p.description}
                      </Typography>
                    </Stack>
                  </MenuItem>
                );
              })}
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
