import { NavLink, useNavigate } from 'react-router-dom';
import css from './Header.module.scss';
//import {Offcanvas, Navbar, Container} from 'react-bootstrap'
import PropTypes from 'prop-types';
import NavList from 'components/NavList';
import { icons, links } from './utils';
import { logoIcon } from 'icons/index';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getUserData } from '../../api/auth/login';
import { DisplayDataHeader } from './DisplayDataHeader';
import { useSnackbar } from 'notistack';
import React from 'react';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { colors } from '../../theme/colors';
import MainIcon from '../../assets/svg/main_icon.svg';
import SessionsIcon from '../../assets/svg/sessions_icon.svg';
import ParkIcon from '../../assets/svg/park_icon.svg';
import BlackListIcon from '../../assets/svg/blacklist_icon.svg';
import RequestsIcon from '../../assets/svg/requests_icon.svg';
import SettingsIcon from '../../assets/svg/settings_icon.svg';
import ProfileIcon from '../../assets/svg/profile_icon.svg';
import AddressIcon from '../../assets/svg/parking_address_icon.svg';
import IdIcon from '../../assets/svg/parking_id_icon.svg';
import MoreIcon from '../../assets/svg/more_icon.svg';
import MoreIconSelected from '../../assets/svg/more_icon_selected.svg';
import { adminRoutes, operatorRoutes, renterRoutes } from '../../router/routes';
import { logout } from '../../api/auth/login';
import { useParkingInfoQuery } from '../../api/settings/settings';
import { spacers } from '../../theme/spacers';

const mobileFooterStyle = {
  top: 'auto',
  bottom: 0,
  justifyContent: 'center',
  width: '100%',
  height: spacers.footer,
  backgroundColor: colors.surface.low
};

const mobileMenuButtonStyle = {
  height: '56px',
  width: '100%',
  borderWidth: 0,
  borderTop: `1px solid ${colors.outline.surface}`,
  backgroundColor: colors.surface.high,
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer'
};

const menuButtonStyle = {
  height: '72px',
  width: '72px',
  borderRight: `1px solid ${colors.outline.surface}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer'
};

const menuIconStyle = {
  padding: '4px',
  height: '40px'
};

const mobileProfileTextStyle = {
  fontSize: '0.75rem',
  lineHeight: '0.875rem',
  color: colors.element.secondary
};

const menuTextStyle = {
  fontSize: '0.75rem',
  lineHeight: '0.875rem',
  textAlign: 'center',
  fontWeight: 500,
  color: colors.element.secondary
};

const selectedTextStyle = {
  color: colors.button.primary.default
};

const Header = ({ title, userType, isHideMenu = false }) => {
  const { data: parkingData } = useParkingInfoQuery();
  const [userData, setUserData] = useState(null);
  const [currentHref, setCurrentHref] = useState(useLocation().pathname);
  const [more, setMore] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  let navigate = useNavigate();
  const isMobile = window.orientation > 1;

  useEffect(() => {
    setCurrentHref(location.pathname);
  }, [location]);

  const routeList =
    userType === 'admin'
      ? adminRoutes.slice(0, 6)
      : userType === 'operator'
      ? operatorRoutes
      : userType === 'renter'
      ? renterRoutes
      : [];

  const mobileRouteList =
    userType === 'admin'
      ? adminRoutes.slice(0, 3)
      : userType === 'operator'
      ? operatorRoutes.slice(0, 3)
      : userType === 'renter'
      ? renterRoutes
      : [];

  useLayoutEffect(() => {
    if (currentHref !== '/login' && currentHref !== '/registration') {
      getUserData()
        .then((res) => {
          setUserData(res.data);
        })
        .catch((e) => {
          enqueueSnackbar('Ошибка подключения', { variant: 'error' });
        });
    }
  }, [currentHref]);

  const handleMoreClick = () => {
    setMore(true);
  };

  return (
    <>
      {isMobile && (
        <AppBar position="absolute" sx={mobileFooterStyle}>
          <Stack
            direction={'row'}
            justifyContent={'space-around'}
            sx={{ width: '100%' }}
          >
            {mobileRouteList.map((route) => {
              const icon = icons.find((icon) => icon.route === route.eventKey);
              return (
                <Box
                  sx={[
                    mobileMenuButtonStyle,
                    {
                      borderColor:
                        !more && icon.route === currentHref
                          ? colors.button.primary.default
                          : colors.outline.surface
                    }
                  ]}
                  key={route.eventKey}
                  onClick={() => {
                    setMore(false);
                    navigate(route.eventKey);
                  }}
                >
                  {icon && (
                    <IconButton disableRipple sx={menuIconStyle}>
                      <img
                        style={{
                          height: icon.height,
                          color: colors.button.primary.default
                        }}
                        src={
                          !more && icon.route === currentHref
                            ? icon.selected
                            : icon.icon
                        }
                        alt={route.title}
                      />
                    </IconButton>
                  )}
                  <Typography
                    sx={[
                      menuTextStyle,
                      !more && icon.route === currentHref
                        ? selectedTextStyle
                        : {}
                    ]}
                  >
                    {route.title}
                  </Typography>
                </Box>
              );
            })}
            {userType !== 'renter' && (
              <Box
                sx={[
                  mobileMenuButtonStyle,
                  {
                    borderColor: more
                      ? colors.button.primary.default
                      : colors.outline.surface
                  }
                ]}
                onClick={handleMoreClick}
              >
                <IconButton disableRipple sx={menuIconStyle}>
                  <img
                    style={{
                      height: 5,
                      color: colors.button.primary.default
                    }}
                    src={more ? MoreIconSelected : MoreIcon}
                    alt="Ещё"
                  />
                </IconButton>
                <Typography sx={[menuTextStyle, more ? selectedTextStyle : {}]}>
                  Ещё
                </Typography>
              </Box>
            )}
          </Stack>
          <Stack
            direction={'row'}
            justifyContent={'center'}
            gap={'4px'}
            sx={{ width: '100%' }}
          >
            <Typography sx={mobileProfileTextStyle}>
              {userData.username}
            </Typography>
            <IconButton disableRipple disabled sx={{ p: 0 }}>
              <img
                style={{
                  height: 10
                }}
                src={AddressIcon}
                alt="Адрес"
              />
            </IconButton>
            <Typography sx={mobileProfileTextStyle}>
              {parkingData.address}
            </Typography>
          </Stack>
        </AppBar>
      )}
      {!isMobile && (
        <Stack
          justifyContent={'space-between'}
          sx={{
            width: '72px',
            height: '100%',
            maxHeight: '100dvh',
            backgroundColor: colors.surface.high,
            borderRight: `1px solid ${colors.outline.surface}`
          }}
        >
          <Stack sx={{ gap: '2px' }}>
            {routeList.map((route) => {
              const icon = icons.find((icon) => icon.route === route.eventKey);
              return (
                <Box
                  sx={[
                    menuButtonStyle,
                    {
                      borderColor:
                        icon.route === currentHref
                          ? colors.button.primary.default
                          : colors.outline.surface
                    }
                  ]}
                  key={route.eventKey}
                  onClick={() => navigate(route.eventKey)}
                >
                  {icon && (
                    <IconButton disableRipple sx={menuIconStyle}>
                      <img
                        style={{
                          height: icon.height,
                          color: colors.button.primary.default
                        }}
                        src={
                          icon.route === currentHref ? icon.selected : icon.icon
                        }
                        alt={route.title}
                      />
                    </IconButton>
                  )}
                  <Typography
                    sx={[
                      menuTextStyle,
                      icon.route === currentHref ? selectedTextStyle : {}
                    ]}
                  >
                    {route.title}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
          <Stack gap={'4px'}>
            {currentHref !== '/login' && currentHref !== '/registration' && (
              <>
                {parkingData && (
                  <>
                    <Typography sx={menuTextStyle}>
                      ID: {parkingData.parkingID}
                    </Typography>
                    <Stack>
                      <IconButton disableRipple disabled sx={{ p: 0 }}>
                        <img
                          style={{
                            height: 24
                          }}
                          src={IdIcon}
                          alt="Идентификатор"
                        />
                      </IconButton>
                      <Typography sx={menuTextStyle}>
                        {parkingData.name}
                      </Typography>
                    </Stack>
                    <Stack>
                      <IconButton disableRipple disabled sx={{ p: 0 }}>
                        <img
                          style={{
                            height: 24
                          }}
                          src={AddressIcon}
                          alt="Адрес"
                        />
                      </IconButton>
                      <Typography sx={menuTextStyle}>
                        {parkingData.address}
                      </Typography>
                    </Stack>
                  </>
                )}
                {userData && (
                  <>
                    <Stack>
                      <IconButton disableRipple disabled sx={{ p: 0 }}>
                        <img
                          style={{
                            height: 24
                          }}
                          src={ProfileIcon}
                          alt="Профиль"
                        />
                      </IconButton>
                      <Typography sx={menuTextStyle}>
                        {userData.username}
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        px: '12px',
                        pb: '8px',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                      onClick={() => logout()}
                    >
                      <Typography
                        sx={{ color: colors.button.visited_link.default }}
                      >
                        Выйти
                      </Typography>
                    </Box>
                  </>
                )}
              </>
            )}
          </Stack>
        </Stack>
      )}
    </>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  userType: PropTypes.string,
  isHideMenu: PropTypes.bool
};

export default Header;
