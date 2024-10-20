import {
  DateInputStyle,
  desktopMenuStyle,
  mobileMenuStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  selectMenuStyle
} from '../../theme/styles';
import {
  Button,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { DateIcon } from '../Icons/DateIcon';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: '0.875rem',
  pb: '4px',
  pl: '12px'
};

export function PaymentFilterForm({
  fromValue,
  toValue,
  handleFromDateChanged,
  handleToDateChanged,
  paymentType,
  handlePaymentTypeChange,
  paymentTypeValues,
  paymentFor,
  handlePaymentForChange,
  paymentForValues,
  isRefund,
  handleIsRefundChange,
  isRefundValues,
  submited,
  filters,
  resetHandle,
  styles,
  confirmText,
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack sx={styles} gap={'8px'}>
      <Stack>
        <Typography sx={labelStyle}>
          {t('components.paymentFilter.date')}
        </Typography>
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
                placeholder: t('components.paymentFilter.from')
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
                placeholder: t('components.paymentFilter.to')
              },
              openPickerButton: { disableRipple: true }
            }}
            slots={{
              openPickerIcon: DateIcon
            }}
          />
        </Stack>
      </Stack>
      <Stack>
        <InputLabel htmlFor="payment-type-select" sx={labelStyle}>
          {t('components.paymentFilter.paymentType')}
        </InputLabel>
        <Select
          id="payment-type-select"
          displayEmpty
          value={paymentType}
          onChange={handlePaymentTypeChange}
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
              return <em>{t('components.paymentFilter.choose')}</em>;
            } else {
              return (
                <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                  {selected}
                </Typography>
              );
            }
          }}
        >
          <MenuItem value="">
            <em>{t('components.paymentFilter.choose')}</em>
          </MenuItem>
          {paymentTypeValues.map((item) => (
            <MenuItem
              key={item.value}
              id={item.value}
              selected={item.name === paymentType}
              value={item.name}
            >
              <Typography
                component={'h5'}
                noWrap
                sx={{ fontWeight: 500, p: 0 }}
              >
                {item.name}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack>
        <InputLabel htmlFor="payment-for-select" sx={labelStyle}>
          {t('components.paymentFilter.typePayment')}
        </InputLabel>
        <Select
          id="payment-for-select"
          displayEmpty
          value={paymentFor}
          onChange={handlePaymentForChange}
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
              return <em>{t('components.paymentFilter.choose')}</em>;
            } else {
              return (
                <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                  {selected}
                </Typography>
              );
            }
          }}
        >
          <MenuItem value="">
            <em>{t('components.paymentFilter.choose')}</em>
          </MenuItem>
          {paymentForValues.map((item) => (
            <MenuItem
              key={item.value}
              id={item.value}
              selected={item.name === paymentFor}
              value={item.name}
            >
              <Typography
                component={'h5'}
                noWrap
                sx={{ fontWeight: 500, p: 0 }}
              >
                {item.name}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack>
        <InputLabel htmlFor="is-refund-select" sx={labelStyle}>
          {t('components.paymentFilter.refund')}
        </InputLabel>
        <Select
          id="is-refund-select"
          displayEmpty
          value={isRefund}
          onChange={handleIsRefundChange}
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
              return <em>{t('components.paymentFilter.choose')}</em>;
            } else {
              return (
                <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                  {selected}
                </Typography>
              );
            }
          }}
        >
          <MenuItem value="">
            <em>{t('components.paymentFilter.choose')}</em>
          </MenuItem>
          {isRefundValues.map((item) => (
            <MenuItem
              key={item.value}
              id={item.value}
              selected={item.name === isRefund}
              value={item.name}
            >
              <Typography
                component={'h5'}
                noWrap
                sx={{ fontWeight: 500, p: 0 }}
              >
                {item.name}
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
          {confirmText}
        </Button>
        <Button
          disabled={!filters}
          disableRipple
          variant="contained"
          fullWidth={false}
          sx={[secondaryButtonStyle({ ...theme }), { flexGrow: 1 }]}
          onClick={resetHandle}
        >
          {t('components.paymentFilter.reset')}
        </Button>
      </Stack>
    </Stack>
  );
}
