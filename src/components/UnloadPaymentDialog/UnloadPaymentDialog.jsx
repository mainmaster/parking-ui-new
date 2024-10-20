import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton
} from '@mui/material';
import { listStyle, secondaryButtonStyle } from '../../theme/styles';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import React, { useEffect, useState } from 'react';
import { PaymentFilterForm } from '../PaymentFilterForm/PaymentFilterForm';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import { formatISO } from 'date-fns';
import i18n from '../../translation';
import { setUnloadFilters } from '../../store/payments/paymentsSlice';
import {unloadPayment} from "../../api/payment";

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

export default function UnloadPaymentDialog({ isOpen, handleClose }) {
  const { t } = useTranslation();
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);
  const [paymentType, setPaymentType] = useState('');
  const [isRefund, setIsRefund] = useState('');
  const [paymentFor, setPaymentFor] = useState('');
  const filters = useSelector((state) => state.payments.unloadFilters);
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    return () => {
      dispatch(setUnloadFilters(null));
    };
  }, []);

  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      unloadPayment(filters).then(() => {
        close();
      });
    }
  });

  const resetHandle = () => {
    formik.resetForm();
    dispatch(setUnloadFilters(null));
    setFromValue(null);
    setToValue(null);
    setPaymentType('');
    setIsRefund('');
    setPaymentFor('');
  };

  const handleFromDateChanged = (newValue) => {
    if (newValue) {
      const values = {
        ...filters,
        createDateFrom: formatISO(newValue)
      };
      dispatch(setUnloadFilters(values));
      setFromValue(newValue);
    }
  };

  const handleToDateChanged = (newValue) => {
    if (newValue) {
      const values = {
        ...filters,
        createDateTo: formatISO(newValue)
      };
      dispatch(setUnloadFilters(values));
      setToValue(newValue);
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
      dispatch(setUnloadFilters(values));
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        paymentType: ''
      };
      dispatch(setUnloadFilters(values));
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
      dispatch(setUnloadFilters(values));
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        isRefund: ''
      };
      dispatch(setUnloadFilters(values));
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
      dispatch(setUnloadFilters(values));
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        paymentFor: ''
      };
      dispatch(setUnloadFilters(values));
    }
    setPaymentFor(event.target.value);
  };

  const close = () => {
    handleClose();
    resetHandle();
  };
  return (
    <Dialog
      open={isOpen}
      onClose={close}
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
        onClick={close}
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
        <img style={{ width: '24px' }} src={closeIcon} alt="Close" />
      </IconButton>
      <DialogTitle
        sx={{
          fontSize: '1.5rem',
          lineHeight: '1.75rem',
          p: '22px 48px',
          textAlign: 'center'
        }}
      >
        {t('components.unloadPaymentDialog.title')}
      </DialogTitle>
      <DialogActions sx={{ justifyContent: 'center', p: '16px' }}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
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
            submited={false}
            filters={filters}
            resetHandle={resetHandle}
            confirmText={t('components.unloadPaymentDialog.confirm')}
          />
        </Box>
      </DialogActions>
    </Dialog>
  );
}
