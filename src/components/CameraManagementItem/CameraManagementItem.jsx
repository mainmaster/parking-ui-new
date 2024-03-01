import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  styled
} from '@mui/material';
import React, { useState } from 'react';
import Camera from '../Camera/Camera';
import eventInIcon from '../../assets/svg/log_event_in_icon.svg';
import eventOutIcon from '../../assets/svg/log_event_out_icon.svg';
import { colors } from '../../theme/colors';
import {
  autoButtonStyle,
  closeButtonStyle,
  openButtonStyle,
  positiveButtonStyle
} from '../../theme/styles';
import {
  openApFetch,
  closeApFetch,
  normalApFetch
} from 'store/events/eventsSlice';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { postLedBoardMessage } from '../../api/access-points';
import { useSnackbar } from 'notistack';

const CameraMessageInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  backgroundColor: colors.surface.low,
  border: '1px solid ' + colors.outline.default,
  borderRadius: '20px',
  height: '40px',
  justifyContent: 'center',
  '& .MuiFilledInput-root': {
    backgroundColor: 'transparent',
    paddingRight: '12px',
    paddingLeft: '12px',
    '&:hover': { backgroundColor: 'transparent' }
  },
  '& .MuiFilledInput-input': {
    backgroundColor: colors.surface.low,
    alignSelf: 'center',
    padding: 0,
    color: 'black'
  }
}));

export default function CameraManagementItem({ camera, src }) {
  const [titlesLed, setTitlesLed] = useState({});
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: { line1: '' },
    onSubmit: (values) => {
      handleCreateLedMessage(values);
    }
  });

  const openAp = () => {
    dispatch(openApFetch(camera.id));
  };

  const closeAp = () => {
    const payload = {
      accessPointid: camera.id
    };
    dispatch(closeApFetch(payload));
  };

  const normalAp = () => {
    const payload = {
      accessPointid: camera.id
    };
    dispatch(normalApFetch(payload));
  };

  const handleCreateLedMessage = (values) => {
    console.log(values);
    postLedBoardMessage({
      ...titlesLed[`access_point${camera.id}`],
      id: camera.id
    }).then(() => {
      enqueueSnackbar('Табло изменено', {
        variant: 'success'
      });
    });
  };

  const handleSetTitles = (event) => {
    formik.handleChange(event);
    let newArr = { ...titlesLed };
    try {
      newArr[`access_point${camera.id}`].line1 = event.target.value;
      console.log(newArr);
      setTitlesLed(newArr);
    } catch (e) {
      newArr[`access_point${camera.id}`] = {
        line1: [`access_point${camera.id}`]?.line1 || '',
        line2: ''
      };
      newArr[`access_point${camera.id}`].line1 = event.target.value;
      setTitlesLed(newArr);
    }
  };

  return (
    <Box
      sx={{
        flex: '1 1 380px',
        minWidth: '380px',
        maxWidth: '776px',
        borderRadius: '8px',
        p: '16px',
        pb: 0
      }}
    >
      <Stack gap={'8px'}>
        <Camera id={camera.id} src={src} />
        <Stack direction={'row'} gap={'8px'}>
          <Stack
            sx={{
              py: '4px',
              px: '8px',
              borderRadius: '8px',
              border: `1px solid ${colors.outline.surface}`,
              flexGrow: 1,
              minWidth: '120px'
            }}
          >
            <Stack direction={'row'} gap={'8px'}>
              <img
                style={{
                  width: '18px'
                }}
                src={camera.direction === 'in' ? eventInIcon : eventOutIcon}
                alt={camera.description}
              />
              <Typography>{camera.description}</Typography>
            </Stack>
            <Stack direction={'row'} gap={'8px'} alignItems={'center'}>
              <Box
                sx={{
                  width: '10px',
                  height: '10px',
                  ml: '10px',
                  borderRadius: '100%',
                  backgroundColor:
                    camera.status === 'open'
                      ? colors.mode.open.element
                      : camera.status === 'working_mode'
                      ? colors.mode.auto.element
                      : colors.mode.close.element
                }}
              ></Box>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  lineHeight: '0.875rem',
                  color:
                    camera.status === 'open'
                      ? colors.mode.open.element
                      : camera.status === 'working_mode'
                      ? colors.mode.auto.element
                      : colors.mode.close.element
                }}
              >
                {camera.status === 'open'
                  ? 'Открыт'
                  : camera.status === 'working_mode'
                  ? 'Авто-режим'
                  : 'Закрыт'}
              </Typography>
            </Stack>
          </Stack>
          <Button
            disableRipple
            variant="contained"
            fullWidth={false}
            sx={openButtonStyle}
            onClick={openAp}
          >
            Открыть
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth={false}
            sx={[positiveButtonStyle, { flexGrow: 1 }]}
          >
            Ввести номер
          </Button>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disableRipple
            variant="contained"
            fullWidth={false}
            sx={closeButtonStyle}
            onClick={closeAp}
          >
            Закрыть
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth={false}
            sx={[autoButtonStyle, { minWidth: '122.5px' }]}
            onClick={normalAp}
          >
            Авто-режим
          </Button>
          <Box
            maxWidth="sm"
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={formik.handleSubmit}
            sx={{ flexGrow: 2 }}
          >
            <CameraMessageInput
              autoFocus
              fullWidth
              InputProps={{
                disableUnderline: true
              }}
              variant="filled"
              id="line1"
              name="line1"
              placeholder="Написать"
              value={formik.values.line1}
              onChange={handleSetTitles}
              onBlur={formik.handleBlur}
              error={formik.touched.line1 && Boolean(formik.errors.line1)}
            />
          </Box>
        </Stack>
        <Box
          sx={{
            width: '100%',
            height: '1px',
            backgroundColor: colors.outline.separator
          }}
        />
      </Stack>
    </Box>
  );
}
