import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { getEvent } from '../../api/events';
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard';
import Image from 'react-bootstrap/Image';
import { Spinner, Accordion } from 'react-bootstrap';
import { formatDate } from 'utils';
import { Box, Tooltip, Typography, Button, Stack, AppBar } from '@mui/material';
import {
  listStyle,
  secondaryButtonStyle,
  positiveButtonStyle
} from '../../theme/styles';
import backIcon from '../../assets/svg/back_icon.svg';
import linkIcon from '../../assets/svg/link_icon.svg';
import eventCarIcon from '../../assets/svg/log_event_car_icon.svg';
import eventInIcon from '../../assets/svg/log_event_in_icon.svg';
import eventOutIcon from '../../assets/svg/log_event_out_icon.svg';
import eventUserIcon from '../../assets/svg/log_event_user_icon.svg';
import eventCopyIcon from '../../assets/svg/log_event_copy_icon.svg';
import { colors } from '../../theme/colors';
import { useNavigate } from 'react-router-dom';
import TypeAuto from '../../components/TypeAuto';
import { changeActiveOpenApModal } from '../../store/cameras/camerasSlice';
import CarNumberDialog from '../../components/CarNumberDialog/CarNumberDialog';
import '@fontsource-variable/roboto-mono';
import { isMobile } from 'react-device-detect';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

const captionTextStyle = {
  fontSize: '0.75rem',
  lineHeight: '0.875rem',
  color: colors.element.secondary
};

const labelTextStyle = {
  width: '112px',
  color: colors.element.secondary
};

const valueTextStyle = {
  fontWeight: 500
};

const detailsTextStyle = {
  fontFamily: ['Roboto Mono Variable', 'monospace'].join(','),
  lineHeight: '1.5rem'
};

export const EventPage = () => {
  const { id } = useParams();
  const [errorEvent, setErrorEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState();
  const [copied, setCopied] = useState(false);
  const [detailsText, setDetailsText] = useState('');
  const [detailsCopied, setDetailsCopied] = useState(false);
  const isOpenApModal = useSelector((state) => state.cameras.isOpenApModal);
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const errorContent = <div>Нет события с ID - {id}</div>;

  useLayoutEffect(() => {
    getEvent(id)
      .then((res) => {
        setLoading(false);
        setEvent(res.data);
      })
      .catch((error) => {
        setLoading(false);
        setErrorEvent(true);
      });
    document.title = `Событие №${id}` || 'Загрузка';
    return () => {
      document.title = 'Parking';
    };
  }, [id]);

  useEffect(() => {
    if (event?.scores) {
      setDetailsText(JSON.stringify(event.scores));
    }
  }, [event]);

  const handleCopyLinkClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  const handleCopyDetailsClick = () => {
    navigator.clipboard.writeText(detailsText);
    setDetailsCopied(true);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <AppBar
        sx={{
          width: isMobile ? '100%' : 'calc(100% - 72px)',
          position: 'absolute',
          top: 0,
          left: isMobile ? 0 : '72px',
          backgroundColor: colors.surface.low
        }}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          sx={{
            p: '16px',
            pb: isMobile ? '10px' : '8px'
          }}
        >
          <Stack direction={'row'} alignItems={'center'} gap={'16px'}>
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              onClick={handleBackClick}
              sx={[
                secondaryButtonStyle,
                isMobile && {
                  minWidth: '48px',
                  '& .MuiButton-startIcon': {
                    margin: 0
                  }
                }
              ]}
              startIcon={
                <img
                  src={backIcon}
                  alt="Назад"
                  style={{ width: '24px', height: '24px' }}
                />
              }
            >
              {isMobile ? '' : 'Назад'}
            </Button>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? 0 : '0.5rem'}
            >
              <Typography sx={titleTextStyle}>Событие </Typography>
              <Typography sx={isMobile ? captionTextStyle : titleTextStyle}>
                №{id}
              </Typography>
            </Stack>
          </Stack>
          <Tooltip title={copied ? 'Ссылка скопирована' : 'Скопировать ссылку'}>
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              onClick={handleCopyLinkClick}
              sx={[
                secondaryButtonStyle,
                isMobile
                  ? {
                      minWidth: '48px',
                      '& .MuiButton-endIcon': {
                        margin: 0
                      }
                    }
                  : { minWidth: '212px' }
              ]}
              endIcon={
                <img
                  src={linkIcon}
                  alt="Скопировать ссылку"
                  style={{
                    width: '24px',
                    height: '24px'
                  }}
                />
              }
            >
              {isMobile ? '' : 'Скопировать ссылку'}
            </Button>
          </Tooltip>
        </Stack>
      </AppBar>
      <Stack
        sx={[
          listStyle,
          {
            width: '100%',
            p: '16px',
            pt: isMobile ? '66px' : '64px',
            backgroundColor: colors.surface.low
          }
        ]}
      >
        {loading && <Spinner />}
        {errorEvent && errorContent}
        {event && (
          <>
            <Stack gap={'8px'} sx={{ pt: '16px' }}>
              {event.car_img_path && (
                <img
                  style={{
                    maxWidth: '560px',
                    borderRadius: '8px',
                    width: '100%'
                  }}
                  src={
                    process.env.REACT_APP_API_URL + '/' + event?.car_img_path
                  }
                  alt="Фото автомобиля"
                />
              )}
              {event.plate_img_path && (
                <img
                  style={{
                    maxWidth: '560px',
                    borderRadius: '8px'
                  }}
                  src={
                    process.env.REACT_APP_API_URL + '/' + event?.plate_img_path
                  }
                  alt="Фото номера"
                />
              )}
            </Stack>
            <Stack gap={'16px'} sx={{ pt: '16px' }}>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>Госномер</Typography>
                {event.vehicle_plate.full_plate !== '' && (
                  <CarNumberCard carNumber={event.vehicle_plate} isTable />
                )}
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>Описание</Typography>
                <Typography sx={valueTextStyle}>{event.description}</Typography>
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>Дата и время</Typography>
                <Typography sx={valueTextStyle}>
                  {formatDate(event.create_datetime)}
                </Typography>
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Stack
                  direction={'row'}
                  justifyContent={isMobile ? 'flex-start' : 'space-between'}
                  gap={'8px'}
                  sx={labelTextStyle}
                >
                  <Typography sx={{ color: colors.element.secondary }}>
                    Авто
                  </Typography>
                  <img
                    style={{
                      width: '14.6px'
                    }}
                    src={eventCarIcon}
                    alt="img"
                  />
                </Stack>
                <Typography sx={valueTextStyle}>{event.car_brand}</Typography>
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>Список авто</Typography>
                <TypeAuto type={event.access_status_code} />
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>Направление</Typography>
                <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
                  <img
                    style={{
                      width: '18px'
                    }}
                    src={event.direction === 'in' ? eventInIcon : eventOutIcon}
                    alt={event.access_point_description}
                  />
                  <Typography>{event.access_point_description}</Typography>
                </Stack>
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Stack
                  direction={'row'}
                  justifyContent={isMobile ? 'flex-start' : 'space-between'}
                  gap={'8px'}
                  sx={labelTextStyle}
                >
                  <Typography sx={{ color: colors.element.secondary }}>
                    Автор
                  </Typography>
                  <img
                    style={{
                      width: '14.6px'
                    }}
                    src={eventUserIcon}
                    alt="img"
                  />
                </Stack>
                <Typography sx={valueTextStyle}>
                  {event.initiator || '_'}
                </Typography>
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>Действие</Typography>
                <Stack
                  direction={'row'}
                  gap={'8px'}
                  alignItems={'center'}
                  justifyContent={'flex-start'}
                >
                  {!event.is_recognition && (
                    <Button
                      disableRipple
                      variant="contained"
                      fullWidth={false}
                      sx={[positiveButtonStyle, { mt: '8px' }]}
                      onClick={() =>
                        dispatch(changeActiveOpenApModal(event.access_point))
                      }
                    >
                      Ввести номер
                    </Button>
                  )}
                  {event.access_status_code === '1004' && (
                    <Button
                      disableRipple
                      variant="contained"
                      fullWidth={false}
                      sx={[secondaryButtonStyle, { mt: '8px' }]}
                    >
                      Убрать из Чёрного списка
                    </Button>
                  )}
                </Stack>
              </Stack>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? '4px' : '16px'}
              >
                <Typography sx={labelTextStyle}>Детали</Typography>
                {event.scores && (
                  <Stack
                    direction={'row'}
                    gap={'10px'}
                    justifyContent={'space-between'}
                    sx={{
                      width: '100%',
                      maxWidth: '720px',
                      backgroundColor: colors.surface.high,
                      borderRadius: '8px',
                      border: `1px solid ${colors.outline.surface}`,
                      p: '16px'
                    }}
                  >
                    <Stack>
                      {Object.entries(event.scores).map((item) => {
                        return (
                          <Stack key={item[1]}>
                            {Array.isArray(item[1]) ? (
                              <>
                                <Typography sx={detailsTextStyle}>
                                  {item[0]}:
                                </Typography>
                                {item[1].map((li) => (
                                  <Typography>{li}</Typography>
                                ))}
                              </>
                            ) : (
                              <Typography sx={detailsTextStyle}>
                                {item[0]}: {item[1]}
                              </Typography>
                            )}
                          </Stack>
                        );
                      })}
                    </Stack>
                    <Tooltip
                      title={
                        detailsCopied
                          ? 'Детали скопированы'
                          : 'Скопировать детали'
                      }
                    >
                      <Button
                        disableRipple
                        variant="contained"
                        fullWidth={false}
                        onClick={handleCopyDetailsClick}
                        sx={[
                          secondaryButtonStyle,
                          {
                            minWidth: '48px',
                            '& .MuiButton-startIcon': {
                              margin: 0
                            }
                          }
                        ]}
                        startIcon={
                          <img
                            src={eventCopyIcon}
                            alt="Скопировать"
                            style={{ width: '24px', height: '24px' }}
                          />
                        }
                      ></Button>
                    </Tooltip>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </>
        )}
        <CarNumberDialog
          show={isOpenApModal}
          handleClose={() => dispatch(changeActiveOpenApModal())}
        />
      </Stack>
    </>
  );
};
