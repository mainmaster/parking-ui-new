import { useDispatch } from 'react-redux';
import { Box, Button, Stack, Typography } from '@mui/material';
import { colors } from '../../theme/colors';
import { secondaryButtonStyle } from '../../theme/styles';
import { ITEM_MAX_WIDTH, ITEM_MIN_WIDTH } from '../../constants';
import {
  editModalHandler,
  deleteControllerFetch
} from 'store/controllers/controllersSlice';
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
  fontWeight: 500
};

const labelTextStyle = {
  minWidth: '160px',
  maxWidth: '160px',
  color: colors.element.secondary
};

export default function LogControllerCard({ controller }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleEditModeClick = () => {
    dispatch(editModalHandler(controller.id));
  };

  const handleDeleteModeClick = () => {
    dispatch(deleteControllerFetch(controller.id));
  };

  return (
    <Box sx={[cardContainerStyle, isMobile && { minWidth: '320px' }]}>
      <Stack gap={'16px'}>
        <Typography sx={titleTextStyle}>{controller.description}</Typography>
        <Stack gap={'12px'}>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>IP адрес</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {`${controller.ip_address}:${controller.port}`}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Пароль</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {controller.password}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleEditModeClick}
          >
            Изменить
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleDeleteModeClick}
          >
            Удалить
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
