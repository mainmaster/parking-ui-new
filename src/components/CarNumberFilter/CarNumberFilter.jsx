import { useDispatch, useSelector } from 'react-redux';
import {
  changeCurrentPage,
  eventsFetch,
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
import { useTheme } from '@mui/material/styles';
import {
  DatePicker,
  renderTimeViewClock,
  TimePicker
} from '@mui/x-date-pickers';
import searchIcon from '../../assets/svg/log_event_search_icon.svg';
import searchCancelIcon from '../../assets/svg/log_event_search_cancel_icon.svg';
import eventTuneIcon from '../../assets/svg/log_event_tune_icon.svg';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import { DateIcon } from '../Icons/DateIcon';
import {
  primaryButtonStyle,
  secondaryButtonStyle,
  CarNumberInput,
  DateInputStyle,
  selectMenuStyle
} from '../../theme/styles';
//import { eventCodes } from '../../constants';
import { getAccessPointsRequest } from '../../api/access-points';
import { getEventCodesRequest } from '../../api/events';
import { formatISO } from 'date-fns';
import _ from 'lodash';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { EventFormFilter } from '../EventFormFilter/EventFormFilter';
import {useLocation, useNavigate} from "react-router-dom";

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
  const { t } = useTranslation();
  const [selectedEventCode, setSelectedEventCode] = useState('');
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);
  const [timeFromValue, setTimeFromValue] = useState(null);
  const [timeToValue, setTimeToValue] = useState(null);
  const [accessPoints, setAccessPoints] = useState([]);
  const [eventCodes, setEventCodes] = useState([]);
  const [selectedAccessPoint, setSelectedAccessPoint] = useState('');
  const [submited, setSubmited] = useState(true);
  const [numberInChange, setNumberInChange] = useState(false);
  const [hasInitializedFilters, setHasInitializedFilters] = useState(false);
  const filters = useSelector((state) => state.events.filters);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  useEffect(() => {
    getAccessPointsRequest().then((r) => {
      let access = r.data.map((point) => {
        return {
          name: point.description,
          value: point.id
        };
      });
      setAccessPoints([...access]);
    });
  }, []);

  useEffect(() => {
    getEventCodesRequest().then((r) => {
      const codes = Object.keys(r.data).map((key) => {
        return { value: key, name: r.data[key] };
      });
      setEventCodes(codes);
    });
  }, []);

  useEffect(() => {
    if (accessPoints.length > 0 && eventCodes.length > 0 && !hasInitializedFilters) {
      const params = new URLSearchParams(location.search);
      const initialFilters = {
        eventCode: params.get('eventCode') || '',
        createDateFrom: params.get('createDateFrom') || '',
        createDateTo: params.get('createDateTo') || '',
        createTimeFrom: params.get('createTimeFrom') || '',
        createTimeTo: params.get('createTimeTo') || '',
        accessPoint: params.get('accessPoint') || ''
      };

      setFilterParams(initialFilters);
      dispatch(setFilters(initialFilters));
      dispatch(eventsFetch(initialFilters));
      dispatch(eventsOnlyFetch(initialFilters));
      dispatch(changeCurrentPage(1));
      setSubmited(true);
      setHasInitializedFilters(true);
    }
  }, [accessPoints, eventCodes, hasInitializedFilters]);

  const formik = useFormik({
    initialValues: defaultValues,
    onSubmit: (values) => {
      dispatch(changeCurrentPage(1));
      dispatch(eventsOnlyFetch(filters));
      setSubmited(true);
    }
  });

  const setFilterParams = (initialFilters) => {
    const eventCode = initialFilters.eventCode ? eventCodes.find(code => code.value === initialFilters.eventCode) : null;
    const accessPoint = initialFilters.accessPoint ? accessPoints.find(code => code.value === Number(initialFilters.accessPoint)) : null;

    if (eventCode) { setSelectedEventCode(eventCode.name);}
    if (initialFilters.createDateFrom) { setFromValue(new Date(initialFilters.createDateFrom)); }
    if (initialFilters.createDateTo) { setToValue(new Date(initialFilters.createDateTo)); }
    if (initialFilters.createTimeFrom) { setTimeFromValue(parseTimeString(decodeURIComponent(initialFilters.createTimeFrom))); }
    if (initialFilters.createTimeTo) { setTimeToValue(parseTimeString(decodeURIComponent(initialFilters.createTimeTo))); }
    if (accessPoint) { setSelectedAccessPoint(accessPoint.name); }
  }

  const updateURL = (newFilters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      params.set(key, newFilters[key] !== undefined && newFilters[key] !== null ? newFilters[key] : '');
    });

    navigate({ search: params.toString() });
  };

  const parseTimeString = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(num => parseInt(num, 10));
    const today = new Date();
    today.setHours(hours + 3);
    today.setMinutes(minutes);
    today.setSeconds(seconds);
    today.setMilliseconds(0);
    return today;
  };

  const resetHandle = () => {
    formik.resetForm();
    updateURL({});
    setSelectedEventCode('');
    setSelectedAccessPoint('');
    setFromValue(null);
    setToValue(null);
    setTimeToValue(null);
    setTimeFromValue(null);
    dispatch(setFilters(null));
    dispatch(changeCurrentPage(1));
    dispatch(eventsOnlyFetch());
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
      updateURL(values);
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        eventCode: ''
      };
      dispatch(setFilters(values));
      updateURL(values);
      setSubmited(false);
    }
    setSelectedEventCode(event.target.value);
  };

  const handleFromDateChanged = (newValue) => {
    const parseValue = newValue.toISOString().split('T')[0];
    if (parseValue) {
      const values = {
        ...filters,
        createDateFrom: parseValue
      };
      dispatch(setFilters(values));
      updateURL(values);
      setFromValue(parseValue);
      setSubmited(false);
    }
  };

  const handleToDateChanged = (newValue) => {
    const parseValue = newValue.toISOString().split('T')[0];
    if (parseValue) {
      const values = {
        ...filters,
        createDateTo: parseValue
      };
      dispatch(setFilters(values));
      updateURL(values);
      setToValue(parseValue);
      setSubmited(false);
    }
  };

  const handleTimeFromChanged = (newValue) => {
    const parseValue = newValue.toISOString().split('T')[1].split('.')[0];
    if (parseValue) {
      const values = {
        ...filters,
        createTimeFrom: parseValue
      };
      dispatch(setFilters(values));
      updateURL(values);
      setTimeFromValue(newValue);
      setSubmited(false);
    }
  };

  const handleTimeToChanged = (newValue) => {
    const parseValue = newValue.toISOString().split('T')[1].split('.')[0];
    console.log(parseValue)
    if (parseValue) {
      const values = {
        ...filters,
        createTimeTo: parseValue
      };
      dispatch(setFilters(values));
      updateURL(values);
      setTimeToValue(newValue);
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
      updateURL(values);
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        accessPoint: ''
      };
      dispatch(setFilters(values));
      console.log(accessPoint.value)
      updateURL(values);
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
                    alt={t('components.carNumberFilter.searchByNumber')}
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
                      alt={t('components.carNumberFilter.clear')}
                    />
                  </IconButton>
                </InputAdornment>
              )
            }}
            variant="filled"
            id="vehiclePlate"
            name="vehiclePlate"
            placeholder={t('components.carNumberFilter.searchByNumber')}
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
              secondaryButtonStyle({ ...theme }),
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
          <EventFormFilter
            selectedEventCode={selectedEventCode}
            handleEventCodeChange={handleEventCodeChange}
            fromValue={fromValue}
            eventCodes={eventCodes}
            toValue={toValue}
            handleFromDateChanged={handleFromDateChanged}
            handleToDateChanged={handleToDateChanged}
            timeFromValue={timeFromValue}
            timeToValue={timeToValue}
            handleTimeFromChanged={handleTimeFromChanged}
            handleTimeToChanged={handleTimeToChanged}
            selectedAccessPoint={selectedAccessPoint}
            handleAccessPointChange={handleAccessPointChange}
            accessPoints={accessPoints}
            submited={submited}
            filters={filters}
            resetHandle={resetHandle}
            isNeedBorderBottom
          />
        )}
      </Box>
    </>
  );
}
