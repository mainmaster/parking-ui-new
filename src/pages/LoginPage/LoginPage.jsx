import { Box, Stack, Button, Typography, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import Layout from '../../components/Layout';
import { CarNumberInput, primaryButtonStyle } from '../../theme/styles';
import { useDispatch } from 'react-redux';
import { setParkingUserType } from '../../store/parkingInfo/parkingInfo';
import { useState } from 'react';
import { login } from '../../api/auth/login';
import { useSnackbar } from 'notistack';
import getParkingData from '../../api/auth/parking-data';
import Logo from '../../assets/svg/theme/login_logo.svg';
import VlLogo from '../../assets/svg/vltheme/login_logo.svg';

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
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();

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
            enqueueSnackbar('Неверный логин или пароль', {
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

  return (
    <Layout title="Вход">
      <Stack sx={{ width: '100%', height: '100%' }}>
        <Box
          sx={{
            width: '100%',
            height: '92px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.surface.low
          }}
        >
          <img
            style={{ height: '60px' }}
            src={theme.name === 'vltheme' ? VlLogo : Logo}
            alt="logo"
          />
        </Box>
        <Box
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
          <Typography sx={{ fontSize: '2.5rem', lineHeight: '2.875rem' }}>
            Вход
          </Typography>
          <Stack sx={{ width: '100%', maxWidth: '500px' }}>
            <InputLabel htmlFor="username" sx={labelStyle}>
              Логин
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
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
          <Stack sx={{ width: '100%', maxWidth: '500px' }}>
            <InputLabel htmlFor="password" sx={labelStyle}>
              Пароль
            </InputLabel>
            <CarNumberInput
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { paddingLeft: '12px' }
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
              primaryButtonStyle({ ...theme }),
              { width: '100%', maxWidth: '500px' }
            ]}
            type="submit"
          >
            Войти
          </Button>
        </Box>
      </Stack>
    </Layout>
  );
};

export default LoginPage;
