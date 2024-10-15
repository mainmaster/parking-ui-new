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
  Stack, Typography
} from '@mui/material';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import addBlack from '../../assets/svg/add_black.svg';
import React, { useCallback, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { createPaymentOrder } from '../../api/payment';
import RenterSelect from "../ApplicationFilter/RenterSelect";
import VehiclePlate from "./VehiclePlate";
import {formatISO, format} from "date-fns";

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
  const [selectedCompany, setSelectedCompany] = useState('');
  const [vehiclePlates, setVehiclePlates] = useState([]);
  const [companyName, setCompanyName] = useState('');

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
        ...values,
        renter: selectedCompany,
        vehicle_plates: vehiclePlates.filter(plate => !!plate.vehicle_plate && !!plate.valid_until).map(plate => {
          return {
            ...plate,
            valid_until: format(plate.valid_until, 'yyyy-MM-dd')
          }
        })
      };
      setIsLoading(true);
      createPaymentOrder(payload).then((result) => {
        setIsOrderCreatedOpen({...payload, url: result?.data?.redirectURL, companyName});
        formik.resetForm();
        close();
      }).finally(() => {
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

  const handleCompanyChange = (event) => {
    setCompanyName(event.target.value.company_name);
    setSelectedCompany(event.target.value.id);
  };

  const close =() => {
    setSelectedCompany('');
    setVehiclePlates([]);
    handleClose();
    setCompanyName('');
  }

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
          <RenterSelect
            selected={selectedCompany}
            handleChange={handleCompanyChange}
            isNeedAllRenter
          />
          <Stack>
            <Typography>
              {t('components.addOrder.plateAndDate')}
            </Typography>
            <Stack display={'flex'} flexDirection={'row'} gap={2}>
              <IconButton
                sx={[
                  secondaryButtonStyle({ ...theme }),
                  {
                    width: 48,
                    height: 40,
                  }
                ]}
                onClick={() => setVehiclePlates(prevState => [...prevState, {}])}
              >
                <img style={{ width: 13.5 }} src={addBlack} alt="Add" />
              </IconButton>
              {
                vehiclePlates.length ? (
                  <Stack display={'flex'} gap={2}>
                    {
                      vehiclePlates.map((vehicle, index) => (
                        <VehiclePlate key={index} index={index} vehicle={vehicle} setVehiclePlates={setVehiclePlates}/>
                      ))
                    }
                  </Stack>
                ) : <></>
              }
            </Stack>
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
