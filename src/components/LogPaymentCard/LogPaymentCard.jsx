import { useDispatch } from 'react-redux';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { colors } from '../../theme/colors';
import { secondaryButtonStyle } from '../../theme/styles';
import uploadIcon from '../../assets/svg/settings_upload_icon.svg';
import { ITEM_MAX_WIDTH, ITEM_MIN_WIDTH } from '../../constants';
import { CarNumberCard } from '../CarNumberCard/CarNumberCard';
import TypeAuto from '../TypeAuto';
import { paymentsFetch } from 'store/payments/paymentsSlice';
import { usePostPaymentRefundMutation } from '../../api/apiSlice';
import { useSnackbar } from 'notistack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const cardContainerStyle = {
  flex: `1 1 ${ITEM_MIN_WIDTH}px`,
  minWidth: `${ITEM_MIN_WIDTH}px`,
  maxWidth: `${ITEM_MAX_WIDTH}px`,
  border: '1px solid ' + colors.outline.separator,
  borderTop: 'none',
  borderLeft: 'none',
  p: '16px',
  backgroundColor: colors.surface.low
};

const labelTextStyle = {
  minWidth: '88px',
  color: colors.element.secondary
};

export default function LogPaymentCard({ payment }) {
  const dispatch = useDispatch();
  const [addRefund] = usePostPaymentRefundMutation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    <Box sx={[cardContainerStyle, isMobile && { minWidth: '320px' }]}>
      <Stack gap={'12px'}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <CarNumberCard carNumber={payment.vehicle_plate} isTable />
          <Box sx={{ width: '100%' }}></Box>
          <Typography
            sx={{
              whiteSpace: 'nowrap',
              fontWeight: 500,
              color: colors.element.secondary
            }}
          >{`№ ${payment.id}`}</Typography>
        </Stack>
        <Stack direction={'row'} sx={{ minHeight: '20px' }}>
          <TypeAuto type={payment.paymentType} />
          {payment.paymentFor && <TypeAuto type={payment.paymentFor} />}
          {payment.isRefund && <TypeAuto type="refund" />}
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>Сумма</Typography>
          <Typography sx={{ fontWeight: 500 }}>
            {RURuble.format(payment.totalPayedSum)}
          </Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>Дата</Typography>
          <Typography sx={{ fontWeight: 500 }}>{dateString}</Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Typography sx={labelTextStyle}>E-mail</Typography>
          <Typography sx={{ fontWeight: 500 }}>{payment.email}</Typography>
        </Stack>
        <Stack direction={'row'} gap={'8px'}>
          <Button
            disableRipple
            disabled={payment.isRefund}
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handleRefundClick}
          >
            Возврат
          </Button>
          <Button
            disableRipple
            variant="contained"
            fullWidth
            sx={secondaryButtonStyle}
            onClick={handlePaymentClick}
            endIcon={
              <img
                src={uploadIcon}
                alt="Открыть"
                style={{ width: '24px', height: '24px' }}
              />
            }
          >
            Открыть
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
