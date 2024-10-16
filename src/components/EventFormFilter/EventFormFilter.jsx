import {
  Button,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import {
  DateInputStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  selectMenuStyle
} from '../../theme/styles';
import _ from 'lodash';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { DateIcon } from '../Icons/DateIcon';
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

export function EventFormFilter({
  selectedEventCode,
  handleEventCodeChange,
  eventCodes,
  fromValue,
  toValue,
  handleFromDateChanged,
  handleToDateChanged,
  timeFromValue,
  timeToValue,
  handleTimeFromChanged,
  handleTimeToChanged,
  selectedAccessPoint,
  handleAccessPointChange,
  accessPoints,
  submited,
  filters,
  resetHandle,
  isNeedBorderBottom,
  confirmText
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Stack
      sx={{
        p: '16px',
        pt: '8px',
        borderBottom: isNeedBorderBottom ? `1px solid ${theme.colors.outline.surface}` : ''
      }}
      gap={'8px'}
    >
      <Stack>
        <InputLabel htmlFor="eventcode-select" sx={labelStyle}>
          {t('components.carNumberFilter.eventType')}
        </InputLabel>
        <Select
          id="eventcode-select"
          displayEmpty
          value={selectedEventCode}
          onChange={handleEventCodeChange}
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
              return <em>{t('components.carNumberFilter.choose')}</em>;
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
            <em>{t('components.carNumberFilter.choose')}</em>
          </MenuItem>
          {_.sortBy(eventCodes, ['name']).map((code) => (
            <MenuItem
              key={code.value}
              id={code.name}
              selected={code.name === selectedEventCode}
              value={code.name}
            >
              <Typography
                component={'h5'}
                noWrap
                sx={{ fontWeight: 500, p: 0 }}
              >
                {code.name}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack>
        <Typography sx={labelStyle}>
          {t('components.carNumberFilter.date')}
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
                placeholder: t('components.carNumberFilter.from')
              },
              openPickerButton: { disableRipple: true }
            }}
            slots={{
              openPickerIcon: DateIcon
            }}
            views={['day', 'month', 'year']}
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
                placeholder: t('components.carNumberFilter.to')
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
        <Typography sx={labelStyle}>
          {t('components.carNumberFilter.time')}
        </Typography>
        <Stack direction={'row'} gap={'8px'}>
          <TimePicker
            value={timeFromValue}
            ampm={false}
            views={['hours', 'minutes']}
            maxTime={timeToValue ?? null}
            onChange={handleTimeFromChanged}
            slotProps={{
              textField: {
                variant: 'filled',
                sx: DateInputStyle({ ...theme }),
                placeholder: t('components.carNumberFilter.from')
              }
            }}
          />
          <TimePicker
            value={timeToValue}
            ampm={false}
            views={['hours', 'minutes']}
            minTime={timeFromValue ?? null}
            onChange={handleTimeToChanged}
            slotProps={{
              textField: {
                variant: 'filled',
                sx: DateInputStyle({ ...theme }),
                placeholder: t('components.carNumberFilter.to')
              },
              openPickerButton: { disableRipple: true }
            }}
          />
        </Stack>
      </Stack>
      <Stack>
        <InputLabel htmlFor="accesspoint-select" sx={labelStyle}>
          {t('components.carNumberFilter.accessPoint')}
        </InputLabel>
        <Select
          id="accesspoint-select"
          displayEmpty
          value={selectedAccessPoint}
          onChange={handleAccessPointChange}
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
              return <em>{t('components.carNumberFilter.choose')}</em>;
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
            <em>{t('components.carNumberFilter.choose')}</em>
          </MenuItem>
          {accessPoints.map((apoint) => (
            <MenuItem
              key={apoint.value}
              id={apoint.name}
              selected={apoint.name === selectedAccessPoint}
              value={apoint.name}
            >
              <Typography
                component={'h5'}
                noWrap
                sx={{ fontWeight: 500, p: 0 }}
              >
                {apoint.name}
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
          {confirmText ?? t('components.carNumberFilter.submit')}
        </Button>
        <Button
          disabled={!filters}
          disableRipple
          variant="contained"
          fullWidth={false}
          sx={[secondaryButtonStyle({ ...theme }), { flexGrow: 1 }]}
          onClick={resetHandle}
        >
          {t('components.carNumberFilter.reset')}
        </Button>
      </Stack>
    </Stack>
  );
}
