import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import { editLedFetch, createLedFetch } from 'store/led/ledSlice';
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
  Select,
  MenuItem,
  Typography,
  InputLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import {
  primaryButtonStyle,
  listStyle,
  secondaryButtonStyle,
  CarNumberInput,
  selectMenuStyle
} from '../../theme/styles';
import { ledTypeOptions } from '../../constants';

const validationSchema = yup.object({
  description: yup.string().required('Введите название'),
  ip_address: yup.string().required('Введите IP адрес'),
  led_board_type: yup.string().required('Выберите тип LED табло')
});

const initialValues = {
  description: '',
  ip_address: '',
  led_board_type: '',
  port: 80
};

const labelStyle = {
  pb: '4px',
  pl: '12px',
  whiteSpace: 'wrap'
};

export default function AddLedDialog({ show, handleClose, edit }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [submited, setSubmited] = useState(true);
  const ledEdit = useSelector((state) => state.leds.ledEdit);
  const theme = useTheme();

  const defaultValues = useMemo(() => {
    if (!_.isEmpty(ledEdit)) {
      return {
        description: ledEdit.description,
        ip_address: ledEdit.ip_address,
        led_board_type: ledEdit.led_board_type,
        port: ledEdit.port
      };
    } else {
      return initialValues;
    }
  }, [ledEdit]);

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
          id: ledEdit.id
        };
        dispatch(editLedFetch(payload));
      } else {
        dispatch(createLedFetch(payload));
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
        {edit ? 'Редактировать LED Табло' : 'Добавить LED Табло'}
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
              Название
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
              IP адрес
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
              Порт
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
            <InputLabel htmlFor="led_board_type" sx={labelStyle}>
              Тип табло
            </InputLabel>
            <Select
              id="led_board_type"
              name="led_board_type"
              displayEmpty
              value={formik.values.led_board_type}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
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
                const selectedName = ledTypeOptions.find(
                  (item) => item.value === selected
                );
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selectedName?.name}
                  </Typography>
                );
              }}
              error={
                formik.touched.led_board_type &&
                Boolean(formik.errors.led_board_type)
              }
            >
              <MenuItem disabled value="">
                <em> </em>
              </MenuItem>
              {ledTypeOptions.map((d) => (
                <MenuItem
                  key={d.name}
                  id={d.name}
                  selected={d.value === formik.values.led_board_type}
                  value={d.value}
                >
                  <Typography
                    component={'h5'}
                    noWrap
                    sx={{ fontWeight: 500, p: 0 }}
                  >
                    {d.name}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </Stack>

          <Button
            disableRipple
            disabled={submited}
            variant="contained"
            type="submit"
            sx={primaryButtonStyle({ ...theme })}
          >
            {edit ? 'Сохранить' : 'Добавить'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
