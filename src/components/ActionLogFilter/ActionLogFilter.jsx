import { Box, IconButton, InputAdornment, Stack } from '@mui/material';
import {
  CarNumberInput,
  desktopMenuStyle,
  mobileMenuStyle,
  secondaryButtonStyle
} from '../../theme/styles';
import searchIcon from '../../assets/svg/log_event_search_icon.svg';
import searchCancelIcon from '../../assets/svg/log_event_search_cancel_icon.svg';
import eventTuneIcon from '../../assets/svg/log_event_tune_icon.svg';
import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  changeCurrentPage,
  actionLogsChangePageFetch,
  actionLogsFetch,
  setFilters
} from "../../store/actionLogs/actionLogsSlice";
import {useFormik} from "formik";
import {formatISO} from "date-fns";
import i18n from "../../translation";
import {ActionLogFilterForm} from "../ActionLogFilterForm/ActionLogFilterForm";
import {useParkingInfoQuery} from "../../api/settings/settings";


const defaultValues = {
  username: ''
};
let actionLogSection = [
  { value: 'access_point', name: i18n.t('components.actionLogFilter.accessPoint') },
  { value: 'black_list', name: i18n.t('components.actionLogFilter.blackList') },
  { value: 'camera', name: i18n.t('components.actionLogFilter.camera') },
  { value: 'laurent', name: i18n.t('components.actionLogFilter.laurent') },
  { value: 'led_board', name: i18n.t('components.actionLogFilter.ledBoard') },
  { value: 'report', name: i18n.t('components.actionLogFilter.report') },
  { value: 'request', name: i18n.t('components.actionLogFilter.request') },
  { value: 'settings', name: i18n.t('components.actionLogFilter.settings') },
  { value: 'terminal', name: i18n.t('components.actionLogFilter.terminal') },
  { value: 'working_mode', name: i18n.t('components.actionLogFilter.workingMode') },
  { value: 'operator', name: i18n.t('components.actionLogFilter.operator') },
  { value: 'renter', name: i18n.t('components.actionLogFilter.renter') },
  { value: 'car_park', name: i18n.t('components.actionLogFilter.carPark') },
]

let actionLogAction = [
  { value: 'update', name: i18n.t('components.actionLogFilter.update') },
  { value: 'create', name: i18n.t('components.actionLogFilter.create') },
  { value: 'delete', name: i18n.t('components.actionLogFilter.delete') },
]

const changeFilter = () => {
  actionLogSection = [
    { value: 'access_point', name: i18n.t('components.actionLogFilter.accessPoint') },
    { value: 'black_list', name: i18n.t('components.actionLogFilter.blackList') },
    { value: 'camera', name: i18n.t('components.actionLogFilter.camera') },
    { value: 'laurent', name: i18n.t('components.actionLogFilter.laurent') },
    { value: 'led_board', name: i18n.t('components.actionLogFilter.ledBoard') },
    { value: 'report', name: i18n.t('components.actionLogFilter.report') },
    { value: 'request', name: i18n.t('components.actionLogFilter.request') },
    { value: 'settings', name: i18n.t('components.actionLogFilter.settings') },
    { value: 'terminal', name: i18n.t('components.actionLogFilter.terminal') },
    { value: 'working_mode', name: i18n.t('components.actionLogFilter.workingMode') },
    { value: 'operator', name: i18n.t('components.actionLogFilter.operator') },
    { value: 'renter', name: i18n.t('components.actionLogFilter.renter') },
    { value: 'car_park', name: i18n.t('components.actionLogFilter.carPark') },

  ];

  actionLogAction = [
    { value: 'update', name: i18n.t('components.actionLogFilter.update') },
    { value: 'create', name: i18n.t('components.actionLogFilter.create') },
    { value: 'delete', name: i18n.t('components.actionLogFilter.delete') },
  ]
};

i18n.on('loaded', () => {
  changeFilter();
});

i18n.on('languageChanged', () => {
  changeFilter();
});

export default function ActionLogFilter({ openForm, setOpenForm }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [entry, setEntry] = useState('');
  const [action, setAction] = useState('');
  const [submited, setSubmited] = useState(true);
  const [numberInChange, setNumberInChange] = useState(false);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const filters = useSelector((state) => state.actionLogs.filters);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: parkingData } = useParkingInfoQuery();
  const [number, setNumber] = useState('');
 
  useEffect(() => {
    if (!parkingData) {
      return;
    }

    const params = new URLSearchParams(location.search);
    const initialFilters = {
      username: params.get('username') || '',
      action: params.get('action') || '',
      entry: params.get('entry') || '',
      entryId: params.get('entryId') || '',
      createDatetime_after: params.get('createDatetime_after') || '',
      createDatetime_before: params.get('createDatetime_before') || '',
      page: params.get('page')
    };

    const pageNumber = initialFilters.page ? Number(initialFilters.page) : 1;
    setFilterParams(initialFilters);

    dispatch(setFilters(initialFilters));
    dispatch(actionLogsFetch({ data: initialFilters,  id: parkingData.parkingID }));
    dispatch(changeCurrentPage(pageNumber));
    setSubmited(true);
  }, [parkingData]);

  const formik = useFormik({
    initialValues: defaultValues,
    onSubmit: (values) => {

      dispatch(actionLogsFetch({ id: parkingData.parkingID, data: filters }));
      dispatch(changeCurrentPage(1));
      setSubmited(true);
    }
  });

  const setFilterParams = (initialFilters) => {
    const entry = initialFilters.entry ? actionLogSection.find(type => type.value === initialFilters.entry) : null;
    const action = initialFilters.action ? actionLogAction.find(type => type.value === initialFilters.action) : null;

    if (entry) { setEntry(entry.name); }
    if (initialFilters.username) { formik.values.username = initialFilters.username; }
    if (action) { setAction(action.name); }
    if (initialFilters.createDatetime_after) { setDateTo(new Date(initialFilters.createDatetime_after)); }
    if (initialFilters.createDatetime_before) { setDateFrom(new Date(initialFilters.createDatetime_before)); }
    if (initialFilters.entryId) {setNumber(initialFilters.entryId); }
  }

  const updateURL = (newFilters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      params.set(key, newFilters[key] !== undefined && newFilters[key] !== null ? newFilters[key] : '');
    });

    navigate({ search: params.toString() });
  };

  const resetHandle = () => {
    formik.resetForm();
    formik.values.username = '';
    updateURL({});
    dispatch(setFilters(null));
    dispatch(changeCurrentPage(1));
    dispatch(actionLogsFetch({id: parkingData.parkingID}));
    setDateFrom(null);
    setDateTo(null);
    setEntry('');
    setAction('');
    setSubmited(true);
    setNumber('');
  };

  const handleChangeField = (e) => {
    if (!openForm) {
      const values = {
        username: e.target.value
      };
      dispatch(setFilters(values));
      updateURL(values);
      dispatch(changeCurrentPage(1));
      dispatch(actionLogsChangePageFetch({ data: values, id: parkingData.parkingID, num: 1 }));
    } else if (openForm) {
      const values = {
        ...filters,
        username: e.target.value
      };
      dispatch(setFilters(values));
      updateURL(values);
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
    formik.values.username = '';
    if (!openForm) {
      dispatch(setFilters(null));
      updateURL({});
      dispatch(changeCurrentPage(1));
      dispatch(actionLogsFetch({id: parkingData.parkingID}));
    } else if (openForm) {
      const values = {
        ...filters,
        username: ''
      };
      dispatch(setFilters(values));
      updateURL(values);
      setSubmited(false);
    }
    setNumberInChange(false);
  };

  const handleDateFromChanged = (newValue) => {
    if (newValue) {
      const values = {
        ...filters,
        createDatetime_after: formatISO(newValue)
      };
      dispatch(setFilters(values));
      updateURL(values);
      setDateFrom(newValue);
      setSubmited(false);
    }
  };

  const handleDateToChanged = (newValue) => {
    if (newValue) {
      const values = {
        ...filters,
        createDatetime_before: formatISO(newValue)
      };
      dispatch(setFilters(values));
      updateURL(values);
      setDateTo(newValue);
      setSubmited(false);
    }
  };

  const handleSectionChange = (event) => {
    const item = actionLogSection.find(
      (item) => item.name === event.target.value
    );
    if (item) {
      const values = {
        ...filters,
        entry: item.value
      };
      dispatch(setFilters(values));
      updateURL(values);
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        entry: ''
      };
      dispatch(setFilters(values));
      updateURL(values);
      setSubmited(false);
    }
    setEntry(event.target.value);
  };

  const handleActionChange = (event) => {
    const item = actionLogAction.find(
      (item) => item.name === event.target.value
    );
    if (item) {
      const values = {
        ...filters,
        action: item.value
      };
      dispatch(setFilters(values));
      updateURL(values);
      setSubmited(false);
    } else if (event.target.value === '') {
      const values = {
        ...filters,
        action: ''
      };
      dispatch(setFilters(values));
      updateURL(values);
      setSubmited(false);
    }
    setAction(event.target.value);
  };

  const handleNumberChange = (value) => {
    const values = {
      ...filters,
      entryId: value
    };
    setNumber(value)
    dispatch(setFilters(values));
    updateURL(values);
    setSubmited(false);
  }

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
                    alt={t('components.actionLogFilterForm.user')}
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
                      alt={t('components.paymentFilter.clear')}
                    />
                  </IconButton>
                </InputAdornment>
              )
            }}
            variant="filled"
            id="username"
            name="username"
            placeholder={t('components.actionLogFilterForm.user')}
            value={formik.values.username}
            onChange={handleChangeField}
            onBlur={formik.handleBlur}
            error={
              formik.touched.username && Boolean(formik.errors.username)
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
          <ActionLogFilterForm
            number={number}
            handleChangeNumber={handleNumberChange}
            dateFrom={dateFrom}
            handleDateFromChanged={handleDateFromChanged}
            dateTo={dateTo}
            handleDateToChanged={handleDateToChanged}
            section={entry}
            handleSectionChange={handleSectionChange}
            sectionValues={actionLogSection}
            action={action}
            handleActionChange={handleActionChange}
            actionValues={actionLogAction}
            submited={submited}
            filters={filters}
            resetHandle={resetHandle}
            styles={
              isMobile
                ? mobileMenuStyle({ ...theme, border: true })
                : desktopMenuStyle({ ...theme })
            }
            confirmText={t('components.actionLogFilterForm.submit')}
          />
        )}
      </Box>
    </>
  );
}
