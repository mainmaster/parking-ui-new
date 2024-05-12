import { useSelector } from 'react-redux';
import {
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRentersQuery } from '../../api/renters/renters.api';
import { selectMenuStyle } from '../../theme/styles';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import _ from 'lodash';

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: '0.875rem',
  pb: '4px',
  pl: '12px'
};

export default function RenterSelect({ selected, handleChange }) {
  const { data: renters } = useRentersQuery();
  const theme = useTheme();

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
            value={selected}
            onChange={handleChange}
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
            renderValue={(selectedId) => {
              if (selectedId === '') {
                return <em>Выбрать</em>;
              } else {
                const selectedCompany = renters.find(
                  (r) => r.id === selectedId
                );
                return (
                  <Typography component={'h5'} noWrap sx={{ fontWeight: 500 }}>
                    {selectedCompany?.company_name || ''}
                  </Typography>
                );
              }
            }}
          >
            <MenuItem disabled value="">
              <em>Выбрать</em>
            </MenuItem>
            {_.sortBy(renters, ['company_name']).map((r) => (
              <MenuItem
                key={r.id}
                id={r.id}
                selected={r.id === selected}
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
