import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import React, {useCallback, useState} from 'react';
import _ from 'lodash';
import { enqueueSnackbar } from 'notistack';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  InputLabel,
  Stack,
} from '@mui/material';
import {
  CarNumberInput,
  DateInputStyle,
  listStyle,
  primaryButtonStyle,
  secondaryButtonStyle
} from '../../theme/styles';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import * as yup from 'yup';
import { DateTimePicker } from '@mui/x-date-pickers';
import {format} from "date-fns";
import {createSession} from "../../api/sessions";

const labelStyle = {
  pb: '4px',
  pl: '12px'
};

const validationSchema = yup.object({
  vehicle_plate: yup.string().required('Введите номер'),
});

export function CreateSessionDialog({ isOpen, handleClose }) {
  const [date, setDate] = useState(null);
  const [submited, setSubmited] = useState(true);

  const defaultValues = {
    vehicle_plate: '',
  };

  const formik = useFormik({
    initialValues: defaultValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let payload = {
        ...values,
        date: format(date, 'yyyy-MM-dd HH:mm'),
      };
      setSubmited(true);
      createSession(payload).then(() => {
        setDate(null);
        formik.resetForm();
        handleClose();
      }).catch().finally();

    }
  });
  const theme = useTheme();
  const { t } = useTranslation();

  const handleValueChange = (event) => {
    formik.handleChange(event);
    if (date) {
      setSubmited(false);
    }
  };

  const handleDateChange = (newValue) => {
    if (newValue) {
      setDate(newValue);
      if (formik.values.vehicle_plate) {
        setSubmited(false);
      }
    }
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

  console.log(submited);

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
        {t('components.createSession.title')}
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
            <InputLabel htmlFor="vehicle_plate" sx={labelStyle}>
              {t('components.createSession.number')}
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
              placeholder={t('components.createSession.numberPlaceHolder')}
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="date" sx={labelStyle}>
              {t('components.createSession.date')}
            </InputLabel>
            <DateTimePicker
              fullWidth
              format={'dd.MM.yyyy hh:mm'}
              slotProps={{
                textField: {
                  variant: 'filled',
                  sx: DateInputStyle({ ...theme }),
                  placeholder: t('components.createSession.datePlaceholder')
                }
              }}
              variant="filled"
              id="date"
              name="date"
              value={date}
              onChange={handleDateChange}
              onBlur={formik.handleBlur}
              error={formik.touched.date && Boolean(formik.errors.date)}
              sx={{
                borderRadius: 100,
                height: 40,
                padding: '0 12px 0 12px'
              }}
              ampm={false}
            />
          </Stack>
          <Button
            disabled={submited}
            disableRipple
            fullWidth
            variant="contained"
            type="submit"
            sx={primaryButtonStyle({ ...theme })}
          >
            {t('components.createSession.create')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
