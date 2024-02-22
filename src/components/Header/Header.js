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
import { Box, Container, IconButton, Stack, Typography } from '@mui/material';
import { colors } from '../../theme/colors';
import MainIcon from '../../assets/svg/main_icon.svg';
import SessionsIcon from '../../assets/svg/sessions_icon.svg';
import ParkIcon from '../../assets/svg/park_icon.svg';
import BlackListIcon from '../../assets/svg/blacklist_icon.svg';
import RequestsIcon from '../../assets/svg/requests_icon.svg';
import SettingsIcon from '../../assets/svg/settings_icon.svg';
import ProfileIcon from '../../assets/svg/profile_icon.svg';
import { adminRoutes, operatorRoutes, renterRoutes } from '../../router/routes';

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

const menuTextStyle = {
  fontSize: '0.75rem',
  lineHeight: '0.875rem',
  textAlign: 'center',
  fontWeight: 500
};

const selectedTextStyle = {
  color: colors.button.primary.default
};

const Header = ({ title, userType, isHideMenu = false }) => {
  const [userData, setUserData] = useState(null);
  const [currentHref, setCurrentHref] = useState(useLocation().pathname);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  let navigate = useNavigate();

  useEffect(() => {
    setCurrentHref(location.pathname);
  }, [location]);

  const routeList =
    userType === 'admin'
      ? adminRoutes
      : userType === 'operator'
      ? operatorRoutes
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

  return (
    // <Navbar style={{background: 'white'}} expand={false} bg="light">
    //     <Container fluid>
    //         <Navbar.Brand className={css.header_logo}>
    //             <NavLink to="/">{logoIcon}</NavLink>
    //             <div className={css.header_title}>{title}</div>
    //         </Navbar.Brand>
    //         {!isHideMenu && (
    //             <>
    //                 <div style={{display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap'}}>
    //                     {
    //                         (currentHref !== '/login' &&
    //                             currentHref !== '/registration') && userData != null?
    //                             <DisplayDataHeader userData={userData}/>
    //                             : null
    //                     }
    //                 </div>
    //                 <Navbar.Offcanvas placement="end">
    //                     <Offcanvas.Header closeButton>
    //                         <Offcanvas.Title>Меню</Offcanvas.Title>
    //                     </Offcanvas.Header>
    //                     <Offcanvas.Body>
    //                         <div className={css.header_menu}>
    //                             <NavList links={links} />
    //                         </div>
    //                     </Offcanvas.Body>
    //                 </Navbar.Offcanvas>

    //             </>
    //         )}
    //     </Container>
    // </Navbar>
    <Stack
      justifyContent={'space-between'}
      sx={{
        width: '72px',
        height: '100%',
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
                    src={icon.route === currentHref ? icon.selected : icon.icon}
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
      <Box sx={menuButtonStyle}>
        {currentHref !== '/login' &&
        currentHref !== '/registration' &&
        userData != null ? (
          <>
            <IconButton disableRipple sx={menuIconStyle}>
              <img
                style={{
                  height: 26
                }}
                src={ProfileIcon}
                alt="Профиль"
              />
            </IconButton>
            <Typography sx={menuTextStyle}>{userData.username}</Typography>
          </>
        ) : null}
      </Box>
    </Stack>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  userType: PropTypes.string,
  isHideMenu: PropTypes.bool
};

export default Header;
