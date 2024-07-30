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
  applicationsFetch,
  changeCurrentPage,
  setFilters
} from '../../store/applications/applicationSlice';
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
import { format } from 'date-fns';
import RenterSelect from './RenterSelect';
import i18n from '../../translation/index'
import {useTranslation} from "react-i18next";

const defaultValues = {
  vehiclePlate: '',
  companyName: ''
};

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: '0.875rem',
  pb: '4px',
  pl: '12px'
};

let applicationStatusValues = [
  { value: 'true', name: i18n.t('components.applicationFilter.statusUsed') },
  { value: 'false', name: i18n.t('components.applicationFilter.statusNotUsed') }
];

export default function ApplicationFilter({ openForm, setOpenForm }) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    applicationStatusValues = [
      { value: 'true', name: i18n.t('components.applicationFilter.statusUsed') },
      { value: 'false', name: i18n.t('components.applicationFilter.statusNotUsed') }
    ]
  }, [i18n.language])

  const [anchorEl, setAnchorEl] = useState(null);
  const [fromValue, setFromValue] = useState(null);
  const [toValue, setToValue] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedApplicationStatus, setSelectedApplicationStatus] =
    useState('');
  const [submited, setSubmited] = useState(true);
  const [numberInChange, setNumberInChange] = useState(false);
  const filters = useSelector((state) => state.applications.filters);

  const userType = useSelector((state) => state.parkingInfo.userType);
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
      dispatch(changeCurrentPage(1));
      dispatch(applicationsFetch(filters));
      setSubmited(true);
    }
  });

  const resetHandle = () => {
    formik.resetForm();
    dispatch(setFilters(null));
    dispatch(changeCurrentPage(1));
    dispatch(applicationsFetch());
    setFromValue(null);
    setToValue(null);
    setSelectedCompany('');
    setSelectedApplicationStatus('');
    setSubmited(true);
  };

  const handleChangeField = (e) => {
    if (!openForm) {
      const values = {
        vehiclePlate: e.target.value
      };
      dispatch(setFilters(values));
      dispatch(changeCurrentPage(1));
      dispatch(applicationsFetch(values));
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
      dispatch(setFilters(null));
      dispatch(changeCurrentPage(1));
      dispatch(applicationsFetch());
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

  const handleFromDateChanged = (newValue) => {
    if (newValue) {
      const values = {
        ...filters,
        validForDateFrom: format(newValue, 'yyyy-MM-dd')
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
        validForDateTo: format(newValue, 'yyyy-MM-dd')
      };
      dispatch(setFilters(values));
      setToValue(newValue);
      setSubmited(false);
    }
  };

  const handleCompanyChange = (event) => {
    const values = {
      ...filters,
      companyID: event.target.value
    };
    dispatch(setFilters(values));
    setSubmited(false);
    setSelectedCompany(event.target.value);
  };

  const handleApplicationStatusChange = (event) => {
    const status = applicationStatusValues.find(
      (st) => st.name === event.target.value
    );
    if (status) {
      const values = {
        ...filters,
        isUsed: status.value
      };
      dispatch(setFilters(values));
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        isUsed: ''
      };
      dispatch(setFilters(values));
      setSubmited(false);
    }
    setSelectedApplicationStatus(event.target.value);
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
                    alt={t('components.applicationFilter.searchByNumber')}
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
                      alt={t('components.applicationFilter.clear')}
                    />
                  </IconButton>
                </InputAdornment>
              )
            }}
            variant="filled"
            id="vehiclePlate"
            name="vehiclePlate"
            placeholder={t('components.applicationFilter.searchByNumber')}
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
          <Stack
            sx={
              isMobile
                ? mobileMenuStyle({ ...theme, border: true })
                : desktopMenuStyle({ ...theme })
            }
            gap={'8px'}
          >
            <Stack>
              <Typography sx={labelStyle}>{t('components.applicationFilter.date')}</Typography>
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
                      sx: DateInputStyle({ ...theme }),
                      placeholder: t('components.applicationFilter.from')
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
                      sx: DateInputStyle({ ...theme }),
                      placeholder: t('components.applicationFilter.to')
                    },
                    openPickerButton: { disableRipple: true }
                  }}
                  slots={{
                    openPickerIcon: DateIcon
                  }}
                />
              </Stack>
            </Stack>
            {userType && userType !== 'renter' && (
              <RenterSelect
                selected={selectedCompany}
                handleChange={handleCompanyChange}
              />
            )}
            <Stack>
              <InputLabel htmlFor="application-status-select" sx={labelStyle}>
                {t('components.applicationFilter.requestStatus')}
              </InputLabel>
              <Select
                id="application-status-select"
                displayEmpty
                value={selectedApplicationStatus}
                onChange={handleApplicationStatusChange}
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
                  if (selected === '') {
                    return <em>{t('components.applicationFilter.choose')}</em>;
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
                <MenuItem value="">
                  <em>{t('components.applicationFilter.choose')}</em>
                </MenuItem>
                {applicationStatusValues.map((st) => (
                  <MenuItem
                    key={st.value}
                    id={st.name}
                    selected={st.name === selectedApplicationStatus}
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

            <Stack direction={'row'} gap={'8px'} sx={{ pt: '8px' }}>
              <Button
                disabled={submited}
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={[primaryButtonStyle({ ...theme }), { flexGrow: 1 }]}
                type="submit"
              >
                {t('components.applicationFilter.submit')}
              </Button>
              <Button
                disabled={!filters}
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={[secondaryButtonStyle({ ...theme }), { flexGrow: 1 }]}
                onClick={resetHandle}
              >
                {t('components.applicationFilter.reset')}
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </>
  );
}
