import {
  CarNumberInput,
  listStyle,
  primaryButtonStyle,
  secondaryButtonStyle
} from '../../theme/styles';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  InputLabel,
  Stack
} from '@mui/material';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import React, { useCallback, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { createPaymentOrder } from '../../api/payment';

const labelStyle = {
  pb: '4px',
  pl: '12px'
};

const validationSchema = yup.object({
  amount: yup
    .number()
    .min(1, 'Сумма должна быть больше 1')
    .required('Введите сумму'),
  description: yup.string().required('Введите описание'),
  email: yup.string().required('Введите email')
});

export default function AddOrderDialog({
  isOpen,
  handleClose,
  setIsOrderCreatedOpen
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = {
    amount: 0,
    description: '',
    email: ''
  };
  const formik = useFormik({
    initialValues: defaultValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let payload = {
        ...values
      };
      setIsLoading(true);
      createPaymentOrder(payload).then((result) => {
        setIsOrderCreatedOpen({...payload, url: result?.data?.redirectURL});
      }).finally(() => {
        formik.resetForm();
        handleClose();
        setIsLoading(false);
      });
    }
  });
  const handleValueChange = (event) => {
    formik.handleChange(event);
  };

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

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
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
        onClick={handleClose}
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
        {t('components.addOrder.title')}
      </DialogTitle>
      <DialogActions sx={{ justifyContent: 'center', p: '16px' }}>
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
            <InputLabel htmlFor="amount" sx={labelStyle}>
              {t('components.addOrder.sum')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="amount"
              name="amount"
              type="number"
              value={formik.values.amount}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="email" sx={labelStyle}>
              {t('components.addOrder.email')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="description" sx={labelStyle}>
              {t('components.addOrder.description')}
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
          <Button
            disabled={isLoading}
            disableRipple
            fullWidth
            variant="contained"
            type="submit"
            sx={primaryButtonStyle({ ...theme })}
          >
            {t('components.addOrder.getUrl')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
