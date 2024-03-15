import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import {
  sessionsFetch,
  sessionsChangePageFetch,
  changeDataModal,
  changeCurrentPage,
  statusSessionFetch,
  paidSessionFetch
} from 'store/sessions/sessionsSlice';
import { CarNumberCard } from '../CarNumberCard/CarNumberCard';
import TypeAuto from '../TypeAuto';
import { formatDate, getDayMinuteSecondsByNumber } from 'utils';
import { positiveButtonStyle, secondaryButtonStyle } from '../../theme/styles';
import sessionSkeleton from '../../assets/svg/session_skeleton.svg';
import { colors } from '../../theme/colors';

const cardContainerStyle = {
  flex: '1 1 380px',
  minWidth: '380px',
  maxWidth: '776px',
  border: '1px solid ' + colors.outline.separator,
  borderTop: 'none',
  borderLeft: 'none',
  p: '16px',
  backgroundColor: colors.surface.low
};

const imageContainerStyle = {
  backgroundImage: `url("${sessionSkeleton}")`,
  backgroundSize: 'cover',
  width: '100%',
  height: '100%',
  minHeight: '174px',
  maxHeight: '250px',
  aspectRatio: '16 / 9',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  border: `1px solid ${colors.outline.surface}`
};

const imageStyle = {
  objectFit: 'contain',
  objectPosition: 'center',
  height: '100%',
  minHeight: '174px',
  maxHeight: '250px',
  display: 'block'
};

const labelTextStyle = {
  minWidth: '88px',
  color: colors.element.secondary
};

export default function LogSessionCard({ session }) {
  const [imgUrl, setImgUrl] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (session && session.events[0] && session.events[0].car_img_path) {
      setImgUrl(
        process.env.REACT_APP_API_URL + '/' + session.events[0].car_img_path
      );
    } else {
      setImgUrl(null);
    }
  }, [session]);

  const handleSessionClick = () => {
    window.open(
      `${window.location.href}/${session.id}`,
      '_blank',
      'noreferrer'
    );
  };

  const handlePaidClick = () => {
    dispatch(paidSessionFetch({ id: session.id, is_paid: true }));
  };

  const handleCloseClick = () => {
    dispatch(statusSessionFetch({ id: session.id, status: 'closed' }));
  };

  return (
    <Box sx={cardContainerStyle}>
      <Stack gap={'12px'}>
        <Box sx={imageContainerStyle}>
          <img style={imageStyle} src={imgUrl} alt="img" />
        </Box>
        {session.events[0] && (
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            sx={{ width: '100%' }}
          >
            <Stack direction={'row'}>
              <CarNumberCard
                carNumber={session.events[0].vehicle_plate}
                isTable
              />
              <Box sx={{ width: '100%' }}></Box>
            </Stack>
            <IconButton
              disableRipple
              sx={[
                secondaryButtonStyle,
                {
                  width: '48px',
                  height: '40px'
                }
              ]}
              onClick={handleSessionClick}
            >
              <Typography sx={{ fontWeight: 500 }}>...</Typography>
            </IconButton>
          </Stack>
        )}
        <Stack direction={'row'} gap={'4px'}>
          {session.events[0] && (
            <TypeAuto type={session.events[0].access_status_code} />
          )}
          <TypeAuto type={session.status} />
          <TypeAuto type={session.is_paid ? 'paid' : 'not_paid'} />
        </Stack>
        <Stack gap={'4px'}>
          <Stack direction={'row'} gap={'8px'}>
            <Typography sx={labelTextStyle}>Проведено</Typography>
            <Typography>
              {getDayMinuteSecondsByNumber(session.time_on_parking)}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'8px'}>
            <Typography sx={labelTextStyle}>Создана</Typography>
            <Typography>{formatDate(session.create_datetime)}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'8px'}>
            <Typography sx={labelTextStyle}>Закрыта</Typography>
            <Typography>
              {session.closed_datetime
                ? formatDate(session.closed_datetime)
                : '-'}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'8px'}>
            <Typography sx={labelTextStyle}>Оплачено до</Typography>
            <Typography>
              {session.payment_is_valid_until
                ? formatDate(session.payment_is_valid_until)
                : '-'}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>Долг</Typography>
          <Typography>{`${session.payment_amount} ₽`}</Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          {session.payment_amount > 0 ? (
            <Button
              disableRipple
              variant="contained"
              fullWidth
              sx={secondaryButtonStyle}
              onClick={handlePaidClick}
            >
              Обнулить долг
            </Button>
          ) : (
            <Box sx={{ width: '100%' }} />
          )}
          <Button
            disableRipple
            disabled={session.status === 'closed'}
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleCloseClick}
          >
            Закрыть
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
