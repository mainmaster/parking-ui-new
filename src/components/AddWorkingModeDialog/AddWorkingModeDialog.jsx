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
  FormGroup,
  FormControlLabel,
  Switch,
  styled
} from '@mui/material';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { setHours, setMinutes } from 'date-fns';
import _ from 'lodash';
import {
  createWorkingModeFetch,
  editWorkingModeFetch
} from 'store/workingModes/workingModesSlice';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import {
  closeButtonStyle,
  listStyle,
  secondaryButtonStyle,
  CarNumberInput,
  selectMenuStyle,
  DateInputStyle
} from '../../theme/styles';
import { passModeOptions } from 'constants';
import { colors } from '../../theme/colors';

const validationSchemaHour = yup.object({
  description: yup.string().required('Введите название'),
  pass_mode: yup.string().required('Выберите режим'),
  price: yup
    .number()
    .min(0, 'Цена должна быть положительной')
    .required('Введите цену'),
  entry_fee: yup
    .number()
    .min(0, 'Входная плата должна быть положительной')
    .required('Введите входную плату'),
  transit_block_time_min: yup
    .number()
    .min(0, 'Время должно быть положительным')
    .max(59, 'Время должно быть меньше 60')
    .required('Введите время блокировки'),
  free_time_min: yup
    .number()
    .min(0, 'Время должно быть положительным')
    .max(59, 'Время должно быть меньше 60')
    .required('Введите свободное время')
});

const validationSchemaInterval = yup.object({
  description: yup.string().required('Введите название'),
  pass_mode: yup.string().required('Выберите режим'),
  price: yup
    .number()
    .min(0, 'Цена должна быть положительной')
    .required('Введите цену'),
  transit_block_time_min: yup
    .number()
    .min(0, 'Время должно быть положительным')
    .max(59, 'Время должно быть меньше 60')
    .required('Введите время блокировки'),
  interval: yup
    .number()
    .min(0, 'Интервал должен быть положительным')
    .required('Введите интервал')
});

const validationSchemaDay = yup.object({
  description: yup.string().required('Введите название'),
  pass_mode: yup.string().required('Выберите режим'),
  price: yup
    .number()
    .min(0, 'Цена должна быть положительной')
    .required('Введите цену'),
  day_counts_from_mins: yup
    .number()
    .min(0, 'Задержка должна быть положительной')
    .required('Введите задержку')
});

const validationSchemaFirstHours = yup.object({
  description: yup.string().required('Введите название'),
  pass_mode: yup.string().required('Выберите режим'),
  price: yup
    .number()
    .min(0, 'Цена должна быть положительной')
    .required('Введите цену'),
  number_of_first_mins: yup
    .number()
    .min(0, 'Количество должно быть положительным')
    .required('Введите количество первых N минут')
});

const validationSchemaClosed = yup.object({
  description: yup.string().required('Введите название'),
  pass_mode: yup.string().required('Выберите режим'),
  transit_block_time_min: yup
    .number()
    .min(0, 'Время должно быть положительным')
    .max(59, 'Время должно быть меньше 60')
    .required('Введите время транзитной блокировки')
});

const labelStyle = {
  pb: '4px',
  pl: '12px',
  whiteSpace: 'wrap'
};

export default function AddWorkingModeDialog({ show, handleClose, edit }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [submited, setSubmited] = useState(true);
  const [timeFrom, setTimeFrom] = useState(
    setHours(setMinutes(new Date(), 0), 0)
  );
  const [timeTo, setTimeTo] = useState(setHours(setMinutes(new Date(), 0), 0));
  const [passMode, setPassMode] = useState('');
  const workingModeEdit = useSelector(
    (state) => state.workingModes.workingModeEdit
  );
  const isError = useSelector((state) => state.workingModes.isErrorFetch);

  const defaultValues = useMemo(() => {
    if (workingModeEdit) {
      return {
        description: workingModeEdit.description,
        pass_mode: workingModeEdit.pass_mode,
        price: workingModeEdit.price,
        entry_fee: workingModeEdit.entry_fee,
        transit_block_time_min: workingModeEdit.transit_block_time_min,
        free_time_min: workingModeEdit.free_time_min,
        interval: workingModeEdit.interval,
        day_counts_from_mins: workingModeEdit.day_counts_from_mins,
        number_of_first_mins: workingModeEdit.number_of_first_mins
      };
    } else {
      return {
        description: '',
        pass_mode: '',
        price: '',
        entry_fee: '',
        transit_block_time_min: '',
        free_time_min: '',
        interval: '',
        day_counts_from_mins: '',
        number_of_first_mins: ''
      };
    }
  }, [workingModeEdit]);

  useEffect(() => {
    if (workingModeEdit && !_.isEmpty(workingModeEdit)) {
      setPassMode(workingModeEdit.pass_mode);
      setTimeFrom(
        setHours(
          setMinutes(timeFrom, workingModeEdit.time_lte_min),
          workingModeEdit.time_lte_hour
        )
      );
      setTimeTo(
        setHours(
          setMinutes(timeTo, workingModeEdit.time_gte_min),
          workingModeEdit.time_gte_hour
        )
      );
    } else {
      setPassMode('');
      setTimeFrom(setHours(setMinutes(new Date(), 0), 0));
      setTimeTo(setHours(setMinutes(new Date(), 0), 0));
    }
  }, [workingModeEdit, edit]);

  const validationSchema = useMemo(() => {
    switch (passMode) {
      case 'pay_by_hour':
        return validationSchemaHour;
        break;
      case 'pay_by_day':
        return validationSchemaDay;
        break;
      case 'pay_by_first_hours':
        return validationSchemaFirstHours;
        break;
      case 'pay_by_interval':
        return validationSchemaInterval;
        break;
      case 'closed':
        return validationSchemaClosed;
        break;
      default:
        return validationSchemaHour;
    }
  }, [passMode]);

  const formik = useFormik({
    initialValues: defaultValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const {
        description,
        pass_mode,
        price,
        entry_fee,
        transit_block_time_min,
        free_time_min,
        interval,
        day_counts_from_mins,
        number_of_first_mins
      } = values;
      let payload = {
        description: description,
        pass_mode: pass_mode
      };
      switch (pass_mode) {
        case 'pay_by_hour':
          payload = {
            ...payload,
            price: price,
            entry_fee: entry_fee,
            transit_block_time_min: transit_block_time_min,
            free_time_min: free_time_min,
            time_lte_hour: timeFrom.getHours(),
            time_lte_min: timeFrom.getMinutes(),
            time_gte_hour: timeTo.getHours(),
            time_gte_min: timeTo.getMinutes()
          };
          break;
        case 'pay_by_day':
          payload = {
            ...payload,
            price: price,
            day_counts_from_mins: day_counts_from_mins
          };
          break;
        case 'pay_by_first_hours':
          payload = {
            ...payload,
            price: price,
            number_of_first_mins: number_of_first_mins
          };
          break;
        case 'pay_by_interval':
          payload = {
            ...payload,
            price: price,
            interval: interval,
            transit_block_time_min: transit_block_time_min
          };
          break;
        case 'closed':
          payload = {
            ...payload,
            price: 0,
            transit_block_time_min: transit_block_time_min,
            time_lte_hour: timeFrom.getHours(),
            time_lte_min: timeFrom.getMinutes(),
            time_gte_hour: timeTo.getHours(),
            time_gte_min: timeTo.getMinutes()
          };
      }
      if (edit) {
        payload = {
          ...payload,
          id: workingModeEdit.id
        };
        dispatch(editWorkingModeFetch(payload));
      } else {
        dispatch(createWorkingModeFetch(payload));
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

  const handlePassModeChange = (event) => {
    setPassMode(event.target.value);
    formik.handleChange(event);
    setSubmited(false);
  };

  const handleCloseDialog = () => {
    handleClose();
    resetHandle();
  };

  const resetHandle = () => {
    formik.resetForm();
    setSubmited(true);
  };

  const handleTimeFromChange = (newValue) => {
    if (newValue) {
      setTimeFrom(newValue);
      setSubmited(false);
    }
  };

  const handleTimeToChange = (newValue) => {
    if (newValue) {
      setTimeTo(newValue);
      setSubmited(false);
    }
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
        {edit ? 'Редактировать режим' : 'Добавить режим'}
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
            <InputLabel htmlFor="description" sx={labelStyle}>
              Название
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
          {(passMode || _.isEmpty(workingModeEdit)) && (
            <>
              <Stack>
                <InputLabel htmlFor="pass_mode" sx={labelStyle}>
                  Пропускной режим
                </InputLabel>
                <Select
                  id="pass_mode"
                  name="pass_mode"
                  displayEmpty={true}
                  value={passMode}
                  onChange={handlePassModeChange}
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
                  renderValue={(selected) => {
                    const selectedName = passModeOptions.find(
                      (item) => item.value === selected
                    );
                    return (
                      <Typography
                        component={'h5'}
                        noWrap
                        sx={{ fontWeight: 500 }}
                      >
                        {selectedName?.name}
                      </Typography>
                    );
                  }}
                  error={
                    formik.touched.pass_mode && Boolean(formik.errors.pass_mode)
                  }
                >
                  <MenuItem value="">
                    <em> </em>
                  </MenuItem>
                  {passModeOptions.map((m) => (
                    <MenuItem
                      key={m.name}
                      id={m.name}
                      selected={m.value === formik.values.pass_mode}
                      value={m.value}
                    >
                      <Typography
                        component={'h5'}
                        noWrap
                        sx={{ fontWeight: 500, p: 0 }}
                      >
                        {m.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </>
          )}

          {passMode !== '' && passMode !== 'closed' && (
            <Stack>
              <InputLabel htmlFor="price" sx={labelStyle}>
                Цена
              </InputLabel>
              <CarNumberInput
                fullWidth
                InputProps={{
                  type: 'number',
                  disableUnderline: true,
                  sx: { paddingLeft: '12px' }
                }}
                variant="filled"
                id="price"
                name="price"
                value={formik.values.price}
                onChange={handleValueChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
              />
            </Stack>
          )}
          {passMode === 'pay_by_hour' && (
            <Stack>
              <InputLabel htmlFor="entry_fee" sx={labelStyle}>
                Входная плата
              </InputLabel>
              <CarNumberInput
                fullWidth
                InputProps={{
                  type: 'number',
                  disableUnderline: true,
                  sx: { paddingLeft: '12px' }
                }}
                variant="filled"
                id="entry_fee"
                name="entry_fee"
                value={formik.values.entry_fee}
                onChange={handleValueChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.entry_fee && Boolean(formik.errors.entry_fee)
                }
              />
            </Stack>
          )}
          {passMode === 'pay_by_interval' && (
            <Stack>
              <InputLabel htmlFor="interval" sx={labelStyle}>
                Интервал
              </InputLabel>
              <CarNumberInput
                fullWidth
                InputProps={{
                  type: 'number',
                  disableUnderline: true,
                  sx: { paddingLeft: '12px' }
                }}
                variant="filled"
                id="interval"
                name="interval"
                value={formik.values.interval}
                onChange={handleValueChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.interval && Boolean(formik.errors.interval)
                }
              />
            </Stack>
          )}
          {passMode === 'pay_by_day' && (
            <Stack>
              <InputLabel htmlFor="day_counts_from_mins" sx={labelStyle}>
                Задержка для запуска суточного режима (минут)
              </InputLabel>
              <CarNumberInput
                fullWidth
                InputProps={{
                  type: 'number',
                  disableUnderline: true,
                  sx: { paddingLeft: '12px' }
                }}
                variant="filled"
                id="day_counts_from_mins"
                name="day_counts_from_mins"
                value={formik.values.day_counts_from_mins}
                onChange={handleValueChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.day_counts_from_mins &&
                  Boolean(formik.errors.day_counts_from_mins)
                }
              />
            </Stack>
          )}
          {passMode === 'pay_by_first_hours' && (
            <Stack>
              <InputLabel htmlFor="number_of_first_mins" sx={labelStyle}>
                Количество первых N минут
              </InputLabel>
              <CarNumberInput
                fullWidth
                InputProps={{
                  type: 'number',
                  disableUnderline: true,
                  sx: { paddingLeft: '12px' }
                }}
                variant="filled"
                id="number_of_first_mins"
                name="number_of_first_mins"
                value={formik.values.number_of_first_mins}
                onChange={handleValueChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.number_of_first_mins &&
                  Boolean(formik.errors.number_of_first_mins)
                }
              />
            </Stack>
          )}
          {(passMode === 'pay_by_hour' ||
            passMode === 'pay_by_interval' ||
            passMode === 'closed') && (
            <Stack>
              <InputLabel htmlFor="transit_block_time_min" sx={labelStyle}>
                Время транзитной блокировки (минут)
              </InputLabel>
              <CarNumberInput
                fullWidth
                InputProps={{
                  type: 'number',
                  disableUnderline: true,
                  sx: { paddingLeft: '12px' }
                }}
                variant="filled"
                id="transit_block_time_min"
                name="transit_block_time_min"
                value={formik.values.transit_block_time_min}
                onChange={handleValueChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.transit_block_time_min &&
                  Boolean(formik.errors.transit_block_time_min)
                }
              />
            </Stack>
          )}
          {passMode === 'pay_by_hour' && (
            <Stack>
              <InputLabel htmlFor="free_time_min" sx={labelStyle}>
                Свободное время (минут)
              </InputLabel>
              <CarNumberInput
                fullWidth
                InputProps={{
                  type: 'number',
                  disableUnderline: true,
                  sx: { paddingLeft: '12px' }
                }}
                variant="filled"
                id="free_time_min"
                name="free_time_min"
                value={formik.values.free_time_min}
                onChange={handleValueChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.free_time_min &&
                  Boolean(formik.errors.free_time_min)
                }
              />
            </Stack>
          )}
          {(passMode === 'pay_by_hour' || passMode === 'closed') && (
            <>
              {timeFrom && (
                <Stack>
                  <InputLabel htmlFor="timeFrom" sx={labelStyle}>
                    Время от (часов и минут)
                  </InputLabel>
                  <TimeField
                    id="timeFrom"
                    value={timeFrom}
                    format={'HH:mm'}
                    onChange={handleTimeFromChange}
                    slotProps={{
                      textField: {
                        variant: 'filled',
                        sx: DateInputStyle,
                        placeholder: '00:00'
                      }
                    }}
                  />
                </Stack>
              )}
              {timeTo && (
                <Stack>
                  <InputLabel htmlFor="timeTo" sx={labelStyle}>
                    Время до (часов и минут)
                  </InputLabel>
                  <TimeField
                    id="timeTo"
                    value={timeTo}
                    format={'HH:mm'}
                    onChange={handleTimeToChange}
                    slotProps={{
                      textField: {
                        variant: 'filled',
                        sx: DateInputStyle,
                        placeholder: '00:00'
                      }
                    }}
                  />
                </Stack>
              )}
            </>
          )}

          <Button
            disableRipple
            disabled={submited}
            variant="contained"
            type="submit"
            sx={closeButtonStyle}
          >
            {edit ? 'Сохранить' : 'Добавить'}
          </Button>
          {show && passMode === '' && (
            <Typography
              sx={{
                width: '100%',
                textAlign: 'center',
                color: colors.element.error
              }}
            >
              Заполните поля, чтобы добавить режим
            </Typography>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
