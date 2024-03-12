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
import React, { useEffect, useState } from 'react';
import Camera from '../Camera/Camera';
import eventInIcon from '../../assets/svg/log_event_in_icon.svg';
import eventOutIcon from '../../assets/svg/log_event_out_icon.svg';
import { colors } from '../../theme/colors';
import {
  autoButtonStyle,
  closeButtonStyle,
  openButtonStyle,
  positiveButtonStyle,
  primaryButtonStyle
} from '../../theme/styles';
import {
  openApFetch,
  closeApFetch,
  normalApFetch,
  setSelectedEventId
} from 'store/events/eventsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { postLedBoardMessage } from '../../api/access-points';
import { useSnackbar } from 'notistack';
import submitIcon from '../../assets/svg/camera_submit_icon.svg';
import cameraSkeleton from '../../assets/svg/camera_skeleton_logo.svg';
import { CarNumberCard } from '../CarNumberCard/CarNumberCard';
import { changeActiveOpenApModal } from '../../store/cameras/camerasSlice';
import { isMobile } from 'react-device-detect';

const CameraMessageInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  backgroundColor: colors.surface.low,
  border: '1px solid ' + colors.outline.default,
  borderRadius: '20px',
  height: '40px',
  justifyContent: 'center',
  '& .MuiFilledInput-root': {
    backgroundColor: 'transparent',
    paddingRight: 0,
    paddingLeft: '12px',
    '&:hover': { backgroundColor: 'transparent' }
  },
  '& .MuiFilledInput-input': {
    backgroundColor: colors.surface.low,
    alignSelf: 'center',
    padding: 0,
    color: 'black'
  }
}));

export default function CameraManagementItem({
  camera,
  src,
  titlesLed,
  setTitlesLed
}) {
  const [titlesInChange, setTitlesInChange] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const events = useSelector((state) => state.events.events);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (events && events[0].access_point === camera.id) {
      setCurrentEvent(events[0]);
    }
  }, [events]);

  const formik = useFormik({
    initialValues: { line2: '' },
    onSubmit: (values) => {
      handleCreateLedMessage(values);
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
    console.log(values);
    postLedBoardMessage({
      ...titlesLed[`access_point${camera.id}`],
      id: camera.id
    }).then(() => {
      enqueueSnackbar('Табло изменено', {
        variant: 'success'
      });
    });
  };

  const handleSetTitles = (event) => {
    if (event.target.value !== '') {
      setTitlesInChange(true);
    } else {
      setTitlesInChange(false);
    }
    formik.handleChange(event);
    let newArr = { ...titlesLed };
    try {
      newArr[`access_point${camera.id}`].line1 = 'Сообщение от админа';
      newArr[`access_point${camera.id}`].line2 = event.target.value;
      console.log(newArr);
      setTitlesLed(newArr);
    } catch (e) {
      newArr[`access_point${camera.id}`] = {
        line1: [`access_point${camera.id}`]?.line1 || '',
        line2: [`access_point${camera.id}`]?.line2 || ''
      };
      newArr[`access_point${camera.id}`].line1 = 'Сообщение от админа';
      newArr[`access_point${camera.id}`].line1 = event.target.value;
      setTitlesLed(newArr);
    }
  };

  const handleEventClick = () => {
    dispatch(setSelectedEventId(currentEvent.id));
  };

  return (
    <Box
      sx={{
        flex: '1 1 380px',
        minWidth: '380px',
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
            backgroundImage: `url("${cameraSkeleton}")`,
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
              border: `1px solid ${colors.outline.surface}`,
              borderRadius: '4px'
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>
              {titlesLed[`access_point${camera.id}`]?.line1 || ''}
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {titlesLed[`access_point${camera.id}`]?.line2 || ''}
            </Typography>
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
                  fontWeight: 500,
                  py: '2px',
                  px: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: `1px solid ${colors.outline.surface}`,
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
              border: `1px solid ${colors.outline.surface}`,
              flexGrow: 1,
              minWidth: '120px'
            }}
          >
            <Stack direction={'row'} gap={'8px'}>
              <img
                style={{
                  width: '18px'
                }}
                src={camera.direction === 'in' ? eventInIcon : eventOutIcon}
                alt={camera.description}
              />
              <Typography>{camera.description}</Typography>
            </Stack>
            <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
              <Box
                sx={{
                  width: '10px',
                  height: '10px',
                  ml: '10px',
                  borderRadius: '100%',
                  backgroundColor:
                    camera.status === 'open'
                      ? colors.mode.open.element
                      : camera.status === 'working_mode'
                      ? colors.mode.auto.element
                      : colors.mode.close.element
                }}
              ></Box>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  lineHeight: '0.875rem',
                  color:
                    camera.status === 'open'
                      ? colors.mode.open.element
                      : camera.status === 'working_mode'
                      ? colors.mode.auto.element
                      : colors.mode.close.element
                }}
              >
                {camera.status === 'open'
                  ? 'Открыт'
                  : camera.status === 'working_mode'
                  ? 'Авто-режим'
                  : 'Закрыт'}
              </Typography>
            </Stack>
          </Stack>
          <Button
            disableRipple
            variant="contained"
            fullWidth={false}
            sx={openButtonStyle}
            onClick={openAp}
          >
            Открыть
          </Button>
          {!isMobile && (
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              sx={[positiveButtonStyle, { flexGrow: 1 }]}
              onClick={() => dispatch(changeActiveOpenApModal(camera.id))}
            >
              Ввести номер
            </Button>
          )}
        </Stack>
        {isMobile && (
          <Stack direction={'row'} gap={'8px'}>
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              sx={[positiveButtonStyle, { flexGrow: 1 }]}
              onClick={() => dispatch(changeActiveOpenApModal(camera.id))}
            >
              Ввести номер
            </Button>
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              sx={closeButtonStyle}
              onClick={closeAp}
            >
              Закрыть
            </Button>
          </Stack>
        )}
        <Stack direction={'row'} gap={'8px'}>
          {!isMobile && (
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              sx={closeButtonStyle}
              onClick={closeAp}
            >
              Закрыть
            </Button>
          )}
          <Button
            disableRipple
            variant="contained"
            fullWidth={false}
            sx={[autoButtonStyle, { minWidth: '122.5px' }]}
            onClick={normalAp}
          >
            Авто-режим
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
                        sx={primaryButtonStyle}
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
              placeholder="Написать"
              value={formik.values.line2}
              onChange={handleSetTitles}
              onBlur={formik.handleBlur}
              error={formik.touched.line2 && Boolean(formik.errors.line2)}
            />
          </Box>
        </Stack>
        <Box
          sx={{
            width: '100%',
            height: '1px',
            backgroundColor: colors.outline.separator
          }}
        />
      </Stack>
    </Box>
  );
}
