import { useDispatch } from 'react-redux';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { secondaryButtonStyle, cardContainerStyle } from '../../theme/styles';
import uploadIcon from '../../assets/svg/settings_upload_icon.svg';
import { CarNumberCard } from '../CarNumberCard/CarNumberCard';
import TypeAuto from '../TypeAuto';
import { paymentsFetch } from 'store/payments/paymentsSlice';
import { usePostPaymentRefundMutation } from '../../api/apiSlice';
import { useSnackbar } from 'notistack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import {useTranslation} from "react-i18next";

export default function LogPaymentCard({ payment }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [addRefund] = usePostPaymentRefundMutation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const labelTextStyle = useMemo(() => {
    return {
      minWidth: '88px',
      color: theme.colors.element.secondary
    };
  }, [theme]);

  let RURuble = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  });

  const dateString = format(
    parseISO(payment.create_datetime),
    'dd.MM.yyyy HH:mm:ss'
  );

  const handlePaymentClick = () => {
    window.open(
      `${window.location.href}/${payment.id}`,
      '_blank',
      'noreferrer'
    );
  };

  const handleRefundClick = () => {
    addRefund(payment.id)
      .unwrap()
      .then(() => {
        enqueueSnackbar(`Возврат по ID - ${payment.id}`, {
          variant: 'success'
        });
        dispatch(paymentsFetch());
      });
  };

  return (
    <Box
      sx={[cardContainerStyle({ ...theme }), isMobile && { minWidth: '320px' }]}
    >
      <Stack gap={'12px'}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <CarNumberCard carNumber={payment.vehicle_plate} isTable />
          <Box sx={{ width: '100%' }}></Box>
          <Typography
            sx={{
              whiteSpace: 'nowrap',
              fontWeight: 500,
              color: theme.colors.element.secondary
            }}
          >{`№ ${payment.id}`}</Typography>
        </Stack>
        <Stack direction={'row'} sx={{ minHeight: '20px' }}>
          <TypeAuto type={payment.paymentType} />
          {payment.paymentFor && <TypeAuto type={payment.paymentFor} />}
          {payment.isRefund && <TypeAuto type="refund" />}
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>{t('components.logPaymentCard.amount')}</Typography>
          <Typography sx={{ fontWeight: 500 }}>
            {RURuble.format(payment.totalPayedSum)}
          </Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>{t('components.logPaymentCard.date')}</Typography>
          <Typography sx={{ fontWeight: 500 }}>{dateString}</Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>{t('components.logPaymentCard.e-mail')}</Typography>
          <Typography sx={{ fontWeight: 500 }}>{payment.email}</Typography>
        </Stack>
        {payment.description && <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>{t('components.logPaymentCard.description')}</Typography>
          <Typography sx={{fontWeight: 500}}>{payment.description}</Typography>
        </Stack>}
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disableRipple
            disabled={payment.isRefund}
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handleRefundClick}
          >
            {t('components.logPaymentCard.refund')}
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle({ ...theme })}
            onClick={handlePaymentClick}
            endIcon={
              <img
                src={uploadIcon}
                alt="Открыть"
                style={{ width: '24px', height: '24px' }}
              />
            }
          >
            {t('components.logPaymentCard.open')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
