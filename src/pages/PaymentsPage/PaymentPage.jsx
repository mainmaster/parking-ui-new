import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard';
import TypeAuto from '../../components/TypeAuto';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
import FooterSpacer from '../../components/Header/FooterSpacer';
import { useDispatch, useSelector } from 'react-redux';
import { paymentSelectFetch } from '../../store/payments/paymentsSlice';
import { usePostPaymentRefundMutation } from '../../api/apiSlice';
import {
  Tooltip,
  Typography,
  Button,
  Stack,
  AppBar,
  IconButton
} from '@mui/material';
import linkIcon from '../../assets/svg/link_icon.svg';
import {
  listWithScrollStyle,
  secondaryButtonStyle,
  captionTextStyle
} from '../../theme/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import EventManager from '../../components/EventManager/EventManager';
import { format, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';
import {useTranslation} from "react-i18next";

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

export const PaymentPage = () => {
  const { t } = useTranslation();
  const [addRefund] = usePostPaymentRefundMutation();
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const payment = useSelector((state) => state.payments.selectPayment);
  const loading = useSelector((state) => state.payments.isLoadingSelect);
  const errorLoad = useSelector((state) => state.payments.isErrorSelect);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const [dateString, setDateString] = useState('');

  const labelTextStyle = useMemo(() => {
    return {
      width: '112px',
      color: theme.colors.element.secondary
    };
  }, [theme]);

  let RURuble = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  });

  useEffect(() => {
    if (payment) {
      setDateString(
        format(parseISO(payment.create_datetime), 'dd.MM.yyyy HH:mm:ss')
      );
    }
  }, [payment]);

  const handleCopyLinkClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  const handleRefundPayment = () => {
    addRefund(id)
      .unwrap()
      .then(() => {
        enqueueSnackbar(`${t('pages.paymentPage.refundBy')} ID - ${id}`, {
          variant: 'success'
        });
        dispatch(paymentSelectFetch());
      });
  };

  useLayoutEffect(() => {
    document.title = `${t('pages.paymentPage.payment')} №${id}` || t('pages.paymentPage.loading');
    dispatch(paymentSelectFetch(id));

    return () => {
      document.title = 'Parking';
    };
  }, [dispatch, id]);

  const errorContent = <h1>{t('pages.paymentPage.paymentFrom')} №{id} {t('pages.paymentPage.noFound')}</h1>;

  return (
    <>
      <Stack
        gap={'16px'}
        sx={[
          listWithScrollStyle({ ...theme }),
          {
            width: '100%',
            px: '16px',
            backgroundColor: theme.colors.surface.low
          }
        ]}
      >
        <EventManager />
        {loading && <SpinerLogo />}
        {errorLoad && errorContent}
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          sx={{
            width: '100%',
            pt: '16px',
            pb: isMobile ? '10px' : '8px'
          }}
        >
          <Stack direction={'row'} alignItems={'center'} gap={'16px'}>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? 0 : '0.5rem'}
            >
              <Typography sx={titleTextStyle}>{t('pages.paymentPage.payment')} </Typography>
              <Typography
                sx={isMobile ? captionTextStyle({ ...theme }) : titleTextStyle}
              >
                №{id}
              </Typography>
            </Stack>
          </Stack>
          <Tooltip title={copied ? t('pages.paymentPage.urlIsCopy') : t('pages.paymentPage.copyUrl')}>
            <Button
              disableRipple
              variant="contained"
              fullWidth={false}
              onClick={handleCopyLinkClick}
              sx={[
                secondaryButtonStyle({ ...theme }),
                isMobile
                  ? {
                      minWidth: '48px',
                      '& .MuiButton-endIcon': {
                        margin: 0
                      }
                    }
                  : { minWidth: '212px' }
              ]}
              endIcon={
                <img
                  src={linkIcon}
                  alt={t('pages.paymentPage.copyUrl')}
                  style={{
                    width: '24px',
                    height: '24px'
                  }}
                />
              }
            >
              {isMobile ? '' : t('pages.paymentPage.copyUrl')}
            </Button>
          </Tooltip>
        </Stack>

        {payment && (
          <>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>{t('pages.paymentPage.gosNumber')}</Typography>
              {payment.vehicle_plate &&
                payment.vehicle_plate.full_plate !== '' && (
                  <Stack direction={'row'}>
                    <CarNumberCard carNumber={payment.vehicle_plate} isTable />
                  </Stack>
                )}
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>{t('pages.paymentPage.typeTo')}</Typography>
              <Stack direction={'row'}>
                <TypeAuto type={payment.paymentType} />
              </Stack>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>{t('pages.paymentPage.type')}</Typography>
              <Stack direction={'row'}>
                <TypeAuto type={payment.paymentFor} />
              </Stack>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>{t('pages.paymentPage.refund')}</Typography>
              <Stack direction={'row'}>
                <TypeAuto type={payment.isRefund ? 'refund' : ''} />
              </Stack>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>{t('pages.paymentPage.amount')}</Typography>
              <Typography>{RURuble.format(payment.totalPayedSum)}</Typography>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>{t('pages.paymentPage.date')}</Typography>
              <Typography>{dateString}</Typography>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>{t('pages.paymentPage.email')}</Typography>
              <Typography>{payment.email}</Typography>
            </Stack>
            {payment.description && <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>{t('pages.paymentPage.description')}</Typography>
              <Typography>{payment.description}</Typography>
            </Stack>}
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>{t('pages.paymentPage.session')}</Typography>
              <NavLink
                to={`/sessions/${payment.session_id}`}
                style={{ lineHeight: '1.125rem' }}
              >
                {t('pages.paymentPage.session')} №{payment.session_id}
              </NavLink>
            </Stack>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? '4px' : '16px'}
            >
              <Typography sx={labelTextStyle}>{t('pages.paymentPage.action')}</Typography>
              <Stack direction={'row'}>
                <Stack direction={'row'} gap={'8px'}>
                  <Button
                    disableRipple
                    variant="contained"
                    fullWidth
                    sx={secondaryButtonStyle({ ...theme })}
                    onClick={handleRefundPayment}
                  >
                    {t('pages.paymentPage.refund')}
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </>
        )}
        <FooterSpacer />
      </Stack>
    </>
  );
};
