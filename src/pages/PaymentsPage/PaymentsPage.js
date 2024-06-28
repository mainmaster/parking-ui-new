import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Store
import {
  paymentsFetch,
  paymentsChangePageFetch,
  changeCurrentPage
} from 'store/payments/paymentsSlice';
import { getPaymentsReport } from '../../api/payment';
// Components
import PaginationCustom from 'components/Pagination';
import SpinerLogo from '../../components/SpinerLogo/SpinerLogo';
// Styles
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, AppBar, Box, Stack, Typography } from '@mui/material';
import { listWithScrollStyle, primaryButtonStyle } from '../../theme/styles';
import PaymentFilter from '../../components/PaymentFilter/PaymentFilter';
import FooterSpacer from '../../components/Header/FooterSpacer';
import PaymentsSpacer from './PaymentsSpacer';
import paymentsEmptyIcon from '../../assets/svg/payments_empty_icon.svg';
import { CARS_ON_PAGE, ITEM_MIN_WIDTH, ITEM_MAX_WIDTH } from '../../constants';
import LogPaymentCard from '../../components/LogPaymentCard/LogPaymentCard';
import EventManager from '../../components/EventManager/EventManager';
import OpenFormSpacer from './OpenformSpacer';
import { format, parseISO } from 'date-fns';

const titleTextStyle = {
  fontSize: '1.5rem',
  lineHeight: '1.75rem',
  fontWeight: 500
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
  const filters = useSelector((state) => state.payments.filters);
  const [paymentsListScrolled, setPaymentsListScrolled] = useState(false);
  const paymentsListRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const containerRef = useRef(null);
  const [itemsInRow, setItemsInRow] = useState(0);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      
      ym(97631905, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
      });
    `;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const totalTextStyle = useMemo(() => {
    return {
      fontSize: '1.5rem',
      lineHeight: '1.75rem',
      color: theme.colors.element.secondary
    };
  }, [theme]);

  const mobileTotalTextStyle = useMemo(() => {
    return {
      fontSize: '0.75rem',
      lineHeight: '0.875rem',
      color: theme.colors.element.secondary
    };
  }, [theme]);

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

  const handleGetPaymentsReport = () => {
    getPaymentsReport({ ...filters }).then((res) => {
      // Create blob link to download
      const url = URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;
      const from = filters.createDateFrom
        ? format(parseISO(filters.createDateFrom), 'yyyy-MM-dd')
        : '';
      const to = filters.createDateTo
        ? format(parseISO(filters.createDateTo), 'yyyy-MM-dd')
        : '';
      const filename = `report_${from}_${to}.xlsx`;
      link.setAttribute('download', filename);
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    });
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
            backgroundColor: theme.colors.surface.low,
            boxShadow: !paymentsListScrolled && 'none',
            zIndex: 10,
            borderBottom: `1px solid ${theme.colors.outline.separator}`
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
            <Stack
              direction={'row'}
              justifyContent={'flex-end'}
              sx={{ width: '100%' }}
            >
              <Button
                disableRipple
                variant="contained"
                fullWidth={false}
                sx={primaryButtonStyle({ ...theme })}
                onClick={handleGetPaymentsReport}
              >
                Выгрузить
              </Button>
              <PaymentFilter openForm={openForm} setOpenForm={setOpenForm} />
            </Stack>
          </Stack>
        </AppBar>
      )}
      <Stack
        ref={paymentsListRef}
        sx={[
          listWithScrollStyle({ ...theme }),
          {
            width: '100%',
            backgroundColor: theme.colors.surface.low
          }
        ]}
        onScroll={handlePaymentsListScroll}
      >
        <EventManager offset={!openForm ? 0 : isMobile ? 0 : 336} />
        <PaymentsSpacer />
        {isMobile && (
          <>
            <AppBar
              sx={{
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: theme.colors.surface.low,
                boxShadow: !paymentsListScrolled && 'none',
                zIndex: 10,
                borderBottom: `1px solid ${theme.colors.outline.separator}`
              }}
            >
              <Stack
                direction={'row'}
                gap={'16px'}
                justifyContent={'space-between'}
                sx={{
                  height: '66px',
                  width: '100%',
                  p: '16px',
                  pb: '8px'
                }}
              >
                <Stack
                  justifyContent={'flex-start'}
                  sx={{
                    width: '100%'
                  }}
                >
                  <Typography sx={titleTextStyle}>Оплаты</Typography>
                  <Typography sx={mobileTotalTextStyle}>
                    {totalString}
                  </Typography>
                </Stack>
                <Button
                  disableRipple
                  variant="contained"
                  fullWidth={false}
                  sx={primaryButtonStyle({ ...theme })}
                  onClick={handleGetPaymentsReport}
                >
                  Выгрузить
                </Button>
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
