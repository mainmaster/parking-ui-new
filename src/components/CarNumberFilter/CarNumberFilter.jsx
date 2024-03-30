import { useDispatch, useSelector } from 'react-redux';
import {
  changeCurrentPage,
  eventsOnlyFetch,
  setFilters
} from '../../store/events/eventsSlice';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  styled
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { colors } from '../../theme/colors';
import searchIcon from '../../assets/svg/log_event_search_icon.svg';
import searchCancelIcon from '../../assets/svg/log_event_search_cancel_icon.svg';
import eventTuneIcon from '../../assets/svg/log_event_tune_icon.svg';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import { DateIcon } from './DateIcon';
import {
  closeButtonStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  CarNumberInput,
  DateInputStyle,
  selectMenuStyle
} from '../../theme/styles';
import { eventCodes } from '../../constants';
import { getAccessPointsRequest } from '../../api/access-points';
import { formatISO } from 'date-fns';

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: '0.875rem',
  pb: '4px',
  pl: '12px'
};

const defaultValues = {
  vehiclePlate: ''
};
export default function CarNumberFilter({ openForm, setOpenForm }) {
  const [selectedEventCode, setSelectedEventCode] = useState('');
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);
  const [accessPoints, setAccessPoints] = useState([]);
  const [selectedAccessPoint, setSelectedAccessPoint] = useState('');
  const [submited, setSubmited] = useState(true);
  const [numberInChange, setNumberInChange] = useState(false);
  const filters = useSelector((state) => state.events.filters);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setFilters(null));
    };
  }, []);

  useEffect(() => {
    getAccessPointsRequest().then((r) => {
      let access = r.data.map((point) => {
        return {
          name: point.description,
          value: point.id
        };
      });
      setAccessPoints([...access, { value: null, name: '' }]);
    });
  }, []);

  const formik = useFormik({
    initialValues: defaultValues,
    onSubmit: (values) => {
      dispatch(eventsOnlyFetch(filters));
      dispatch(changeCurrentPage(1));
      setSubmited(true);
    }
  });

  const resetHandle = () => {
    formik.resetForm();
    setSelectedEventCode('');
    setSelectedAccessPoint('');
    setFromValue(null);
    setToValue(null);
    dispatch(eventsOnlyFetch());
    dispatch(setFilters(null));
    dispatch(changeCurrentPage(1));
    setSubmited(true);
  };

  const handleChangeField = (e) => {
    if (!openForm) {
      const values = {
        vehiclePlate: e.target.value
      };
      dispatch(eventsOnlyFetch(values));
      dispatch(setFilters(values));
      dispatch(changeCurrentPage(1));
    } else if (openForm) {
      const values = {
        ...filters,
        vehiclePlate: e.target.value
      };
      dispatch(setFilters(values));
      setSubmited(false);
    }
    if (e.target.value === '') {
      setNumberInChange(false);
    } else {
      setNumberInChange(true);
    }
    formik.handleChange(e);
  };

  const handleOpenForm = () => {
    setOpenForm(!openForm);
  };

  const handleNumberErase = () => {
    formik.values.vehiclePlate = '';
    if (!openForm) {
      dispatch(eventsOnlyFetch());
      dispatch(setFilters(null));
      dispatch(changeCurrentPage(1));
    } else if (openForm) {
      const values = {
        ...filters,
        vehiclePlate: ''
      };
      dispatch(setFilters(values));
      setSubmited(false);
    }
    setNumberInChange(false);
  };

  const handleEventCodeChange = (event) => {
    const eventCode = eventCodes.find(
      (code) => code.name === event.target.value
    );
    if (eventCode) {
      const values = {
        ...filters,
        eventCode: eventCode.value
      };
      dispatch(setFilters(values));
      setSubmited(false);
    }
    setSelectedEventCode(event.target.value);
  };

  const handleFromDateChanged = (newValue) => {
    if (newValue) {
      const values = {
        ...filters,
        createDateFrom: formatISO(newValue)
      };
      dispatch(setFilters(values));
      setFromValue(newValue);
      setSubmited(false);
    }
  };

  const handleToDateChanged = (newValue) => {
    if (newValue) {
      const values = {
        ...filters,
        createDateTo: formatISO(newValue)
      };
      dispatch(setFilters(values));
      setToValue(newValue);
      setSubmited(false);
    }
  };

  const handleAccessPointChange = (event) => {
    const accessPoint = accessPoints.find(
      (apoint) => apoint.name === event.target.value
    );
    if (accessPoint) {
      const values = {
        ...filters,
        accessPoint: accessPoint.value
      };
      dispatch(setFilters(values));
      setSubmited(false);
    }
    setSelectedAccessPoint(event.target.value);
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit}
        //sx={{ flexGrow: 2 }}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={'8px'}
          sx={{ height: '64px', width: '100%', p: '16px', pb: '8px' }}
        >
          <CarNumberInput
            autoFocus
            fullWidth
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{
                    height: '100%',
                    mt: '0 !important',
                    mr: '4px'
                  }}
                >
                  <img
                    style={{
                      height: 24
                    }}
                    src={searchIcon}
                    alt="Найти по номеру"
                  />
                </InputAdornment>
              ),
              endAdornment: numberInChange && (
                <InputAdornment position="end">
                  <IconButton
                    disableRipple
                    aria-label="cancel"
                    onClick={handleNumberErase}
                    sx={{ p: 0 }}
                  >
                    <img
                      style={{
                        height: 24
                      }}
                      src={searchCancelIcon}
                      alt={'Очистить'}
                    />
                  </IconButton>
                </InputAdornment>
              )
            }}
            variant="filled"
            id="vehiclePlate"
            name="vehiclePlate"
            placeholder="Найти по номеру"
            value={formik.values.vehiclePlate}
            onChange={handleChangeField}
            onBlur={formik.handleBlur}
            error={
              formik.touched.vehiclePlate && Boolean(formik.errors.vehiclePlate)
            }
          />

          <IconButton
            disableRipple
            onClick={handleOpenForm}
            sx={[
              secondaryButtonStyle,
              {
                width: '48px',
                height: '40px'
              }
            ]}
          >
            <img
              style={{
                width: '24px'
              }}
              src={eventTuneIcon}
              alt="img"
            />
          </IconButton>
        </Stack>
        {openForm && (
          <Stack
            sx={{
              p: '16px',
              pt: '8px',
              borderBottom: `1px solid ${colors.outline.surface}`
            }}
            gap={'8px'}
          >
            <Stack>
              <InputLabel htmlFor="eventcode-select" sx={labelStyle}>
                Тип события
              </InputLabel>
              <Select
                id="eventcode-select"
                displayEmpty
                value={selectedEventCode}
                onChange={handleEventCodeChange}
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
                    return <em>Выбрать</em>;
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
                  <em>Выбрать</em>
                </MenuItem>
                {eventCodes.map((code) => (
                  <MenuItem
                    key={code.value}
                    id={code.name}
                    selected={code.name === selectedEventCode}
                    value={code.name}
                  >
                    <Typography
                      component={'h5'}
                      noWrap
                      sx={{ fontWeight: 500, p: 0 }}
                    >
                      {code.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack>
              <Typography sx={labelStyle}>Дата</Typography>
              <Stack direction={'row'} gap={'8px'}>
                <DatePicker
                  value={fromValue}
                  format={'dd.MM.yyyy'}
                  disableFuture
                  maxDate={toValue ? toValue : undefined}
                  onChange={handleFromDateChanged}
                  slotProps={{
                    textField: {
                      variant: 'filled',
                      sx: DateInputStyle,
                      placeholder: 'От'
                    },
                    openPickerButton: { disableRipple: true }
                  }}
                  slots={{
                    openPickerIcon: DateIcon
                  }}
                />
                <DatePicker
                  value={toValue}
                  format={'dd.MM.yyyy'}
                  disableFuture
                  minDate={fromValue ? fromValue : undefined}
                  onChange={handleToDateChanged}
                  slotProps={{
                    textField: {
                      variant: 'filled',
                      sx: DateInputStyle,
                      placeholder: 'До'
                    },
                    openPickerButton: { disableRipple: true }
                  }}
                  slots={{
                    openPickerIcon: DateIcon
                  }}
                />
              </Stack>
            </Stack>
            <Stack>
              <InputLabel htmlFor="accesspoint-select" sx={labelStyle}>
                Точка доступа
              </InputLabel>
              <Select
                id="accesspoint-select"
                displayEmpty
                value={selectedAccessPoint}
                onChange={handleAccessPointChange}
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
                    return <em>Выбрать</em>;
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
                  <em>Выбрать</em>
                </MenuItem>
                {accessPoints.map((apoint) => (
                  <MenuItem
                    key={apoint.value}
                    id={apoint.name}
                    selected={apoint.name === selectedAccessPoint}
                    value={apoint.name}
                  >
                    <Typography
                      component={'h5'}
                      noWrap
                      sx={{ fontWeight: 500, p: 0 }}
                    >
                      {apoint.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack direction={'row'} gap={'8px'} sx={{ pt: '8px' }}>
              <Button
                disabled={submited}
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={[closeButtonStyle, { flexGrow: 1 }]}
                type="submit"
              >
                Применить
              </Button>
              <Button
                disabled={!filters}
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={[secondaryButtonStyle, { flexGrow: 1 }]}
                onClick={resetHandle}
              >
                Сбросить
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </>
  );
}
