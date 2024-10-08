import React, { useEffect, useMemo, useState } from 'react';
import { useParkingInfoQuery } from '../../api/settings/settings';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedEventId } from 'store/events/eventsSlice';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  IconButton,
  LinearProgress,
  Slide,
  Fade,
  Link,
  Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CarNumberCard } from '../CarNumberCard/CarNumberCard';
import eventInIcon from '../../assets/svg/log_event_in_icon.svg';
import eventOutIcon from '../../assets/svg/log_event_out_icon.svg';
import eventInnerIcon from '../../assets/svg/log_event_inner_icon.svg';
import eventCloseIcon from '../../assets/svg/event_alert_close_icon.svg';
import { parseISO, differenceInSeconds } from 'date-fns';

export default function EventAlertCard({
  event,
  close,
  animate,
  fade,
  setPause
}) {
  const { data: parkingData } = useParkingInfoQuery();
  const start =
    differenceInSeconds(Date.now(), parseISO(event.create_datetime)) * 20;
  const [lastEvent, setLastEvent] = useState(null);
  const [progress, setProgress] = useState(start < 100 ? start : 100);
  const [stopped, setStopped] = useState(false);
  const [show, setShow] = useState(true);
  const [showFade, setShowFade] = useState(true);
  // const [image, setImage] = useState(null);
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();

  useEffect(() => {
    if (event !== lastEvent) {
      // const imagePath =
      //   process.env.REACT_APP_API_URL + '/' + event.car_img_path;
      // if (image !== imagePath) setImage(imagePath);
      setLastEvent(event);
      setShow(true);
      //console.log(event.id + ' ' + start);
    }
  }, [event]);

  const image = useMemo(
    () => process.env.REACT_APP_API_URL + '/' + event.car_img_path,
    [event]
  );

  useEffect(() => {
    if (progress < 100) {
      setTimeout(() => {
        if (!stopped) {
          setProgress(progress + 2);
        }
      }, 100);
    } else {
      setShow(false);
      setTimeout(() => {
        close(null);
      }, 250);
    }
  }, [progress, stopped]);

  useEffect(() => {
    if (fade) {
      setShowFade(false);
      setTimeout(() => {
        close(null);
      }, 100);
    }
  }, []);

  const handleCloseClick = (event) => {
    event.stopPropagation();
    setShowFade(false);
    setPause(true);
    setTimeout(() => {
      close(null);
    }, 100);
  };

  const handleCopyCarNumberClick = (event) => {
    event.stopPropagation();
    handleCloseClick(event);
  };

  const handleEventClick = () => {
    const route = parkingData?.userType === 'renter' ? 'events-logs' : 'events';
    const baseUrl = window.location.href.replace(pathname, '');
    window.open(
      `${baseUrl}/${route}?event_id=${event.id}`,
      '_blank',
      'noreferrer'
    );
    // setTimeout(() => {
    //   dispatch(setSelectedEventId(event.id));
    // }, 500);
  };

  return (
    <Fade in={showFade} appear={false} timeout={100}>
      <div style={{ width: isMobile ? '100%' : 'inherit' }}>
        <Slide
          direction={isMobile ? 'up' : 'left'}
          in={show}
          appear={start > 0 ? false : animate}
          timeout={250}
        >
          <Card
            sx={{
              border: `1px solid ${theme.colors.outline.surface}`,
              borderRadius: '16px',
              width: isMobile ? '100%' : 'inherit',
              borderBottomRightRadius: isMobile ? '0' : '16px',
              borderBottomLeftRadius: isMobile ? '0' : '16px',
              cursor: 'pointer',
              boxShadow: isMobile ? '0px -4px 16px rgba(0, 0, 0, 0.2)' : ''
            }}
            onMouseLeave={() => setStopped(false)}
            onMouseOver={() => setStopped(true)}
            onClick={handleEventClick}
          >
            <CardContent
              sx={{ p: '8px', pr: 0, '&:last-child': { pb: '12px' } }}
            >
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'flex-start'}
              >
                <Stack direction={'row'} alignItems={'flex-start'}>
                  {image && (
                    <IconButton disableRipple sx={{ p: 0, pr: '8px' }}>
                      <img
                        style={{
                          height: 96,
                          borderRadius: '8px'
                        }}
                        src={image}
                        alt="auto"
                      />
                    </IconButton>
                  )}
                  {event && (
                    <Stack
                      gap={'8px'}
                      sx={{ width: '200px', maxWidth: '200px' }}
                    >
                      {event.vehicle_plate && event.vehicle_plate.full_plate && (
                        <Stack
                          direction={'row'}
                          sx={{ pb: '4px' }}
                          onClick={handleCopyCarNumberClick}
                        >
                          <CarNumberCard
                            carNumber={event.vehicle_plate}
                            isTable
                          />
                        </Stack>
                      )}
                      <Typography
                        sx={{ fontWeight: 500, lineHeight: '1.125rem' }}
                      >
                        {event.description}
                      </Typography>
                      <Stack
                        direction={'row'}
                        gap={'8px'}
                        alignItems={'center'}
                      >
                        {event.direction && (
                          <img
                            style={{
                              width: '18px'
                            }}
                            src={
                              event.direction === 'in'
                                ? eventInIcon
                                : event.direction === 'out'
                                ? eventOutIcon
                                : eventInnerIcon
                            }
                            alt={event.access_point_description}
                          />
                        )}
                        <Typography>
                          {event.access_point_description}
                        </Typography>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
                <IconButton
                  disableRipple
                  sx={{ p: 0, px: '8px' }}
                  onClick={handleCloseClick}
                >
                  <img
                    style={{
                      width: 16
                    }}
                    src={eventCloseIcon}
                    alt="закрыть"
                  />
                </IconButton>
              </Stack>
            </CardContent>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                backgroundColor: 'transparent',
                '& span': { backgroundColor: theme.colors.outline.surface }
              }}
            />
          </Card>
        </Slide>
      </div>
    </Fade>
  );
}
