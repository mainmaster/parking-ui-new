import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { useRentersQuery } from '../../api/renters/renters.api';
import { colors } from '../../theme/colors';
import { selectMenuStyle } from '../../theme/styles';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: '0.875rem',
  pb: '4px',
  pl: '12px'
};

export default function RenterSelect({ selected, handleChange, setRenter }) {
  const { data: renters } = useRentersQuery();
  const applicationEdit = useSelector(
    (state) => state.applications.editApplication
  );

  useEffect(() => {
    if (setRenter && applicationEdit && applicationEdit.application) {
      if (renters.length > 0) {
        const currentRenter = renters.find(
          (renter) =>
            renter.company_name === applicationEdit.application.company_name
        );
        if (currentRenter) {
          setRenter(currentRenter);
        } else {
          setRenter('');
        }
      }
    }
  }, [setRenter, applicationEdit, renters]);

  const handleRenterChange = (event) => {
    if (renters.length > 0) {
      const currentRenter = renters.find(
        (renter) => renter.id === event.target.value
      );
      if (currentRenter) {
        setRenter(currentRenter);
      } else {
        setRenter('');
      }
    }
    handleChange(event.target.value);
  };

  return (
    <>
      {renters && (
        <Stack>
          <InputLabel htmlFor="company-select" sx={labelStyle}>
            Арендатор
          </InputLabel>
          <Select
            id="company-select"
            displayEmpty
            value={selected.id || ''}
            onChange={handleRenterChange}
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
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '8px',
                  border: '1px solid ' + colors.outline.default
                }
              },
              MenuListProps: {
                sx: { py: '4px' }
              }
            }}
            renderValue={(selectedId) => {
              if (selectedId === '') {
                return <em>Выбрать</em>;
              } else {
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selected.company_name}
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
                key={r.id}
                id={r.id}
                selected={r.id === selected.id}
                value={r.id}
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
      )}
    </>
  );
}
