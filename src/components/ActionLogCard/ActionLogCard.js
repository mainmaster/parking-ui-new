import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { cardContainerStyle, secondaryButtonStyle } from '../../theme/styles';
import hideIcon from '../../assets/svg/hide_info_action_log_card.svg';
import moreInfo from '../../assets/svg/more_info_action_log_card.svg';
import { getActionLog } from '../../api/action-logs.api';
import * as moment from 'moment'
const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  wordBreak: 'break-word'
};

const entities = {
  access_point: 'Точка доступа',
  black_list: 'Черный список',
  camera: 'Камера',
  car_park: 'Автопарк',
  laurent: 'Контроллер',
  led_board: 'LED табло',
  report: 'Отчет',
  request: 'Заявка',
  settings: 'Настройки',
  terminal: 'Терминал',
  working_mode: 'Режим',
  operator: 'Оператор',
  renter: 'Арендатор'
};

const engEntities = {
  access_point: 'Access point',
  black_list: 'Black list',
  camera: 'Camera',
  car_park: 'Car park',
  laurent: 'Laurent',
  led_board: 'LED board',
  report: 'Report',
  request: 'Request',
  settings: 'Settings',
  terminal: 'Terminal',
  working_mode: 'Working mode',
  operator: 'Operator',
  renter: 'Renter'
}

const actions = {
  create: 'Создание',
  update: 'Обновление',
  delete: 'Удаление'
}

const engActions = {
  create: 'Create',
  update: 'Update',
  delete: 'Delete'
}

const ActionLogCard = ({ actionLog }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [height, setHeight] = useState(0);
  const [active, setActive] = useState(false);
  const accordionContentRef = useRef(null);
  const [log, setLog] = useState(null);
  const [loader, setLoader] = useState(false);

  const labelTextStyle = useMemo(() => {
    return {
      minWidth: '88px',
      maxWidth: '88px',
      color: theme.colors.element.secondary
    };
  }, [theme]);

  useEffect(() => {
    if (!active || log) {
      return;
    }

    setLoader(true);
    getActionLog(actionLog.id).then((res) => {
      setLoader(false);
      setLog(res.data);
    });
  }, [active]);

  useEffect(() => {
    if (!active || !log) {
      return;
    }
    setHeight(accordionContentRef.current.scrollHeight);
  }, [log])

  const toggleAccordion = () => {
    setActive(!active);
    setHeight(active || !log ? 0 : accordionContentRef.current.scrollHeight);
  };

  return (
    <Box
      sx={[cardContainerStyle({ ...theme }), isMobile && { minWidth: '320px' }]}
    >
      <Stack gap={'16px'}>
        <Stack direction="row" justifyContent={'space-between'}>
          <Typography sx={titleTextStyle}>{actionLog.username}</Typography>
          <Typography
            sx={{
              fontWeight: 500,
              color: theme.colors.element.secondary,
              fontSize: '1.5rem',
              lineHeight: '1.75rem'
            }}
          >
            № {actionLog.id}
          </Typography>
        </Stack>
        <Stack gap={'12px'}>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>
              {t('components.actionLogCard.action')}
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>{i18n.language === 'ru' ? actions[actionLog.action] : engActions[actionLog.action]}</Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>
              {t('components.actionLogCard.section')}
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              {i18n.language === 'ru' ? entities[actionLog.entry] : engEntities[actionLog.entry]}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>
              {t('components.actionLogCard.date')}
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>{moment(actionLog.create_datetime).format('DD.MM.YYYY HH:mm:ss')}</Typography>
          </Stack>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            onClick={toggleAccordion}
            disabled={loader}
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            endIcon={<img src={active ? hideIcon : moreInfo} alt={''} />}
          >
            {t('components.actionLogCard.more')}
          </Button>
        </Stack>
        <Stack
          display="flex"
          flexDirection="column"
          gap="12px"
          sx={{
            maxHeight: height,
            overflow: 'hidden',
            transition: 'max-height .6s ease'
          }}
          ref={accordionContentRef}
        >
          <Stack direction={'row'} gap={'12px'}>
            <Typography sx={labelTextStyle}>
              {t('components.actionLogCard.entity')}
            </Typography>
            <Typography sx={{ fontWeight: 500 }}> {actionLog.id} </Typography>
          </Stack>
          <Stack direction="column" gap={'8px'}>
            <Typography sx={labelTextStyle}>
              {t('components.actionLogCard.before')}
            </Typography>
            <Stack
              direction={'row'}
              gap={'10px'}
              justifyContent={'space-between'}
              sx={{
                width: '100%',
                maxWidth: '720px',
                backgroundColor: theme.colors.surface.high,
                borderRadius: '8px',
                border: `1px solid ${theme.colors.outline.surface}`,
                p: '16px'
              }}
            >
              {JSON.stringify(log?.before, null, 2)}
            </Stack>
          </Stack>
          <Stack direction="column" gap={'8px'}>
            <Typography sx={labelTextStyle}>
              {t('components.actionLogCard.after')}
            </Typography>
            <Stack
              direction={'row'}
              gap={'10px'}
              justifyContent={'space-between'}
              sx={{
                width: '100%',
                maxWidth: '720px',
                backgroundColor: theme.colors.surface.high,
                borderRadius: '8px',
                border: `1px solid ${theme.colors.outline.surface}`,
                p: '16px'
              }}
            >
              {JSON.stringify(log?.after, null, 2)}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ActionLogCard;
