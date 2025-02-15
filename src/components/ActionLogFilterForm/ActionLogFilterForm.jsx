import {
  CarNumberInput,
  DateInputStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  selectMenuStyle
} from '../../theme/styles';
import {
  Button,
  IconButton, InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {DateTimePicker} from "@mui/x-date-pickers";
import {DateIcon} from "../Icons/DateIcon";

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: '0.875rem',
  pb: '4px',
  pl: '12px'
};

export function ActionLogFilterForm({
  dateFrom,
  handleDateFromChanged,
  dateTo,
  handleDateToChanged,
  section,
  handleSectionChange,
  sectionValues,
  action,
  handleActionChange,
  actionValues,
  submited,
  filters,
  resetHandle,
  styles,
  confirmText,
  number,
  handleChangeNumber,
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack sx={styles} gap={'8px'}>
      <Stack>
        <InputLabel htmlFor="payment-type-select" sx={labelStyle}>
          {t('components.actionLogFilterForm.section')}
        </InputLabel>
        <Select
          id="section-select"
          displayEmpty
          value={section}
          onChange={handleSectionChange}
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
              return <em>{t('components.actionLogFilterForm.choose')}</em>;
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
            <em>{t('components.actionLogFilterForm.choose')}</em>
          </MenuItem>
          {sectionValues.map((item) => (
            <MenuItem
              key={item.value}
              id={item.value}
              selected={item.name === section}
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
          {t('components.actionLogFilterForm.action')}
        </InputLabel>
        <Select
          id="payment-for-select"
          displayEmpty
          value={action}
          onChange={handleActionChange}
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
              return <em>{t('components.actionLogFilterForm.choose')}</em>;
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
            <em>{t('components.actionLogFilterForm.choose')}</em>
          </MenuItem>
          {actionValues.map((item) => (
            <MenuItem
              key={item.value}
              id={item.value}
              selected={item.name === action}
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
        <Typography sx={labelStyle}>
          {t('components.actionLogFilterForm.dateFrom')}
        </Typography>
        <DateTimePicker
          value={dateFrom}
          onChange={handleDateFromChanged}
          maxDateTime={dateTo ?? null}
          slotProps={{
            textField: {
              variant: 'filled',
              sx: DateInputStyle({ ...theme }),
              placeholder: t('components.actionLogFilterForm.from')
            },
            openPickerButton: { disableRipple: true }
          }}
          slots={{
            openPickerIcon: DateIcon
          }}
        />
      </Stack>
      <Stack>
        <Typography sx={labelStyle}>
          {t('components.actionLogFilterForm.dateTo')}
        </Typography>
        <DateTimePicker
          value={dateTo}
          onChange={handleDateToChanged}
          minDateTime={dateFrom ?? null}
          slotProps={{
            textField: {
              variant: 'filled',
              sx: DateInputStyle({ ...theme }),
              placeholder: t('components.actionLogFilterForm.to')
            },
            openPickerButton: { disableRipple: true }
          }}
          slots={{
            openPickerIcon: DateIcon
          }}
        />
      </Stack>
      <Stack>
        <Typography sx={labelStyle}>
          {t('components.actionLogFilterForm.numberLabel')}
        </Typography>
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
              </InputAdornment>
            ),
          }}
          variant="filled"
          id="vehiclePlate"
          name="vehiclePlate"
          placeholder={t('components.actionLogFilterForm.number')}
          value={number}
          onChange={(event) => handleChangeNumber(event.target.value)}/>
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
          {t('components.actionLogFilterForm.cancel')}
        </Button>
      </Stack>
    </Stack>
  );
}
