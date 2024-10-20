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
  secondaryButtonStyle,
  CarNumberInput,
  desktopMenuStyle,
  mobileMenuStyle
} from '../../theme/styles';
import searchIcon from '../../assets/svg/log_event_search_icon.svg';
import searchCancelIcon from '../../assets/svg/log_event_search_cancel_icon.svg';
import eventTuneIcon from '../../assets/svg/log_event_tune_icon.svg';
import { format } from 'date-fns';
import i18n from '../../translation/index';
import { useTranslation } from 'react-i18next';
import ApplicationFilterForm from '../ApplicationFilterForm/ApplicationFilterForm';

const defaultValues = {
  vehiclePlate: '',
  companyName: ''
};

let applicationStatusValues = [
  { value: 'true', name: i18n.t('components.applicationFilter.statusUsed') },
  { value: 'false', name: i18n.t('components.applicationFilter.statusNotUsed') }
];

export default function ApplicationFilter({ openForm, setOpenForm }) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    applicationStatusValues = [
      {
        value: 'true',
        name: i18n.t('components.applicationFilter.statusUsed')
      },
      {
        value: 'false',
        name: i18n.t('components.applicationFilter.statusNotUsed')
      }
    ];
  }, [i18n.language]);

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
          <ApplicationFilterForm
            fromValue={fromValue}
            toValue={toValue}
            handleFromDateChanged={handleFromDateChanged}
            userType={userType}
            selectedCompany={selectedCompany}
            handleCompanyChange={handleCompanyChange}
            handleToDateChanged={handleToDateChanged}
            selectedApplicationStatus={selectedApplicationStatus}
            handleApplicationStatusChange={handleApplicationStatusChange}
            submited={submited}
            resetHandle={resetHandle}
            filters={filters}
            submitedText={t('components.applicationFilter.submit')}
            styles={
              isMobile
                ? mobileMenuStyle({ ...theme, border: true })
                : desktopMenuStyle({ ...theme })
            }
          />
        )}
      </Box>
    </>
  );
}
