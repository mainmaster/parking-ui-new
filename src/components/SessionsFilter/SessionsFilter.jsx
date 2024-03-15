import React, { useEffect, useState } from 'react';
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
import { colors } from '../../theme/colors';
import { closeButtonStyle, secondaryButtonStyle } from '../../theme/styles';
import searchIcon from '../../assets/svg/log_event_search_icon.svg';
import searchCancelIcon from '../../assets/svg/log_event_search_cancel_icon.svg';
import eventTuneIcon from '../../assets/svg/log_event_tune_icon.svg';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import { DateIcon } from './DateIcon';
import { useDispatch, useSelector } from 'react-redux';
import {
  sessionsFetch,
  setFilters,
  changeCurrentPage
} from 'store/sessions/sessionsSlice';
import { useFormik } from 'formik';
import { formatISO } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const desktopMenuStyle = {
  position: 'absolute',
  top: '64px',
  right: '16px',
  width: '360px',
  p: '16px',
  pt: '8px',
  //borderBottom: `1px solid ${colors.outline.surface}`,
  backgroundColor: colors.surface.low,
  borderRadius: '16px',
  filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))',
  zIndex: 1
};

const mobileMenuStyle = {
  p: '16px',
  pt: '8px',
  backgroundColor: colors.surface.low
};

const CarNumberInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  backgroundColor: colors.surface.low,
  border: '1px solid ' + colors.outline.default,
  borderRadius: '20px',
  height: '40px',
  justifyContent: 'center',
  '& .MuiFilledInput-root': {
    backgroundColor: 'transparent !important',
    paddingRight: '12px',
    '&:hover': { backgroundColor: 'transparent !important' },
    '& .Mui-focused': { backgroundColor: 'transparent !important' }
  },
  '& .MuiFilledInput-input': {
    backgroundColor: colors.surface.low,
    alignSelf: 'center',
    padding: 0,
    color: 'black'
  }
}));

const selectMenuStyle = {
  width: '100%',
  backgroundColor: `${colors.surface.low} !important`,
  border: '1px solid ' + colors.outline.default,
  borderRadius: '20px',
  height: '40px',
  justifyContent: 'center',
  '&:after, &:before': {
    display: 'none'
  },
  '&:hover, & .Mui-focused': {
    backgroundColor: `${colors.surface.low} !important`
  },
  '& .MuiFilledInput-input': {
    backgroundColor: colors.surface.low,
    alignSelf: 'center',
    padding: `${0} !important`,
    paddingRight: '28px !important',
    marginLeft: '12px',
    marginRight: '12px',
    color: colors.element.primary,
    display: 'flex',
    alignItems: 'center',
    '&:hover, &:focus': { backgroundColor: 'transparent !important' }
  }
};

const DateInputStyle = {
  width: '100%',
  backgroundColor: `${colors.surface.low} !important`,
  border: '1px solid ' + colors.outline.default,
  borderRadius: '20px',
  height: '40px',
  justifyContent: 'center',
  '& .MuiFilledInput-root': {
    backgroundColor: 'transparent !important',
    '&:hover': { backgroundColor: 'transparent !important' },
    '& .Mui-focused': { backgroundColor: 'transparent !important' },
    '&:after, &:before': {
      display: 'none'
    }
  },
  '& .MuiFilledInput-input': {
    backgroundColor: colors.surface.low,
    padding: `${0} !important`,
    width: '100%',
    fontWeight: 500,
    color: colors.element.primary,
    marginLeft: '12px'
  },
  '& .MuiIconButton-root': {
    borderRadius: 0
  }
};

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: '0.875rem',
  pb: '4px',
  pl: '12px'
};

const defaultValues = {
  vehiclePlate: ''
};

const sessionStatusValues = [
  { value: 'open', name: 'Открытые' },
  { value: 'closed', name: 'Закрытые' }
];

const paymentStatusValues = [
  { value: true, name: 'Оплачено' },
  { value: false, name: 'Не оплачено' }
];

export default function SessionsFilter({ openForm, setOpenForm }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSessionStatus, setSelectedSessionStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);
  const [submited, setSubmited] = useState(true);
  const [numberInChange, setNumberInChange] = useState(false);
  const filters = useSelector((state) => state.sessions.filters);
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
      dispatch(sessionsFetch(filters));
      dispatch(changeCurrentPage(1));
      setSubmited(true);
    }
  });

  const resetHandle = () => {
    formik.resetForm();
    // setSelectedEventCode('');
    // setSelectedAccessPoint('');
    // setFromValue(null);
    // setToValue(null);
    dispatch(sessionsFetch());
    dispatch(setFilters(null));
    dispatch(changeCurrentPage(1));
    setSubmited(true);
  };

  const handleChangeField = (e) => {
    if (!openForm) {
      const values = {
        vehiclePlate: e.target.value
      };
      dispatch(sessionsFetch(values));
      dispatch(setFilters(values));
      dispatch(changeCurrentPage(1));
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
      dispatch(sessionsFetch());
      dispatch(setFilters(null));
      dispatch(changeCurrentPage(1));
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

  const handleSessionStatusChange = (event) => {
    const status = sessionStatusValues.find(
      (st) => st.name === event.target.value
    );
    if (status) {
      const values = {
        ...filters,
        status: status.value
      };
      dispatch(setFilters(values));
      setSubmited(false);
    }
    setSelectedSessionStatus(event.target.value);
  };

  const handlePaymentStatusChange = (event) => {
    const status = paymentStatusValues.find(
      (st) => st.name === event.target.value
    );
    if (status) {
      const values = {
        ...filters,
        isPaid: status.value
      };
      dispatch(setFilters(values));
      setSubmited(false);
    }
    setSelectedPaymentStatus(event.target.value);
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
          minWidth: '360px'
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
            autoFocus
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
                    alt="Найти по номеру"
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
                      alt={'Очистить'}
                    />
                  </IconButton>
                </InputAdornment>
              )
            }}
            variant="filled"
            id="vehiclePlate"
            name="vehiclePlate"
            placeholder="Найти по номеру"
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
              secondaryButtonStyle,
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
          <Stack sx={isMobile ? mobileMenuStyle : desktopMenuStyle} gap={'8px'}>
            <Stack>
              <InputLabel htmlFor="session-status-select" sx={labelStyle}>
                Статус сессии
              </InputLabel>
              <Select
                id="session-status-select"
                displayEmpty
                value={selectedSessionStatus}
                onChange={handleSessionStatusChange}
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
                sx={selectMenuStyle}
                renderValue={(selected) => {
                  if (selected === '') {
                    return <em>Выбрать</em>;
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
                <MenuItem disabled value="">
                  <em>Выбрать</em>
                </MenuItem>
                {sessionStatusValues.map((st) => (
                  <MenuItem
                    key={st.value}
                    id={st.name}
                    selected={st.name === selectedSessionStatus}
                    value={st.name}
                  >
                    <Typography
                      component={'h5'}
                      noWrap
                      sx={{ fontWeight: 500, p: 0 }}
                    >
                      {st.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack>
              <InputLabel htmlFor="payment-status-select" sx={labelStyle}>
                Статус оплаты
              </InputLabel>
              <Select
                id="payment-status-select"
                displayEmpty
                value={selectedPaymentStatus}
                onChange={handlePaymentStatusChange}
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
                sx={selectMenuStyle}
                renderValue={(selected) => {
                  if (selected === '') {
                    return <em>Выбрать</em>;
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
                <MenuItem disabled value="">
                  <em>Выбрать</em>
                </MenuItem>
                {paymentStatusValues.map((st) => (
                  <MenuItem
                    key={st.name}
                    id={st.name}
                    selected={st.name === selectedPaymentStatus}
                    value={st.name}
                  >
                    <Typography
                      component={'h5'}
                      noWrap
                      sx={{ fontWeight: 500, p: 0 }}
                    >
                      {st.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack>
              <Typography sx={labelStyle}>Дата</Typography>
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
                      sx: DateInputStyle,
                      placeholder: 'От'
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
                      sx: DateInputStyle,
                      placeholder: 'До'
                    },
                    openPickerButton: { disableRipple: true }
                  }}
                  slots={{
                    openPickerIcon: DateIcon
                  }}
                />
              </Stack>
            </Stack>

            <Stack direction={'row'} gap={'8px'} sx={{ pt: '8px' }}>
              <Button
                disabled={submited}
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={[closeButtonStyle, { flexGrow: 1 }]}
                type="submit"
              >
                Применить
              </Button>
              <Button
                disabled={!filters}
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={[secondaryButtonStyle, { flexGrow: 1 }]}
                onClick={resetHandle}
              >
                Сбросить
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </>
  );
}
