import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import {
  useCreateTerminalMutation,
  useEditTerminalMutation
} from '../../api/terminal/terminal.api';
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
import { terminalTypeOptions } from '../../constants';
import {useTranslation} from "react-i18next";

const validationSchema = yup.object({
  description: yup.string().required('Введите название'),
  address: yup.string().required('Введите адрес'),
  place: yup.string().required('Введите место'),
  automat_number: yup.number().required('Введите номер автомата'),
  ip_address: yup.string().required('Введите IP адрес'),
  terminal_type: yup.string().required('Выберите тип терминала')
});

const initialValues = {
  description: '',
  address: '',
  place: '',
  automat_number: '',
  ip_address: '',
  terminal_type: '',
  port: 4455,
  ssh_port: 22,
};

const labelStyle = {
  pb: '4px',
  pl: '12px',
  whiteSpace: 'wrap'
};

export default function AddTerminalDialog({ show, handleClose, edit }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [submited, setSubmited] = useState(true);
  const terminalEdit = useSelector((state) => state.terminals.editTerminal);
  const [updateTerminal, { isError: isUpdateError }] =
    useEditTerminalMutation();
  const [createTerminal, { isError: isCreateError }] =
    useCreateTerminalMutation();
  const theme = useTheme();

  const defaultValues = useMemo(() => {
    if (!_.isEmpty(terminalEdit)) {
      return {
        description: terminalEdit.description,
        address: terminalEdit.address,
        place: terminalEdit.place,
        automat_number: terminalEdit.automat_number,
        ip_address: terminalEdit.ip_address,
        terminal_type: terminalEdit.terminal_type,
        port: terminalEdit.port,
        ssh_port: terminalEdit.ssh_port
      };
    } else {
      return initialValues;
    }
  }, [terminalEdit]);

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
          id: terminalEdit.id
        };
        updateTerminal(payload)
          .unwrap()
          .then((result) => {
            enqueueSnackbar(t('components.addTerminalDialog.dataSave'), { variant: 'success' });
          })
          .catch(() => {
            enqueueSnackbar(t('components.addTerminalDialog.errorSave'), {
              variant: 'error',
              iconVariant: 'warning'
            });
          });
      } else {
        createTerminal(payload)
          .unwrap()
          .then((result) => {
            enqueueSnackbar(t('components.addTerminalDialog.correctAdd'), { variant: 'success' });
          })
          .catch(() => {
            enqueueSnackbar(t('components.addTerminalDialog.errorSave'), {
              variant: 'error',
              iconVariant: 'warning'
            });
          });
      }
      handleCloseDialog();
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
        {edit ? t('components.addTerminalDialog.editTerminal') : t('components.addTerminalDialog.addTerminal')}
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
              {t('components.addTerminalDialog.name')}
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
            <InputLabel htmlFor="address" sx={labelStyle}>
              {t('components.addTerminalDialog.address')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="address"
              name="address"
              value={formik.values.address}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="place" sx={labelStyle}>
              {t('components.addTerminalDialog.place')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="place"
              name="place"
              value={formik.values.place}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={formik.touched.place && Boolean(formik.errors.place)}
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="automat_number" sx={labelStyle}>
              {t('components.addTerminalDialog.automatNumber')}
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                type: 'number',
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="automat_number"
              name="automat_number"
              value={formik.values.automat_number}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.automat_number &&
                Boolean(formik.errors.automat_number)
              }
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="ip_address" sx={labelStyle}>
              {t('components.addTerminalDialog.ipAddress')}
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
              {t('components.addTerminalDialog.port')}
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
            <InputLabel htmlFor='ssh_port' sx={labelStyle}>
              {t('components.addTerminalDialog.sshPort')}
            </InputLabel>
            <CarNumberInput
                fullWidth
                InputProps={{
                  type: 'number',
                  disableUnderline: true,
                  sx: { paddingLeft: '12px' }
                }}
                variant="filled"
                id="ssh_port"
                name="ssh_port"
                value={formik.values.ssh_port}
                onChange={handleValueChange}
                onBlur={formik.handleBlur}
                error={formik.touched.ssh_port && Boolean(formik.errors.ssh_port)}
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="terminal_type" sx={labelStyle}>
              {t('components.addTerminalDialog.type')}
            </InputLabel>
            <Select
              id="terminal_type"
              name="terminal_type"
              displayEmpty
              value={formik.values.terminal_type}
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
                const selectedName = terminalTypeOptions.find(
                  (item) => item.value === selected
                );
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selectedName?.name}
                  </Typography>
                );
              }}
              error={
                formik.touched.terminal_type &&
                Boolean(formik.errors.terminal_type)
              }
            >
              <MenuItem disabled value="">
                <em> </em>
              </MenuItem>
              {terminalTypeOptions.map((d) => (
                <MenuItem
                  key={d.name}
                  id={d.name}
                  selected={d.value === formik.values.terminal_type}
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
            {edit ? t('components.addTerminalDialog.save') : t('components.addTerminalDialog.add')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
