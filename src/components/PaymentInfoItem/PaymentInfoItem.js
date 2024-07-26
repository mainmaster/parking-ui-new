import {useTranslation} from "react-i18next";
import css from './PaymentInfoItem.module.scss'
import PropTypes from 'prop-types'
import { Button, Card, Form } from 'react-bootstrap'
import Modal from 'components/Modal'
import Input from 'components/Input'

import moment from 'moment'
import { Formik } from 'formik'
import React, {Fragment, useMemo, useState} from 'react'
import { useSubscriptionsQuery } from '../../api/payments.api'
import { useSearchParams } from 'react-router-dom'
import {CarNumberCard} from "../CarNumberCard/CarNumberCard";
import {Box, Dialog, DialogContent, DialogTitle, IconButton, Stack} from "@mui/material";
import {Close, KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import eventInIcon from '../../assets/svg/log_event_in_icon.svg';
import sessionSkeleton from '../../assets/svg/session_skeleton.svg';
import {useTheme} from "@mui/material/styles";
import Lightbox from "react-18-image-lightbox";

const imageStyle = {
  objectFit: 'contain',
  objectPosition: 'center',
  height: '100%',
  width: '100%',
  minHeight: '174px',
  maxHeight: '250px',
  display: 'block',
  cursor: 'pointer'
};

function getTimeFromMins(time) {
  let mins = time % 60
  let hours = (time - mins) / 60

  if (mins < 10) mins = '0' + mins
  if (hours < 10) hours = '0' + hours

  return hours + 'ч:' + mins + 'м'
}

const SubmitModal = ({ show, handleClose, payHandler, sessionId}) => {
  const { t } = useTranslation();
  const handleSubmit = (values) =>{
    if(values.no_check_needed){
      values.email = ''
    }
    payHandler({...values, sessionId})
  }

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      PaperProps={{
        sx: {borderRadius: '16px'},
        className: css.dialogWrapper,
      }}
    >
      <DialogTitle
        style={{textAlign: 'center'}}
      >
        {t('components.paymentIntoSubmitModal.payment')}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 7,
            top: 5,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Formik
          onSubmit={handleSubmit}
          initialValues={{ email: '', no_check_needed: false }}>
          {(props) => (
            <form onSubmit={props.handleSubmit} id="pay-handler">
              <Input
                label={t('components.paymentIntoSubmitModal.emailForCheck')}
                name="email"
                required
                type="text"
                value={props.values.no_check_needed ? '' : props.values.email}
                disabled={props.values.no_check_needed}
                onChange={(e) => props.setFieldValue('email', e.target.value)}
              />

              <Form.Check
                label={t('components.paymentIntoSubmitModal.checkNotNeed')}
                name='no_check_needed'
                type='checkbox'
                className='mt-2 mb-2'
                onChange={(e) => props.setFieldValue('no_check_needed', e.target.checked)}
              />

              <Button variant="primary" className='mt-2' type='submit' style={{width: '100%'}}>
                {t('components.paymentIntoSubmitModal.forPayment')}
              </Button>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

const PaymentInfoItem = ({
  Amount,
  TotalTimeMin,
  ImgPath,
  payHandler,
  SessionCreatedAt,
  sessionId,
  AmountDetails,
  VehiclePlate,
  freeTime
}) => {

  const { t } = useTranslation();
  const payment = () =>{
    payHandler({sessionId: sessionId, email: ''})
  }

  const [show, setShow] = useState(false);
  const [isDetailShow, setIsDetailShow] = useState(false);
  const [params] = useSearchParams()
  const {data: subscriptions} = useSubscriptionsQuery(params.get('parkingID'))
  const theme = useTheme();
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    src: ''
  });

  const changeActiveImageModal = (src) =>
    setImageModal({
      src: src,
      isOpen: !imageModal.isOpen
    });

  const imageContainerStyle = useMemo(() => {
    return {
      backgroundColor: theme.colors.surface.high,
      border: `1px solid ${theme.colors.outline.surface}`
    };
  }, [theme]);

  const detailComponent = ({start, end, format, amount, description}) => {
    return (
      <div key={start} className={css.detail_container}>
        <div className={css.detail_container_time}>
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
    <div className={css.item}>
         <SubmitModal
          payHandler={payHandler}
          show={show}
          sessionId={sessionId}
          handleClose={() => setShow(false)}
        />
      <Box
        sx={[
          imageContainerStyle,
          ImgPath ? {} : { backgroundImage: `url("${sessionSkeleton}")` }
        ]}
      >
        <img
          className={css.imageContainer}
          style={imageStyle}
          src={`${process.env.REACT_APP_API_URL + '/' + ImgPath}`}
          alt="img"
          onClick={() => changeActiveImageModal(`${process.env.REACT_APP_API_URL + '/' + ImgPath}`)}
        />
      </Box>
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
               <img alt={'нет изображения'} style={{width: '18px'}} src={eventInIcon}/>
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
                     description: `${t('components.paymentInfoItem.first')} ${freeTime}${t('components.paymentInfoItem.м')}`
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
                     description: `${t('components.paymentInfoItem.first')} 3${t('components.paymentInfoItem.h')}`
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
                     description: `100₽/${t('components.paymentInfoItem.h')}`
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
                     description: `1000₽/${t('components.paymentInfoItem.d')}`
                   })
                 )
               }
             })}
             <span>{t('components.paymentInfoItem.timeSpentOnParking')}: {getTimeFromMins(TotalTimeMin)}</span>
           </Stack>
           : <></>}
         <Button variant="primary" style={{width: '100%'}} onClick={()=>{
           if(subscriptions.emailForPayment){
             setShow(true)
           }else{
             payment()
           }
         }}>
           {t('components.paymentInfoItem.pay')} {Amount} ₽
         </Button>
       </Stack>
      {imageModal.isOpen && (
        <Lightbox
          onCloseRequest={changeActiveImageModal}
          mainSrc={imageModal.src}
          imagePadding={100}
          reactModalStyle={{
            overlay: { zIndex: 1300 }
          }}
        />
      )}
    </div>
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
