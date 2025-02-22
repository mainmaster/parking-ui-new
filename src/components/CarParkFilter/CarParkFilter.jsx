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
import {
  carParkChangePageFetch,
  carParkFetch,
  changeCurrentPage,
  setFilters
} from '../../store/carPark/carParkSlice';
import { useRentersQuery } from '../../api/renters/renters.api';
import { useFormik } from 'formik';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  primaryButtonStyle,
  secondaryButtonStyle,
  CarNumberInput,
  selectMenuStyle,
  desktopMenuStyle,
  mobileMenuStyle
} from '../../theme/styles';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import searchIcon from '../../assets/svg/log_event_search_icon.svg';
import searchCancelIcon from '../../assets/svg/log_event_search_cancel_icon.svg';
import eventTuneIcon from '../../assets/svg/log_event_tune_icon.svg';
import _ from 'lodash';
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {accessPointsOnlyFetch} from "../../store/accessPoints/accessPointsSlice";

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

export default function CarParkFilter({ openForm, setOpenForm, currentTab }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [submited, setSubmited] = useState(true);
  const [numberInChange, setNumberInChange] = useState(false);
  const filters = useSelector((state) => state.carPark.filters);
  const { data: renters } = useRentersQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialFilters = {
      companyName: params.get('companyName') || '',
      vehiclePlate: params.get('vehiclePlate'),
      page: params.get('page') || ''
    };

    const pageNumber = initialFilters.page ? Number(initialFilters.page) : 1;
    if (initialFilters.companyName) { setSelectedCompany(initialFilters.companyName); }
    if (initialFilters.vehiclePlate) { formik.values.vehiclePlate = initialFilters.vehiclePlate; }

    dispatch(setFilters(initialFilters));
    dispatch(carParkFetch(initialFilters));
    dispatch(accessPointsOnlyFetch(initialFilters));
    dispatch(carParkChangePageFetch(pageNumber));
    dispatch(changeCurrentPage(pageNumber));
    setSubmited(true);
  }, []);

  useEffect(() => {
    dispatch(carParkFetch(filters));
    dispatch(changeCurrentPage(1));
    setSubmited(true);
  }, [currentTab]);

  const formik = useFormik({
    initialValues: defaultValues,
    onSubmit: (values) => {
      dispatch(carParkFetch(filters));
      dispatch(changeCurrentPage(1));
      setSubmited(true);
    }
  });

  const updateURL = (newFilters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      params.set(key, newFilters[key] !== undefined && newFilters[key] !== null ? newFilters[key] : '');
    });

    navigate({ search: params.toString() });
  };

  const resetHandle = () => {
    formik.resetForm();
    formik.values.vehiclePlate = '';
    updateURL({})
    dispatch(setFilters(null));
    dispatch(changeCurrentPage(1));
    dispatch(carParkFetch());
    setSelectedCompany('');
    setSubmited(true);
  };

  const handleChangeField = (e) => {
    if (!openForm) {
      const values = {
        vehiclePlate: e.target.value
      };
      dispatch(setFilters(values));
      updateURL(values);
      dispatch(changeCurrentPage(1));
      dispatch(carParkFetch(values));
    } else if (openForm) {
      const values = {
        ...filters,
        vehiclePlate: e.target.value
      };
      updateURL(values);
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
      updateURL({});
      dispatch(changeCurrentPage(1));
      dispatch(carParkFetch());
    } else if (openForm) {
      const values = {
        ...filters,
        vehiclePlate: ''
      };
      dispatch(setFilters(values));
      updateURL(values);
      setSubmited(false);
    }
    setNumberInChange(false);
  };

  const handleCompanyChange = (event) => {
    const values = {
      ...filters,
      companyName: event.target.value
    };
    dispatch(setFilters(values));
    updateURL(values);
    setSubmited(false);
    setSelectedCompany(event.target.value);
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
                    alt={t('components.carParkFilter.searchByNumber')}
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
                      alt={t('components.carParkFilter.clear')}
                    />
                  </IconButton>
                </InputAdornment>
              )
            }}
            variant="filled"
            id="vehiclePlate"
            name="vehiclePlate"
            placeholder={t('components.carParkFilter.searchByNumber')}
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
                ? mobileMenuStyle({ ...theme })
                : desktopMenuStyle({ ...theme })
            }
            gap={'8px'}
          >
            <Stack>
              <InputLabel htmlFor="company-select" sx={labelStyle}>
                {t('components.carParkFilter.renter')}
              </InputLabel>
              <Select
                id="company-select"
                displayEmpty
                value={selectedCompany}
                onChange={handleCompanyChange}
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
                    return <em>{t('components.carParkFilter.choose')}</em>;
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
                  <em>{t('components.carParkFilter.choose')}</em>
                </MenuItem>
                {_.sortBy(renters, ['company_name']).map((r) => (
                  <MenuItem
                    key={r.company_name}
                    id={r.company_name}
                    selected={r.company_name === selectedCompany}
                    value={r.company_name}
                  >
                    <Typography
                      component={'h5'}
                      noWrap
                      sx={{ fontWeight: 500, p: 0 }}
                    >
                      {r.company_name}
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
                {t('components.carParkFilter.submit')}
              </Button>
              <Button
                disabled={!filters}
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={[secondaryButtonStyle({ ...theme }), { flexGrow: 1 }]}
                onClick={resetHandle}
              >
                {t('components.carParkFilter.reset')}
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </>
  );
}
