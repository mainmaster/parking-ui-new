import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  paymentsFetch,
  changeCurrentPage,
  setFilters
} from '../../store/payments/paymentsSlice';
import { useFormik } from 'formik';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  primaryButtonStyle,
  secondaryButtonStyle,
  CarNumberInput,
  DateInputStyle,
  selectMenuStyle,
  desktopMenuStyle,
  mobileMenuStyle
} from '../../theme/styles';
import { DateIcon } from '../Icons/DateIcon';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import searchIcon from '../../assets/svg/log_event_search_icon.svg';
import searchCancelIcon from '../../assets/svg/log_event_search_cancel_icon.svg';
import eventTuneIcon from '../../assets/svg/log_event_tune_icon.svg';
import { formatISO } from 'date-fns';
import i18n from '../../translation/index'
import {useTranslation} from "react-i18next";

const defaultValues = {
  vehiclePlate: ''
};

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: '0.875rem',
  pb: '4px',
  pl: '12px'
};

let paymentTypeValues = [
  { value: 'sber', name: i18n.t('components.paymentFilter.sber') },
  { value: 'yookassa', name: i18n.t('components.paymentFilter.yookassa') },
  { value: 'pos_terminal', name: i18n.t('components.paymentFilter.afterTerminal') }
];

let isRefundValues = [
  { value: 'true', name: i18n.t('components.paymentFilter.withRefund') },
  { value: 'false', name: i18n.t('components.paymentFilter.withoutRefund') }
];

let paymentForValues = [
  { value: 'subscription', name: i18n.t('components.paymentFilter.aboniment') },
  { value: 'session', name: i18n.t('components.paymentFilter.oneTime') }
];

const changeFilter = () => {
  paymentTypeValues = [
    { value: 'sber', name: i18n.t('components.paymentFilter.sber') },
    { value: 'yookassa', name: i18n.t('components.paymentFilter.yookassa') },
    { value: 'pos_terminal', name: i18n.t('components.paymentFilter.afterTerminal') }
  ];
  isRefundValues = [
    { value: 'true', name: i18n.t('components.paymentFilter.withRefund') },
    { value: 'false', name: i18n.t('components.paymentFilter.withoutRefund') }
  ];
  paymentForValues = [
    { value: 'subscription', name: i18n.t('components.paymentFilter.aboniment') },
    { value: 'session', name: i18n.t('components.paymentFilter.oneTime') }
  ];
}

i18n.on('loaded', () => {
  changeFilter()
})

i18n.on('languageChanged', () => {
  changeFilter()
})

export default function PaymentFilter({ openForm, setOpenForm }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);
  const [paymentType, setPaymentType] = useState('');
  const [isRefund, setIsRefund] = useState('');
  const [paymentFor, setPaymentFor] = useState('');
  const [submited, setSubmited] = useState(true);
  const [numberInChange, setNumberInChange] = useState(false);
  const filters = useSelector((state) => state.payments.filters);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    return () => {
      dispatch(setFilters(null));
    };
  }, []);

  const formik = useFormik({
    initialValues: defaultValues,
    onSubmit: (values) => {
      dispatch(changeCurrentPage(1));
      dispatch(paymentsFetch(filters));
      setSubmited(true);
    }
  });

  const resetHandle = () => {
    formik.resetForm();
    dispatch(setFilters(null));
    dispatch(changeCurrentPage(1));
    dispatch(paymentsFetch());
    setFromValue(null);
    setToValue(null);
    setPaymentType('');
    setIsRefund('');
    setPaymentFor('');
    setSubmited(true);
  };

  const handleChangeField = (e) => {
    if (!openForm) {
      const values = {
        vehiclePlate: e.target.value
      };
      dispatch(setFilters(values));
      dispatch(changeCurrentPage(1));
      dispatch(paymentsFetch(values));
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
      dispatch(setFilters(null));
      dispatch(changeCurrentPage(1));
      dispatch(paymentsFetch());
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

  const handlePaymentTypeChange = (event) => {
    const item = paymentTypeValues.find(
      (item) => item.name === event.target.value
    );
    if (item) {
      const values = {
        ...filters,
        paymentType: item.value
      };
      dispatch(setFilters(values));
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        paymentType: ''
      };
      dispatch(setFilters(values));
      setSubmited(false);
    }
    setPaymentType(event.target.value);
  };

  const handleIsRefundChange = (event) => {
    const item = isRefundValues.find(
      (item) => item.name === event.target.value
    );
    if (item) {
      const values = {
        ...filters,
        isRefund: item.value
      };
      dispatch(setFilters(values));
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        isRefund: ''
      };
      dispatch(setFilters(values));
      setSubmited(false);
    }
    setIsRefund(event.target.value);
  };

  const handlePaymentForChange = (event) => {
    const item = paymentForValues.find(
      (item) => item.name === event.target.value
    );
    if (item) {
      const values = {
        ...filters,
        paymentFor: item.value
      };
      dispatch(setFilters(values));
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        paymentFor: ''
      };
      dispatch(setFilters(values));
      setSubmited(false);
    }
    setPaymentFor(event.target.value);
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
                    alt={t('components.paymentFilter.searchByNumber')}
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
                      alt={t('components.paymentFilter.clear')}
                    />
                  </IconButton>
                </InputAdornment>
              )
            }}
            variant="filled"
            id="vehiclePlate"
            name="vehiclePlate"
            placeholder={t('components.paymentFilter.searchByNumber')}
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
                ? mobileMenuStyle({ ...theme, border: true })
                : desktopMenuStyle({ ...theme })
            }
            gap={'8px'}
          >
            <Stack>
              <Typography sx={labelStyle}>{t('components.paymentFilter.date')}</Typography>
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
                      placeholder: t('components.paymentFilter.from')
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
                      placeholder: t('components.paymentFilter.to')
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
              <InputLabel htmlFor="payment-type-select" sx={labelStyle}>
                {t('components.paymentFilter.paymentType')}
              </InputLabel>
              <Select
                id="payment-type-select"
                displayEmpty
                value={paymentType}
                onChange={handlePaymentTypeChange}
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
                    return <em>{t('components.paymentFilter.choose')}</em>;
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
                  <em>{t('components.paymentFilter.choose')}</em>
                </MenuItem>
                {paymentTypeValues.map((item) => (
                  <MenuItem
                    key={item.value}
                    id={item.value}
                    selected={item.name === paymentType}
                    value={item.name}
                  >
                    <Typography
                      component={'h5'}
                      noWrap
                      sx={{ fontWeight: 500, p: 0 }}
                    >
                      {item.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack>
              <InputLabel htmlFor="payment-for-select" sx={labelStyle}>
                {t('components.paymentFilter.typePayment')}
              </InputLabel>
              <Select
                id="payment-for-select"
                displayEmpty
                value={paymentFor}
                onChange={handlePaymentForChange}
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
                    return <em>{t('components.paymentFilter.choose')}</em>;
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
                  <em>{t('components.paymentFilter.choose')}</em>
                </MenuItem>
                {paymentForValues.map((item) => (
                  <MenuItem
                    key={item.value}
                    id={item.value}
                    selected={item.name === paymentFor}
                    value={item.name}
                  >
                    <Typography
                      component={'h5'}
                      noWrap
                      sx={{ fontWeight: 500, p: 0 }}
                    >
                      {item.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack>
              <InputLabel htmlFor="is-refund-select" sx={labelStyle}>
                {t('components.paymentFilter.refund')}
              </InputLabel>
              <Select
                id="is-refund-select"
                displayEmpty
                value={isRefund}
                onChange={handleIsRefundChange}
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
                    return <em>{t('components.paymentFilter.choose')}</em>;
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
                  <em>{t('components.paymentFilter.choose')}</em>
                </MenuItem>
                {isRefundValues.map((item) => (
                  <MenuItem
                    key={item.value}
                    id={item.value}
                    selected={item.name === isRefund}
                    value={item.name}
                  >
                    <Typography
                      component={'h5'}
                      noWrap
                      sx={{ fontWeight: 500, p: 0 }}
                    >
                      {item.name}
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
                sx={[primaryButtonStyle({ ...theme }), { flexGrow: 1 }]}
                type="submit"
              >
                {t('components.paymentFilter.submit')}
              </Button>
              <Button
                disabled={!filters}
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={[secondaryButtonStyle({ ...theme }), { flexGrow: 1 }]}
                onClick={resetHandle}
              >
                {t('components.paymentFilter.reset')}
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </>
  );
}
