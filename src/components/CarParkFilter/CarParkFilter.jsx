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
  carParkFetch,
  changeCurrentPage,
  setFilters
} from '../../store/carPark/carParkSlice';
import { useRentersQuery } from '../../api/renters/renters.api';
import { useFormik } from 'formik';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { colors } from '../../theme/colors';
import {
  closeButtonStyle,
  secondaryButtonStyle,
  CarNumberInput,
  selectMenuStyle
} from '../../theme/styles';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import searchIcon from '../../assets/svg/log_event_search_icon.svg';
import searchCancelIcon from '../../assets/svg/log_event_search_cancel_icon.svg';
import eventTuneIcon from '../../assets/svg/log_event_tune_icon.svg';

const defaultValues = {
  vehiclePlate: '',
  companyName: ''
};

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

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: '0.875rem',
  pb: '4px',
  pl: '12px'
};

export default function CarParkFilter({ openForm, setOpenForm }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [submited, setSubmited] = useState(true);
  const [numberInChange, setNumberInChange] = useState(false);
  const filters = useSelector((state) => state.carPark.filters);
  const { data: renters } = useRentersQuery();
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
      dispatch(carParkFetch(filters));
      setSubmited(true);
    }
  });

  const resetHandle = () => {
    formik.resetForm();
    dispatch(setFilters(null));
    dispatch(changeCurrentPage(1));
    dispatch(carParkFetch());
    setSubmited(true);
  };

  const handleChangeField = (e) => {
    if (!openForm) {
      const values = {
        vehiclePlate: e.target.value
      };
      dispatch(setFilters(values));
      dispatch(changeCurrentPage(1));
      dispatch(carParkFetch(values));
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
      dispatch(carParkFetch());
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

  const handleCompanyChange = (event) => {
    const values = {
      ...filters,
      companyName: event.target.value
    };
    dispatch(setFilters(values));
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
              <InputLabel htmlFor="company-select" sx={labelStyle}>
                Компания
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
                {renters.map((r) => (
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
