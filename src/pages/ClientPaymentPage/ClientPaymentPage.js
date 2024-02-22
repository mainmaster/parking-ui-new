import {Accordion, Col, Row, Spinner} from 'react-bootstrap'
import css from './ClientPaymentPage.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import { Button } from 'react-bootstrap'
import { useEffect, useRef, useState} from 'react'
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

const ClientPaymentPage = () => {
    let parkingID = new URLSearchParams(window.location.search).get('parkingID')
    const dispatch = useDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const paymentInfo = useSelector((state) => state.payments.paymentInfo)
    const isLoadingFetch = useSelector((state) => state.payments.isLoadingInfoFetch)
    const isErrorFetch = useSelector((state) => state.payments.isErrorInfoFetch)
    const [isSubmit, setIsSubmit] = useState(false)
    const {data: parkingData} = useGetInfoFooterQuery(parkingID)

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

    const spinnerContent = (
        <div className={css.spinner}>
            <Spinner animation="border" />
        </div>
    )

    const errorContent = (
        <div className={css.error}>Что-то пошло не так! Попробуйте позже</div>
    )

    const contentResult = (
        <div className={css.result}>
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

    const hasData = !(isLoadingFetch || isErrorFetch) && isSubmit
    const errorMessage = isErrorFetch ? errorContent : null
    const spinner = isLoadingFetch ? spinnerContent : null
    const content = hasData ? contentResult : null
    let freeTime = tariffs?.tariffs[0].freeMins


    return (
        <ClientLayout parkingID={parkingID} title={parkingData?.payment_page_header} isHideMenu>
            {subscriptions?.supportSubscribe &&
                <Button className="mb-3" onClick={()=>setBuyModal(true)}>Купить абонемент</Button>}
            <div className={css.price}>
                <div className={css.green}>{freeTime}мин 0&#8381;</div>
                {tariffs?.tariffs?.map((item) => (
                    <> 
                       <div>
                            {item.passMode === 'pay_by_hour' ?  ` 1ч ${item.price}₽`:  `${item.interval}ч ${item.price}₽ `}
                        </div>
                       
                    </>
                ))}
            </div>
            <Modal
                show={buyModal}
                handleClose={()=>setBuyModal(false)}
                header={ <h3>Покупка абонемента</h3>}
                body={<SubscriptionModal subscriptions={subscriptions}/>}
            />
            <Formik
                initialValues={{
                    number: '',
                }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {(props) => (
                    <form onSubmit={props.handleSubmit} className={css.form}>
                        <Input
                            label="Номер машины"
                            name="number"
                            type="text"
                            onChange={(e) => props.setFieldValue('number', e.target.value)}
                            className={css.input}
                            placeholder="123"
                        />
                        <Button variant="success" type="submit" className={css.btn}>
                            Найти
                        </Button>
                    </form>
                )}
            </Formik>

            {errorMessage}
            {spinner}
            {content}
        </ClientLayout>
    )
}

export default ClientPaymentPage