import InputMask from 'react-input-mask';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import { useEffect, useState, useRef } from 'react';
import { useBlocker, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  getPersonalInfoPolicy,
  setPersonalInfoPolicy
} from 'api/settings/personalInfoPolicy';
import {
  getPaymentsPageImage,
  setPaymentsPageImage
} from 'api/settings/paymentsPageImage';
import { getReturnPolicy, setReturnPolicy } from 'api/settings/returnPolicy';
import {
  useGlobalSettingsQuery,
  useParkingInfoQuery,
  usePutParkingInfoMutation
} from 'api/settings/settings';
import { useEditGlobalSettingsMutation } from 'api/settings/settings';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  AppBar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Stack,
  Typography,
  Button,
  Tabs,
  Tab,
  FormGroup,
  FormControlLabel,
  Switch,
  InputLabel,
  Select,
  IconButton,
  MenuItem,
  Input
} from '@mui/material';
import { colors } from '../../theme/colors';
import {
  listWithScrollStyle,
  closeButtonStyle,
  CarNumberInput,
  switchInputStyle,
  selectMenuStyle,
  secondaryButtonStyle
} from '../../theme/styles';
import SettingsSpacer from './SettingsSpacer';
import FooterSpacer from '../../components/Header/FooterSpacer';
import EventManager from '../../components/EventManager/EventManager';
import SettingsConfirmDialog from '../../components/SettingsConfirmDialog/SettingsConfirmDialog';
import { ExpandIcon } from '../../components/Icons/ExpandIcon';
import selectIcon from '../../assets/svg/car_filter_select_icon.svg';
import eventInIcon from '../../assets/svg/log_event_in_icon.svg';
import eventOutIcon from '../../assets/svg/log_event_out_icon.svg';
import uploadIcon from '../../assets/svg/settings_upload_icon.svg';

const titleTextStyle = {
  margin: 0,
  py: 0,
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

const tabStyle = {
  minHeight: '42px',
  textTransform: 'none',
  fontSize: '1rem',
  lineHeight: '1.125rem',
  fontWeight: 500,
  '&.Mui-selected': {
    color: colors.button.primary.default
  }
};

const labelStyle = {
  pb: '4px',
  pl: '12px',
  whiteSpace: 'wrap'
};

const sectionContainerStyle = {
  width: '100%',
  maxWidth: '1200px',
  my: 0,
  p: '16px 28px',
  border: '1px solid ' + colors.outline.separator,
  borderTop: 'none',
  borderLeft: 'none'
};

const accordionContainerStyle = {
  width: '100%',
  maxWidth: '1200px',
  my: 0,
  p: '16px',
  boxShadow: 'none',
  border: '1px solid ' + colors.outline.separator,
  borderTop: 'none',
  borderLeft: 'none'
};

const accordionTitleStyle = {
  minHeight: '28px',
  p: '0 12px',
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap'
};

const uploadButtonStyle = {
  height: '40px',
  minWidth: '147px',
  py: '8px',
  px: '12px',
  textTransform: 'none',
  fontSize: '1rem',
  backgroundColor: `${colors.surface.high} !important`,
  border: `1px solid ${colors.outline.separator}`,
  borderRadius: 0,
  borderTopLeftRadius: '8px',
  borderBottomLeftRadius: '8px',
  color: colors.element.primary,
  boxShadow: 'none',
  whiteSpace: 'nowrap'
};

const uploadInfoStyle = {
  width: '100%',
  height: '40px',
  border: `1px solid ${colors.outline.separator}`,
  borderLeft: 'none',
  borderTopRightRadius: '8px',
  borderBottomRightRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  px: '16px'
};

const downloadInfoStyle = {
  px: '12px',
  textDecoration: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'none',
    backgroundColor: colors.surface.hover
  }
};

const yookassaTaxSystemCodeValues = [
  { value: 1, name: 'Общая, ОСН' },
  { value: 2, name: 'Упрощенная доход,УСН доход' },
  { value: 3, name: 'Упрощенная доход минус расход, УСН доход - расход' },
  { value: 4, name: 'Единый налог на вмененный доход, ЕНВД' },
  { value: 5, name: 'Единый сельскохозяйственный налог, ЕСН' },
  { value: 6, name: 'Патентная система налогообложения, Патент' }
];

const yookassaVatCodeValues = [
  { value: 1, name: 'Без НДС' },
  { value: 2, name: 'НДС по ставке 0%' },
  { value: 3, name: 'НДС по ставке 10%' },
  { value: 4, name: 'НДС чека по ставке 20%' },
  { value: 5, name: 'НДС чека по расчетной ставке 10/110' },
  { value: 6, name: 'НДС чека по расчетной ставке 20/120' }
];

const aqsiTaxSystemCodeValues = [
  { value: 1, name: 'Общая, ОСН' },
  { value: 2, name: 'Упрощенная доход,УСН доход' },
  { value: 4, name: 'Упрощенная доход минус расход, УСН доход - расход' },
  { value: 8, name: 'Единый налог на вмененный доход, ЕНВД' },
  { value: 16, name: 'Единый сельскохозяйственный налог, ЕСН' },
  { value: 32, name: 'Патентная система налогообложения, Патент' }
];

const aqsiVatCodeValues = [
  { value: 1, name: '20%' },
  { value: 2, name: '10%' },
  { value: 3, name: 'Ставка расч. 20/120' },
  { value: 4, name: 'Ставка расч. 10/110' },
  { value: 5, name: '0%' },
  { value: 6, name: 'Без НДС' }
];

const Settings = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [personalInfoFile, setPersonalInfoFile] = useState(null);
  const [returnPolicyFile, setReturnPolicyFile] = useState(null);
  const [paymentsPageImageFile, setPaymentsPageImageFile] = useState(null);
  const { data, isLoading: loadingGlobal } = useGlobalSettingsQuery();
  const { data: parkingInfo } = useParkingInfoQuery();
  const [editParkingInfoQuery] = usePutParkingInfoMutation();
  const [editGlobal] = useEditGlobalSettingsMutation();
  const [editParkingInfo, setEditParkingInfo] = useState(parkingInfo);
  const [notificationsSound, setNotificationsSound] = useState(
    localStorage.getItem('notificationsSound')
  );
  const [currentTab, setCurrentTab] = useState(0);
  const [changingTab, setChangingTab] = useState(null);
  const [settingsScrolled, setSettingsScrolled] = useState(false);
  const [submited, setSubmited] = useState(true);
  const settingsRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [globalSettings, setGlobalSettings] = useState({
    company_info: '',
    company_name: '',
    count_free_places: 0,
    print_count_free_places: false,
    operator_phone_number: '',
    yookassa_api_key: '',
    yookassa_shop_id: '',
    yookassa_tax_system_code: 1,
    yookassa_vat_code: 4,
    aqsi_tax_system_code: 1,
    aqsi_vat_code: 1,
    email_for_unclaimed_checks: '',
    email_for_online_payment: true,
    week_subscription_price: '',
    month_subscription_price: '',
    quarter_subscription_price: '',
    year_subscription_price: '',
    support_subscribe: false,
    vision_labs_support: false,
    vision_labs_address: '',
    free_access_emergency: false,
    car_score_vl_recognition: 0,
    plate_score_vl_recognition: 0,
    regno_score_vl_recognition: 0,
    emergency_car_score_vl_recognition: 0,
    car_brand_model_score_vl_recognition: 0,
    country_score_vl_recognition: 0,
    min_width_car_vl_recognition: 0,
    min_height_car_vl_recognition: 0,
    min_width_plate_vl_recognition: 0,
    min_height_plate_vl_recognition: 0,
    number_of_bad_recognizations_for_additional_logic: 0,
    min_symbols_count_for_match: 0,
    additional_confirmation_car_by_brand_and_model: false,
    mins_to_leave_parking: 0,
    delay_before_checking_confirmation_events: 0,
    relay_closing_time: 0,
    entry_on_request_only: false,
    release_all_sessions_not_found_without_payment: false,
    release_all_sessions_not_found_with_payment_amount: 0,
    let_the_car_in_with_opened_session: false,
    save_events_with_not_recognized_plate: false,
    seconds_before_close_laurent: 0,
    seconds_between_laurent_checks: 0,
    terminal_payment_ttl: 60,
    terminal_payment_refund_type: 1
  });
  const [changedSettings, setChangedSettings] = useState({});
  let location = useLocation();

  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !submited && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (
      (blocker.state === 'blocked' && submited) ||
      location.pathname !== '/settings'
    ) {
      blocker.reset();
    }
  }, [blocker, submited]);

  const handleConfirmedNewLocation = () => {
    if (changingTab !== null) {
      setCurrentTab(changingTab);
      setChangingTab(null);
      setChangedSettings({});
      setSubmited(true);
    } else {
      blocker.proceed();
    }
  };

  const handleCancelNewLocation = () => {
    if (changingTab !== null) {
      setChangingTab(null);
    } else {
      blocker.reset();
    }
  };

  useEffect(() => {
    if (data && submited) {
      setGlobalSettings(data);
      setEditParkingInfo(parkingInfo);
    }
  }, [data, parkingInfo, submited]);

  const handleSettingsScroll = () => {
    if (settingsRef.current) {
      const { scrollTop } = settingsRef.current;
      if (scrollTop > 0) {
        setSettingsScrolled(true);
      } else if (settingsScrolled) {
        setSettingsScrolled(false);
      }
    }
  };

  const handleChangeTab = (event, value) => {
    if (value !== undefined) {
      if (!submited) {
        setChangingTab(value);
      } else {
        setCurrentTab(value);
      }
    }
  };

  const handleGlobalSettings = (e) => {
    console.log(e.target.value);
    if (e.target.type === 'checkbox') {
      setGlobalSettings({
        ...globalSettings,
        [e.target.name]: Boolean(e.target.checked)
      });
      setChangedSettings({
        ...changedSettings,
        [e.target.name]: Boolean(e.target.checked)
      });
    } else {
      setGlobalSettings({ ...globalSettings, [e.target.name]: e.target.value });
      setChangedSettings({
        ...changedSettings,
        [e.target.name]: e.target.value
      });
    }
    setSubmited(false);
  };

  const handleGlobalInLine1 = (e) => {
    setGlobalSettings({
      ...globalSettings,
      led_board_message_texts: {
        in: {
          ...globalSettings.led_board_message_texts.in,
          [e.target.name]: {
            line1: e.target.value,
            line2:
              globalSettings.led_board_message_texts.in[e.target.name].line2 ||
              ''
          }
        },
        out: {
          ...globalSettings.led_board_message_texts.out
        }
      }
    });
    setChangedSettings({
      ...changedSettings,
      led_board_message_texts: {
        in: {
          ...(changedSettings.led_board_message_texts?.in || {}),
          [e.target.name]: {
            line1: e.target.value,
            line2:
              globalSettings.led_board_message_texts.in[e.target.name].line2 ||
              ''
          }
        },
        out: {
          ...(changedSettings.led_board_message_texts?.out || {})
        }
      }
    });
    setSubmited(false);
  };

  const handleGlobalInLine2 = (e) => {
    setGlobalSettings({
      ...globalSettings,
      led_board_message_texts: {
        in: {
          ...globalSettings.led_board_message_texts.in,
          [e.target.name]: {
            line1:
              globalSettings.led_board_message_texts.in[e.target.name].line1 ||
              '',
            line2: e.target.value
          }
        },
        out: {
          ...globalSettings.led_board_message_texts.out
        }
      }
    });
    setChangedSettings({
      ...changedSettings,
      led_board_message_texts: {
        in: {
          ...(changedSettings.led_board_message_texts?.in || {}),
          [e.target.name]: {
            line1:
              globalSettings.led_board_message_texts.in[e.target.name].line1 ||
              '',
            line2: e.target.value
          }
        },
        out: {
          ...(changedSettings.led_board_message_texts?.out || {})
        }
      }
    });
    setSubmited(false);
  };

  const handleGlobalOutLine1 = (e) => {
    setGlobalSettings({
      ...globalSettings,
      led_board_message_texts: {
        in: {
          ...globalSettings.led_board_message_texts.in
        },
        out: {
          ...globalSettings.led_board_message_texts.out,
          [e.target.name]: {
            line1: e.target.value,
            line2:
              globalSettings.led_board_message_texts.out[e.target.name].line2 ||
              ''
          }
        }
      }
    });
    setChangedSettings({
      ...changedSettings,
      led_board_message_texts: {
        in: {
          ...(changedSettings.led_board_message_texts?.in || {})
        },
        out: {
          ...(changedSettings.led_board_message_texts?.out || {}),
          [e.target.name]: {
            line1: e.target.value,
            line2:
              globalSettings.led_board_message_texts.out[e.target.name].line2 ||
              ''
          }
        }
      }
    });
    setSubmited(false);
  };

  const handleGlobalOutLine2 = (e) => {
    setGlobalSettings({
      ...globalSettings,
      led_board_message_texts: {
        in: {
          ...globalSettings.led_board_message_texts.in
        },
        out: {
          ...globalSettings.led_board_message_texts.out,
          [e.target.name]: {
            line1:
              globalSettings.led_board_message_texts.out[e.target.name].line1 ||
              '',
            line2: e.target.value
          }
        }
      }
    });
    setChangedSettings({
      ...changedSettings,
      led_board_message_texts: {
        in: {
          ...(changedSettings.led_board_message_texts?.in || {})
        },
        out: {
          ...(changedSettings.led_board_message_texts?.out || {}),
          [e.target.name]: {
            line1:
              globalSettings.led_board_message_texts.out[e.target.name].line1 ||
              '',
            line2: e.target.value
          }
        }
      }
    });
    setSubmited(false);
  };

  const handlePaymentsPageImage = (e) => {
    setPaymentsPageImageFile(e.target.files[0]);
  };
  const handleParkingInfo = (e) => {
    setEditParkingInfo({ ...editParkingInfo, [e.target.name]: e.target.value });
    setSubmited(false);
  };

  const handlePersonalInfoPolicyClick = () => {
    getPersonalInfoPolicy(parkingInfo.parkingID).then((res) => {
      // Create blob link to download
      const url = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PersonalInfoPolicy.pdf`);
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    });
  };

  const handleReturnPolicyClick = () => {
    getReturnPolicy(parkingInfo.parkingID).then((res) => {
      // Create blob link to download
      const url = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ReturnPolicy.pdf`);
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    });
  };

  const handlePaymentsPageImageClick = () => {
    getPaymentsPageImage(parkingInfo.parkingID).then((res) => {
      // Create blob link to download
      const url = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PaymentsPageImage.png`);
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    });
  };

  const editPersonalInfoPolicySubmit = (e) => {
    setPersonalInfoFile(e.target.files[0]);
    let formData = new FormData();
    formData.append('file', e.target.files[0]);
    setPersonalInfoPolicy(formData).then(() =>
      enqueueSnackbar('Файл успешно загружен', { variant: 'success' })
    );
  };

  const editParkingInfoSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    let result = await editParkingInfoQuery(editParkingInfo);
    if (result.error) {
      enqueueSnackbar(result.error, { variant: 'error' });
    } else {
      enqueueSnackbar('Данные успешно измененны', { variant: 'success' });
      setSubmited(true);
    }
  };

  const editReturnPolicySubmit = (e) => {
    setReturnPolicyFile(e.target.files[0]);
    let formData = new FormData();
    formData.append('file', e.target.files[0]);
    setReturnPolicy(formData).then(() =>
      enqueueSnackbar('Файл успешно загружен', { variant: 'success' })
    );
  };

  const editPaymentsPageImageSubmit = (e) => {
    setPaymentsPageImageFile(e.target.files[0]);
    let formData = new FormData();
    formData.append('file', e.target.files[0]);
    setPaymentsPageImage(formData).then(() =>
      enqueueSnackbar('Файл успешно загружен', { variant: 'success' })
    );
  };

  const editGlobalSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem('notificationsSound', notificationsSound);
    let result = await editGlobal(changedSettings);
    if (result.error) {
      enqueueSnackbar(result.error, { variant: 'error' });
    } else {
      enqueueSnackbar('Данные успешно измененны', { variant: 'success' });
      setSubmited(true);
    }
  };

  const editGlobalOperatorSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    localStorage.setItem('notificationsSound', notificationsSound);

    enqueueSnackbar('Данные успешно измененны', { variant: 'success' });
    setSubmited(true);
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={
          parkingInfo.userType === 'operator'
            ? editGlobalOperatorSubmit
            : currentTab === 0
            ? editGlobalSubmit
            : editParkingInfoSubmit
        }
        sx={{ width: '100%', minWidth: '320px' }}
      >
        <AppBar
          sx={{
            width: isMobile ? '100%' : 'calc(100% - 72px)',
            position: 'absolute',
            top: 0,
            left: isMobile ? 0 : '72px',
            backgroundColor: colors.surface.low,
            boxShadow: !settingsScrolled && 'none',
            zIndex: 10,
            borderBottom: `1px solid ${colors.outline.separator}`
          }}
        >
          <Stack
            direction={'row'}
            gap={'16px'}
            justifyContent={'space-between'}
            sx={{
              height: '64px',
              width: '100%',
              p: '16px',
              pb: '8px'
            }}
          >
            <Typography sx={titleTextStyle}>Настройки</Typography>
            <Stack
              direction={'row'}
              justifyContent={'flex-end'}
              sx={{ width: '100%' }}
            >
              <Button
                disableRipple
                disabled={submited}
                variant="contained"
                fullWidth={false}
                sx={closeButtonStyle}
                type="submit"
              >
                Сохранить
              </Button>
            </Stack>
          </Stack>
          {parkingInfo.userType === 'admin' && (
            <Stack direction={'row'}>
              <Tabs
                value={currentTab}
                onChange={handleChangeTab}
                variant="scrollable"
                scrollButtons={false}
                TabIndicatorProps={{
                  sx: {
                    backgroundColor: colors.button.primary.default
                  }
                }}
                sx={{ minHeight: '42px' }}
              >
                <Tab sx={tabStyle} disableRipple label="Основные" />
                <Tab sx={tabStyle} disableRipple label="О парковке" />
              </Tabs>
            </Stack>
          )}
        </AppBar>
        <Stack
          ref={settingsRef}
          sx={[
            listWithScrollStyle,
            {
              width: '100%',
              backgroundColor: colors.surface.low
            }
          ]}
          onScroll={handleSettingsScroll}
        >
          <EventManager />
          <SettingsSpacer tabs={parkingInfo.userType === 'admin'} />

          {loadingGlobal ? (
            <Stack
              justifyContent={'center'}
              alignItems={'center'}
              height={'100%'}
            >
              <SpinerLogo />
            </Stack>
          ) : (
            <>
              {currentTab === 0 && (
                <>
                  {parkingInfo.userType === 'admin' && (
                    <>
                      <Accordion disableGutters sx={accordionContainerStyle}>
                        <AccordionSummary
                          expandIcon={<ExpandIcon />}
                          sx={accordionTitleStyle}
                        >
                          Общее
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack sx={{ pt: '16px', gap: '16px' }}>
                            <Stack>
                              <InputLabel
                                htmlFor="company_name"
                                sx={labelStyle}
                              >
                                Имя компании
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="company_name"
                                name="company_name"
                                value={globalSettings.company_name}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="company_info"
                                sx={labelStyle}
                              >
                                Описание
                              </InputLabel>
                              <CarNumberInput
                                sx={{ height: '72px', overflow: 'hidden' }}
                                multiline
                                maxRows={3}
                                fullWidth
                                InputProps={{
                                  disableUnderline: true,
                                  sx: { padding: '8px 12px' }
                                }}
                                variant="filled"
                                id="company_info"
                                name="company_info"
                                value={globalSettings.company_info}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="operator_phone_number"
                                sx={labelStyle}
                              >
                                Номер телефона оператора
                              </InputLabel>
                              <InputMask
                                mask="+7 (999) 999-99-99"
                                onChange={handleGlobalSettings}
                                value={globalSettings.operator_phone_number}
                                defaultValue={
                                  globalSettings.operator_phone_number
                                }
                              >
                                {(inputProps) => (
                                  <CarNumberInput
                                    fullWidth
                                    InputProps={{
                                      disableUnderline: true,
                                      sx: { paddingLeft: '12px' }
                                    }}
                                    variant="filled"
                                    id="operator_phone_number"
                                    name="operator_phone_number"
                                  />
                                )}
                              </InputMask>
                            </Stack>
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion disableGutters sx={accordionContainerStyle}>
                        <AccordionSummary
                          expandIcon={<ExpandIcon />}
                          sx={accordionTitleStyle}
                        >
                          Места на парковке
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack sx={{ pt: '16px', gap: '16px' }}>
                            <Stack>
                              <InputLabel
                                htmlFor="count_free_places"
                                sx={labelStyle}
                              >
                                Количество свободных мест
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="count_free_places"
                                name="count_free_places"
                                value={globalSettings.count_free_places}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="total_places_for_cars"
                                sx={labelStyle}
                              >
                                Общее количество мест на парковке
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="total_places_for_cars"
                                name="total_places_for_cars"
                                value={globalSettings.total_places_for_cars}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={Boolean(
                                      globalSettings.print_count_free_places
                                    )}
                                    onChange={handleGlobalSettings}
                                    name="print_count_free_places"
                                    sx={switchInputStyle}
                                  />
                                }
                                label="Вывод количества свободных мест"
                                labelPlacement="end"
                                sx={{
                                  m: 0,
                                  justifyContent: 'flex-start',
                                  gap: '16px',
                                  pl: '12px'
                                }}
                              />
                            </FormGroup>
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion disableGutters sx={accordionContainerStyle}>
                        <AccordionSummary
                          expandIcon={<ExpandIcon />}
                          sx={accordionTitleStyle}
                        >
                          Платёжные системы
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack sx={{ pt: '16px', gap: '16px' }}>
                            <Stack>
                              <InputLabel
                                htmlFor="yookassa_api_key"
                                sx={labelStyle}
                              >
                                Yookassa shop key
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="yookassa_api_key"
                                name="yookassa_api_key"
                                value={globalSettings.yookassa_api_key}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="yookassa_shop_id"
                                sx={labelStyle}
                              >
                                Yookassa shop id
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="yookassa_shop_id"
                                name="yookassa_shop_id"
                                value={globalSettings.yookassa_shop_id}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="terminal_payment_ttl"
                                sx={labelStyle}
                              >
                                Время жизни сессии оплаты терминала
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="terminal_payment_ttl"
                                name="terminal_payment_ttl"
                                value={globalSettings.terminal_payment_ttl}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={Boolean(
                                      globalSettings.if_payment_is_impossible_passage_cars_for_free
                                    )}
                                    onChange={handleGlobalSettings}
                                    name="if_payment_is_impossible_passage_cars_for_free"
                                    sx={switchInputStyle}
                                  />
                                }
                                label="Пускать авто бесплатно если система оплаты не доступна"
                                labelPlacement="end"
                                sx={{
                                  m: 0,
                                  justifyContent: 'flex-start',
                                  gap: '16px',
                                  pl: '12px'
                                }}
                              />
                            </FormGroup>
                            <Stack>
                              <InputLabel
                                htmlFor="secs_to_show_terminal_qr_code"
                                sx={labelStyle}
                              >
                                Время показа QR кода на терминале
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="secs_to_show_terminal_qr_code"
                                name="secs_to_show_terminal_qr_code"
                                value={
                                  globalSettings.secs_to_show_terminal_qr_code
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="payment_page_header"
                                sx={labelStyle}
                              >
                                Заголовок для онлайн-оплаты
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="payment_page_header"
                                name="payment_page_header"
                                value={globalSettings.payment_page_header}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="vendotek_terminal_prod_id"
                                sx={labelStyle}
                              >
                                ID продукта (Vendotek)
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="vendotek_terminal_prod_id"
                                name="vendotek_terminal_prod_id"
                                value={globalSettings.vendotek_terminal_prod_id}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="vendotek_terminal_prod_name"
                                sx={labelStyle}
                              >
                                Имя продукта (Vendotek)
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="vendotek_terminal_prod_name"
                                name="vendotek_terminal_prod_name"
                                value={
                                  globalSettings.vendotek_terminal_prod_name
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="terminal_payment_refund_type"
                                sx={labelStyle}
                              >
                                Тип возврата оплат через терминал
                              </InputLabel>
                              <Select
                                id="terminal_payment_refund_type"
                                name="terminal_payment_refund_type"
                                displayEmpty
                                value={
                                  globalSettings.terminal_payment_refund_type
                                }
                                onChange={handleGlobalSettings}
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
                                sx={selectMenuStyle}
                                renderValue={(selected) => (
                                  <Typography
                                    component={'h5'}
                                    noWrap
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {selected === 0
                                      ? 'Контактный'
                                      : 'Бесконтактный'}
                                  </Typography>
                                )}
                              >
                                <MenuItem
                                  id="Контактный"
                                  selected={
                                    globalSettings.terminal_payment_refund_type ===
                                    0
                                  }
                                  value={0}
                                >
                                  <Typography
                                    component={'h5'}
                                    noWrap
                                    sx={{ fontWeight: 500, p: 0 }}
                                  >
                                    Контактный
                                  </Typography>
                                </MenuItem>
                                <MenuItem
                                  id="Бесконтактный"
                                  value={1}
                                  selected={
                                    globalSettings.terminal_payment_refund_type ===
                                    1
                                  }
                                >
                                  <Typography
                                    component={'h5'}
                                    noWrap
                                    sx={{ fontWeight: 500, p: 0 }}
                                  >
                                    Бесконтактный
                                  </Typography>
                                </MenuItem>
                              </Select>
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="yookassa_tax_system_code"
                                sx={labelStyle}
                              >
                                Система налогообложения (Юкасса)
                              </InputLabel>
                              <Select
                                id="yookassa_tax_system_code"
                                name="yookassa_tax_system_code"
                                displayEmpty
                                value={globalSettings.yookassa_tax_system_code}
                                onChange={handleGlobalSettings}
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
                                sx={selectMenuStyle}
                                renderValue={(selected) => {
                                  const selectedName =
                                    yookassaTaxSystemCodeValues.find(
                                      (item) => item.value === selected
                                    );
                                  return (
                                    <Typography
                                      component={'h5'}
                                      noWrap
                                      sx={{ fontWeight: 500 }}
                                    >
                                      {selectedName?.name}
                                    </Typography>
                                  );
                                }}
                              >
                                {yookassaTaxSystemCodeValues.map((item) => (
                                  <MenuItem
                                    key={item.name}
                                    id={item.name}
                                    selected={
                                      globalSettings.yookassa_tax_system_code ===
                                      item.value
                                    }
                                    value={item.value}
                                  >
                                    <Typography
                                      component={'h5'}
                                      noWrap
                                      sx={{ fontWeight: 500, p: 0 }}
                                    >
                                      {item.name}
                                    </Typography>
                                  </MenuItem>
                                ))}
                              </Select>
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="yookassa_vat_code"
                                sx={labelStyle}
                              >
                                Тип НДС (Юкасса)
                              </InputLabel>
                              <Select
                                id="yookassa_vat_code"
                                name="yookassa_vat_code"
                                displayEmpty
                                value={globalSettings.yookassa_vat_code}
                                onChange={handleGlobalSettings}
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
                                sx={selectMenuStyle}
                                renderValue={(selected) => {
                                  const selectedName =
                                    yookassaVatCodeValues.find(
                                      (item) => item.value === selected
                                    );
                                  return (
                                    <Typography
                                      component={'h5'}
                                      noWrap
                                      sx={{ fontWeight: 500 }}
                                    >
                                      {selectedName?.name}
                                    </Typography>
                                  );
                                }}
                              >
                                {yookassaVatCodeValues.map((item) => (
                                  <MenuItem
                                    key={item.name}
                                    id={item.name}
                                    selected={
                                      globalSettings.yookassa_vat_code ===
                                      item.value
                                    }
                                    value={item.value}
                                  >
                                    <Typography
                                      component={'h5'}
                                      noWrap
                                      sx={{ fontWeight: 500, p: 0 }}
                                    >
                                      {item.name}
                                    </Typography>
                                  </MenuItem>
                                ))}
                              </Select>
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="aqsi_tax_system_code"
                                sx={labelStyle}
                              >
                                Система налогообложения (AQSI)
                              </InputLabel>
                              <Select
                                id="aqsi_tax_system_code"
                                name="aqsi_tax_system_code"
                                displayEmpty
                                value={globalSettings.aqsi_tax_system_code}
                                onChange={handleGlobalSettings}
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
                                sx={selectMenuStyle}
                                renderValue={(selected) => {
                                  const selectedName =
                                    aqsiTaxSystemCodeValues.find(
                                      (item) => item.value === selected
                                    );
                                  return (
                                    <Typography
                                      component={'h5'}
                                      noWrap
                                      sx={{ fontWeight: 500 }}
                                    >
                                      {selectedName?.name}
                                    </Typography>
                                  );
                                }}
                              >
                                {aqsiTaxSystemCodeValues.map((item) => (
                                  <MenuItem
                                    key={item.name}
                                    id={item.name}
                                    selected={
                                      globalSettings.aqsi_tax_system_code ===
                                      item.value
                                    }
                                    value={item.value}
                                  >
                                    <Typography
                                      component={'h5'}
                                      noWrap
                                      sx={{ fontWeight: 500, p: 0 }}
                                    >
                                      {item.name}
                                    </Typography>
                                  </MenuItem>
                                ))}
                              </Select>
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="aqsi_vat_code"
                                sx={labelStyle}
                              >
                                Тип НДС (AQSI)
                              </InputLabel>
                              <Select
                                id="aqsi_vat_code"
                                name="aqsi_vat_code"
                                displayEmpty
                                value={globalSettings.aqsi_vat_code}
                                onChange={handleGlobalSettings}
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
                                sx={selectMenuStyle}
                                renderValue={(selected) => {
                                  const selectedName = aqsiVatCodeValues.find(
                                    (item) => item.value === selected
                                  );
                                  return (
                                    <Typography
                                      component={'h5'}
                                      noWrap
                                      sx={{ fontWeight: 500 }}
                                    >
                                      {selectedName?.name}
                                    </Typography>
                                  );
                                }}
                              >
                                {aqsiVatCodeValues.map((item) => (
                                  <MenuItem
                                    key={item.name}
                                    id={item.name}
                                    selected={
                                      globalSettings.aqsi_vat_code ===
                                      item.value
                                    }
                                    value={item.value}
                                  >
                                    <Typography
                                      component={'h5'}
                                      noWrap
                                      sx={{ fontWeight: 500, p: 0 }}
                                    >
                                      {item.name}
                                    </Typography>
                                  </MenuItem>
                                ))}
                              </Select>
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="email_for_unclaimed_checks"
                                sx={labelStyle}
                              >
                                Почта для невостребованных чеков
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="email_for_unclaimed_checks"
                                name="email_for_unclaimed_checks"
                                value={
                                  globalSettings.email_for_unclaimed_checks
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={Boolean(
                                      globalSettings.email_for_online_payment
                                    )}
                                    onChange={handleGlobalSettings}
                                    name="email_for_online_payment"
                                    sx={switchInputStyle}
                                  />
                                }
                                label="Требовать  email для онлайн-оплаты"
                                labelPlacement="end"
                                sx={{
                                  m: 0,
                                  justifyContent: 'flex-start',
                                  gap: '16px',
                                  pl: '12px'
                                }}
                              />
                            </FormGroup>
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion disableGutters sx={accordionContainerStyle}>
                        <AccordionSummary
                          expandIcon={<ExpandIcon />}
                          sx={accordionTitleStyle}
                        >
                          Абонементы
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack sx={{ pt: '16px', gap: '16px' }}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={Boolean(
                                      globalSettings.support_subscribe
                                    )}
                                    onChange={handleGlobalSettings}
                                    name="support_subscribe"
                                    sx={switchInputStyle}
                                  />
                                }
                                label="Возможность покупки абонемента"
                                labelPlacement="end"
                                sx={{
                                  m: 0,
                                  justifyContent: 'flex-start',
                                  gap: '16px',
                                  pl: '12px'
                                }}
                              />
                            </FormGroup>
                            <Stack>
                              <InputLabel
                                htmlFor="week_subscription_price"
                                sx={labelStyle}
                              >
                                Стоимость абонемента на неделю
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="week_subscription_price"
                                name="week_subscription_price"
                                value={globalSettings.week_subscription_price}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="month_subscription_price"
                                sx={labelStyle}
                              >
                                Стоимость абонемента на месяц
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="month_subscription_price"
                                name="month_subscription_price"
                                value={globalSettings.month_subscription_price}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="quarter_subscription_price"
                                sx={labelStyle}
                              >
                                Стоимость абонемента на квартал
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="quarter_subscription_price"
                                name="quarter_subscription_price"
                                value={
                                  globalSettings.quarter_subscription_price
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="year_subscription_price"
                                sx={labelStyle}
                              >
                                Стоимость абонемента на год
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="year_subscription_price"
                                name="year_subscription_price"
                                value={globalSettings.year_subscription_price}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion disableGutters sx={accordionContainerStyle}>
                        <AccordionSummary
                          expandIcon={<ExpandIcon />}
                          sx={accordionTitleStyle}
                        >
                          Облачное распознавание
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack sx={{ pt: '16px', gap: '16px' }}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={Boolean(
                                      globalSettings.vision_labs_support
                                    )}
                                    onChange={handleGlobalSettings}
                                    name="vision_labs_support"
                                    sx={switchInputStyle}
                                  />
                                }
                                label="Использовать распознование от Vizor VL"
                                labelPlacement="end"
                                sx={{
                                  m: 0,
                                  justifyContent: 'flex-start',
                                  gap: '16px',
                                  pl: '12px'
                                }}
                              />
                            </FormGroup>
                            <Stack>
                              <InputLabel
                                htmlFor="vision_labs_address"
                                sx={labelStyle}
                              >
                                Адрес сервера Vizor VL
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="vision_labs_address"
                                name="vision_labs_address"
                                value={globalSettings.vision_labs_address}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={Boolean(
                                      globalSettings.free_access_emergency
                                    )}
                                    onChange={handleGlobalSettings}
                                    name="free_access_emergency"
                                    sx={switchInputStyle}
                                  />
                                }
                                label="Бесплатный доступ для спец. авто"
                                labelPlacement="end"
                                sx={{
                                  m: 0,
                                  justifyContent: 'flex-start',
                                  gap: '16px',
                                  pl: '12px'
                                }}
                              />
                            </FormGroup>
                            <Stack>
                              <InputLabel
                                htmlFor="car_score_vl_recognition"
                                sx={labelStyle}
                              >
                                car_score_vl_recognition
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="car_score_vl_recognition"
                                name="car_score_vl_recognition"
                                value={globalSettings.car_score_vl_recognition}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="plate_score_vl_recognition"
                                sx={labelStyle}
                              >
                                plate_score_vl_recognition
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="plate_score_vl_recognition"
                                name="plate_score_vl_recognition"
                                value={
                                  globalSettings.plate_score_vl_recognition
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="regno_score_vl_recognition"
                                sx={labelStyle}
                              >
                                regno_score_vl_recognition
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="regno_score_vl_recognition"
                                name="regno_score_vl_recognition"
                                value={
                                  globalSettings.regno_score_vl_recognition
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="emergency_car_score_vl_recognition"
                                sx={labelStyle}
                              >
                                emergency_car_score_vl_recognition
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="emergency_car_score_vl_recognition"
                                name="emergency_car_score_vl_recognition"
                                value={
                                  globalSettings.emergency_car_score_vl_recognition
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="car_brand_model_score_vl_recognition"
                                sx={labelStyle}
                              >
                                car_brand_model_score_vl_recognition
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="car_brand_model_score_vl_recognition"
                                name="car_brand_model_score_vl_recognition"
                                value={
                                  globalSettings.car_brand_model_score_vl_recognition
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="country_score_vl_recognition"
                                sx={labelStyle}
                              >
                                country_score_vl_recognition
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="country_score_vl_recognition"
                                name="country_score_vl_recognition"
                                value={
                                  globalSettings.country_score_vl_recognition
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="min_width_car_vl_recognition"
                                sx={labelStyle}
                              >
                                Минимальная ширина машины на картинке
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="min_width_car_vl_recognition"
                                name="min_width_car_vl_recognition"
                                value={
                                  globalSettings.min_width_car_vl_recognition
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="min_height_car_vl_recognition"
                                sx={labelStyle}
                              >
                                Минимальная высота машины на картинке
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="min_height_car_vl_recognition"
                                name="min_height_car_vl_recognition"
                                value={
                                  globalSettings.min_height_car_vl_recognition
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="min_width_plate_vl_recognition"
                                sx={labelStyle}
                              >
                                Минимальная ширина номера на картинке
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="min_width_plate_vl_recognition"
                                name="min_width_plate_vl_recognition"
                                value={
                                  globalSettings.min_width_plate_vl_recognition
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="min_height_plate_vl_recognition"
                                sx={labelStyle}
                              >
                                Минимальная высота номера на картинке
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="min_height_plate_vl_recognition"
                                name="min_height_plate_vl_recognition"
                                value={
                                  globalSettings.min_height_plate_vl_recognition
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="number_of_bad_recognizations_for_additional_logic"
                                sx={labelStyle}
                              >
                                Количество событий с нераспознанным номером для
                                дополнительной логики
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="number_of_bad_recognizations_for_additional_logic"
                                name="number_of_bad_recognizations_for_additional_logic"
                                value={
                                  globalSettings.number_of_bad_recognizations_for_additional_logic
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="min_symbols_count_for_match"
                                sx={labelStyle}
                              >
                                Минимальное количество символов для
                                подтверждения совпадения номеров
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="min_symbols_count_for_match"
                                name="min_symbols_count_for_match"
                                value={
                                  globalSettings.min_symbols_count_for_match
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={Boolean(
                                      globalSettings.additional_confirmation_car_by_brand_and_model
                                    )}
                                    onChange={handleGlobalSettings}
                                    name="additional_confirmation_car_by_brand_and_model"
                                    sx={switchInputStyle}
                                  />
                                }
                                label="Дополнительное подтверждение машин по марке и модели"
                                labelPlacement="end"
                                sx={{
                                  m: 0,
                                  justifyContent: 'flex-start',
                                  gap: '16px',
                                  pl: '12px'
                                }}
                              />
                            </FormGroup>
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion disableGutters sx={accordionContainerStyle}>
                        <AccordionSummary
                          expandIcon={<ExpandIcon />}
                          sx={accordionTitleStyle}
                        >
                          Политика сессий
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack sx={{ pt: '16px', gap: '16px' }}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={Boolean(
                                      globalSettings.release_all_sessions_not_found_without_payment
                                    )}
                                    onChange={handleGlobalSettings}
                                    name="release_all_sessions_not_found_without_payment"
                                    sx={switchInputStyle}
                                  />
                                }
                                label="Выпускать все машины без сессии без оплаты"
                                labelPlacement="end"
                                sx={{
                                  m: 0,
                                  justifyContent: 'flex-start',
                                  gap: '16px',
                                  pl: '12px'
                                }}
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={Boolean(
                                      globalSettings.let_the_car_in_with_opened_session
                                    )}
                                    onChange={handleGlobalSettings}
                                    name="let_the_car_in_with_opened_session"
                                    sx={switchInputStyle}
                                  />
                                }
                                label="Впускать все машины с открытой сессией"
                                labelPlacement="end"
                                sx={{
                                  m: 0,
                                  justifyContent: 'flex-start',
                                  gap: '16px',
                                  pl: '12px'
                                }}
                              />
                            </FormGroup>
                            <Stack>
                              <InputLabel
                                htmlFor="release_all_sessions_not_found_with_payment_amount"
                                sx={labelStyle}
                              >
                                Выпускать все машины без сессии с оплатой штрафа
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="release_all_sessions_not_found_with_payment_amount"
                                name="release_all_sessions_not_found_with_payment_amount"
                                value={
                                  globalSettings.release_all_sessions_not_found_with_payment_amount
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={Boolean(
                                      globalSettings.entry_on_request_only
                                    )}
                                    onChange={handleGlobalSettings}
                                    name="entry_on_request_only"
                                    sx={switchInputStyle}
                                  />
                                }
                                label="Въезд только по заявкам"
                                labelPlacement="end"
                                sx={{
                                  m: 0,
                                  justifyContent: 'flex-start',
                                  gap: '16px',
                                  pl: '12px'
                                }}
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={Boolean(
                                      globalSettings.save_events_with_not_recognized_plate
                                    )}
                                    onChange={handleGlobalSettings}
                                    name="save_events_with_not_recognized_plate"
                                    sx={switchInputStyle}
                                  />
                                }
                                label="Сохранять события с нераспознанным номером"
                                labelPlacement="end"
                                sx={{
                                  m: 0,
                                  justifyContent: 'flex-start',
                                  gap: '16px',
                                  pl: '12px'
                                }}
                              />
                            </FormGroup>
                            <Stack>
                              <InputLabel
                                htmlFor="mins_to_leave_parking"
                                sx={labelStyle}
                              >
                                Время на выезд из парковки, мин
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="mins_to_leave_parking"
                                name="mins_to_leave_parking"
                                value={globalSettings.mins_to_leave_parking}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="delay_before_checking_confirmation_events"
                                sx={labelStyle}
                              >
                                Время на закрытие ШГ если нет события
                                подтверждения проезда
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="delay_before_checking_confirmation_events"
                                name="delay_before_checking_confirmation_events"
                                value={
                                  globalSettings.delay_before_checking_confirmation_events
                                }
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                            <Stack>
                              <InputLabel
                                htmlFor="relay_closing_time"
                                sx={labelStyle}
                              >
                                Время закрытия реле
                              </InputLabel>
                              <CarNumberInput
                                fullWidth
                                InputProps={{
                                  type: 'number',
                                  disableUnderline: true,
                                  sx: { paddingLeft: '12px' }
                                }}
                                variant="filled"
                                id="relay_closing_time"
                                name="relay_closing_time"
                                value={globalSettings.relay_closing_time}
                                onChange={handleGlobalSettings}
                              />
                            </Stack>
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                      <Accordion disableGutters sx={accordionContainerStyle}>
                        <AccordionSummary
                          expandIcon={<ExpandIcon />}
                          sx={accordionTitleStyle}
                        >
                          Сообщения led-табло
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack sx={{ pt: '16px', gap: '16px' }}>
                            <Stack
                              direction={'row'}
                              gap={'8px'}
                              alignItems={'center'}
                              sx={{ pl: '12px', pt: '12px' }}
                            >
                              <img
                                style={{
                                  width: '18px'
                                }}
                                src={eventInIcon}
                                alt="Въезд"
                              />
                              <Typography sx={{ fontWeight: '500' }}>
                                Въезд
                              </Typography>
                            </Stack>
                            {globalSettings?.led_board_message_texts?.in &&
                              Object.keys(
                                globalSettings.led_board_message_texts.in
                              ).map((key) => (
                                <Stack gap={'4px'} key={`${key}_in`}>
                                  <InputLabel
                                    htmlFor={`${key}_in_line1`}
                                    sx={labelStyle}
                                  >
                                    {key}
                                  </InputLabel>
                                  <CarNumberInput
                                    fullWidth
                                    InputProps={{
                                      disableUnderline: true,
                                      sx: { paddingLeft: '12px' }
                                    }}
                                    variant="filled"
                                    id={`${key}_in_line1`}
                                    name={key}
                                    value={
                                      globalSettings.led_board_message_texts.in[
                                        key
                                      ].line1 ?? ''
                                    }
                                    onChange={handleGlobalInLine1}
                                  />
                                  <CarNumberInput
                                    fullWidth
                                    InputProps={{
                                      disableUnderline: true,
                                      sx: { paddingLeft: '12px' }
                                    }}
                                    variant="filled"
                                    id={`${key}_in_line2`}
                                    name={key}
                                    value={
                                      globalSettings.led_board_message_texts.in[
                                        key
                                      ].line2 ?? ''
                                    }
                                    onChange={handleGlobalInLine2}
                                  />
                                </Stack>
                              ))}
                            <Stack
                              direction={'row'}
                              gap={'8px'}
                              alignItems={'center'}
                              sx={{ pl: '12px', pt: '12px' }}
                            >
                              <img
                                style={{
                                  width: '18px'
                                }}
                                src={eventOutIcon}
                                alt="Выезд"
                              />
                              <Typography sx={{ fontWeight: '500' }}>
                                Выезд
                              </Typography>
                            </Stack>
                            {globalSettings?.led_board_message_texts?.out &&
                              Object.keys(
                                globalSettings.led_board_message_texts.out
                              ).map((key) => (
                                <Stack gap={'4px'} key={`${key}_out`}>
                                  <InputLabel
                                    htmlFor={`${key}_out_line1`}
                                    sx={labelStyle}
                                  >
                                    {key}
                                  </InputLabel>
                                  <CarNumberInput
                                    fullWidth
                                    InputProps={{
                                      disableUnderline: true,
                                      sx: { paddingLeft: '12px' }
                                    }}
                                    variant="filled"
                                    id={`${key}_out_line1`}
                                    name={key}
                                    value={
                                      globalSettings.led_board_message_texts
                                        .out[key].line1 ?? ''
                                    }
                                    onChange={handleGlobalOutLine1}
                                  />
                                  <CarNumberInput
                                    fullWidth
                                    InputProps={{
                                      disableUnderline: true,
                                      sx: { paddingLeft: '12px' }
                                    }}
                                    variant="filled"
                                    id={`${key}_out_line2`}
                                    name={key}
                                    value={
                                      globalSettings.led_board_message_texts
                                        .out[key].line2 ?? ''
                                    }
                                    onChange={handleGlobalOutLine2}
                                  />
                                </Stack>
                              ))}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    </>
                  )}
                  <Box sx={sectionContainerStyle}>
                    <Stack gap={'16px'}>
                      <Typography sx={titleTextStyle}>Уведомления</Typography>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={notificationsSound === 'true'}
                              onChange={(e) => {
                                setNotificationsSound(
                                  e.target.checked.toString()
                                );
                              }}
                              name="sound"
                              sx={switchInputStyle}
                            />
                          }
                          label="Звук уведомлений"
                          labelPlacement="end"
                          sx={{
                            m: 0,
                            justifyContent: 'flex-start',
                            gap: '16px'
                          }}
                        />
                      </FormGroup>
                    </Stack>
                  </Box>
                </>
              )}
              {currentTab === 1 && (
                <>
                  <Box sx={[sectionContainerStyle, { px: '16px' }]}>
                    <Stack gap={'16px'}>
                      <Stack
                        direction={'row'}
                        gap={'8px'}
                        alignItems={'center'}
                        onClick={handlePersonalInfoPolicyClick}
                        sx={downloadInfoStyle}
                      >
                        <Typography sx={titleTextStyle}>
                          Политика обработки персональных данных
                        </Typography>
                        <img src={uploadIcon} alt="Загрузить" />
                      </Stack>
                      <Stack>
                        <InputLabel
                          htmlFor="personal_info_policy"
                          sx={labelStyle}
                        >
                          Заменить
                        </InputLabel>
                        <Stack direction={'row'}>
                          <Button
                            disableRipple
                            variant="filled"
                            component="label"
                            sx={uploadButtonStyle}
                          >
                            {' '}
                            Выберите файл
                            <Input
                              type="file"
                              id="personal_info_policy"
                              sx={{ display: 'none' }}
                              onChange={editPersonalInfoPolicySubmit}
                            />
                          </Button>
                          <Box sx={uploadInfoStyle}>
                            <Typography>
                              {personalInfoFile
                                ? 'Файл загружен'
                                : 'Файл не выбран'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Box>
                  <Box sx={[sectionContainerStyle, { px: '16px' }]}>
                    <Stack gap={'16px'}>
                      <Stack
                        direction={'row'}
                        gap={'8px'}
                        alignItems={'center'}
                        onClick={handleReturnPolicyClick}
                        sx={downloadInfoStyle}
                      >
                        <Typography sx={titleTextStyle}>
                          Политика возврата и обмена
                        </Typography>
                        <img src={uploadIcon} alt="Загрузить" />
                      </Stack>
                      <Stack>
                        <InputLabel htmlFor="return_policy" sx={labelStyle}>
                          Заменить
                        </InputLabel>
                        <Stack direction={'row'}>
                          <Button
                            disableRipple
                            variant="filled"
                            component="label"
                            sx={uploadButtonStyle}
                          >
                            {' '}
                            Выберите файл
                            <Input
                              type="file"
                              id="return_policy"
                              sx={{ display: 'none' }}
                              onChange={editReturnPolicySubmit}
                            />
                          </Button>
                          <Box sx={uploadInfoStyle}>
                            <Typography>
                              {returnPolicyFile
                                ? 'Файл загружен'
                                : 'Файл не выбран'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Box>
                  <Box sx={[sectionContainerStyle, { px: '16px' }]}>
                    <Stack gap={'16px'}>
                      <Stack
                        direction={'row'}
                        gap={'8px'}
                        alignItems={'center'}
                        onClick={handlePaymentsPageImageClick}
                        sx={downloadInfoStyle}
                      >
                        <Typography sx={titleTextStyle}>
                          Фото на странице оплаты
                        </Typography>
                        <img src={uploadIcon} alt="Загрузить" />
                      </Stack>
                      <Stack direction={'row'}>
                        <img
                          style={{ height: '170px', borderRadius: '8px' }}
                          src={
                            process.env.REACT_APP_API_URL +
                            `/settings/paymentsPageImage/?parkingID=${parkingInfo.parkingID}`
                          }
                          alt="Фото на странице оплаты"
                        />
                      </Stack>
                      <Stack>
                        <InputLabel
                          htmlFor="payments_page_image"
                          sx={labelStyle}
                        >
                          Заменить
                        </InputLabel>
                        <Stack direction={'row'}>
                          <Button
                            disableRipple
                            variant="filled"
                            component="label"
                            sx={uploadButtonStyle}
                          >
                            {' '}
                            Выберите файл
                            <Input
                              type="file"
                              id="payments_page_image"
                              sx={{ display: 'none' }}
                              onChange={editPaymentsPageImageSubmit}
                            />
                          </Button>
                          <Box sx={uploadInfoStyle}>
                            <Typography>
                              {paymentsPageImageFile
                                ? 'Файл загружен'
                                : 'Файл не выбран'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Box>
                  <Box sx={[sectionContainerStyle, { px: '16px' }]}>
                    <Stack gap={'16px'}>
                      <Typography sx={[titleTextStyle, { px: '12px' }]}>
                        О парковке
                      </Typography>
                      <Stack>
                        <InputLabel htmlFor="name" sx={labelStyle}>
                          Имя
                        </InputLabel>
                        <CarNumberInput
                          fullWidth
                          InputProps={{
                            disableUnderline: true,
                            sx: { paddingLeft: '12px' }
                          }}
                          variant="filled"
                          id="name"
                          name="name"
                          value={editParkingInfo?.name}
                          onChange={handleParkingInfo}
                        />
                      </Stack>
                      <Stack>
                        <InputLabel htmlFor="address" sx={labelStyle}>
                          Имя
                        </InputLabel>
                        <CarNumberInput
                          fullWidth
                          InputProps={{
                            disableUnderline: true,
                            sx: { paddingLeft: '12px' }
                          }}
                          variant="filled"
                          id="address"
                          name="address"
                          value={editParkingInfo?.address}
                          onChange={handleParkingInfo}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                </>
              )}
            </>
          )}
          <FooterSpacer />
        </Stack>
      </Box>
      <SettingsConfirmDialog
        show={blocker.state === 'blocked' || changingTab !== null}
        cancel={handleCancelNewLocation}
        confirm={handleConfirmedNewLocation}
      />
    </>
  );
};

export default Settings;
