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
  setFilters,
  paymentsChangePageFetch
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
import i18n from '../../translation/index';
import { useTranslation } from 'react-i18next';
import { PaymentFilterForm } from '../PaymentFilterForm/PaymentFilterForm';
import {useLocation, useNavigate} from "react-router-dom";

const defaultValues = {
  vehiclePlate: ''
};

let paymentTypeValues = [
  { value: 'sber', name: i18n.t('components.paymentFilter.sber') },
  { value: 'yookassa', name: i18n.t('components.paymentFilter.yookassa') },
  {
    value: 'pos_terminal',
    name: i18n.t('components.paymentFilter.afterTerminal')
  }
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
    {
      value: 'pos_terminal',
      name: i18n.t('components.paymentFilter.afterTerminal')
    }
  ];
  isRefundValues = [
    { value: 'true', name: i18n.t('components.paymentFilter.withRefund') },
    { value: 'false', name: i18n.t('components.paymentFilter.withoutRefund') }
  ];
  paymentForValues = [
    {
      value: 'subscription',
      name: i18n.t('components.paymentFilter.aboniment')
    },
    { value: 'session', name: i18n.t('components.paymentFilter.oneTime') }
  ];
};

i18n.on('loaded', () => {
  changeFilter();
});

i18n.on('languageChanged', () => {
  changeFilter();
});

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
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialFilters = {
      vehiclePlate: params.get('vehiclePlate') || '',
      paymentType: params.get('paymentType') || '',
      isRefund: params.get('isRefund') || '',
      paymentFor: params.get('paymentFor') || '',
      createDateFrom: params.get('createDateFrom') || '',
      createDateTo: params.get('createDateTo') || '',
      page: params.get('page')
    };

    const pageNumber = initialFilters.page ? Number(initialFilters.page) : 1;
    setFilterParams(initialFilters);

    dispatch(setFilters(initialFilters));
    dispatch(paymentsFetch(initialFilters));
    dispatch(paymentsChangePageFetch(pageNumber));
    dispatch(changeCurrentPage(pageNumber));
    setSubmited(true);
  }, []);

  const formik = useFormik({
    initialValues: defaultValues,
    onSubmit: (values) => {
      dispatch(paymentsFetch(filters));
      dispatch(changeCurrentPage(1));
      setSubmited(true);
    }
  });

  const setFilterParams = (initialFilters) => {
    const paymentType = initialFilters.paymentType ? paymentTypeValues.find(type => type.value === initialFilters.paymentType) : null;
    const isRefund = initialFilters.isRefund !== '' ? isRefundValues.find(refund => refund.value === initialFilters.isRefund) : null;
    const paymentFor = initialFilters.paymentFor ? paymentForValues.find(type => type.value === initialFilters.paymentFor) : null;

    if (paymentType) { setPaymentType(paymentType.name); }
    if (initialFilters.vehiclePlate) { formik.values.vehiclePlate = initialFilters.vehiclePlate; }
    if (isRefund) { setIsRefund(isRefund.name); }
    if (paymentFor) { setPaymentFor(paymentFor.name); }
    if (initialFilters.createDateFrom) { setFromValue(new Date(initialFilters.createDateFrom)); }
    if (initialFilters.createDateTo) { setToValue(new Date(initialFilters.createDateTo)); }
  }

  const updateURL = (newFilters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      params.set(key, newFilters[key] !== undefined && newFilters[key] !== null ? newFilters[key] : '');
    });

    navigate({ search: params.toString() });
  };

  const resetHandle = () => {
    formik.resetForm();
    formik.values.vehiclePlate = '';
    updateURL({});
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
      updateURL(values);
      dispatch(changeCurrentPage(1));
      dispatch(paymentsFetch(values));
    } else if (openForm) {
      const values = {
        ...filters,
        vehiclePlate: e.target.value
      };
      dispatch(setFilters(values));
      updateURL(values);
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
      updateURL({});
      dispatch(changeCurrentPage(1));
      dispatch(paymentsFetch());
    } else if (openForm) {
      const values = {
        ...filters,
        vehiclePlate: ''
      };
      dispatch(setFilters(values));
      updateURL(values);
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
      updateURL(values);
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
      updateURL(values);
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
      updateURL(values);
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        paymentType: ''
      };
      dispatch(setFilters(values));
      updateURL(values);
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
      updateURL(values);
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        isRefund: ''
      };
      dispatch(setFilters(values));
      updateURL(values);
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
      updateURL(values);
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        paymentFor: ''
      };
      dispatch(setFilters(values));
      updateURL(values);
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
          <PaymentFilterForm
            fromValue={fromValue}
            toValue={toValue}
            handleFromDateChanged={handleFromDateChanged}
            handleToDateChanged={handleToDateChanged}
            paymentType={paymentType}
            handlePaymentTypeChange={handlePaymentTypeChange}
            paymentTypeValues={paymentTypeValues}
            paymentFor={paymentFor}
            handlePaymentForChange={handlePaymentForChange}
            paymentForValues={paymentForValues}
            isRefund={isRefund}
            handleIsRefundChange={handleIsRefundChange}
            isRefundValues={isRefundValues}
            submited={submited}
            filters={filters}
            resetHandle={resetHandle}
            styles={
              isMobile
                ? mobileMenuStyle({ ...theme, border: true })
                : desktopMenuStyle({ ...theme })
            }
            confirmText={t('components.paymentFilter.submit')}
          />
        )}
      </Box>
    </>
  );
}
