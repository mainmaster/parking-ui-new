// import css from './PaymentInfoItem.module.scss'
import PropTypes from 'prop-types'
import { Button, Card, Form } from 'react-bootstrap'
import Modal from 'components/Modal'
import Input from 'components/Input'

import moment from 'moment'
import { Formik } from 'formik'
import React, {Fragment, useState} from 'react'
import { useSubscriptionsQuery } from '../../api/payments.api'
import { useSearchParams } from 'react-router-dom'
import {CarNumberCard} from "../CarNumberCard/CarNumberCard";
import {IconButton, Stack} from "@mui/material";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import eventInIcon from '../../assets/svg/log_event_in_icon.svg';

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
  sessionId,
  AmountDetails,
  VehiclePlate
}) => {

  const payment = () =>{
    payHandler({sessionId: sessionId, email: ''})
  }

  const [show, setShow] = useState(false);
  const [isDetailShow, setIsDetailShow] = useState(false);
  const [params] = useSearchParams()
  const {data: subscriptions} = useSubscriptionsQuery(params.get('parkingID'))

  const detailComponent = ({start, end, format, amount, description}) => {
    return (
      <div key={start} style={{display: 'flex', gap: 8, fontSize: 16}}>
        <div style={{color:'rgb(126, 122, 131)', width: '30%'}}>
          {moment(start).format(format)}-{moment(end).format(format)}
        </div>
        <div style={{color: `${amount !== 0 ? '' : 'rgb(77, 143, 89)'}`}}>
          {amount}₽
        </div>
        <div style={{color:'rgb(126, 122, 131)'}}>
          ({description})
        </div>
      </div>
    )
  }

  return (
    <Card>
      <SubmitModal
        payHandler={payHandler}
        show={show}
        sessionId={sessionId}
        handleClose={() => setShow(false)}
      />

      <Card.Img
        variant="top"
        src={process.env.REACT_APP_API_URL + '/' + ImgPath}
        style={{ maxHeight: 366 }}
      />
      <Card.Body>
        <Stack direction={'column'} gap={'16px'}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <CarNumberCard carNumber={VehiclePlate} isTable />
            <div style={{width: 48, height: 40, display: "flex", alignItems: 'center', justifyContent: 'center', border: '1px solid black', borderRadius: 8, cursor: 'pointer'}} onClick={() => setIsDetailShow(!isDetailShow)}>
              {isDetailShow ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
            </div>
          </Stack>
          {isDetailShow && AmountDetails?.length && AmountDetails.length > 0 ?
            <Stack direction={'column'} gap={'4px'}>
              <div style={{display: 'flex', gap: 8, fontSize: 16}}>
                <div style={{color: 'rgb(126, 122, 131)', width: '30%'}}>
                  {moment(SessionCreatedAt).format('hh:mm, DD.MM')}
                </div>
                <img style={{width: '18px'}} src={eventInIcon}/>
                <div>
                  Въезд
                </div>
              </div>
              {AmountDetails.map((detail) => {
                if (detail.type === 'free_time_min') {
                  return (
                    detailComponent({
                      start: detail.start_hour,
                      end: detail.end_hour,
                      format: 'hh:mm',
                      amount: detail.amount,
                      description: 'первые 30м'
                    })
                  )
                }

                if (detail.type === 'pay_by_first_hours') {
                  return (
                    detailComponent({
                      start: detail.start_hour,
                      end: detail.end_hour,
                      format: 'hh:mm',
                      amount: detail.amount,
                      description: 'первые 3ч'
                    })
                  )
                }

                if (detail.type === 'pay_by_hour') {
                  return (
                    detailComponent({
                      start: detail.start_hour,
                      end: detail.end_hour,
                      format: 'hh:mm',
                      amount: detail.amount,
                      description: '100₽/ч'
                    })
                  )
                }

                if (detail.type === 'pay_by_day') {
                  return (
                    detailComponent({
                      start: detail.start_hour,
                      end: detail.end_hour,
                      format: 'DD.MM',
                      amount: detail.amount,
                      description: '1000₽/д'
                    })
                  )
                }
              })}
              <span>Время проведенное на парковке: {getTimeFromMins(TotalTimeMin)}</span>
            </Stack>
            : <></>}
          <Button variant="primary" style={{width: '100%'}} onClick={()=>{
            if(subscriptions.emailForPayment){
              setShow(true)
            }else{
              payment()
            }
          }}>
            Оплатить {Amount} ₽
          </Button>
        </Stack>
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
