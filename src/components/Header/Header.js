import { useNavigate } from 'react-router-dom';
import { operatorAccessOptions } from '../../constants';
import PropTypes from 'prop-types';
import { icons } from './utils';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
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
import {
  secondaryButtonStyle,
  mobileFooterStyle,
  mobileMoreHeaderStyle,
  mobileMoreListStyle,
  mobileMenuButtonStyle,
  menuButtonStyle,
  mobileProfileTextStyle,
  menuTextStyle,
  vlMenuTextStyle,
  selectedTextStyle
} from '../../theme/styles';
import css from './Header.module.scss';
import MoreIdIcon from '../../assets/svg/more_parking_id.svg';
import MoreHomeIcon from '../../assets/svg/more_parking_home.svg';
import MoreUserIcon from '../../assets/svg/more_parking_user.svg';
import ProfileIcon from '../../assets/svg/profile_icon.svg';
import AddressIcon from '../../assets/svg/parking_address_icon.svg';
import IdIcon from '../../assets/svg/parking_id_icon.svg';
import MoreIcon from '../../assets/svg/more_icon.svg';
import MoreIconSelected from '../../assets/svg/theme/more_icon_selected.svg';
import VlMoreIconSelected from '../../assets/svg/vltheme/more_icon_selected.svg';
import { adminRoutes, operatorRoutes, renterRoutes } from '../../router/routes';
import { logout } from '../../api/auth/login';
import {
  setParkingUserType,
  setOperator,
  setUsername
} from '../../store/parkingInfo/parkingInfo';
import { useParkingInfoQuery } from '../../api/settings/settings';
import { spacers } from '../../theme/spacers';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const menuIconStyle = {
  padding: '4px',
  height: '40px'
};

const mobileMenuIconStyle = {
  padding: '4px',
  height: '38px'
};

const Header = ({ title, userType, isHideMenu = false }) => {
  const { data: parkingData } = useParkingInfoQuery();
  const operator = useSelector((state) => state.parkingInfo.operator);
  const username = useSelector((state) => state.parkingInfo.username);
  const [currentHref, setCurrentHref] = useState(useLocation().pathname);
  const [more, setMore] = useState(false);
  const [moreListScrolled, setMoreListScrolled] = useState(false);
  const [adminFullMenu, setAdminFullMenu] = useState(false);
  const [firstMenuMouseOut, setFirstMenuMouseOut] = useState(true);
  const [secondMenuMouseOut, setSecondMenuMouseOut] = useState(true);
  const [filteredOperatorRoutes, setFilteredOperatorRoutes] =
    useState(operatorRoutes);
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

  useEffect(() => {
    if (!_.isEmpty(operator)) {
      const routes = adminRoutes.filter((route) => {
        const option = operatorAccessOptions.find(
          (option) => option.route === route.eventKey
        );
        if (
          (option && option.value in operator && operator[option.value]) ||
          (option && option.value === 'access_to_events')
        ) {
          return true;
        } else {
          return false;
        }
      });
      setFilteredOperatorRoutes(routes);
    }
  }, [operator]);

  const handleMoreClick = () => {
    setMore(!more);
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
    dispatch(setOperator({}));
    dispatch(setUsername(''));
  };

  return (
    <>
      {isMobile && (
        <>
          <AppBar
            position="absolute"
            sx={mobileFooterStyle({ ...theme, spacers: spacers })}
          >
            <Stack
              direction={'row'}
              justifyContent={'space-around'}
              sx={{ width: '100%' }}
            >
              {mobileRouteList.map((route) => {
                const icon = theme.icons.find(
                  (icon) => icon.route === route.eventKey
                );
                return (
                  <Box
                    sx={[
                      mobileMenuButtonStyle({ ...theme }),
                      {
                        borderColor:
                          !more && icon.route === currentHref
                            ? theme.colors.button.primary.default
                            : theme.colors.outline.surface
                      }
                    ]}
                    key={route.eventKey}
                    onClick={() => {
                      setMore(false);
                      navigate(route.eventKey);
                    }}
                  >
                    {icon && (
                      <IconButton disableRipple sx={mobileMenuIconStyle}>
                        <img
                          style={{
                            height: icon.height,
                            color: theme.colors.button.primary.default
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
                      className={
                        theme.name === 'vltheme' && route.vltitle
                          ? css.vltitle
                          : ''
                      }
                      sx={[
                        route.vltitle
                          ? vlMenuTextStyle({ ...theme })
                          : menuTextStyle({ ...theme }),
                        !more && icon.route === currentHref
                          ? selectedTextStyle({ ...theme })
                          : {}
                      ]}
                    >
                      {theme.name === 'vltheme' && route.vltitle
                        ? route.vltitle.replace(' ', '')
                        : route.title}
                    </Typography>
                  </Box>
                );
              })}
              {userType !== 'renter' && (
                <Box
                  sx={[
                    mobileMenuButtonStyle({ ...theme }),
                    {
                      borderColor: more
                        ? theme.colors.button.primary.default
                        : theme.colors.outline.surface
                    }
                  ]}
                  onClick={handleMoreClick}
                >
                  <IconButton disableRipple sx={mobileMenuIconStyle}>
                    <img
                      style={{
                        height: 5,
                        color: theme.colors.button.primary.default
                      }}
                      src={
                        more
                          ? theme.name === 'vltheme'
                            ? VlMoreIconSelected
                            : MoreIconSelected
                          : MoreIcon
                      }
                      alt="Ещё"
                    />
                  </IconButton>
                  <Typography
                    sx={[
                      menuTextStyle({ ...theme }),
                      more ? selectedTextStyle({ ...theme }) : {}
                    ]}
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
              <Typography sx={mobileProfileTextStyle({ ...theme })}>
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
                <Typography sx={mobileProfileTextStyle({ ...theme })}>
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
                  mobileMoreHeaderStyle({ ...theme, spacers: spacers }),
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
                    onClick={handleLogout}
                    sx={secondaryButtonStyle({ ...theme })}
                  >
                    Выход
                  </Button>
                </Stack>
              </AppBar>
              <Stack
                ref={moreListRef}
                sx={mobileMoreListStyle({ ...theme, spacers: spacers })}
                onScroll={handleMoreListScroll}
              >
                {parkingData && (
                  <Stack gap={'4px'}>
                    <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: theme.colors.element.secondary,
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
                          color: theme.colors.element.primary
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
                          color: theme.colors.element.primary
                        }}
                        src={MoreHomeIcon}
                        alt="Адрес"
                      />
                      <Typography>{parkingData.address}</Typography>
                    </Stack>
                    {username !== '' && (
                      <Stack
                        direction={'row'}
                        gap={'8px'}
                        alignItems={'center'}
                      >
                        <img
                          style={{
                            width: 24,
                            color: theme.colors.element.primary
                          }}
                          src={MoreUserIcon}
                          alt="Пользователь"
                        />
                        <Typography>{username}</Typography>
                      </Stack>
                    )}
                  </Stack>
                )}
                <Stack>
                  {mobileRouteList2.map((route) => {
                    const icon = theme.icons.find(
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
                          backgroundColor: theme.colors.surface.high
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
                                color: theme.colors.element.primary
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
            backgroundColor: theme.colors.surface.high,
            borderRight: !adminFullMenu
              ? `1px solid ${theme.colors.outline.surface}`
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
                    backgroundColor: theme.colors.surface.high,
                    position: 'absolute',
                    top: 0,
                    right: '-73px',
                    zIndex: 1200
                  }}
                >
                  <Box sx={{ minHeight: '1rem' }}></Box>
                  {adminRouteList2.map((route) => {
                    const icon = theme.icons.find(
                      (icon) => icon.route === route.eventKey
                    );
                    return (
                      <Box
                        sx={[
                          menuButtonStyle({ ...theme }),
                          {
                            borderColor:
                              icon.route === currentHref
                                ? theme.colors.button.primary.default
                                : theme.colors.outline.surface
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
                                color: theme.colors.button.primary.default
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
                            menuTextStyle({ ...theme }),
                            icon.route === currentHref
                              ? selectedTextStyle({ ...theme })
                              : {}
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
                    backgroundColor: theme.colors.surface.high,
                    position: 'absolute',
                    top: 0,
                    right: '-145px',
                    zIndex: 1200,
                    borderRight: `1px solid ${theme.colors.outline.surface}`
                  }}
                >
                  <Box sx={{ minHeight: '1rem' }}></Box>
                  {adminRouteList3.map((route) => {
                    const icon = theme.icons.find(
                      (icon) => icon.route === route.eventKey
                    );
                    return (
                      <Box
                        sx={[
                          menuButtonStyle({ ...theme }),
                          {
                            borderColor:
                              icon.route === currentHref
                                ? theme.colors.button.primary.default
                                : theme.colors.outline.surface
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
                                color: theme.colors.button.primary.default
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
                            menuTextStyle({ ...theme }),
                            icon.route === currentHref
                              ? selectedTextStyle({ ...theme })
                              : {}
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
              const icon = theme.icons.find(
                (icon) => icon.route === route.eventKey
              );
              return (
                <Box
                  sx={[
                    menuButtonStyle({ ...theme }),
                    {
                      borderColor:
                        icon.route === currentHref
                          ? theme.colors.button.primary.default
                          : theme.colors.outline.surface
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
                          color: theme.colors.button.primary.default
                        }}
                        src={
                          icon.route === currentHref ? icon.selected : icon.icon
                        }
                        alt={route.title}
                      />
                    </IconButton>
                  )}
                  <Typography
                    className={
                      theme.name === 'vltheme' && route.vltitle
                        ? css.vltitle
                        : ''
                    }
                    sx={[
                      theme.name === 'vltheme' && route.vltitle
                        ? vlMenuTextStyle({ ...theme })
                        : menuTextStyle({ ...theme }),
                      icon.route === currentHref
                        ? selectedTextStyle({ ...theme })
                        : {}
                    ]}
                  >
                    {theme.name === 'vltheme' && route.vltitle
                      ? route.vltitle
                      : route.title}
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
                    <Typography sx={menuTextStyle({ ...theme })}>
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
                      <Typography sx={menuTextStyle({ ...theme })}>
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
                      <Typography sx={menuTextStyle({ ...theme })}>
                        {parkingData.address}
                      </Typography>
                    </Stack>
                  </>
                )}
                {username !== '' && (
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
                      <Typography sx={menuTextStyle({ ...theme })}>
                        {username}
                      </Typography>
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
                        sx={{ color: theme.colors.button.visited_link.default }}
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
