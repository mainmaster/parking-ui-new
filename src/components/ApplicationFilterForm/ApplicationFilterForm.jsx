import {
  Button,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import {
  DateInputStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  selectMenuStyle
} from '../../theme/styles';
import { DatePicker } from '@mui/x-date-pickers';
import { DateIcon } from '../Icons/DateIcon';
import RenterSelect from '../ApplicationFilter/RenterSelect';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import i18n from '../../translation';

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
export default function ApplicationFilterForm({
  fromValue,
  toValue,
  handleFromDateChanged,
  userType,
  selectedCompany,
  handleCompanyChange,
  handleToDateChanged,
  selectedApplicationStatus,
  handleApplicationStatusChange,
  submited,
  resetHandle,
  filters,
  submitedText,
  styles
}) {
  const theme = useTheme();
  const { t } = useTranslation();

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

  return (
    <Stack sx={styles} gap={'8px'}>
      <Stack>
        <Typography sx={labelStyle}>
          {t('components.applicationFilter.date')}
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
                <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
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
          {submitedText}
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
  );
}
