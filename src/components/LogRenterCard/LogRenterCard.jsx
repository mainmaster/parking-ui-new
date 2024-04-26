import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { colors } from '../../theme/colors';
import { secondaryButtonStyle, positiveButtonStyle } from '../../theme/styles';
import { ITEM_MAX_WIDTH, ITEM_MIN_WIDTH } from '../../constants';
import { setEditRenter } from '../../store/renters/rentersSlice';
import {
  useActivateRenterMutation,
  useDeactivateRenterMutation
} from '../../api/renters/renters.api';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const cardContainerStyle = {
  flex: `1 1 ${ITEM_MIN_WIDTH}px`,
  minWidth: `${ITEM_MIN_WIDTH}px`,
  maxWidth: `${ITEM_MAX_WIDTH}px`,
  border: '1px solid ' + colors.outline.separator,
  borderTop: 'none',
  borderLeft: 'none',
  p: '16px',
  backgroundColor: colors.surface.low
};

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
};

const labelTextStyle = {
  minWidth: '88px',
  color: colors.element.secondary
};

export default function LogRenterCard({ renter }) {
  const [deactivateRenter] = useDeactivateRenterMutation();
  const [activateRenter] = useActivateRenterMutation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleEditRenterClick = () => {
    dispatch(setEditRenter(renter));
  };

  const handleDeactivateRenterClick = () => {
    deactivateRenter(renter.id);
  };

  const handleActivateRenterClick = () => {
    activateRenter(renter.id);
  };

  return (
    <Box sx={[cardContainerStyle, isMobile && { minWidth: '320px' }]}>
      <Stack gap={'16px'}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography sx={titleTextStyle}>{renter.username}</Typography>
          <Typography
            sx={{
              whiteSpace: 'nowrap',
              fontWeight: 500,
              color: colors.element.secondary
            }}
          >{`№ ${renter.id}`}</Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>Компания</Typography>
          <Typography sx={{ fontWeight: 500 }}>
            {renter.company_name}
          </Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>Контакты</Typography>
          <Typography sx={{ fontWeight: 500 }}>{renter.contacts}</Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleEditRenterClick}
          >
            Изменить
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={renter.is_active ? secondaryButtonStyle : positiveButtonStyle}
            onClick={
              renter.is_active
                ? handleDeactivateRenterClick
                : handleActivateRenterClick
            }
          >
            {renter.is_active ? 'Деактивировать' : 'Активировать'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
