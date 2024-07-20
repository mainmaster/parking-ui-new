import { useDispatch } from 'react-redux';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { secondaryButtonStyle, cardContainerStyle } from '../../theme/styles';
import { CarNumberCard } from '../CarNumberCard/CarNumberCard';
import TypeAuto from '../TypeAuto';
import {
  createApplicationsFetch,
  deleteApplicationFetch,
  setEditApplication
} from 'store/applications/applicationSlice';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import {useTranslation} from "react-i18next";

export default function LogApplicationCard({ application }) {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const dateString = format(parseISO(application.valid_for_date), 'dd.MM.yyyy');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const labelTextStyle = useMemo(() => {
    return {
      minWidth: '88px',
      color: theme.colors.element.secondary
    };
  }, [theme]);

  const handleSessionClick = () => {
    navigate(`../sessions/${application?.session_id}`);
  };

  const handleEditApplicationClick = () => {
    dispatch(
      setEditApplication({
        edit: true,
        application: application
      })
    );
  };

  const handleDeleteApplicationClick = () => {
    dispatch(deleteApplicationFetch(application.id));
  };

  return (
    <Box
      sx={[cardContainerStyle({ ...theme }), isMobile && { minWidth: '320px' }]}
    >
      <Stack gap={'12px'}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <CarNumberCard carNumber={application.vehicle_plate} isTable />
          <Box sx={{ width: '100%' }}></Box>
          <Typography
            sx={{
              whiteSpace: 'nowrap',
              fontWeight: 500,
              color: theme.colors.element.secondary
            }}
          >{`№ ${application.id}`}</Typography>
        </Stack>
        <Stack direction={'row'} sx={{ minHeight: '20px' }}>
          {application.is_used ? (
            <TypeAuto type="used" />
          ) : (
            <TypeAuto type="not_used" />
          )}
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>{t('components.logApplicationCard.renter')}</Typography>
          <Typography sx={{ fontWeight: 500 }}>
            {application.company_name}
          </Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>{t('components.logApplicationCard.date')}</Typography>
          <Typography sx={{ fontWeight: 500 }}>{dateString}</Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disableRipple
            disabled={!application.session_id}
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handleSessionClick}
          >
            {t('components.logApplicationCard.session')}
          </Button>
          <Button
            disableRipple
            disabled={application.is_used}
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handleEditApplicationClick}
          >
            {t('components.logApplicationCard.change')}
          </Button>
          <Button
            disableRipple
            disabled={application.is_used}
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handleDeleteApplicationClick}
          >
            {t('components.logApplicationCard.delete')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
