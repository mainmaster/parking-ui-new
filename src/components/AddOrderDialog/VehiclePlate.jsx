import { IconButton, Stack } from '@mui/material';
import {
  CarNumberInput,
  DateInputStyle,
  secondaryButtonStyle
} from '../../theme/styles';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers';
import { DateIcon } from '../Icons/DateIcon';
import { formatISO } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import closeCircle from '../../assets/svg/circle_close.svg';

export default function VehiclePlate({ setVehiclePlates, vehicle, index }) {
  const [date, setDate] = useState(vehicle.valid_until);
  const { t } = useTranslation();
  const handleFromDateChanged = (newValue) => {
    if (newValue) {
      setVehiclePlates((prevState) =>
        prevState.map((item, i) => {
          if (index !== i) {
            return item;
          }

          return {
            ...item,
            valid_until: formatISO(newValue)
          };
        })
      );
      setDate(newValue);
    }
  };
  const theme = useTheme();

  return (
    <Stack display={'flex'} flexDirection={'row'} gap={1}>
      <Stack sx={{flex: 1.5}}>
        <CarNumberInput
          fullWidth
          InputProps={{
            disableUnderline: true,
            sx: { paddingLeft: '12px' }
          }}
          variant="filled"
          placeholder={t('components.vehiclePlate.example')}
          value={vehicle.vehicle_plate}
          onChange={(event) => {
            setVehiclePlates((prevState) =>
              prevState.map((item, i) => {
                if (index !== i) {
                  return item;
                }

                return {
                  ...item,
                  vehicle_plate: event.target.value
                };
              })
            );
          }}
        />
      </Stack>
      <Stack sx={{flex: 1.25}}>
        <DatePicker
          value={date}
          format={'dd.MM.yyyy'}
          onChange={handleFromDateChanged}
          slotProps={{
            textField: {
              variant: 'filled',
              sx: DateInputStyle({ ...theme }),
              placeholder: t('components.vehiclePlate.date')
            },
            openPickerButton: { disableRipple: true }
          }}
          slots={{
            openPickerIcon: DateIcon
          }}
        />
      </Stack>
      <IconButton
        sx={[
          secondaryButtonStyle({ ...theme }),
          {
            width: 48,
            height: 40
          }
        ]}
        onClick={() =>
          setVehiclePlates((prevState) =>
            prevState.filter((item, i) => i !== index)
          )
        }
      >
        <img style={{ width: 19.5 }} src={closeCircle} alt="Add" />
      </IconButton>
    </Stack>
  );
}
