import css from './SuccessPaymentPage.module.scss'
import { CheckCircleFill } from 'react-bootstrap-icons'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
// Components
import ClientLayout from 'components/ClientLayout'
import {getSuccessPayment, getSuccessPaymentSubs} from "../../api/successPayment/successPayment.api";
import Cookies from 'universal-cookie';
import { useGetInfoFooterQuery } from 'api/apiSlice'
import {Stack, Typography} from "@mui/material";
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import {getPaymentsPageImage} from "../../api/settings/paymentsPageImage";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {useTranslation} from "react-i18next";


const formatTime = (num) => {
  const minutes = Math.floor(num / 60)
  const seconds = num % 60
  return [
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':')
}

const SuccessPaymentPage = () => {
  const { t } = useTranslation();

  let parkingID = new URLSearchParams(window.location.search).get('parkingID')
  const [seconds, setSeconds] = useState(0)
  const [timerActive] = useState(true)
  const {data: parkingData} = useGetInfoFooterQuery(parkingID)
  const [banner, setBanner] = useState('');

  const cookies = new Cookies();

  let dataNow = moment().format('YYYY-MM-DDTHH:mm:ss.SSSS')
  let dateToLeave = moment(moment(cookies.get('timeByWhichCanLeave')))

  console.log(dateToLeave)

  useEffect(()=>{
    getSuccessPayment(parkingID)
    getPaymentsPageImage(parkingID).then(res => {
      setBanner(res.config.baseURL + res.config.url)
    })
    document.title = parkingData?.payment_page_header

  },[parkingData?.payment_page_header, parkingID])


  useEffect(() => {
    if(Math.floor(moment.duration(moment(moment(cookies.get('timeByWhichCanLeave'))).diff(dataNow)).asSeconds()) < 0){
      setSeconds(0)
    }else{
      setTimeout(()=>{
        setSeconds(Math.floor(moment.duration(moment(moment(cookies.get('timeByWhichCanLeave'))).diff(dataNow)).asSeconds()))
      }, 1000)
    }
  }, [dataNow, moment(moment(cookies.get('timeByWhichCanLeave'))), seconds, timerActive])

  const { data: footerInfo } = useGetInfoFooterQuery(parkingID)

  return (
      <div className={css.wrapper}>
        <Stack direction={'column'} sx={{width: '100%', maxWidth: '1024px', padding: '16px 16px 0 16px'}} gap={'24px'}>
          <div className={css.bannerContainer}>
            <img className={css.logo} src={banner} alt=''/>
            <a className={css.dispatcher} href={`tel:${footerInfo?.operator_phone_number}`}>
              <PhoneOutlinedIcon/>
              <Typography>{t('pages.successPaymentPage.manager')}</Typography>
            </a>
          </div>
        </Stack>
        <div className={css.content}>
          <CheckCircleFill className={css.icon}/>
          <div className={css.success}>{t('pages.successPaymentPage.success')}</div>
          <div className={css.text}>{t('pages.successPaymentPage.timeToOut')}</div>
          <div className={css.time}>{formatTime(seconds)}</div>
        </div>
      </div>
  )
}

export default SuccessPaymentPage
