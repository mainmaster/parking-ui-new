import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import {
  secondaryButtonStyle,
  positiveButtonStyle,
  cardContainerStyle, primaryButtonStyle
} from '../../theme/styles';
import { setEditRenter } from '../../store/renters/rentersSlice';
import {
  useActivateRenterMutation,
  useDeactivateRenterMutation, useDeleteRenterMutation
} from '../../api/renters/renters.api';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTranslation} from "react-i18next";

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
};

export default function LogRenterCard({ renter }) {
  const { t } = useTranslation();
  const [deactivateRenter] = useDeactivateRenterMutation();
  const [activateRenter] = useActivateRenterMutation();
  const [deleteRenter] = useDeleteRenterMutation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const labelTextStyle = useMemo(() => {
    return {
      minWidth: '88px',
      color: theme.colors.element.secondary
    };
  }, [theme]);

  const handleEditRenterClick = () => {
    dispatch(setEditRenter(renter));
  };

  const handleDeactivateRenterClick = () => {
    deactivateRenter(renter.id);
  };

  const handleActivateRenterClick = () => {
    activateRenter(renter.id);
  };

  const handleDeleteRenterClick = () => {
    deleteRenter(renter.id);
  }

  return (
    <Box
      sx={[cardContainerStyle({ ...theme }), isMobile && { minWidth: '320px' }]}
    >
      <Stack gap={'16px'}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography sx={titleTextStyle}>{renter.username}</Typography>
          <Typography
            sx={{
              whiteSpace: 'nowrap',
              fontWeight: 500,
              color: theme.colors.element.secondary
            }}
          >{`№ ${renter.id}`}</Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>{t('components.logRenterCard.renter')}</Typography>
          <Typography sx={{ fontWeight: 500 }}>
            {renter.company_name}
          </Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>{t('components.logRenterCard.contacts')}</Typography>
          <Typography sx={{ fontWeight: 500 }}>{renter.contacts}</Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>{t('components.logRenterCard.numberOfPlace')}</Typography>
          <Typography sx={{ fontWeight: 500 }}>{renter.number_of_places ?? 100}</Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handleEditRenterClick}
          >
            {t('components.logRenterCard.change')}
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={
              renter.is_active
                ? secondaryButtonStyle({ ...theme })
                : positiveButtonStyle({ ...theme })
            }
            onClick={
              renter.is_active
                ? handleDeactivateRenterClick
                : handleActivateRenterClick
            }
          >
            {renter.is_active ? t('components.logRenterCard.deactive') : t('components.logRenterCard.active')}
          </Button>
        </Stack>
        <Stack>
          <Button
            disableRipple
            variant="contained"
            sx={{...primaryButtonStyle({...theme}), width: '50%'}}
            onClick={handleDeleteRenterClick}
          >
            {t('components.logRenterCard.delete')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
