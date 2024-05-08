import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { colors } from '../../theme/colors';
import { secondaryButtonStyle } from '../../theme/styles';
import { ITEM_MAX_WIDTH, ITEM_MIN_WIDTH } from '../../constants';
import {
  editModalHandler,
  deleteAccessPointFetch
} from 'store/accessPoints/accessPointsSlice';
import { useTerminalsQuery } from 'api/terminal/terminal.api';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import eventInIcon from '../../assets/svg/log_event_in_icon.svg';
import eventOutIcon from '../../assets/svg/log_event_out_icon.svg';
import eventInnerIcon from '../../assets/svg/log_event_inner_icon.svg';

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

export default function LogAccessPointCard({ point }) {
  const dispatch = useDispatch();
  const accessPoints = useSelector((state) => state.accessPoints.accessPoints);
  const cameras = useSelector((state) => state.cameras.cameras);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const controllers = useSelector((state) => state.controllers.controllers);
  const leds = useSelector((state) => state.leds.leds);
  const { data: terminals } = useTerminalsQuery();
  const workingModes = useSelector((state) => state.workingModes.workingModes);
  const [filteredModes, setFilteredModes] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (
      cameras &&
      cameras.length > 0 &&
      point.cameras &&
      point.cameras.length > 0
    ) {
      setFilteredCameras(
        cameras.filter((camera) => point.cameras.includes(camera.id))
      );
    }
  }, [cameras, point]);

  useEffect(() => {
    if (
      workingModes &&
      workingModes.length > 0 &&
      point.working_modes &&
      point.working_modes.length > 0
    ) {
      setFilteredModes(
        workingModes.filter((mode) => point.working_modes.includes(mode.id))
      );
    }
  }, [workingModes, point]);

  const controllerName = useMemo(() => {
    return controllers.length > 0
      ? controllers.find((item) => item.id === point.laurent_id).description
      : '-';
  }, [controllers, point]);

  const ledName = useMemo(() => {
    return leds.length > 0 && point.led_board_id !== null
      ? leds.find((item) => item.id === point.led_board_id).description
      : '-';
  }, [leds, point]);

  const terminalName = useMemo(() => {
    if (terminals) {
      return terminals.length !== 0 && point.terminal_id !== null
        ? terminals.find((item) => item.id === point.terminal_id).description
        : '-';
    }
  }, [terminals, point]);

  const reverseName = useMemo(() => {
    return accessPoints.length > 0 && point.reverse_access_point !== null
      ? accessPoints.find((item) => item.id === point.reverse_access_point)
          .description
      : 'Нет';
  }, [accessPoints, point]);

  const handleEditPointClick = () => {
    dispatch(editModalHandler(point.id));
  };

  const handleDeletePointClick = () => {
    dispatch(deleteAccessPointFetch(point.id));
  };

  return (
    <Box sx={[cardContainerStyle, isMobile && { minWidth: '320px' }]}>
      <Stack gap={'16px'}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography sx={titleTextStyle}>{point.description}</Typography>
          <Typography
            sx={{
              whiteSpace: 'nowrap',
              fontWeight: 500,
              color: colors.element.secondary
            }}
          >{`№ ${point.id}`}</Typography>
        </Stack>
        <Stack gap={'12px'}>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Направление</Typography>
            {point.description ? (
              <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
                {point.direction && (
                  <img
                    style={{
                      width: '18px'
                    }}
                    src={
                      point.direction === 'in'
                        ? eventInIcon
                        : point.direction === 'out'
                        ? eventOutIcon
                        : eventInnerIcon
                    }
                    alt={point.description}
                  />
                )}
                <Typography sx={{ fontWeight: 500 }}>
                  {point.description}
                </Typography>
              </Stack>
            ) : (
              <Typography sx={{ fontWeight: 500 }}>-</Typography>
            )}
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Камеры</Typography>
            <Stack>
              {filteredCameras.map((camera) => (
                <Typography key={camera.id} sx={{ fontWeight: 500 }}>
                  {camera.description}
                </Typography>
              ))}
            </Stack>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Контроллер</Typography>
            <Typography sx={{ fontWeight: 500 }}>{controllerName}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>LED табло</Typography>
            <Typography sx={{ fontWeight: 500 }}>{ledName}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Номер реле для открытия</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {point.open_relay_number}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Номер реле для закрытия</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {point.close_relay_number}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>
              Номер контакта статуса открытия
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {point.status_contact_number}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>
              Задержка перед закрытием
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {`${point.seconds_before_close_laurent} сек`}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>
              Задержка между проверкой статуса шлагбаума
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {`${point.seconds_between_laurent_checks} сек`}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>
              Задержка перед проверкой статуса шлагбаума
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {`${point.seconds_before_laurent_checks} сек`}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Терминал</Typography>
            <Typography sx={{ fontWeight: 500 }}>{terminalName}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>Реверс</Typography>
            <Typography sx={{ fontWeight: 500 }}>{reverseName}</Typography>
          </Stack>
        </Stack>
        <Stack direction={'row'} gap={'12px'}>
          <Typography sx={labelTextStyle}>Режимы</Typography>
          <Stack>
            {filteredModes.map((mode, index) => (
              <Typography key={mode.id} sx={{ fontWeight: 500 }}>
                {`${++index}. ${mode.description}`}
              </Typography>
            ))}
          </Stack>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleEditPointClick}
          >
            Изменить
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleDeletePointClick}
          >
            Удалить
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
