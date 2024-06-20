import {Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {Close} from "@mui/icons-material";
import React, {useState} from "react";
import moment from "moment";
import DialogContext from "@mui/material/Dialog/DialogContext";
import {DateRangePicker} from "rsuite";
import {Button} from "react-bootstrap";
import {Formik} from "formik";

const SubscriptionPaymentModal = ({show, handleClose, subscription}) => {
  moment.locale('ru')
  return (
    <Dialog
      open={show}
      onClose={handleClose}
      PaperProps={{
        sx: {borderRadius: '16px'}
      }}
    >
      <DialogTitle
        style={{textAlign: 'center', width: 400}}
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
        <div>
          Абонимент на {subscription.subscription?.toLowerCase()} за {subscription.price}₽,
          от {moment(new Date).format('d MMM yyyy')}
        </div>
      </DialogTitle>
      <DialogContent>
      </DialogContent>
    </Dialog>
  )
}

export default SubscriptionPaymentModal;