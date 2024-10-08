import React, { useEffect, useState } from 'react';
import EventAlertCard from '../EventAlertCard/EventAlertCard';
import { useSelector } from 'react-redux';
import { Stack, Slide, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { formatISO, addHours } from 'date-fns';
import { spacers } from '../../theme/spacers';
import { useSwipeable } from 'react-swipeable';

export default function EventManager({ offset }) {
  const dataModal = useSelector((state) => state.events.dataModal);
  const events = useSelector((state) => state.events.events);
  //const [testEvents, setTestEvents] = useState([]);
  const [lastEvent, setLastEvent] = useState(null);
  const [show, setShow] = useState(true);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [third, setThird] = useState(null);
  const [forth, setForth] = useState(null);
  const [pause, setPause] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handlers = useSwipeable({
    onSwipedDown: () => {
      setShow(false);
      setPause(true);
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setFirst(null);
        setShow(true);
      }, 100);
    }
  }, [show]);

  useEffect(() => {
    if (pause) {
      setTimeout(() => {
        setPause(false);
      }, 3000);
    }
  }, [pause]);

  //test of alerts
  // const [count, setCount] = useState(0);
  // useEffect(() => {
  //   if (dataModal && count < testEvents.length) {
  //     const newEvents = events;
  //     setTimeout(() => {
  //       newEvents.unshift({
  //         ...dataModal,
  //         id: count,
  //         create_datetime: formatISO(Date.now())
  //       });
  //       console.log('test ' + events[0].id);
  //       console.log(count);
  //       setEvents(newEvents);
  //       setCount(count + 1);
  //     }, 1000);
  //   }
  // }, [dataModal, count]);
  //end of test code

  useEffect(() => {
    if (events.length > 0 && events[0] !== lastEvent) {
      //console.log('first event: ' + events[0].id);
      setLastEvent(events[0]);
      if (!pause) {
        if (first && !isMobile) {
          if (second) {
            if (third) {
              if (!forth || forth.id !== third.id) {
                setForth(third);
                //console.log('forth: ' + third.id);
              }
            }
            if (!third || third.id !== second.id) {
              setThird(second);
              //console.log('third: ' + second.id);
            }
          }
          if (!second || second.id !== first.id) {
            setSecond(first);
            //console.log('second: ' + first.id);
          }
        }
        if ((!first || first.id !== events[0].id) && lastEvent) {
          setFirst(events[0]);
          //console.log('first: ' + events[0].id);
        }
      }
    }
  }, [events]);

  return (
    <>
      <Stack
        {...handlers}
        gap={'4px'}
        alignItems={'flex-end'}
        sx={{
          position: 'fixed',
          bottom: isMobile ? 72 : '',
          top: isMobile
              ? ''
            : `calc(24px + ${spacers.header} + ${offset ? offset + 4 : 0}px)`,
          right: isMobile ? 0 : '24px',
          left: isMobile ? 0 : 'auto',
          zIndex: 1300
        }}
      >
        {first && (
          <Slide direction="up" in={show} appear={false} timeout={100}>
            <div style={{ width: isMobile ? '100%' : 'inherit' }}>
              <EventAlertCard
                key={first.id + formatISO(Date.now()) + 1}
                event={first}
                close={setFirst}
                animate={true}
                setPause={setPause}
              />
            </div>
          </Slide>
        )}
        {second && (
          <EventAlertCard
            key={second.id + formatISO(Date.now()) + 2}
            event={second}
            close={setSecond}
            animate={false}
            setPause={setPause}
          />
        )}
        {third && (
          <EventAlertCard
            key={third.id + formatISO(Date.now()) + 3}
            event={third}
            close={setThird}
            animate={false}
            setPause={setPause}
          />
        )}
        {forth && (
          <EventAlertCard
            key={forth.id + formatISO(Date.now()) + 4}
            event={forth}
            close={setForth}
            animate={false}
            fade
          />
        )}
      </Stack>
    </>
  );
}
