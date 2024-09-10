import {Accordion, Col, Row, Spinner} from 'react-bootstrap'
import css from './ClientPaymentPage.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import { Button } from 'react-bootstrap'
import React, {useEffect, useMemo, useRef, useState} from 'react'
// Store
import {
    paymentInfoFetch,
    registerOrderFetch,
} from 'store/payments/paymentsSlice'
// Components
import ClientLayout from 'components/ClientLayout'
import Input from 'components/Input'
import { validationSchema } from './utils'
import {useGetAllTariffsQuery} from "api/apiSlice";
import {useSubscriptionsQuery} from "api/payments.api";
import Modal from "components/Modal";
import PaymentInfoItem from "components/PaymentInfoItem";
import {DateRangePicker} from "rsuite";
import moment from "moment";
import {useBuySubscriptionMutation} from "../../api/payments.api";
import {registerOrderRequest} from "../../api/payment";
import {useSnackbar} from "notistack";
import { useGetInfoFooterQuery } from 'api/apiSlice'
import {Box, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import visaImg from 'icons/visa.png'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from "@mui/icons-material/Search";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {getPaymentsPageImage} from "../../api/settings/paymentsPageImage";
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { logoIconWithoutBG } from 'icons/index'
import mir from '../../assets/svg/Mir.svg'
import master from '../../assets/svg/Mastercard.svg'
import visa from '../../assets/svg/Visa.svg'
import jcb from '../../assets/svg/JCB.svg'
import DoneIcon from '@mui/icons-material/Done';
import SubscriptionPaymentModal from 'components/SubscriptionPaymentModal'
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import {Telephone} from "react-bootstrap-icons";
import {useTranslation} from "react-i18next";


const ABONIMENTS = [
  'weekSubscriptionPrice',
  'monthSubscriptionPrice',
'quarterSubscriptionPrice',
'yearSubscriptionPrice',
];

const ClientPaymentPage = () => {
    const { t } = useTranslation();
    let parkingID = new URLSearchParams(window.location.search).get('parkingID')
    let onlySubscribe = new URLSearchParams(window.location.search).get('onlySubscribe') === 'true'
    const dispatch = useDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const paymentInfo = useSelector((state) => state.payments.paymentInfo)
    const isLoadingFetch = useSelector((state) => state.payments.isLoadingInfoFetch)
    const isErrorFetch = useSelector((state) => state.payments.isErrorInfoFetch)
    const [isSubmit, setIsSubmit] = useState(false)
    const [bannerPicture ,setBannerPicture] = useState('');
    const {data: parkingData} = useGetInfoFooterQuery(parkingID);
    const [inputText, setInputText] = useState('');
    const [subscription, setSubscription] = useState({});

    const {data: tariffs} = useGetAllTariffsQuery(parkingID)
    const {data: subscriptions} = useSubscriptionsQuery(parkingID)
    const [buyModal, setBuyModal] = useState(false)

    useEffect(()=>{
        document.title = parkingData?.payment_page_header || t('pages.clientPaymentPage.loading')
    },[parkingData])

    const onSubmit = (values) => {
        dispatch(paymentInfoFetch({...values, parkingID: parkingID}))
        setIsSubmit(true)
    }

    const payHandler = (data) => {
        registerOrderRequest(data)
            .then(r=>{
                if(r.data.error){
                    enqueueSnackbar(t('pages.clientPaymentPage.paymentNoActive'),{
                        variant: 'error'
                    })
                }else{
                    window.location.href = r.data.redirectURL
                }
            })
    }
    let freeTime = tariffs?.tariffs[0].freeMins

    const contentResult = (
        <div className={css.content}>
            <div className={css.text}>
                Найдено: {paymentInfo === 0 ? t('pages.clientPaymentPage.paymentForCarNotNeed') : paymentInfo?.length}
            </div>
            <div className={css.items}>
                {paymentInfo !== 0 &&
                    paymentInfo.map((item) => (
                        <PaymentInfoItem
                            {...item}
                            sessionId={item.SessionId}
                            payHandler={payHandler}
                            key={item.SessionId}
                            freeTime={freeTime}
                        />
                    ))}
            </div>
        </div>
    )

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const nullContent = (
    <div className={css.nullContent}>
      <DoneIcon/>
      {t('pages.clientPaymentPage.paymentNotNeed')}
    </div>
  )

    const content = paymentInfo && paymentInfo.length ? contentResult : isSubmit && !isLoadingFetch ? nullContent : null

    useEffect(()=>{
      getPaymentsPageImage(parkingID).then((res)=>{
        setBannerPicture(res.config.baseURL + res.config.url)
      })
    },[]);

    const handleSearch = () => {
      if (!inputText) {
        return;
      }

      dispatch(paymentInfoFetch({number: inputText, parkingID: parkingID}))
      setIsSubmit(true);
    }

    const handleClose = () => {
      setBuyModal(false);
    }

    const handleOpen = ({price, subscription, isEmailNeed}) => {
      setSubscription({
        price,
        subscription,
        isEmailNeed
      })
      setBuyModal(true);
    }

  const { data: footerInfo } = useGetInfoFooterQuery(parkingID)

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

  return (
      <div className={css.clientPaymentPageWrapper}>
        <Stack direction={'column'} sx={{width: '100%', maxWidth: '1024px', padding: '16px 16px 0 16px'}} gap={'24px'}>
          <div className={css.bannerContainer}>
            <img className={css.logo} src={bannerPicture} alt=''/>
            <a className={css.dispatcher} href={`tel:${footerInfo?.operator_phone_number}`}>
              <PhoneOutlinedIcon/>
              <Typography>{t('pages.clientPaymentPage.manager')}</Typography>
            </a>
          </div>
          <Stack direction={'column'} gap={'24px'}>
            {subscriptions?.supportSubscribe && (
              <Stack direction={'column'} gap={'12px'}>
                <Typography sx={{fontSize: '24px', fontWeight: 500}}>{t('pages.clientPaymentPage.buyAboniment')}</Typography>
                <Stack direction={'row'} gap={'12px'}>
                  {ABONIMENTS.map((aboniment) => {
                    if (!subscriptions[aboniment]) {
                      return;
                    }

                    let title = '';
                    switch (aboniment) {
                      case 'weekSubscriptionPrice':
                        title = t('pages.clientPaymentPage.week');
                        break;
                      case 'monthSubscriptionPrice':
                        title = t('pages.clientPaymentPage.month');
                        break;
                      case 'quarterSubscriptionPrice':
                        title = `3 ${t('pages.clientPaymentPage.month')}`;
                        break;
                      case 'yearSubscriptionPrice':
                        title = `1 ${t('pages.clientPaymentPage.year')}`;
                        break;
                    }
                    return (
                      <div
                        className={css.aboniment}
                        key={subscriptions[aboniment]}
                        onClick={() => handleOpen({price: subscriptions[aboniment], subscription: title, isEmailNeed: subscriptions.emailForPayment})}
                      >
                        <Typography sx={{fontWeight: 600}}>{title}</Typography>
                        <div className={css.abonimentPrice}>{subscriptions[aboniment]}₽ <KeyboardArrowRightIcon/></div>
                      </div>
                    )
                  })}
                </Stack>
              </Stack>
            )}
            {!onlySubscribe &&
            <>
              <Stack direction={'column'} gap={'8px'}>
                <Typography sx={{fontSize: '24px', fontWeight: 500}}>{t('pages.clientPaymentPage.payPark')}</Typography>
                <Stack direction={'row'} gap={'8px'} sx={{alignItems: 'center'}}>
                  <TextField
                    value={inputText}
                    onChange={(event) => {
                      setInputText(event.target.value);
                      setIsSubmit(false);
                    }}
                    onKeyDown={(event) => {
                      if (event.code.toLowerCase() === 'enter' && !isSubmit) {
                        handleSearch();
                      }
                    }}
                    className={css.searchInput}
                    placeholder={`${t('pages.clientPaymentPage.yourGosNumber')} а012аа`}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: inputText ? (
                        <InputAdornment
                          position="end"
                          onClick={() => {
                            setInputText('')
                          }}
                          sx={{
                            cursor: 'pointer'
                          }}
                        >
                          <HighlightOffIcon />
                        </InputAdornment>
                      ) : null
                    }}
                  />
                  {isMobile ?<Button onClick={handleSearch} type='submit' style={{width: '200px', height: '100%', background: 'green', border: "none"}}>
                    {t('pages.clientPaymentPage.search')}
                  </Button> : <></>}
                </Stack>
              </Stack>
              <Stack direction={'row'} gap={'8px'} sx={{alignItems: 'center'}}>
                <Stack direction={'column'} gap={'4px'}>
                  <Typography fontSize={'medium'} sx={{paddingLeft: '12px'}}>{t('pages.clientPaymentPage.tarif')}</Typography>
                  <Stack direction={'row'} gap={'8px'}>
                    <div
                      className={css.aboniment}
                      key={freeTime}
                    >
                      <Typography sx={{fontWeight: 600}}>{freeTime} {t('pages.clientPaymentPage.min')}</Typography>
                      <div className={`${css.abonimentPrice} ${css.zero}`}>0₽ <KeyboardArrowRightIcon/></div>
                    </div>
                    {tariffs?.tariffs?.map((item) => {
                      const title = item.passMode === 'pay_by_hour' ? ` 1 ${t('pages.clientPaymentPage.hour')}` : `${item.interval} ${t('pages.clientPaymentPage.hours')} `
                      return (
                        <div
                          className={css.aboniment}
                          key={item.price + item.interval}
                        >
                          <Typography sx={{fontWeight: 600}}>{title}</Typography>
                          <div className={css.abonimentPrice}>{item.price}₽ <KeyboardArrowRightIcon/></div>
                        </div>
                      )
                    })}
                  </Stack>
                </Stack>
              </Stack>
            </>
            }
          </Stack>
          {!onlySubscribe && content}
        </Stack>

        <div className={css.footer}>
          <div className={css.footerLogo}>
            {logoIconWithoutBG}
            <div className={css.paymentsLogo}>
              <img src={mir} alt=''/>
              <img src={master} alt=''/>
              <img src={visa} alt=''/>
              <img src={jcb} alt=''/>
            </div>
          </div>
          <div className={css.offer}>
            <div className={css.offerUnp}>
              {footerInfo?.name}<br/>
              {footerInfo?.info}
            </div>
            <a href={footerInfo?.refund} target="_blank" rel="noreferrer">{t('pages.clientPaymentPage.refund')}</a>
            <a href={footerInfo?.oferta} target="_blank" rel="noreferrer">{t('pages.clientPaymentPage.oferta')}</a>
          </div>
        </div>

        {buyModal && <SubscriptionPaymentModal show={buyModal} handleClose={handleClose} subscription={subscription}/>}
      </div>
    )
}

export default ClientPaymentPage