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
  Typography,
  MenuItem,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Switch,
  styled
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { useTerminalsQuery } from 'api/terminal/terminal.api';
import {
  createAccessPointFetch,
  editAccessPointFetch
} from 'store/accessPoints/accessPointsSlice';
import closeIcon from '../../assets/svg/car_number_dialog_close_icon.svg';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import checkIcon from '../../assets/svg/multiselect_check_icon.svg';
import {
  primaryButtonStyle,
  listStyle,
  secondaryButtonStyle,
  CarNumberInput,
  selectMenuStyle,
  switchInputStyle
} from '../../theme/styles';
import {
  directionOptions,
  relayNumberOptions,
  statusContactOptions
} from 'constants';
import theme from '../../theme/normal';

const validationSchema = yup.object({
  description: yup.string().required('Введите название'),
  direction: yup.string().required('Выберите направление'),
  cam_id: yup.number().required('Выберите камеру'),
  laurent_id: yup.number().required('Выберите контроллер'),
  led_board_id: yup.number().required('Выберите LED табло'),
  open_relay_number: yup.number().required('Выберите реле для открытия'),
  close_relay_number: yup.number().required('Выберите реле для закрытия'),
  status_contact_number: yup
    .number()
    .required('Выберите номер контакта статуса открытия'),
  seconds_before_close_laurent: yup
    .number()
    .required('Введите задержку перед закрытием'),
  seconds_between_laurent_checks: yup
    .number()
    .required('Введите задержку между проверкой статуса шлагбаума'),
  seconds_before_laurent_checks: yup
    .number()
    .required('Введите задержку перед проверкой статуса шлагбаума'),
  laurent_checks_amount: yup
    .number()
    .required('Введите количество проверок статуса шлагбаума'),
  terminal_id: yup.number(),
  is_reverse_access_point: yup.boolean(),
  working_modes: yup.string()
});

const labelStyle = {
  pb: '4px',
  pl: '12px',
  whiteSpace: 'wrap'
};

export default function AddAccessPointDialog({ show, handleClose, edit }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [submited, setSubmited] = useState(true);
  const { data: terminals } = useTerminalsQuery();
  const accessPointEdit = useSelector(
    (state) => state.accessPoints.accessPointEdit
  );
  const cameras = useSelector((state) => state.cameras.cameras);
  const controllers = useSelector((state) => state.controllers.controllers);
  const leds = useSelector((state) => state.leds.leds);
  const workingModes = useSelector((state) => state.workingModes.workingModes);
  const isError = useSelector((state) => state.accessPoints.isErrorFetch);
  const urlStatus = useParams();
  const theme = useTheme();

  useEffect(() => {
    if (!show) {
      resetHandle();
    }
  }, [show]);

  const defaultValues = useMemo(() => {
    return {
      description: accessPointEdit?.description || '',
      direction: accessPointEdit?.direction || '',
      cam_id: accessPointEdit?.cameras ? accessPointEdit?.cameras[0] : '',
      laurent_id: accessPointEdit?.laurent_id || '',
      led_board_id: accessPointEdit?.led_board_id || '',
      open_relay_number: accessPointEdit?.open_relay_number || '',
      close_relay_number: accessPointEdit?.close_relay_number || '',
      status_contact_number: accessPointEdit?.status_contact_number || '',
      seconds_before_close_laurent:
        accessPointEdit?.seconds_before_close_laurent || '',
      seconds_between_laurent_checks:
        accessPointEdit?.seconds_between_laurent_checks || '',
      seconds_before_laurent_checks:
        accessPointEdit?.seconds_before_laurent_checks || '',
      laurent_checks_amount: accessPointEdit?.laurent_checks_amount || '',
      terminal_id: accessPointEdit?.terminal_id || '',
      is_reverse_access_point:
        accessPointEdit?.is_reverse_access_point || false,
      working_modes: accessPointEdit?.working_modes
        ? accessPointEdit?.working_modes.join(',')
        : ''
    };
  }, [accessPointEdit]);

  const camerasOptions = useMemo(() => {
    return cameras.map((item) => ({
      name: item.description,
      value: item.id
    }));
  }, [cameras]);

  const controllersOptions = useMemo(() => {
    return controllers.map((item) => ({
      name: item.description,
      value: item.id
    }));
  }, [controllers]);

  const ledsOptions = useMemo(() => {
    return leds.map((item) => ({
      name: item.description,
      value: item.id
    }));
  }, [leds]);

  const terminalOptions = useMemo(() => {
    return terminals?.map((item) => ({
      name: item.description,
      value: item.id
    }));
  }, [terminals]);

  const workingModesOptions = useMemo(() => {
    return workingModes.map((item) => ({
      name: item.description,
      value: item.id
    }));
  }, [workingModes]);

  const formik = useFormik({
    initialValues: defaultValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const {
        description,
        direction,
        cam_id,
        laurent_id,
        led_board_id,
        open_relay_number,
        close_relay_number,
        status_contact_number,
        seconds_before_close_laurent,
        seconds_between_laurent_checks,
        seconds_before_laurent_checks,
        laurent_checks_amount,
        terminal_id,
        is_reverse_access_point,
        working_modes
      } = values;
      if (edit) {
        const payload = {
          description: description,
          direction: direction,
          cameras: [cam_id],
          laurent_id: laurent_id,
          led_board_id: led_board_id,
          open_relay_number: open_relay_number,
          close_relay_number: close_relay_number,
          status_contact_number: status_contact_number,
          seconds_before_close_laurent: seconds_before_close_laurent,
          seconds_between_laurent_checks: seconds_between_laurent_checks,
          seconds_before_laurent_checks: seconds_before_laurent_checks,
          laurent_checks_amount: laurent_checks_amount,
          terminal_id: terminal_id,
          is_reverse_access_point: is_reverse_access_point,
          working_modes: working_modes
            .split(',')
            .map((i) => parseInt(i, 10))
            .filter((i) => !isNaN(i)),
          id: accessPointEdit.id
        };
        dispatch(editAccessPointFetch(payload));
      } else {
        const payload = {
          description: description,
          direction: direction,
          cameras: [cam_id],
          laurent_id: laurent_id,
          led_board_id: led_board_id,
          open_relay_number: open_relay_number,
          close_relay_number: close_relay_number,
          status_contact_number: status_contact_number,
          seconds_before_close_laurent: seconds_before_close_laurent,
          seconds_between_laurent_checks: seconds_between_laurent_checks,
          seconds_before_laurent_checks: seconds_before_laurent_checks,
          laurent_checks_amount: laurent_checks_amount,
          is_reverse_access_point: is_reverse_access_point,
          terminal_id: terminal_id,
          working_modes: working_modes
            .split(',')
            .map((i) => parseInt(i, 10))
            .filter((i) => !isNaN(i))
        };
        dispatch(createAccessPointFetch(payload));
      }
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

  const handleMultiSelectChange = (event) => {
    const {
      target: { value }
    } = event;
    const modes = value.map((item) => item).join(',');
    formik.setFieldValue('working_modes', modes);
    setSubmited(false);
  };

  const handleCloseDialog = () => {
    resetHandle();
    handleClose();
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
        {edit ? 'Редактировать точку доступа' : 'Добавить точку доступа'}
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
            <InputLabel htmlFor="direction" sx={labelStyle}>
              Направление
            </InputLabel>
            <Select
              id="direction"
              name="direction"
              displayEmpty
              value={formik.values.direction}
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
                const selectedName = directionOptions.find(
                  (item) => item.value === selected
                );
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selectedName?.name}
                  </Typography>
                );
              }}
              error={
                formik.touched.direction && Boolean(formik.errors.direction)
              }
            >
              <MenuItem disabled value="">
                <em> </em>
              </MenuItem>
              {directionOptions.map((d) => (
                <MenuItem
                  key={d.name}
                  id={d.name}
                  selected={d.value === formik.values.direction}
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
          <Stack>
            <InputLabel htmlFor="cam_id" sx={labelStyle}>
              Камеры
            </InputLabel>
            <Select
              id="cam_id"
              name="cam_id"
              displayEmpty
              value={formik.values.cam_id}
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
                const selectedName = camerasOptions.find(
                  (item) => item.value === selected
                );
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selectedName?.name}
                  </Typography>
                );
              }}
              error={formik.touched.cam_id && Boolean(formik.errors.cam_id)}
            >
              <MenuItem disabled value="">
                <em> </em>
              </MenuItem>
              {camerasOptions.map((d) => (
                <MenuItem
                  key={d.name}
                  id={d.name}
                  selected={d.value === formik.values.cam_id}
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
          <Stack>
            <InputLabel htmlFor="laurent_id" sx={labelStyle}>
              Контроллер
            </InputLabel>
            <Select
              id="laurent_id"
              name="laurent_id"
              displayEmpty
              value={formik.values.laurent_id}
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
                const selectedName = controllersOptions.find(
                  (item) => item.value === selected
                );
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selectedName?.name}
                  </Typography>
                );
              }}
              error={
                formik.touched.laurent_id && Boolean(formik.errors.laurent_id)
              }
            >
              <MenuItem disabled value="">
                <em> </em>
              </MenuItem>
              {controllersOptions.map((d) => (
                <MenuItem
                  key={d.name}
                  id={d.name}
                  selected={d.value === formik.values.laurent_id}
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
          <Stack>
            <InputLabel htmlFor="led_board_id" sx={labelStyle}>
              LED табло
            </InputLabel>
            <Select
              id="led_board_id"
              name="led_board_id"
              displayEmpty
              value={formik.values.led_board_id}
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
                const selectedName = ledsOptions.find(
                  (item) => item.value === selected
                );
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selectedName?.name}
                  </Typography>
                );
              }}
              error={
                formik.touched.led_board_id &&
                Boolean(formik.errors.led_board_id)
              }
            >
              <MenuItem disabled value="">
                <em> </em>
              </MenuItem>
              {ledsOptions.map((d) => (
                <MenuItem
                  key={d.name}
                  id={d.name}
                  selected={d.value === formik.values.led_board_id}
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
          <Stack>
            <InputLabel htmlFor="open_relay_number" sx={labelStyle}>
              Номер реле для открытия
            </InputLabel>
            <Select
              id="open_relay_number"
              name="open_relay_number"
              displayEmpty
              value={formik.values.open_relay_number}
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
                const selectedName = relayNumberOptions.find(
                  (item) => item.value === selected
                );
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selectedName?.name}
                  </Typography>
                );
              }}
              error={
                formik.touched.open_relay_number &&
                Boolean(formik.errors.open_relay_number)
              }
            >
              <MenuItem disabled value="">
                <em> </em>
              </MenuItem>
              {relayNumberOptions.map((d) => (
                <MenuItem
                  key={d.name}
                  id={d.name}
                  selected={d.value === formik.values.open_relay_number}
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
          <Stack>
            <InputLabel htmlFor="close_relay_number" sx={labelStyle}>
              Номер реле для закрытия
            </InputLabel>
            <Select
              id="close_relay_number"
              name="close_relay_number"
              displayEmpty
              value={formik.values.close_relay_number}
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
                const selectedName = relayNumberOptions.find(
                  (item) => item.value === selected
                );
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selectedName?.name}
                  </Typography>
                );
              }}
              error={
                formik.touched.close_relay_number &&
                Boolean(formik.errors.close_relay_number)
              }
            >
              <MenuItem disabled value="">
                <em> </em>
              </MenuItem>
              {relayNumberOptions.map((d) => (
                <MenuItem
                  key={d.name}
                  id={d.name}
                  selected={d.value === formik.values.close_relay_number}
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
          <Stack>
            <InputLabel htmlFor="status_contact_number" sx={labelStyle}>
              Номер контакта статуса открытия
            </InputLabel>
            <Select
              id="status_contact_number"
              name="status_contact_number"
              displayEmpty
              value={formik.values.status_contact_number}
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
                const selectedName = statusContactOptions.find(
                  (item) => item.value === selected
                );
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selectedName?.name}
                  </Typography>
                );
              }}
              error={
                formik.touched.status_contact_number &&
                Boolean(formik.errors.status_contact_number)
              }
            >
              <MenuItem disabled value="">
                <em> </em>
              </MenuItem>
              {statusContactOptions.map((d) => (
                <MenuItem
                  key={d.name}
                  id={d.name}
                  selected={d.value === formik.values.status_contact_number}
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
          <Stack>
            <InputLabel htmlFor="seconds_before_close_laurent" sx={labelStyle}>
              Задержка перед закрытием (cекунд)
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                type: 'number',
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="seconds_before_close_laurent"
              name="seconds_before_close_laurent"
              value={formik.values.seconds_before_close_laurent}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.seconds_before_close_laurent &&
                Boolean(formik.errors.seconds_before_close_laurent)
              }
            />
          </Stack>
          <Stack>
            <InputLabel
              htmlFor="seconds_between_laurent_checks"
              sx={labelStyle}
            >
              Задержка между проверкой статуса шлагбаума (секунд)
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                type: 'number',
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="seconds_between_laurent_checks"
              name="seconds_between_laurent_checks"
              value={formik.values.seconds_between_laurent_checks}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.seconds_between_laurent_checks &&
                Boolean(formik.errors.seconds_between_laurent_checks)
              }
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="seconds_before_laurent_checks" sx={labelStyle}>
              Задержка перед проверкой статуса шлагбаума (секунд)
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                type: 'number',
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="seconds_before_laurent_checks"
              name="seconds_before_laurent_checks"
              value={formik.values.seconds_before_laurent_checks}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.seconds_before_laurent_checks &&
                Boolean(formik.errors.seconds_before_laurent_checks)
              }
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="laurent_checks_amount" sx={labelStyle}>
              Кол-во проверок статуса шлагбаума
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                type: 'number',
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
              }}
              variant="filled"
              id="laurent_checks_amount"
              name="laurent_checks_amount"
              value={formik.values.laurent_checks_amount}
              onChange={handleValueChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.laurent_checks_amount &&
                Boolean(formik.errors.laurent_checks_amount)
              }
            />
          </Stack>
          <Stack>
            <InputLabel htmlFor="terminal_id" sx={labelStyle}>
              Терминал
            </InputLabel>
            <Select
              id="terminal_id"
              name="terminal_id"
              displayEmpty
              value={formik.values.terminal_id}
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
                const selectedName = terminalOptions.find(
                  (item) => item.value === selected
                );
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selectedName?.name}
                  </Typography>
                );
              }}
              error={
                formik.touched.terminal_id && Boolean(formik.errors.terminal_id)
              }
            >
              <MenuItem disabled value="">
                <em> </em>
              </MenuItem>
              {terminalOptions &&
                terminalOptions.map((d) => (
                  <MenuItem
                    key={d.name}
                    id={d.name}
                    selected={d.value === formik.values.terminal_id}
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
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(formik.values.is_reverse_access_point)}
                  onChange={handleValueChange}
                  name="is_reverse_access_point"
                  sx={switchInputStyle({ ...theme })}
                />
              }
              label="Включить реверс"
              labelPlacement="end"
              sx={{
                m: 0,
                justifyContent: 'flex-start',
                gap: '16px',
                pl: '12px'
              }}
            />
          </FormGroup>
          <Stack>
            <InputLabel htmlFor="working_modes" sx={labelStyle}>
              Режимы
            </InputLabel>
            <Select
              id="working_modes"
              name="working_modes"
              multiple
              displayEmpty
              value={formik.values.working_modes.split(',')}
              onChange={handleMultiSelectChange}
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
                const selectedItems = workingModesOptions.filter((item) =>
                  selected.includes(item.value.toString())
                );
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selectedItems.map((item) => item.name).join(', ')}
                  </Typography>
                );
              }}
              error={
                formik.touched.working_modes &&
                Boolean(formik.errors.working_modes)
              }
            >
              <MenuItem disabled value="" sx={{ display: 'none' }}></MenuItem>
              {workingModesOptions &&
                workingModesOptions.map((d) => {
                  const selected = formik.values.working_modes
                    .split(',')
                    .some((item) => item === d.value.toString());
                  return (
                    <MenuItem
                      key={d.name}
                      id={d.name}
                      disableRipple
                      selected={selected}
                      value={d.value.toString()}
                      sx={{
                        p: '8px',
                        '&.Mui-selected': { backgroundColor: 'transparent' }
                      }}
                    >
                      <Stack
                        direction={'row'}
                        gap={'8px'}
                        sx={{ height: '24px' }}
                        alignItems={'center'}
                      >
                        <Box sx={{ width: '24px' }}>
                          {selected && <img src={checkIcon} alt="checked" />}
                        </Box>
                        <Typography
                          component={'h5'}
                          noWrap
                          sx={{ fontWeight: 500, p: 0 }}
                        >
                          {d.name}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  );
                })}
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
