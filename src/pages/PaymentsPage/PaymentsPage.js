import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Store
import {
  paymentsFetch,
  paymentsChangePageFetch,
  changeCurrentPage
} from 'store/payments/paymentsSlice';
// Components
import PaginationCustom from 'components/Pagination';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
// Styles
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppBar, Box, Stack, Typography } from '@mui/material';
import { colors } from '../../theme/colors';
import { listStyle, listWithScrollStyle } from '../../theme/styles';
import PaymentFilter from '../../components/PaymentFilter/PaymentFilter';
import FooterSpacer from '../../components/Header/FooterSpacer';
import PaymentsSpacer from './PaymentsSpacer';
import paymentsEmptyIcon from '../../assets/svg/payments_empty_icon.svg';
import { CARS_ON_PAGE, ITEM_MIN_WIDTH, ITEM_MAX_WIDTH } from '../../constants';
import LogPaymentCard from '../../components/LogPaymentCard/LogPaymentCard';
import EventManager from '../../components/EventManager/EventManager';
import OpenFormSpacer from './OpenformSpacer';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
};

const totalTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  color: colors.element.secondary
};

const mobileTotalTextStyle = {
  fontSize: '0.75rem',
  lineHeight: '0.875rem',
  color: colors.element.secondary
};

const PaymentsPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const dispatch = useDispatch();
  const payments = useSelector((state) => state.payments.payments);
  const pages = useSelector((state) => state.payments.pages);
  const currentPage = useSelector((state) => state.payments.currentPage);
  const isLoading = useSelector((state) => state.payments.isLoadingFetch);
  const isError = useSelector((state) => state.payments.isErrorFetch);
  const totalPayment = useSelector((state) => state.payments.totalPayment);
  const [paymentsListScrolled, setPaymentsListScrolled] = useState(false);
  const paymentsListRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const containerRef = useRef(null);
  const [itemsInRow, setItemsInRow] = useState(0);

  const handleResize = useCallback(() => {
    if (containerRef?.current) {
      const items = Math.floor(
        containerRef.current.offsetWidth / ITEM_MIN_WIDTH
      );
      setItemsInRow(items - 1);
    }
  }, [containerRef]);

  useEffect(() => {
    window.addEventListener('load', handleResize);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('load', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, [containerRef, handleResize]);

  let RURuble = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  });

  const totalString = `${RURuble.format(totalPayment)} всего`;

  useEffect(() => {
    dispatch(paymentsFetch());
    return () => dispatch(changeCurrentPage(1));
  }, [dispatch]);

  const changePage = (event, value) => {
    dispatch(paymentsChangePageFetch(value));
    if (paymentsListRef.current) {
      paymentsListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setPaymentsListScrolled(false);
    }
  };

  const handlePaymentsListScroll = () => {
    if (paymentsListRef.current) {
      const { scrollTop } = paymentsListRef.current;
      if (scrollTop > 0) {
        setPaymentsListScrolled(true);
      } else if (paymentsListScrolled) {
        setPaymentsListScrolled(false);
      }
    }
  };

  return (
    <>
      {!isMobile && (
        <AppBar
          sx={{
            width: 'calc(100% - 72px)',
            position: 'absolute',
            top: 0,
            left: '72px',
            backgroundColor: colors.surface.low,
            boxShadow: !paymentsListScrolled && 'none',
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
            <Stack
              direction={'row'}
              justifyContent={'flex-start'}
              sx={{ width: '100%' }}
              gap={'16px'}
            >
              <Typography sx={titleTextStyle}>Оплаты</Typography>
              <Typography sx={totalTextStyle}>{totalString}</Typography>
            </Stack>
            <PaymentFilter openForm={openForm} setOpenForm={setOpenForm} />
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={paymentsListRef}
        sx={[
          isMobile ? listStyle : listWithScrollStyle,
          {
            width: '100%',
            backgroundColor: colors.surface.low
          }
        ]}
        onScroll={handlePaymentsListScroll}
      >
        <EventManager />
        <PaymentsSpacer />
        {isMobile && (
          <>
            <AppBar
              sx={{
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: colors.surface.low,
                boxShadow: !paymentsListScrolled && 'none',
                zIndex: 10,
                borderBottom: `1px solid ${colors.outline.separator}`
              }}
            >
              <Stack
                justifyContent={'flex-start'}
                sx={{
                  height: '66px',
                  width: '100%',
                  p: '16px',
                  pb: '8px'
                }}
              >
                <Typography sx={titleTextStyle}>Оплаты</Typography>
                <Typography sx={mobileTotalTextStyle}>{totalString}</Typography>
              </Stack>
              <Box
                sx={{
                  height: openForm ? '194px' : '56px',
                  py: '8px'
                }}
              >
                <PaymentFilter openForm={openForm} setOpenForm={setOpenForm} />
              </Box>
            </AppBar>
            {openForm && <OpenFormSpacer />}
          </>
        )}

        {payments && payments.length > 0 ? (
          <>
            <Box
              ref={containerRef}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}
            >
              {payments.map((item, index) => (
                <LogPaymentCard key={item.id} payment={item} />
              ))}
            </Box>
            <Box
              sx={{
                height: '48px'
              }}
            >
              {pages > CARS_ON_PAGE && (
                <PaginationCustom
                  pages={Math.ceil(pages / CARS_ON_PAGE)}
                  changePage={changePage}
                  currentPage={currentPage}
                />
              )}
              {itemsInRow > 0 &&
                [...Array(itemsInRow)].map((value, index) => (
                  <Box
                    id={index + 1}
                    key={index}
                    sx={{
                      flex: `1 1 ${ITEM_MIN_WIDTH}px`,
                      minWidth: `${ITEM_MIN_WIDTH}px`,
                      maxWidth: `${ITEM_MAX_WIDTH}px`
                    }}
                  />
                ))}
            </Box>
          </>
        ) : (
          <Stack
            justifyContent={'center'}
            alignItems={'center'}
            height={'100%'}
            gap={'16px'}
          >
            {isLoading ? (
              <SpinerLogo />
            ) : (
              <>
                <img
                  style={{ height: '40px' }}
                  src={paymentsEmptyIcon}
                  alt="Нет оплат"
                />
                <Typography sx={titleTextStyle}>Нет оплат</Typography>
              </>
            )}
          </Stack>
        )}

        <FooterSpacer />
      </Stack>
    </>
  );
};

export default PaymentsPage;
