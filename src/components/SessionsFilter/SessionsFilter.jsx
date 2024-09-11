import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  InputLabel,
  Popover,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  styled
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import {
  primaryButtonStyle,
  secondaryButtonStyle,
  CarNumberInput,
  DateInputStyle,
  selectMenuStyle,
  desktopMenuStyle,
  mobileMenuStyle
} from '../../theme/styles';
import searchIcon from '../../assets/svg/log_event_search_icon.svg';
import searchCancelIcon from '../../assets/svg/log_event_search_cancel_icon.svg';
import eventTuneIcon from '../../assets/svg/log_event_tune_icon.svg';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import { DateIcon } from '../Icons/DateIcon';
import { useDispatch, useSelector } from 'react-redux';
import {
  sessionsFetch,
  setFilters,
  changeCurrentPage
} from 'store/sessions/sessionsSlice';
import { useFormik } from 'formik';
import { formatISO } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTranslation} from "react-i18next";
import RenterSelect from "../ApplicationFilter/RenterSelect";

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

let sessionStatusValues = [
  { value: 'open', name: 'Открытые' },
  { value: 'closed', name: 'Закрытые' }
];

let paymentStatusValues = [
  { value: true, name: 'Оплачено' },
  { value: false, name: 'Не оплачено' }
];

export default function SessionsFilter({ openForm, setOpenForm }) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    sessionStatusValues = [
      { value: 'open', name: t('components.sessionsFilter.open') },
      { value: 'closed', name: t('components.sessionsFilter.close') }
    ];

    paymentStatusValues = [
      { value: true, name: t('components.sessionsFilter.paid') },
      { value: false, name: t('components.sessionsFilter.notPaid') }
    ];
  }, [i18n.language])


  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSessionStatus, setSelectedSessionStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);
  const [submited, setSubmited] = useState(true);
  const [numberInChange, setNumberInChange] = useState(false);
  const filters = useSelector((state) => state.sessions.filters);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedRenter, setSelectedRenter] = useState('');

  useEffect(() => {
    return () => {
      dispatch(setFilters(null));
    };
  }, []);

  const formik = useFormik({
    initialValues: defaultValues,
    onSubmit: (values) => {
      dispatch(sessionsFetch(filters));
      dispatch(changeCurrentPage(1));
      setSubmited(true);
    }
  });

  const resetHandle = () => {
    formik.resetForm();
    dispatch(sessionsFetch());
    dispatch(setFilters(null));
    dispatch(changeCurrentPage(1));
    setSelectedSessionStatus('');
    setSelectedPaymentStatus('');
    setSelectedRenter('');
    setFromValue(null);
    setToValue(null);
    setSubmited(true);
  };

  const handleChangeField = (e) => {
    if (!openForm) {
      const values = {
        vehiclePlate: e.target.value
      };
      dispatch(sessionsFetch(values));
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

  const handleOpenForm = (event) => {
    if (!openForm) {
      setAnchorEl(event.currentTarget);
    }
    setOpenForm(!openForm);
  };

  const handleNumberErase = () => {
    formik.values.vehiclePlate = '';
    if (!openForm) {
      dispatch(sessionsFetch());
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

  const handleSessionStatusChange = (event) => {
    const status = sessionStatusValues.find(
      (st) => st.name === event.target.value
    );
    if (status) {
      const values = {
        ...filters,
        status: status.value
      };
      dispatch(setFilters(values));
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        status: ''
      };
      dispatch(setFilters(values));
      setSubmited(false);
    }
    setSelectedSessionStatus(event.target.value);
  };

  const handlePaymentStatusChange = (event) => {
    const status = paymentStatusValues.find(
      (st) => st.name === event.target.value
    );
    if (status) {
      const values = {
        ...filters,
        isPaid: status.value
      };
      dispatch(setFilters(values));
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        isPaid: ''
      };
      dispatch(setFilters(values));
      setSubmited(false);
    }
    setSelectedPaymentStatus(event.target.value);
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

  const handleRenterChange = (event) => {
    const values = {
      ...filters,
      renterId: event.target.value
    };
    dispatch(setFilters(values));
    setSubmited(false);
    setSelectedRenter(event.target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit}
        sx={{
          minWidth: isMobile ? '320px' : '360px'
        }}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={'8px'}
          sx={{ width: '100%', px: '16px', pb: '8px' }}
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
                    alt={t('components.sessionsFilter.searchByNumber')}
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
                      alt={t('components.sessionsFilter.clear')}
                    />
                  </IconButton>
                </InputAdornment>
              )
            }}
            variant="filled"
            id="vehiclePlate"
            name="vehiclePlate"
            placeholder={t('components.sessionsFilter.searchByNumber')}
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
          <Stack
            sx={
              isMobile
                ? mobileMenuStyle({ ...theme })
                : desktopMenuStyle({ ...theme })
            }
            gap={'8px'}
          >
            <Stack>
              <InputLabel htmlFor="session-status-select" sx={labelStyle}>
                {t('components.sessionsFilter.sessionStatus')}
              </InputLabel>
              <Select
                id="session-status-select"
                displayEmpty
                value={selectedSessionStatus}
                onChange={handleSessionStatusChange}
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
                sx={selectMenuStyle({ ...theme })}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: '8px',
                      border: '1px solid ' + theme.colors.outline.default
                    }
                  },
                  MenuListProps: {
                    sx: { py: '4px' }
                  }
                }}
                renderValue={(selected) => {
                  if (selected === '') {
                    return <em>{t('components.sessionsFilter.choose')}</em>;
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
                <MenuItem value="">
                  <em>{t('components.sessionsFilter.choose')}</em>
                </MenuItem>
                {sessionStatusValues.map((st) => (
                  <MenuItem
                    key={st.value}
                    id={st.name}
                    selected={st.name === selectedSessionStatus}
                    value={st.name}
                  >
                    <Typography
                      component={'h5'}
                      noWrap
                      sx={{ fontWeight: 500, p: 0 }}
                    >
                      {st.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack>
              <InputLabel htmlFor="payment-status-select" sx={labelStyle}>
                {t('components.sessionsFilter.paymentStatus')}
              </InputLabel>
              <Select
                id="payment-status-select"
                displayEmpty
                value={selectedPaymentStatus}
                onChange={handlePaymentStatusChange}
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
                sx={selectMenuStyle({ ...theme })}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: '8px',
                      border: '1px solid ' + theme.colors.outline.default
                    }
                  },
                  MenuListProps: {
                    sx: { py: '4px' }
                  }
                }}
                renderValue={(selected) => {
                  if (selected === '') {
                    return <em>{t('components.sessionsFilter.choose')}</em>;
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
                <MenuItem value="">
                  <em>{t('components.sessionsFilter.choose')}</em>
                </MenuItem>
                {paymentStatusValues.map((st) => (
                  <MenuItem
                    key={st.name}
                    id={st.name}
                    selected={st.name === selectedPaymentStatus}
                    value={st.name}
                  >
                    <Typography
                      component={'h5'}
                      noWrap
                      sx={{ fontWeight: 500, p: 0 }}
                    >
                      {st.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <RenterSelect selected={selectedRenter} handleChange={handleRenterChange}/>
            <Stack>
              <Typography sx={labelStyle}>{t('components.sessionsFilter.date')}</Typography>
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
                      sx: DateInputStyle({ ...theme }),
                      placeholder: t('components.sessionsFilter.from')
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
                      sx: DateInputStyle({ ...theme }),
                      placeholder: t('components.sessionsFilter.to')
                    },
                    openPickerButton: { disableRipple: true }
                  }}
                  slots={{
                    openPickerIcon: DateIcon
                  }}
                />
              </Stack>
            </Stack>

            <Stack direction={'row'} gap={'8px'} sx={{ pt: '8px' }}>
              <Button
                disabled={submited}
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={[primaryButtonStyle({ ...theme }), { flexGrow: 1 }]}
                type="submit"
              >
                {t('components.sessionsFilter.submit')}
              </Button>
              <Button
                disabled={!filters}
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={[secondaryButtonStyle({ ...theme }), { flexGrow: 1 }]}
                onClick={resetHandle}
              >
                {t('components.sessionsFilter.reset')}
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </>
  );
}
