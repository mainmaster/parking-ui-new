// import css from './PaymentInfoItem.module.scss'
import PropTypes from 'prop-types'
import { Button, Card, Form } from 'react-bootstrap'
import Modal from 'components/Modal'
import Input from 'components/Input'

import moment from 'moment'
import { Formik } from 'formik'
import { useState } from 'react'
import { useGlobalSettingsQuery } from '../../api/settings/settings'
import { useSubscriptionsQuery } from '../../api/payments.api'
import { useSearchParams } from 'react-router-dom'

function getTimeFromMins(time) {
  let mins = time % 60
  let hours = (time - mins) / 60

  if (mins < 10) mins = '0' + mins
  if (hours < 10) hours = '0' + hours

  return hours + 'ч:' + mins + 'м'
}

const SubmitModal = ({ show, handleClose, payHandler, sessionId }) => {

  const handleSubmit = (values) =>{
    if(values.no_check_needed){
      values.email = ''
    }
    payHandler({...values, sessionId})
  }

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<h3>Оплата</h3>}
      body={
        <Formik 
          onSubmit={handleSubmit}
          initialValues={{ email: '', no_check_needed: false }}>
          {(props) => (
            <form onSubmit={props.handleSubmit} id="pay-handler">
              <Input
                label="Укажите ваш e-mail для отправки фискального чека"
                name="email"
                required
                type="text"
                value={props.values.no_check_needed ? '' : props.values.email}
                disabled={props.values.no_check_needed}
                onChange={(e) => props.setFieldValue('email', e.target.value)}
              />

              <Form.Check
                label='Чек не нужен'
                name='no_check_needed'
                type='checkbox'
                className='mt-2 mb-2'
                onChange={(e) => props.setFieldValue('no_check_needed', e.target.checked)}
              />
              
              <Button variant="primary" className='mt-2' type='submit'>
                Оплатить
              </Button>
            </form>
          )}
        </Formik>
      }
    />
  )
}

const PaymentInfoItem = ({
  Name,
  Amount,
  TotalTimeMin,
  ImgPath,
  payHandler,
  SessionCreatedAt,
  sessionId
}) => {

  const payment = () =>{
    payHandler({sessionId: sessionId, email: ''})
  }

  const [show, setShow] = useState(false)
  const [params] = useSearchParams()
  const {data: subscriptions} = useSubscriptionsQuery(params.get('parkingID'))


  return (
    <Card>
      <SubmitModal 
        payHandler={payHandler} 
        show={show} 
        sessionId={sessionId}
        handleClose={()=>setShow(false)}
      />
      
      <Card.Img
        variant="top"
        src={process.env.REACT_APP_API_URL + '/' + ImgPath}
        style={{ maxHeight: 366 }}
      />
      <Card.Body>
        <Card.Title>
          {Name}, {moment(SessionCreatedAt).format('DD/MM/YY HH:mm')}
        </Card.Title>
        <Card.Text>
          <span>Сумма:</span> {Amount} руб.
          <br />
          <span>Время проведенное на парковке:</span>{' '}
          {getTimeFromMins(TotalTimeMin)}
        </Card.Text>
        <Button variant="primary" onClick={()=>{
            if(subscriptions.emailForPayment){
              setShow(true)
            }else{
              payment()
            }
        }}>
          Оплатить
        </Button>
      </Card.Body>
    </Card>
  )
}

PaymentInfoItem.propTypes = {
  SessionId: PropTypes.number,
  Name: PropTypes.string,
  Quantity: PropTypes.number,
  Amount: PropTypes.number,
  TotalTimeMin: PropTypes.number,
  FreeMinutesLeft: PropTypes.number,
  VAT: PropTypes.number,
  ImgPath: PropTypes.string,
  VehiclePlate: PropTypes.string,
  payHandler: PropTypes.func,
}

export default PaymentInfoItem
