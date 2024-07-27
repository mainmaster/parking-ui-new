import {Box, Stack, Button, Typography, InputLabel, FormGroup, Select, IconButton, MenuItem} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import Layout from '../../components/Layout';
import {CarNumberInput, primaryButtonStyle, selectMenuStyle} from '../../theme/styles';
import { useDispatch } from 'react-redux';
import { setParkingUserType } from '../../store/parkingInfo/parkingInfo';
import {useEffect, useRef, useState} from 'react';
import { login } from '../../api/auth/login';
import { useSnackbar } from 'notistack';
import getParkingData from '../../api/auth/parking-data';
import Logo from '../../assets/svg/theme/login_logo.svg';
import VlLogo from '../../assets/svg/vltheme/login_logo.svg';
import {useTranslation} from "react-i18next";
import selectIcon from "../../assets/svg/car_filter_select_icon.svg";
import style from './login-page.module.scss';
import useMediaQuery from "@mui/material/useMediaQuery";

const labelStyle = {
  pb: '4px',
  pl: '12px',
  lineHeight: '1.125rem'
};

const defaultValues = {
  username: '',
  password: ''
};

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const desktopTranslateRef = useRef();
  const desktopBlockRef = useRef();
  const tabletTranslateRef = useRef();
  const tabletBlockRef = useRef();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const formik = useFormik({
    initialValues: defaultValues,
    onSubmit: (values) => {
      const { username, password } = values;
      if (username && password) {
        login({ username, password })
          .then((res) => {
            getParkingData().then((res) => {
              const data = res.data;
              dispatch(setParkingUserType(data.userType));
              if (data.userType === 'operator') {
                localStorage.setItem('notificationsSound', 'true');
              }
            });
            document.location.href = '/';
          })
          .catch(() => {
            enqueueSnackbar(t('pages.loginPage.incorrectLogin'), {
              variant: 'error',
              iconVariant: 'warning'
            });
          });
      }
    }
  });

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
    formik.handleChange(event);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    formik.handleChange(event);
  };

  useEffect(() => {
    if (!desktopTranslateRef.current || !desktopBlockRef.current) {
      return;
    }

    desktopBlockRef.current.style.width = `${desktopTranslateRef.current.offsetWidth}px`;
  }, [desktopTranslateRef.current, desktopBlockRef.current, isTablet]);

  useEffect(() => {
    if (!tabletTranslateRef.current || !tabletBlockRef.current) {
      return;
    }

    tabletBlockRef.current.style.height = `${tabletTranslateRef.current.offsetHeight}px`;
  }, [tabletBlockRef.current, tabletTranslateRef.current, isTablet]);

  return (
    <Layout title="Вход">
      <Stack sx={{ width: '100%', height: '100%' }}>
        <Box
          className={style.header}
          sx={{
            width: '100%',
            height: '92px',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 40px',
            alignItems: 'center',
            backgroundColor: theme.colors.surface.low
          }}
        >
          <div className={style.desktopTranslate} ref={desktopBlockRef}></div>
          <img
            style={{ height: '60px' }}
            src={theme.name === 'vltheme' ? VlLogo : Logo}
            alt="logo"
          />
          <Stack className={style.desktopTranslate} ref={desktopTranslateRef} gap={'16px'} sx={{padding: '12px 0'}}>
            <Typography>Language / Язык</Typography>
            <FormGroup>
              <Select
                id="language"
                name="language"
                displayEmpty
                value={
                  i18n.language
                }
                onChange={(event) => {
                  localStorage.setItem('language', event.target.value);
                  i18n.changeLanguage(event.target.value);
                }}
                variant="filled"
                IconComponent={(props) => (
                  <IconButton
                    disableRipple
                    {...props}
                    sx={{
                      top: `${0} !important`,
                      right: `4px !important`
                    }}
                  >
                    <img
                      style={{
                        width: '24px'
                      }}
                      src={selectIcon}
                      alt="select"
                    />
                  </IconButton>
                )}
                sx={selectMenuStyle({ ...theme })}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: '8px',
                      border:
                        '1px solid ' +
                        theme.colors.outline.default
                    }
                  },
                  MenuListProps: {
                    sx: { py: '4px' }
                  }
                }}
                renderValue={(selected) => (
                  <Typography
                    component={'h5'}
                    noWrap
                    sx={{ fontWeight: 500 }}
                  >
                    {selected === 'en'
                      ? `🇬🇧${t('pages.settings.english')}`
                      : `🇷🇺${t('pages.settings.russian')}`}
                  </Typography>
                )}
              >
                <MenuItem
                  id="Английский"
                  selected={
                    i18n.language === 'en'
                  }
                  value={'en'}
                >
                  <Typography
                    component={'h5'}
                    noWrap
                    sx={{ fontWeight: 500, p: 0 }}
                  >
                    🇬🇧{t('pages.settings.english')}
                  </Typography>
                </MenuItem>
                <MenuItem
                  id="Русский"
                  value={'ru'}
                  selected={
                    i18n.language === 'ru'
                  }
                >
                  <Typography
                    component={'h5'}
                    noWrap
                    sx={{ fontWeight: 500, p: 0 }}
                  >
                    🇷🇺{t('pages.settings.russian')}
                  </Typography>
                </MenuItem>
              </Select>
            </FormGroup>
          </Stack>
        </Box>
        <Box
          className={style.form}
          component={'form'}
          noValidate
          onSubmit={formik.handleSubmit}
          sx={{
            width: '100%',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            p: '16px'
          }}
        >
          <Stack className={style.tabletTranslate} ref={tabletTranslateRef} gap={'16px'} sx={{padding: '12px 0'}}>
            <Typography>Language / Язык</Typography>
            <FormGroup>
              <Select
                id="language"
                name="language"
                displayEmpty
                value={
                  i18n.language
                }
                onChange={(event) => {
                  localStorage.setItem('language', event.target.value);
                  i18n.changeLanguage(event.target.value);
                }}
                variant="filled"
                IconComponent={(props) => (
                  <IconButton
                    disableRipple
                    {...props}
                    sx={{
                      top: `${0} !important`,
                      right: `4px !important`
                    }}
                  >
                    <img
                      style={{
                        width: '24px'
                      }}
                      src={selectIcon}
                      alt="select"
                    />
                  </IconButton>
                )}
                sx={selectMenuStyle({...theme})}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: '8px',
                      border:
                        '1px solid ' +
                        theme.colors.outline.default
                    }
                  },
                  MenuListProps: {
                    sx: {py: '4px'}
                  }
                }}
                renderValue={(selected) => (
                  <Typography
                    component={'h5'}
                    noWrap
                    sx={{fontWeight: 500}}
                  >
                    {selected === 'en'
                      ? `🇬🇧${t('pages.settings.english')}`
                      : `🇷🇺${t('pages.settings.russian')}`}
                  </Typography>
                )}
              >
                <MenuItem
                  id="Английский"
                  selected={
                    i18n.language === 'en'
                  }
                  value={'en'}
                >
                  <Typography
                    component={'h5'}
                    noWrap
                    sx={{fontWeight: 500, p: 0}}
                  >
                    🇬🇧{t('pages.settings.english')}
                  </Typography>
                </MenuItem>
                <MenuItem
                  id="Русский"
                  value={'ru'}
                  selected={
                    i18n.language === 'ru'
                  }
                >
                  <Typography
                    component={'h5'}
                    noWrap
                    sx={{fontWeight: 500, p: 0}}
                  >
                    🇷🇺{t('pages.settings.russian')}
                  </Typography>
                </MenuItem>
              </Select>
            </FormGroup>
          </Stack>
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 40px',
            alignItems: 'center',
            gap: 16
          }}>
            <Typography sx={{fontSize: '2.5rem', lineHeight: '2.875rem'}}>
              {t('pages.loginPage.enter')}
            </Typography>
            <Stack sx={{width: '100%', maxWidth: '500px'}}>
              <InputLabel htmlFor="username" sx={labelStyle}>
                {t('pages.loginPage.login')}
              </InputLabel>
              <CarNumberInput
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  sx: {paddingLeft: '12px'}
                }}
                variant="filled"
                id="username"
                name="username"
                placeholder="username"
                value={username}
                onChange={handleUserNameChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
              />
            </Stack>
            <Stack sx={{width: '100%', maxWidth: '500px'}}>
              <InputLabel htmlFor="password" sx={labelStyle}>
                {t('pages.loginPage.password')}
              </InputLabel>
              <CarNumberInput
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  sx: {paddingLeft: '12px'}
                }}
                variant="filled"
                id="password"
                name="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
              />
            </Stack>
            <Button
              disableRipple
              variant="filled"
              sx={[
                primaryButtonStyle({...theme}),
                {width: '100%', maxWidth: '500px'}
              ]}
              type="submit"
            >
              {t('pages.loginPage.in')}
            </Button>
          </div>
          <div className={style.tabletTranslate} ref={tabletBlockRef}></div>
        </Box>
      </Stack>
    </Layout>
  );
};

export default LoginPage;
