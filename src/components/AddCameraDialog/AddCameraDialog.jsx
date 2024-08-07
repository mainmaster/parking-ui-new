import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import { editCameraFetch, createCameraFetch } from 'store/cameras/camerasSlice';
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
  Typography,
  InputLabel, Checkbox, FormGroup, FormControlLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import {
  primaryButtonStyle,
  listStyle,
  secondaryButtonStyle,
  CarNumberInput
} from '../../theme/styles';
import {useTranslation} from "react-i18next";

const validationSchema = yup.object({
  description: yup.string().required('Введите название'),
  ip_address: yup.string().required('Введите IP адрес'),
  login: yup.string().required('Введите логин'),
  password: yup.string().required('Введите пароль'),
  mjpeg_url: yup.string().required('Введите ссылку на трансляцию'),
  snapshot_url: yup.string().required('Введите ссылку на снапшот')
});

const initialValues = {
  description: '',
  ip_address: '',
  login: '',
  password: '',
  mjpeg_url: '',
  snapshot_url: '',
  port: 80,
  emergency_car_only: false,
  is_display: false,
};

const labelStyle = {
  pb: '4px',
  pl: '12px',
  whiteSpace: 'wrap'
};

export default function AddCameraDialog({ show, handleClose, edit }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [submited, setSubmited] = useState(true);
  const cameraEdit = useSelector((state) => state.cameras.cameraEdit);
  const theme = useTheme();

  console.log(cameraEdit?.emergency_car_only)
  const defaultValues = useMemo(() => {
    if (!_.isEmpty(cameraEdit)) {
      return {
        description: cameraEdit.description,
        ip_address: cameraEdit.ip_address,
        login: cameraEdit.login,
        password: cameraEdit.password,
        mjpeg_url: cameraEdit.mjpeg_url,
        snapshot_url: cameraEdit.snapshot_url,
        port: cameraEdit.port,
        emergency_car_only: cameraEdit.emergency_car_only,
        is_display: cameraEdit.is_display,
      };
    } else {
      return initialValues;
    }
  }, [cameraEdit]);

  const formik = useFormik({
    initialValues: defaultValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let payload = {
        ...values
      };
      if (edit) {
        payload = {
          ...payload,
          id: cameraEdit.id
        };
        dispatch(editCameraFetch(payload));
      } else {
        dispatch(createCameraFetch(payload));
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

  const handleCloseDialog = () => {
    handleClose();
    resetHandle();
  };

  const resetHandle = () => {
    formik.resetForm();
    setSubmited(true);
  };

  return (
    <Dialog
      open={show}
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
        onClick={handleCloseDialog}
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
        {edit ? t('components.addCameraDialog.updateCamera') : t('components.addCameraDialog.addCamera')}
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
              {t('components.addCameraDialog.name')}
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
          <Stack>
            <InputLabel htmlFor="ip_address" sx={labelStyle}>
              {t('components.addCameraDialog.ipAddress')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="ip_address"
              name="ip_address"
              value={formik.values.ip_address}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.ip_address && Boolean(formik.errors.ip_address)
              }
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="port" sx={labelStyle}>
              {t('components.addCameraDialog.port')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                type: 'number',
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="port"
              name="port"
              value={formik.values.port}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={formik.touched.port && Boolean(formik.errors.port)}
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="login" sx={labelStyle}>
              {t('components.addCameraDialog.login')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="login"
              name="login"
              value={formik.values.login}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={formik.touched.login && Boolean(formik.errors.login)}
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="password" sx={labelStyle}>
              {t('components.addCameraDialog.password')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="mjpeg_url" sx={labelStyle}>
              {t('components.addCameraDialog.mjpegUrl')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="mjpeg_url"
              name="mjpeg_url"
              value={formik.values.mjpeg_url}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.mjpeg_url && Boolean(formik.errors.mjpeg_url)
              }
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="snapshot_url" sx={labelStyle}>
              {t('components.addCameraDialog.snapshotUrl')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="snapshot_url"
              name="snapshot_url"
              value={formik.values.snapshot_url}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.snapshot_url &&
                Boolean(formik.errors.snapshot_url)
              }
            />
          </Stack>
          <Stack>
            <FormGroup>
              <FormControlLabel control={
                <Checkbox
                  id="emergency_car_only"
                  name="emergency_car_only"
                  checked={formik.values.emergency_car_only}
                  onChange={handleValueChange}
                  error={
                    formik.touched.emergency_car_only &&
                    Boolean(formik.errors.emergency_car_only)
                  }
                />
              } label={t('components.addCameraDialog.emergencyCarOnly')} />
              <FormControlLabel control={
                <Checkbox
                  id="is_display"
                  name="is_display"
                  checked={formik.values.is_display}
                  onChange={handleValueChange}
                  error={
                    formik.touched.is_display &&
                    Boolean(formik.errors.is_display)
                  }
                />
              } label={t('components.addCameraDialog.isDisplay')} />
            </FormGroup>
          </Stack>

          <Button
            disableRipple
            disabled={submited}
            variant="contained"
            type="submit"
            sx={primaryButtonStyle({ ...theme })}
          >
            {edit ? t('components.addCameraDialog.save') : t('components.addCameraDialog.add')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
