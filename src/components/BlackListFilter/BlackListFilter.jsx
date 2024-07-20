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
  blackListFetch,
  changeCurrentPage,
  setFilters
} from '../../store/blackList/blackListSlice';
import { secondaryButtonStyle, CarNumberInput } from '../../theme/styles';
import searchIcon from '../../assets/svg/log_event_search_icon.svg';
import searchCancelIcon from '../../assets/svg/log_event_search_cancel_icon.svg';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTranslation} from "react-i18next";

export default function BlackListFilter() {
  const { t } = useTranslation();
  const [carNumber, setCarNumber] = useState('');
  const [numberInChange, setNumberInChange] = useState(false);
  const filters = useSelector((state) => state.carPark.filters);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    return () => {
      dispatch(setFilters(null));
    };
  }, []);

  const handleChangeField = (e) => {
    setCarNumber(e.target.value);
    const values = {
      vehiclePlate: e.target.value
    };
    dispatch(setFilters(values));
    dispatch(changeCurrentPage(1));
    dispatch(blackListFetch(values));
    if (e.target.value === '') {
      setNumberInChange(false);
    } else {
      setNumberInChange(true);
    }
  };

  const handleNumberErase = () => {
    setCarNumber('');
    dispatch(setFilters(null));
    dispatch(changeCurrentPage(1));
    dispatch(blackListFetch());
    setNumberInChange(false);
  };

  return (
    <Box
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
                  alt={t('components.blackListFilter.searchByNumber')}
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
                    alt={t('components.blackListFilter.clear')}
                  />
                </IconButton>
              </InputAdornment>
            )
          }}
          variant="filled"
          id="vehiclePlate"
          name="vehiclePlate"
          placeholder={t('components.blackListFilter.searchByNumber')}
          value={carNumber}
          onChange={handleChangeField}
        />
      </Stack>
    </Box>
  );
}
