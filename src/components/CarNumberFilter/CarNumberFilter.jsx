import { useDispatch } from 'react-redux';
import {
  changeCurrentPage,
  eventsFetch,
  setFilters
} from '../../store/events/eventsSlice';
import { useFormik } from 'formik';
import React from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  styled
} from '@mui/material';
import { colors } from '../../theme/colors';
import searchIcon from '../../assets/svg/log_event_search_icon.svg';

const CarNumberInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  backgroundColor: colors.surface.low,
  border: '1px solid ' + colors.outline.default,
  borderRadius: '20px',
  height: '40px',
  justifyContent: 'center',
  '& .MuiFilledInput-root': {
    backgroundColor: 'transparent',
    paddingRight: '12px',
    '&:hover': { backgroundColor: 'transparent' }
  },
  '& .MuiFilledInput-input': {
    backgroundColor: colors.surface.low,
    alignSelf: 'center',
    padding: 0,
    color: 'black'
  }
}));

const defaultValues = {
  vehiclePlate: ''
};
export default function CarNumberFilter() {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: defaultValues,
    onSubmit: (values) => {
      dispatch(eventsFetch(values));
      dispatch(setFilters(values));
      dispatch(changeCurrentPage(1));
    }
  });

  const handleChangeField = (e) => {
    if (e.target.value !== '') {
      const values = {
        vehiclePlate: e.target.value
      };
      dispatch(eventsFetch(values));
      dispatch(setFilters(values));
      dispatch(changeCurrentPage(1));
    }
    formik.handleChange(e);
  };

  return (
    <Box
      maxWidth="sm"
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={formik.handleSubmit}
      sx={{ flexGrow: 2 }}
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
    </Box>
  );
}
