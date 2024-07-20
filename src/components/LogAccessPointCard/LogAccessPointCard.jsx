import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { secondaryButtonStyle, cardContainerStyle } from '../../theme/styles';
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
import {useTranslation} from "react-i18next";

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

export default function LogAccessPointCard({ point }) {
  const { t } = useTranslation();
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

  const labelTextStyle = useMemo(() => {
    return {
      minWidth: '160px',
      maxWidth: '160px',
      color: theme.colors.element.secondary
    };
  }, [theme]);

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
      : t('components.logAccessPointCard.no');
  }, [accessPoints, point]);

  const handleEditPointClick = () => {
    dispatch(editModalHandler(point.id));
  };

  const handleDeletePointClick = () => {
    dispatch(deleteAccessPointFetch(point.id));
  };

  return (
    <Box
      sx={[cardContainerStyle({ ...theme }), isMobile && { minWidth: '320px' }]}
    >
      <Stack gap={'16px'}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography sx={titleTextStyle}>{point.description}</Typography>
          <Typography
            sx={{
              whiteSpace: 'nowrap',
              fontWeight: 500,
              color: theme.colors.element.secondary
            }}
          >{`№ ${point.id}`}</Typography>
        </Stack>
        <Stack gap={'12px'}>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logAccessPointCard.direction')}</Typography>
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
            <Typography sx={labelTextStyle}>{t('components.logAccessPointCard.cameras')}"</Typography>
            <Stack>
              {filteredCameras.map((camera) => (
                <Typography key={camera.id} sx={{ fontWeight: 500 }}>
                  {camera.description}
                </Typography>
              ))}
            </Stack>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logAccessPointCard.controller')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>{controllerName}</Typography>
          </Stack>

          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logAccessPointCard.led')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>{ledName}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logAccessPointCard.numberRelayForOpen')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {point.open_relay_number}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logAccessPointCard.numberRelayForClose')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {point.close_relay_number}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>
              {t('components.logAccessPointCard.numberContactStatus')}
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {point.status_contact_number}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>
              {t('components.logAccessPointCard.timeBeforeClose')}
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {`${point.seconds_before_close_laurent} сек`}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>
              {t('components.logAccessPointCard.timeBetweenLaurentCheck')}
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {`${point.seconds_between_laurent_checks} сек`}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>
              {t('components.logAccessPointCard.timeBeforeLaurentCheck')}
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {`${point.seconds_before_laurent_checks} сек`}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logAccessPointCard.terminal')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>{terminalName}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logAccessPointCard.reverse')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>{reverseName}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logAccessPointCard.recognitionScenario')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>{point.recognition_scenario_id}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logAccessPointCard.confirmationScenario')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>{point.confirmation_scenario_id}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>{t('components.logAccessPointCard.considerRenterNumberPlace')}</Typography>
            <Typography sx={{ fontWeight: 500 }}>{point.consider_renter_number_of_places ? t(t('components.logAccessPointCard.yes')) : t('components.logAccessPointCard.no')}</Typography>
          </Stack>
        </Stack>
        <Stack direction={'row'} gap={'12px'}>
          <Typography sx={labelTextStyle}>{t('components.logAccessPointCard.modes')}</Typography>
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
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handleEditPointClick}
          >
            {t('components.logAccessPointCard.change')}
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handleDeletePointClick}
          >
            {t('components.logAccessPointCard.delete')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
