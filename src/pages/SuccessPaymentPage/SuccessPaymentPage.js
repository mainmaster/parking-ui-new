import css from './SuccessPaymentPage.module.scss'
import { CheckCircleFill } from 'react-bootstrap-icons'
import { useEffect, useState } from 'react'
import moment from 'moment'
// Components
import ClientLayout from 'components/ClientLayout'
import {getSuccessPayment, getSuccessPaymentSubs} from "../../api/successPayment/successPayment.api";
import Cookies from 'universal-cookie';
import { useGetInfoFooterQuery } from 'api/apiSlice'



const formatTime = (num) => {
  const minutes = Math.floor(num / 60)
  const seconds = num % 60
  return [
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':')
}

const SuccessPaymentPage = () => {

  let parkingID = new URLSearchParams(window.location.search).get('parkingID')
  const [seconds, setSeconds] = useState(0)
  const [timerActive] = useState(true)
  const {data: parkingData} = useGetInfoFooterQuery(parkingID)


  const cookies = new Cookies();

  let dataNow = moment().format('YYYY-MM-DDTHH:mm:ss.SSSS')
  let dateToLeave = moment(moment(cookies.get('timeByWhichCanLeave')))

  console.log(dateToLeave)

  useEffect(()=>{
    getSuccessPayment(parkingID)
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

  return (
      <ClientLayout title={parkingData?.payment_page_header} parkingID={parkingID}>
        <div className={css.wrapper}>
          <CheckCircleFill className={css.icon} fill="rgb(1, 167, 1)" />
          <div className={css.success}>Оплата успешно проведена</div>
          <div className={css.text}>Бесплатное время для выезда:</div>
          <div className={css.time}>{formatTime(seconds)}</div>
        </div>
      </ClientLayout>
  )
}

export default SuccessPaymentPage
