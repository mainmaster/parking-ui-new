import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
  Menu,
  MenuItem
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
import { ITEM_MAX_WIDTH, ITEM_MIN_WIDTH } from '../../constants';
import { formatDate, getDayMinuteSecondsByNumber } from 'utils';
import { positiveButtonStyle, secondaryButtonStyle } from '../../theme/styles';
import sessionSkeleton from '../../assets/svg/session_skeleton.svg';
import eventMenuOpenIcon from '../../assets/svg/event_menu_open_icon.svg';
import eventMenuCopyIcon from '../../assets/svg/event_menu_copy_icon.svg';
import { colors } from '../../theme/colors';
import { useSnackbar } from 'notistack';
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

const imageContainerStyle = {
  backgroundColor: colors.surface.high,
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
  display: 'block',
  cursor: 'pointer'
};

const labelTextStyle = {
  minWidth: '88px',
  color: colors.element.secondary
};

export default function LogSessionCard({ session, onClickImage }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (session && session.events[0] && session.events[0].car_img_path) {
      setImgUrl(
        process.env.REACT_APP_API_URL + '/' + session.events[0].car_img_path
      );
    } else {
      setImgUrl(null);
    }
  }, [session]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLinkClick = () => {
    setSelectedMenuItem('copy');
    navigator.clipboard
      .writeText(window.location.href + '/' + session.id)
      .then(() => {
        enqueueSnackbar('Ссылка скопирована');
      });
    setAnchorEl(null);
  };

  const handleSessionClick = () => {
    setSelectedMenuItem('session');
    window.open(
      `${window.location.href}/${session.id}`,
      '_blank',
      'noreferrer'
    );
    setAnchorEl(null);
  };

  const handlePaidClick = () => {
    dispatch(paidSessionFetch({ id: session.id, is_paid: true }));
  };

  const handleCloseClick = () => {
    dispatch(statusSessionFetch({ id: session.id, status: 'closed' }));
  };

  return (
    <Box sx={[cardContainerStyle, isMobile && { minWidth: '320px' }]}>
      <Stack gap={'12px'}>
        <Box
          sx={[
            imageContainerStyle,
            imgUrl ? {} : { backgroundImage: `url("${sessionSkeleton}")` }
          ]}
        >
          <img
            style={imageStyle}
            src={imgUrl}
            alt="img"
            onClick={() => onClickImage(imgUrl)}
          />
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
              onClick={handleMenuClick}
            >
              <Typography sx={{ fontWeight: 500 }}>...</Typography>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="event-menu"
              open={Boolean(anchorEl)}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 10,
                sx: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '168px',
                  border: `1px solid ${colors.outline.default}`,
                  borderRadius: '8px',
                  '& .MuiAvatar-root': {},
                  '&::before': {}
                }
              }}
              MenuListProps={{ sx: { p: 0 } }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem
                id="session"
                selected={selectedMenuItem === 'session'}
                onClick={handleSessionClick}
                sx={{ p: '8px', gap: '8px' }}
              >
                <img
                  style={{
                    width: 24,
                    height: 24
                  }}
                  src={eventMenuOpenIcon}
                  alt={'Открыть'}
                />
                <Typography>Открыть</Typography>
              </MenuItem>
              <MenuItem
                id="copy"
                selected={selectedMenuItem === 'copy'}
                onClick={handleCopyLinkClick}
                sx={{ p: '8px', gap: '8px' }}
              >
                <img
                  style={{
                    width: 24,
                    height: 24
                  }}
                  src={eventMenuCopyIcon}
                  alt={'Скопировать ссылку'}
                />
                <Typography>Коп. ссылку</Typography>
              </MenuItem>
            </Menu>
          </Stack>
        )}
        <Stack direction={'row'} gap={'4px'}>
          {session.events[0] && session.events[0].access_status_code && (
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
            <Typography sx={labelTextStyle}>Оплата до</Typography>
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
          {session.status === 'open' && (
            <Button
              disableRipple
              variant="contained"
              fullWidth
              sx={secondaryButtonStyle}
              onClick={handleCloseClick}
            >
              Закрыть
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
