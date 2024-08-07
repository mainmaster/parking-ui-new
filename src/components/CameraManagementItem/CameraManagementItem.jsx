import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  styled
} from '@mui/material';
import React, {useEffect, useRef, useState} from 'react';
import Camera from '../Camera/Camera';
import eventInIcon from '../../assets/svg/log_event_in_icon.svg';
import eventOutIcon from '../../assets/svg/log_event_out_icon.svg';
import eventInnerIcon from '../../assets/svg/log_event_inner_icon.svg';
import cameraClearIcon from '../../assets/svg/camera_clear_icon.svg';
import {
  autoButtonStyle,
  closeButtonStyle,
  openButtonStyle,
  positiveButtonStyle,
  sendButtonStyle,
  CameraMessageInput
} from '../../theme/styles';
import {
  openApFetch,
  closeApFetch,
  normalApFetch,
  setSelectedEventId
} from 'store/events/eventsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import {
  clearLedBoardMessage,
  postLedBoardMessage
} from '../../api/access-points';
import { useSnackbar } from 'notistack';
import submitIcon from '../../assets/svg/camera_submit_icon.svg';
import cameraSkeleton from '../../assets/svg/theme/camera_skeleton_logo.svg';
import vlCameraSkeleton from '../../assets/svg/vltheme/camera_skeleton_logo.svg';
import { CarNumberCard } from '../CarNumberCard/CarNumberCard';
import { changeActiveOpenApModal } from '../../store/cameras/camerasSlice';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { parseISO, differenceInSeconds } from 'date-fns';
import {useTranslation} from "react-i18next";

export default function CameraManagementItem({
  camera,
  src,
  titlesLed,
  setTitlesLed,
  accessOptions
}) {
  const { t } = useTranslation();
  const [titlesInChange, setTitlesInChange] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventTimeout, setEventTimeout] = useState(0);
  const events = useSelector((state) => state.events.events);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (events && events[0] && events[0].access_point === camera.id) {
      const start = differenceInSeconds(
        Date.now(),
        parseISO(events[0].create_datetime)
      );
      if (start < 6) {
        setCurrentEvent(events[0]);
        setEventTimeout(5);
      }
    }
  }, [events]);

  useEffect(() => {
    if (eventTimeout === 0) {
      setCurrentEvent(null);
    } else {
      setTimeout(() => {
        setEventTimeout(eventTimeout - 1);
      }, 1000);
    }
  }, [eventTimeout]);

  const formik = useFormik({
    initialValues: { line2: '' },
    onSubmit: (values) => {
      handleCreateLedMessage(values);
      formik.resetForm();
    }
  });

  const openAp = () => {
    dispatch(openApFetch(camera.id));
  };

  const closeAp = () => {
    const payload = {
      accessPointid: camera.id
    };
    dispatch(closeApFetch(payload));
  };

  const normalAp = () => {
    const payload = {
      accessPointid: camera.id
    };
    dispatch(normalApFetch(payload));
  };

  const handleCreateLedMessage = (values) => {
    const { line2 } = values;
    if (line2) {
      postLedBoardMessage({
        line1: t('components.cameraManagementItem.messageFromAdmin'),
        line2: line2,
        id: camera.id
      }).then(() => {
        enqueueSnackbar( t('components.cameraManagementItem.tabloChange'), {
          variant: 'success'
        });
      });
    }
  };

  const handleChangeTitles = (event) => {
    if (event.target.value !== '') {
      setTitlesInChange(true);
    } else {
      setTitlesInChange(false);
    }
    formik.handleChange(event);
  };

  const handleEventClick = () => {
    dispatch(setSelectedEventId(currentEvent.id));
  };

  const handleClearMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearLedBoardMessage(camera.id);
  };

  return (
    <Box
      sx={{
        flex: '1 1 320px',
        minWidth: isMobile ? '320px' : '475px',
        maxWidth: '776px',
        borderRadius: '8px',
        p: isMobile ? '8px' : '16px',
        px: isMobile ? 0 : '16px',
        pb: 0
      }}
    >
      <Stack gap={'8px'}>
        <Box
          sx={{
            backgroundImage: `url("${
              theme.name === 'vltheme' ? vlCameraSkeleton : cameraSkeleton
            }")`,
            backgroundSize: 'cover',
            position: 'relative',
            lineHeight: 0
          }}
        >
          <Camera id={camera.id} src={src} />
          <Box
            sx={{
              position: 'absolute',
              bottom: '4px',
              left: '4px',
              py: '2px',
              px: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              border: `1px solid ${theme.colors.outline.surface}`,
              borderRadius: '4px'
            }}
          >
            <Box sx={{ width: '100%', position: 'relative' }} />
            <Typography sx={{ fontWeight: 500 }}>
              {titlesLed[`access_point${camera.id}`]?.line1 || ''}
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {titlesLed[`access_point${camera.id}`]?.line2 || ''}
            </Typography>
            {!accessOptions.disableClearLED && (
              <IconButton
                disableRipple
                aria-label="clear"
                onClick={handleClearMessage}
                sx={{
                  position: 'absolute',
                  top: '-14px',
                  right: '-14px'
                }}
              >
                <img
                  style={{
                    height: 12,
                    backgroundColor: theme.colors.surface.low,
                    borderRadius: '50%',
                    border: `1px solid ${theme.colors.outline.surface}`
                  }}
                  src={cameraClearIcon}
                  alt="Clear message"
                />
              </IconButton>
            )}
          </Box>
          {currentEvent && (
            <Box
              sx={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '139px',
                cursor: 'pointer'
              }}
              onClick={handleEventClick}
            >
              <Typography
                noWrap
                sx={{
                  fontSize: '0.75rem',
                  lineHeight: '0.875rem',
                  fontWeight: 500,
                  p: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: `1px solid ${theme.colors.outline.surface}`,
                  borderRadius: '4px'
                }}
              >
                {currentEvent.description || ''}
              </Typography>
              <CarNumberCard carNumber={currentEvent.vehicle_plate} small />
            </Box>
          )}
        </Box>
        <Stack direction={'row'} gap={'8px'}>
          <Stack
            sx={{
              py: '4px',
              px: '8px',
              borderRadius: '8px',
              border: `1px solid ${theme.colors.outline.surface}`,
              flexGrow: 1,
              minWidth: '120px'
            }}
          >
            <Stack direction={'row'} gap={'8px'}>
              <img
                style={{
                  width: '18px'
                }}
                src={
                  camera.direction === 'in'
                    ? eventInIcon
                    : camera.direction === 'out'
                    ? eventOutIcon
                    : eventInnerIcon
                }
                alt={camera.description}
              />
              <Typography>{camera.description}</Typography>
            </Stack>
            <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
              <Box
                sx={{
                  width: '18px',
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor:
                    camera.status === 'open'
                      ? theme.colors.mode.open.element
                      : camera.status === 'working_mode'
                      ? theme.colors.mode.auto.element
                      : theme.colors.mode.close.element
                }}
              ></Box>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  lineHeight: '0.875rem',
                  color:
                    camera.status === 'open'
                      ? theme.colors.mode.open.element
                      : camera.status === 'working_mode'
                      ? theme.colors.mode.auto.element
                      : theme.colors.mode.close.element
                }}
              >
                {camera.status === 'open'
                  ?  t('components.cameraManagementItem.statusOpen')
                  : camera.status === 'working_mode'
                  ?  t('components.cameraManagementItem.statusAuto')
                  :  t('components.cameraManagementItem.statusClose')}
              </Typography>
            </Stack>
          </Stack>
          <Button
            disableRipple
            disabled={accessOptions.disableOpenAP}
            variant="contained"
            fullWidth={false}
            sx={openButtonStyle({ ...theme })}
            onClick={openAp}
          >
            { t('components.cameraManagementItem.open')}
          </Button>
          {!isMobile && (
            <Button
              disableRipple
              disabled={accessOptions.disableOpenAP}
              variant="contained"
              fullWidth={false}
              sx={[
                positiveButtonStyle({ ...theme }),
                { flexGrow: 1, minWidth: '130px' }
              ]}
              onClick={() => dispatch(changeActiveOpenApModal(camera.id))}
            >
              {t('components.cameraManagementItem.enterNumber')}
            </Button>
          )}
        </Stack>
        {isMobile && (
          <Stack direction={'row'} gap={'8px'}>
            <Button
              disableRipple
              disabled={accessOptions.disableOpenAP}
              variant="contained"
              fullWidth={false}
              sx={[positiveButtonStyle({ ...theme }), { flexGrow: 1 }]}
              onClick={() => dispatch(changeActiveOpenApModal(camera.id))}
            >
              {t('components.cameraManagementItem.enterNumber')}
            </Button>
            <Button
              disableRipple
              disabled={accessOptions.disableCloseAP}
              variant="contained"
              fullWidth={false}
              sx={closeButtonStyle({ ...theme })}
              onClick={closeAp}
            >
              {t('components.cameraManagementItem.close')}
            </Button>
          </Stack>
        )}
        <Stack direction={'row'} gap={'8px'}>
          {!isMobile && (
            <Button
              disableRipple
              disabled={accessOptions.disableCloseAP}
              variant="contained"
              fullWidth={false}
              sx={closeButtonStyle({ ...theme })}
              onClick={closeAp}
            >
              {t('components.cameraManagementItem.close')}
            </Button>
          )}
          <Button
            disableRipple
            disabled={accessOptions.disableWorkAP}
            variant="contained"
            fullWidth={false}
            sx={[autoButtonStyle({ ...theme }), { minWidth: '122.5px' }]}
            onClick={normalAp}
          >
            {t('components.cameraManagementItem.autoMode')}
          </Button>
          <Box
            maxWidth="sm"
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={formik.handleSubmit}
            sx={{ flexGrow: 2 }}
          >
            <CameraMessageInput
              disabled={accessOptions.disableLEDMessage}
              fullWidth
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    {titlesInChange && (
                      <IconButton
                        disableRipple
                        aria-label="submit"
                        type="submit"
                        sx={sendButtonStyle({ ...theme })}
                      >
                        <img
                          style={{
                            height: 24
                          }}
                          src={submitIcon}
                          alt="submit"
                        />
                      </IconButton>
                    )}
                  </InputAdornment>
                )
              }}
              variant="filled"
              id="line2"
              name="line2"
              placeholder={t('components.cameraManagementItem.typing')}
              value={formik.values.line2}
              onChange={handleChangeTitles}
              onBlur={formik.handleBlur}
              error={formik.touched.line2 && Boolean(formik.errors.line2)}
            />
          </Box>
        </Stack>
        <Box
          sx={{
            width: '100%',
            height: '1px',
            backgroundColor: theme.colors.outline.separator
          }}
        />
      </Stack>
    </Box>
  );
}
