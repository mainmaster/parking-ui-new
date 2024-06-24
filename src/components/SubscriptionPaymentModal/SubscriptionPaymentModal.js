import {Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {Close} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import {format, setDefaultOptions} from 'date-fns';
import css from './SubscriptionPaymentModal.module.scss';
import Input from 'components/Input'
import {Formik} from "formik";
import {useBuySubscriptionMutation} from "../../api/payments.api";
import {enqueueSnackbar} from "notistack";
import { Button } from 'react-bootstrap';
import { ru } from 'date-fns/locale'
import {useSearchParams} from "react-router-dom";

const SubscriptionPaymentModal = ({show, handleClose, subscription, }) => {
  setDefaultOptions({ locale: ru })
  const [params] = useSearchParams()
  const parkingID = params.get('parkingID')
  const [buy] = useBuySubscriptionMutation()
  const [title, setTitle] = useState('');
  const [duration, setDuratation] = useState('');

  useEffect(() => {
    const dateTo = new Date();
    switch (subscription.subscription.split(' ')[0].toLowerCase()) {
      case '1':
        dateTo.setFullYear(dateTo.getFullYear() + 1);
        setTitle(`от ${format(new Date, 'dd MMM yyyy')} до ${format(dateTo, 'dd MMM yyyy')}`);
        setDuratation('year');
        return;
      case '3':
        dateTo.setMonth(dateTo.getMonth() + 3);
        setTitle(`от ${format(new Date, 'dd MMM yyyy')} до ${format(dateTo, 'dd MMM yyyy')}`);
        setDuratation('quarter');
        return;
      case 'неделя':
        dateTo.setDate(dateTo.getDate() + 7);
        setTitle(`от ${format(new Date, 'dd MMM yyyy')} до ${format(dateTo, 'dd MMM yyyy')}`);
        setDuratation('month');
        return;
      case 'месяц':
        dateTo.setMonth(dateTo.getMonth() + 1);
        setTitle(`от ${format(new Date, 'dd MMM yyyy')} до ${format(dateTo, 'dd MMM yyyy')}`);
        setDuratation('week');
        return;
    }

  }, [subscription.title]);

  const handleSubmit = (data) =>{
    buy({...data, duration, parkingID})
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

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      PaperProps={{
        sx: {borderRadius: '16px'},
        className: css.dialogWrapper
      }}
    >
      <DialogTitle
        className={css.title}
      >
        <div>
          Покупка абонимента
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
        </div>
        <div className={css.subTitle}>
          Абонемент на {subscription.subscription?.toLowerCase()} за {subscription.price}₽,
          {title}
        </div>
      </DialogTitle>
      <DialogContent className={css.content}>
        <Formik
          onSubmit={handleSubmit}
          initialValues={{ email: '', vehiclePlate: '', fullName: '' }}>
          {(props) => (
            <form onSubmit={props.handleSubmit} id="pay-handler">
              <Input
                label="Имя и телефон, для связи"
                name="fullName"
                required
                type="text"
                placeholder='Иван +79219876543'
                value={props.values.fullName}
                onChange={(e) => props.setFieldValue('fullName', e.target.value)}
              />
              <Input
                label="Полный гос номер"
                name="vehiclePlate"
                required
                type="text"
                placeholder='А001АА 777'
                value={props.values.vehiclePlate}
                onChange={(e) => props.setFieldValue('vehiclePlate', e.target.value)}
              />
              {subscription.isEmailNeed && (
                <Input
                  label="E-mail"
                  name="email"
                  required
                  type="text"
                  placeholder='E-mail'
                  value={props.values.email}
                  onChange={(e) => props.setFieldValue('email', e.target.value)}
                />
              )}
              <Button variant="primary" className='mt-2' type='submit' style={{width: '100%'}}>
                Оплатить {subscription.price}₽
              </Button>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default SubscriptionPaymentModal;