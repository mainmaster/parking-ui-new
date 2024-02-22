import { useLayoutEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard'
import Image from 'react-bootstrap/Image'
import { Spinner, Button } from 'react-bootstrap'
import { formatDate } from 'utils'
import { statusSessionName } from 'constants'
import { useDispatch, useSelector } from 'react-redux'
import { paymentSelectFetch } from '../../store/payments/paymentsSlice'
import { usePostPaymentRefundMutation } from '../../api/apiSlice'

export const PaymentPage = () => {

  const [addRefund] = usePostPaymentRefundMutation()
  

  const { id } = useParams()

  const payment = useSelector((state) => state.payments.selectPayment)
  const loading = useSelector((state) => state.payments.isLoadingSelect)
  const errorLoad = useSelector((state) => state.payments.isErrorSelect)

  const dispatch = useDispatch()

  const handleRefundPayment = (id) => {
    addRefund(id)
      .unwrap()
      .then(() => dispatch(paymentSelectFetch()))
  }

  useLayoutEffect(() => {
    document.title = `Оплата №${id}` || 'Загрузка'
    dispatch(paymentSelectFetch(id))

    return () => {
      document.title = 'Parking'
    }
  }, [dispatch, id])

  const errorContent = <h1>Оплаты с №{id} не найдено</h1>

  return (
    <div style={{ padding: 20 }}>
      <NavLink to="/payments">Назад</NavLink>
      {loading && <Spinner />}
      {errorLoad && errorContent}
      {payment && (
        <>
          <div style={{ marginTop: '20px' }}>
            <h2>Оплата №{id}</h2>
            <div
              style={{ display: 'flex', marginTop: '20px', flexWrap: 'wrap' }}
            >
              <div>
                {payment?.vehicle_plate?.full_plate !== '' && (
                  <CarNumberCard carNumber={payment?.vehicle_plate} />
                )}
                <div style={{display: 'flex', gap: '20px', marginTop: '20px'}}>
                    <div>
                        <h4>
                            <strong>Cумма оплаты</strong>
                            <br />
                            <span>{payment.totalPayedSum}₽</span>
                        </h4>
                        <h4>
                            <strong>Способ оплаты</strong>
                            <br />
                            <span>{payment.paymentType}</span>
                        </h4>
                        {payment.isRefund ? null : (
                            <Button style={{marginRight: '5px'}} onClick={() => handleRefundPayment(payment.id)}>
                                Возврат
                            </Button>
                        )}
                    </div>
                    <div>
                        <h4>
                            <strong>Статус возврата</strong>
                            <br />
                            <span>{payment.isRefund ? <>Возврат</> : '-'}</span>
                        </h4>
                        <h4>
                            <strong>Дата оплаты</strong>
                            <br />
                            <span>{formatDate(payment.create_datetime)}</span>
                        </h4>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
