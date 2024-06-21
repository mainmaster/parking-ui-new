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

const SubscriptionModal = ({subscriptions}) =>{
    let parkingID = new URLSearchParams(window.location.search).get('parkingID')
    const {enqueueSnackbar} = useSnackbar()
    const [buy] = useBuySubscriptionMutation()

    const submitWeek = (data) => {
        buy(data)
            .then(r=>{
                if(r.data.error){
                    enqueueSnackbar('Оплата временно недоступна',{
                        variant: 'error'
                    })
                }else{
                    window.location.href = r.data.redirectURL
                }
            })
    }
    const submitMonth = (data) => {
        buy(data)
            .then(r=>{
                if(r.data.error){
                    enqueueSnackbar('Оплата временно недоступна',{
                        variant: 'error'
                    })
                }else{
                    window.location.href = r.data.redirectURL
                }
            })
    }
    const submitQuarter= (data) => {
        buy(data)
            .then(r=>{
                if(r.data.error){
                    enqueueSnackbar('Оплата временно недоступна',{
                        variant: 'error'
                    })
                }else{
                    window.location.href = r.data.redirectURL
                }
            })
    }
    const submitYear = (data) => {
        buy(data)
            .then(r=>{
                if(r.data.error){
                    enqueueSnackbar('Оплата временно недоступна',{
                        variant: 'error'
                    })
                }else{
                    window.location.href = r.data.redirectURL
                }
            })
    }

    // monthSubscriptionPrice
    //
    // quarterSubscriptionPrice
    // weekSubscriptionPrice
    //
    // yearSubscriptionPrice
    //

    const buyMonth = useRef()
    const buyQuarter = useRef()
    const buyWeek = useRef()
    const buyYear = useRef()


    return (
      <div>
        {
          subscriptions && (
            <>
              {subscriptions.weekSubscriptionPrice > 0 && (
                <Accordion>
                  <Accordion.Header>
                    1 Неделя - {subscriptions.weekSubscriptionPrice}₽
                  </Accordion.Header>
                  <Accordion.Body>
                    <Formik
                      initialValues={{
                        fullName: '',
                        vehiclePlate: '',
                        duration: 'week',
                        parkingID: parkingID,
                      }}
                      onSubmit={submitWeek}
                      innerRef={buyWeek}
                    >
                      {(props) => (
                        <form onSubmit={props.handleSubmit}>
                          <DateRangePicker
                            format="yyyy-MM-dd"
                            id="datepicker"
                            readOnly
                            className="mb-2"
                            placeholder="Дата"
                            defaultValue={[
                              new Date(moment().toISOString()),
                              new Date(moment().add('1', 'week').toISOString()),
                            ]}
                          />
                          <Input
                            label="Имя и телефон"
                            name="fullName"
                            type="text"
                            required
                            className="mb-2"
                            onChange={(e) =>
                              props.setFieldValue(
                                'vehiclePlate',
                                e.target.value
                              )
                            }
                          />
                          <Input
                            label="Номер машины"
                            name="vehiclePlate"
                            type="text"
                            required
                            onChange={(e) =>
                              props.setFieldValue(
                                'vehiclePlate',
                                e.target.value
                              )
                            }
                            className="mb-3"
                          />
                           {
                            subscriptions.emailForPayment &&
                            <Input
                              label="Email"
                            name="email"
                            type="text"
                            required
                            onChange={(e) =>
                              props.setFieldValue(
                                'email',
                                e.target.value
                              )
                            }
                            className="mb-3"
                            />
                          }
                          <Button type="submit">Оплатить</Button>
                        </form>
                      )}
                    </Formik>
                  </Accordion.Body>
                </Accordion>
              )}

              {subscriptions.monthSubscriptionPrice > 0 && (
                <Accordion>
                  <Accordion.Header>
                    1 Месяц - {subscriptions.monthSubscriptionPrice}₽
                  </Accordion.Header>
                  <Accordion.Body>
                    <Formik
                      initialValues={{
                        fullName: '',
                        vehiclePlate: '',
                        duration: 'month',
                        parkingID: parkingID,
                      }}
                      onSubmit={submitMonth}
                      innerRef={buyMonth}
                    >
                      {(props) => (
                        <form onSubmit={props.handleSubmit}>
                          <DateRangePicker
                            format="yyyy-MM-dd"
                            id="datepicker"
                            readOnly
                            className="mb-2"
                            placeholder="Дата"
                            defaultValue={[
                              new Date(moment().toISOString()),
                              new Date(
                                moment().add('1', 'month').toISOString()
                              ),
                            ]}
                          />
                          <Input
                            label="Имя и телефон"
                            name="fullName"
                            type="text"
                            required
                            className="mb-2"
                            onChange={(e) =>
                              props.setFieldValue(
                                'vehiclePlate',
                                e.target.value
                              )
                            }
                          />
                          <Input
                            label="Номер машины"
                            name="vehiclePlate"
                            type="text"
                            required
                            onChange={(e) =>
                              props.setFieldValue(
                                'vehiclePlate',
                                e.target.value
                              )
                            }
                            className="mb-3"
                          />
                           {
                            subscriptions.emailForPayment &&
                            <Input
                              label="Email"
                            name="email"
                            type="text"
                            required
                            onChange={(e) =>
                              props.setFieldValue(
                                'email',
                                e.target.value
                              )
                            }
                            className="mb-3"
                            />
                          }
                          <Button type="submit">Оплатить</Button>
                        </form>
                      )}
                    </Formik>
                  </Accordion.Body>
                </Accordion>
              )}

              {subscriptions.quarterSubscriptionPrice > 0 && (
                <Accordion>
                  <Accordion.Header>
                    3 Месяца - {subscriptions.quarterSubscriptionPrice}₽
                  </Accordion.Header>
                  <Accordion.Body>
                    <Formik
                      initialValues={{
                        fullName: '',
                        vehiclePlate: '',
                        duration: 'quarter',
                        parkingID: parkingID,
                      }}
                      onSubmit={submitQuarter}
                      innerRef={buyQuarter}
                    >
                      {(props) => (
                        <form onSubmit={props.handleSubmit}>
                          <DateRangePicker
                            format="yyyy-MM-dd"
                            id="datepicker"
                            readOnly
                            className="mb-2"
                            placeholder="Дата"
                            defaultValue={[
                              new Date(moment().toISOString()),
                              new Date(
                                moment().add('3', 'month').toISOString()
                              ),
                            ]}
                          />
                          <Input
                            label="Имя и телефон"
                            name="fullName"
                            type="text"
                            required
                            className="mb-2"
                            onChange={(e) =>
                              props.setFieldValue(
                                'vehiclePlate',
                                e.target.value
                              )
                            }
                          />
                          <Input
                            label="Номер машины"
                            name="vehiclePlate"
                            type="text"
                            required
                            onChange={(e) =>
                              props.setFieldValue(
                                'vehiclePlate',
                                e.target.value
                              )
                            }
                            className="mb-3"
                          />
                           {
                            subscriptions.emailForPayment &&
                            <Input
                              label="Email"
                            name="email"
                            type="text"
                            required
                            onChange={(e) =>
                              props.setFieldValue(
                                'email',
                                e.target.value
                              )
                            }
                            className="mb-3"
                            />
                          }
                          <Button type="submit">Оплатить</Button>
                        </form>
                      )}
                    </Formik>
                  </Accordion.Body>
                </Accordion>
              )}

              {subscriptions.yearSubscriptionPrice > 0 && (
                <Accordion>
                  <Accordion.Header>
                    1 Год - {subscriptions.yearSubscriptionPrice}₽
                  </Accordion.Header>
                  <Accordion.Body>
                    <Formik
                      initialValues={{
                        fullName: '',
                        vehiclePlate: '',
                        duration: 'year',
                        parkingID: parkingID,
                      }}
                      onSubmit={submitYear}
                      innerRef={buyYear}
                    >
                      {(props) => (
                        <form onSubmit={props.handleSubmit}>
                          <DateRangePicker
                            format="yyyy-MM-dd"
                            id="datepicker"
                            readOnly
                            className="mb-2"
                            placeholder="Дата"
                            defaultValue={[
                              new Date(moment().toISOString()),
                              new Date(moment().add('1', 'year').toISOString()),
                            ]}
                          />
                          <Input
                            label="Имя и телефон"
                            name="fullName"
                            type="text"
                            className="mb-2"
                            required
                            onChange={(e) =>
                              props.setFieldValue(
                                'vehiclePlate',
                                e.target.value
                              )
                            }
                          />
                          <Input
                            label="Номер машины"
                            name="vehiclePlate"
                            type="text"
                            required
                            onChange={(e) =>
                              props.setFieldValue(
                                'vehiclePlate',
                                e.target.value
                              )
                            }
                            className="mb-3"
                          />
                          {
                            subscriptions.emailForPayment &&
                            <Input
                              label="Email"
                            name="email"
                            type="text"
                            required
                            onChange={(e) =>
                              props.setFieldValue(
                                'email',
                                e.target.value
                              )
                            }
                            className="mb-3"
                            />
                          }
                          <Button type="submit">Оплатить</Button>
                        </form>
                      )}
                    </Formik>
                  </Accordion.Body>
                </Accordion>
              )}
            </>
          )

          // <div>1 Месяц</div>
          // <div>6 Месяцев</div>
          // <div>1 Год</div>
        }
      </div>
    )
}

const ABONIMENTS = [
  {
    price: 400,
    title: 'Неделя',
  },
  {
    price: 1500,
    title: 'Месяц',
  },
  {
    price: 3000,
    title: '3 месяца',
  },
  {
    price: 10000,
    title: '1 год',
  },
];

const FIRST_TIME = [
  {
    price: 0,
    title: '30 минут',
  },
  {
    price: 250,
    title: '3 часа',
  },
];

const TARIF = [
  {
    price: 100,
    title: '1 час',
  },
  {
    price: 1000,
    title: '24 часа',
  },
]

const ClientPaymentPage = () => {
    let parkingID = new URLSearchParams(window.location.search).get('parkingID')
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
        document.title = parkingData?.payment_page_header || 'Загрузка'
    },[parkingData])

    const onSubmit = (values) => {
        dispatch(paymentInfoFetch({...values, parkingID: parkingID}))
        setIsSubmit(true)
    }

    const payHandler = (data) => {
        registerOrderRequest(data)
            .then(r=>{
                if(r.data.error){
                    enqueueSnackbar('Оплата временно недоступна',{
                        variant: 'error'
                    })
                }else{
                    window.location.href = r.data.redirectURL
                }
            })
    }

    const contentResult = (
        <div className={css.content}>
            <div className={css.text}>
                Найдено: {paymentInfo === 0 ? "Оплата на ваш автомобиль не требуется" : paymentInfo?.length}
            </div>
            <div className={css.items}>
                {paymentInfo !== 0 &&
                    paymentInfo.map((item) => (
                        <PaymentInfoItem
                            {...item}
                            sessionId={item.SessionId}
                            payHandler={payHandler}
                            key={item.SessionId}
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
      Оплат не требуется
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

    const handleOpen = ({price, subscription}) => {
      setSubscription({
        price,
        subscription
      })
      setBuyModal(true);
    }

    return (
      <div className={css.clientPaymentPageWrapper}>
        <Stack direction={'column'} sx={{width: '100%', maxWidth: '1024px', padding: '16px 16px 0 16px'}} gap={'24px'}>
          <div className={css.bannerContainer}>
            <img className={css.logo} src={bannerPicture} alt=''/>
            <div className={css.dispatcher}>
              <PhoneOutlinedIcon/>
              <Typography>Диспетчер</Typography>
            </div>
          </div>
          <Stack direction={'column'} gap={'24px'}>
            <Stack direction={'column'} gap={'12px'}>
              <Typography sx={{fontSize: '24px', fontWeight: 500}}>Купить абонемент</Typography>
              <Stack direction={'row'} gap={'12px'}>
                {ABONIMENTS.map((aboniment) => (
                  <div
                    className={css.aboniment}
                    key={aboniment.price}
                    onClick={() => handleOpen({price: aboniment.price, subscription: aboniment.title})}
                  >
                    <Typography sx={{fontWeight: 600}}>{aboniment.title}</Typography>
                    <div className={css.abonimentPrice}>{aboniment.price}₽ <KeyboardArrowRightIcon/></div>
                  </div>
                ))}
              </Stack>
            </Stack>
            <Stack direction={'column'} gap={'8px'}>
              <Typography sx={{fontSize: '24px', fontWeight: 500}}>Оплатить парковку</Typography>
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
                  placeholder='Ваш гос.номер, например а012аа'
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
                  Найти
                </Button> : <></>}
              </Stack>
            </Stack>
            <Stack direction={'row'} gap={'8px'} sx={{alignItems: 'center'}}>
              <Stack direction={'column'} gap={'4px'}>
                <Typography fontSize={'medium'} sx={{paddingLeft: '12px'}}>Первые</Typography>
                <Stack direction={'row'} gap={'8px'}>
                  {FIRST_TIME.map((item) => (
                    <div className={css.aboniment} key={item.price}>
                      <Typography sx={{fontWeight: 600}}>{item.title}</Typography>
                      <div className={`${css.abonimentPrice} ${item.price === 0 ? css.zero : ''}`}>{item.price}₽</div>
                    </div>
                  ))}
                </Stack>
              </Stack>
              <div className={css.borderBetweenPrice}>

              </div>
              <Stack direction={'column'} gap={'4px'}>
                <Typography fontSize={'medium'} sx={{paddingLeft: '12px'}}>Далее по тарифу</Typography>
                <Stack direction={'row'} gap={'8px'}>
                  {TARIF.map((item) => (
                    <div className={css.aboniment} key={item.price}>
                      <Typography sx={{fontWeight: 600}}>{item.title}</Typography>
                      <div className={`${css.abonimentPrice} ${item.price === 0 ? css.zero : ''}`}>{item.price}₽</div>
                    </div>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          {content}
        </Stack>

        <div className={css.footer}>
          <div className={css.footerLogo}>
            {logoIconWithoutBG}
            <div className={css.paymentsLogo}>
              Оплата онлайн
              <img src={mir} alt=''/>
              <img src={master} alt=''/>
              <img src={visa} alt=''/>
              <img src={jcb} alt=''/>
            </div>
          </div>
          <div className={css.offer}>
            <div className={css.offerUnp}>
              ООО «Спорт Плюс»<br/>
              Юридический адрес: 119334, г. Москва, 5-й Донской проезд, д.15/7. Почтовый адрес: 119334, г. Москва, 5-й
              Донской проезд, д.15/7. ИНН/КПП: 7722810381/ 772501001. ОГРН: 1137746480630. Генеральный директор (на
              основании Устава): Крикунов Дмитрий Анатольевич. Телефон, факс, электронная почта, иные контактные данные
              компании: + 7 (499) 653-93-66, hello@citysport.pro, https://citysport.pro/
            </div>
            <a href='#'>Политика возврата и обмена</a>
            <a href='#'>Пользовательское соглашение и политика обработки данных</a>
          </div>
        </div>

        {buyModal && <SubscriptionPaymentModal show={buyModal} handleClose={handleClose} subscription={subscription}/>}
      </div>
    )
}

export default ClientPaymentPage