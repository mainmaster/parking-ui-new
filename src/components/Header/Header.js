import { useNavigate } from 'react-router-dom';
import { operatorAccessOptions } from '../../constants';
import PropTypes from 'prop-types';
import { icons } from './utils';
import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getUserData } from '../../api/auth/login';
import { useSnackbar } from 'notistack';
import _ from 'lodash';
import React, { useMemo } from 'react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { colors } from '../../theme/colors';
import { secondaryButtonStyle } from '../../theme/styles';
import MoreIdIcon from '../../assets/svg/more_parking_id.svg';
import MoreHomeIcon from '../../assets/svg/more_parking_home.svg';
import MoreUserIcon from '../../assets/svg/more_parking_user.svg';
import ProfileIcon from '../../assets/svg/profile_icon.svg';
import AddressIcon from '../../assets/svg/parking_address_icon.svg';
import IdIcon from '../../assets/svg/parking_id_icon.svg';
import MoreIcon from '../../assets/svg/more_icon.svg';
import MoreIconSelected from '../../assets/svg/more_icon_selected.svg';
import { adminRoutes, operatorRoutes, renterRoutes } from '../../router/routes';
import { logout } from '../../api/auth/login';
import { setParkingUserType } from '../../store/parkingInfo/parkingInfo';
import { useParkingInfoQuery } from '../../api/settings/settings';
import { spacers } from '../../theme/spacers';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const mobileFooterStyle = {
  top: 'auto',
  bottom: 0,
  justifyContent: 'center',
  width: '100%',
  height: spacers.footer,
  backgroundColor: colors.surface.low
};

const mobileMoreHeaderStyle = {
  zIndex: 1200,
  top: 0,
  bottom: 'auto',
  justifyContent: 'center',
  width: '100%',
  height: spacers.more,
  backgroundColor: colors.surface.low,
  p: '16px',
  pb: '8px'
};

const mobileMoreListStyle = {
  width: '100%',
  height: `calc(100% - ${spacers.more} - ${spacers.footer})`,
  maxHeight: `calc(100dvh - ${spacers.more} - ${spacers.footer})`,
  backgroundColor: colors.surface.low,
  position: 'absolute',
  top: spacers.more,
  left: 0,
  right: 0,
  zIndex: 1100,
  overflowY: 'scroll',
  scrollbarWidth: 'none', // Hide the scrollbar for firefox
  '&::-webkit-scrollbar': {
    display: 'none' // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
  },
  '&-ms-overflow-style:': {
    display: 'none' // Hide the scrollbar for IE
  },
  p: '16px',
  gap: '16px'
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
  height: '80px',
  width: '72px',
  pt: '8px',
  borderRight: `1px solid ${colors.outline.surface}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
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
  color: colors.element.secondary,
  width: '100%',
  overflowWrap: 'break-word',
  hyphens: 'manual'
};

const selectedTextStyle = {
  color: colors.button.primary.default
};

const Header = ({ title, userType, isHideMenu = false }) => {
  const { data: parkingData } = useParkingInfoQuery();
  const [userData, setUserData] = useState(null);
  const [currentHref, setCurrentHref] = useState(useLocation().pathname);
  const [more, setMore] = useState(false);
  const [moreListScrolled, setMoreListScrolled] = useState(false);
  const [adminFullMenu, setAdminFullMenu] = useState(false);
  const [firstMenuMouseOut, setFirstMenuMouseOut] = useState(true);
  const [secondMenuMouseOut, setSecondMenuMouseOut] = useState(true);
  const [filteredOperatorRoutes, setFilteredOperatorRoutes] =
    useState(operatorRoutes);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  let navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const moreListRef = useRef(null);

  document.addEventListener('mouseleave', () => setAdminFullMenu(false));

  const handleMoreListScroll = () => {
    if (moreListRef.current) {
      const { scrollTop } = moreListRef.current;
      if (scrollTop > 0) {
        setMoreListScrolled(true);
      } else if (moreListScrolled) {
        setMoreListScrolled(false);
      }
    }
  };

  useEffect(() => {
    setCurrentHref(location.pathname);
  }, [location]);

  useEffect(() => {
    if (firstMenuMouseOut && secondMenuMouseOut) {
      setAdminFullMenu(false);
    }
  }, [firstMenuMouseOut, secondMenuMouseOut]);

  const routeList = useMemo(
    () =>
      userType === 'admin'
        ? adminRoutes.slice(0, 6)
        : userType === 'operator'
        ? filteredOperatorRoutes.slice(0, 6)
        : userType === 'renter'
        ? renterRoutes
        : [],
    [filteredOperatorRoutes]
  );

  const adminRouteList2 = useMemo(
    () =>
      userType === 'admin'
        ? adminRoutes.slice(6, 11)
        : userType === 'operator'
        ? filteredOperatorRoutes.slice(6, 11)
        : [],
    [filteredOperatorRoutes]
  );

  const adminRouteList3 = useMemo(
    () =>
      userType === 'admin'
        ? adminRoutes.slice(11)
        : userType === 'operator'
        ? filteredOperatorRoutes.slice(11)
        : [],
    [filteredOperatorRoutes]
  );

  const mobileRouteList = useMemo(
    () =>
      userType === 'admin'
        ? adminRoutes.slice(0, 3)
        : userType === 'operator'
        ? filteredOperatorRoutes.slice(0, 3)
        : userType === 'renter'
        ? renterRoutes
        : [],
    [filteredOperatorRoutes]
  );

  const mobileRouteList2 = useMemo(
    () =>
      userType === 'admin'
        ? adminRoutes.slice(3)
        : userType === 'operator'
        ? filteredOperatorRoutes.slice(3)
        : [],
    [filteredOperatorRoutes]
  );

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

  useEffect(() => {
    if (userData && !_.isEmpty(userData.operator)) {
      const routes = adminRoutes.filter((route) => {
        const option = operatorAccessOptions.find(
          (option) => option.route === route.eventKey
        );
        if (
          (option &&
            option.value in userData.operator &&
            userData.operator[option.value]) ||
          (option && option.value === 'access_to_events')
        ) {
          return true;
        } else {
          return false;
        }
      });
      setFilteredOperatorRoutes(routes);
    }
  }, [userData]);

  const handleMoreClick = () => {
    setMore(true);
  };

  const handleAdminMenuMouseOver = () => {
    setAdminFullMenu(true);
    setFirstMenuMouseOut(false);
    setSecondMenuMouseOut(false);
  };

  const handleFirstMenuMouseOut = () => {
    setFirstMenuMouseOut(true);
  };

  const handleSecondMenuMouseOut = () => {
    setSecondMenuMouseOut(true);
  };

  const handleExitMoreClick = () => {
    setMore(false);
  };

  const handleLogout = () => {
    logout();
    dispatch(setParkingUserType(''));
  };

  return (
    <>
      {isMobile && (
        <>
          <AppBar position="absolute" sx={mobileFooterStyle}>
            <Stack
              direction={'row'}
              justifyContent={'space-around'}
              sx={{ width: '100%' }}
            >
              {mobileRouteList.map((route) => {
                const icon = icons.find(
                  (icon) => icon.route === route.eventKey
                );
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
                  <Typography
                    sx={[menuTextStyle, more ? selectedTextStyle : {}]}
                  >
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
                {userType === 'admin'
                  ? 'Админ'
                  : userType === 'operator'
                  ? 'Оператор'
                  : userType === 'renter'
                  ? 'Арендатор'
                  : ''}
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
              {parkingData && (
                <Typography sx={mobileProfileTextStyle}>
                  {parkingData.address}
                </Typography>
              )}
            </Stack>
          </AppBar>
          {more && (
            <>
              <AppBar
                position="absolute"
                sx={[
                  mobileMoreHeaderStyle,
                  { boxShadow: !moreListScrolled && 'none' }
                ]}
              >
                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  sx={{ width: '100%' }}
                >
                  <Typography
                    sx={{
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      lineHeight: '1.75rem',
                      pt: '6px'
                    }}
                  >
                    Ещё
                  </Typography>
                  <Button
                    disableRipple
                    variant="contained"
                    fullWidth={false}
                    onClick={handleExitMoreClick}
                    sx={secondaryButtonStyle}
                  >
                    Выход
                  </Button>
                </Stack>
              </AppBar>
              <Stack
                ref={moreListRef}
                sx={mobileMoreListStyle}
                onScroll={handleMoreListScroll}
              >
                {parkingData && (
                  <Stack gap={'4px'}>
                    <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: colors.element.secondary,
                          width: '24px'
                        }}
                      >
                        ID:
                      </Typography>
                      <Typography>{parkingData.parkingID}</Typography>
                    </Stack>
                    <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
                      <img
                        style={{
                          width: 24,
                          color: colors.element.primary
                        }}
                        src={MoreIdIcon}
                        alt="ID"
                      />
                      <Typography>{parkingData.name}</Typography>
                    </Stack>
                    <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
                      <img
                        style={{
                          width: 24,
                          color: colors.element.primary
                        }}
                        src={MoreHomeIcon}
                        alt="Адрес"
                      />
                      <Typography>{parkingData.address}</Typography>
                    </Stack>
                    {userData && (
                      <Stack
                        direction={'row'}
                        gap={'8px'}
                        alignItems={'center'}
                      >
                        <img
                          style={{
                            width: 24,
                            color: colors.element.primary
                          }}
                          src={MoreUserIcon}
                          alt="Пользователь"
                        />
                        <Typography>{userData.username}</Typography>
                      </Stack>
                    )}
                  </Stack>
                )}
                <Stack>
                  {mobileRouteList2.map((route) => {
                    const icon = icons.find(
                      (icon) => icon.route === route.eventKey
                    );
                    return (
                      <Stack
                        direction={'row'}
                        alignItems={'center'}
                        gap={'12px'}
                        sx={{
                          px: '12px',
                          py: '8px',
                          backgroundColor: colors.surface.high
                        }}
                        key={route.eventKey}
                        onClick={() => {
                          setMore(false);
                          navigate(route.eventKey);
                        }}
                      >
                        {icon && icon.more && (
                          <IconButton disableRipple sx={{ p: 0 }}>
                            <img
                              style={{
                                width: 24,
                                color: colors.element.primary
                              }}
                              src={icon.more}
                              alt={route.title}
                            />
                          </IconButton>
                        )}
                        <Typography sx={{ fontWeight: 500 }}>
                          {route.title}
                        </Typography>
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            </>
          )}
        </>
      )}
      {!isMobile && (
        <Stack
          justifyContent={'space-between'}
          sx={{
            width: '72px',
            height: '100%',
            maxHeight: '100dvh',
            backgroundColor: colors.surface.high,
            borderRight: !adminFullMenu
              ? `1px solid ${colors.outline.surface}`
              : 'none',
            position: 'relative',
            zIndex: 1200
          }}
          onMouseOver={handleAdminMenuMouseOver}
          onMouseLeave={handleFirstMenuMouseOut}
        >
          <Stack>
            <Box sx={{ height: '1rem' }}>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  lineHeight: '0.875rem',
                  textAlign: 'center'
                }}
              >
                {userType === 'admin'
                  ? 'Админ'
                  : userType === 'operator'
                  ? 'Оператор'
                  : userType === 'renter'
                  ? 'Арендатор'
                  : ''}
              </Typography>
            </Box>
            {adminRouteList2.length > 0 && adminFullMenu && (
              <Stack direction={'row'} onMouseLeave={handleSecondMenuMouseOut}>
                <Stack
                  sx={{
                    width: '72px',
                    height: '100%',
                    maxHeight: '100dvh',
                    backgroundColor: colors.surface.high,
                    position: 'absolute',
                    top: 0,
                    right: '-73px',
                    zIndex: 1200
                  }}
                >
                  <Box sx={{ minHeight: '1rem' }}></Box>
                  {adminRouteList2.map((route) => {
                    const icon = icons.find(
                      (icon) => icon.route === route.eventKey
                    );
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
                        onClick={() => {
                          setAdminFullMenu(false);
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
                                icon.route === currentHref
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
                            icon.route === currentHref ? selectedTextStyle : {}
                          ]}
                        >
                          {route.title}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
                <Stack
                  sx={{
                    width: '72px',
                    height: '100%',
                    maxHeight: '100dvh',
                    backgroundColor: colors.surface.high,
                    position: 'absolute',
                    top: 0,
                    right: '-145px',
                    zIndex: 1200,
                    borderRight: `1px solid ${colors.outline.surface}`
                  }}
                >
                  <Box sx={{ minHeight: '1rem' }}></Box>
                  {adminRouteList3.map((route) => {
                    const icon = icons.find(
                      (icon) => icon.route === route.eventKey
                    );
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
                        onClick={() => {
                          setAdminFullMenu(false);
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
                                icon.route === currentHref
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
                            icon.route === currentHref ? selectedTextStyle : {}
                          ]}
                        >
                          {route.title}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </Stack>
            )}
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
                  onClick={() => {
                    setAdminFullMenu(false);
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
                      {userData.username && (
                        <Typography sx={menuTextStyle}>
                          {userData.username}
                        </Typography>
                      )}
                    </Stack>
                    <Box
                      sx={{
                        px: '12px',
                        pb: '8px',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                      onClick={handleLogout}
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
