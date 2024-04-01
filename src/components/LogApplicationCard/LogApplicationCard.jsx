import { useDispatch } from 'react-redux';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { colors } from '../../theme/colors';
import { secondaryButtonStyle } from '../../theme/styles';
import { CarNumberCard } from '../CarNumberCard/CarNumberCard';
import TypeAuto from '../TypeAuto';
import {
  createApplicationsFetch,
  deleteApplicationFetch,
  setEditApplication
} from 'store/applications/applicationSlice';
import { useNavigate } from 'react-router-dom';

const cardContainerStyle = {
  flex: '1 1 365px',
  minWidth: '365px',
  maxWidth: '466px',
  border: '1px solid ' + colors.outline.separator,
  borderTop: 'none',
  borderLeft: 'none',
  p: '16px',
  backgroundColor: colors.surface.low
};

const labelTextStyle = {
  minWidth: '88px',
  color: colors.element.secondary
};

export default function LogApplicationCard({ application }) {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const dateString = format(parseISO(application.valid_for_date), 'dd.MM.yyyy');

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
    dispatch(
      deleteApplicationFetch({
        id: application.id
      })
    );
  };

  return (
    <Box sx={cardContainerStyle}>
      <Stack gap={'12px'}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <CarNumberCard carNumber={application.vehicle_plate} isTable />
          <Box sx={{ width: '100%' }}></Box>
          <Typography
            sx={{
              whiteSpace: 'nowrap',
              fontWeight: 500,
              color: colors.element.secondary
            }}
          >{`№ ${application.id}`}</Typography>
        </Stack>
        <Stack direction={'row'} sx={{ minHeight: '20px' }}>
          {!application.is_used && <TypeAuto type="not_used" />}
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>Компания</Typography>
          <Typography sx={{ fontWeight: 500 }}>
            {application.company_name}
          </Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>Дата</Typography>
          <Typography sx={{ fontWeight: 500 }}>{dateString}</Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disableRipple
            disabled={!application.session_id}
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleSessionClick}
          >
            Сессия
          </Button>
          <Button
            disableRipple
            disabled={application.is_used}
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleEditApplicationClick}
          >
            Изменить
          </Button>
          <Button
            disableRipple
            disabled={application.is_used}
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleDeleteApplicationClick}
          >
            Удалить
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
