import css from './ClientLayout.module.scss'
import PropTypes from 'prop-types'
import { Telephone } from 'react-bootstrap-icons'
// Icons
import mirImg from 'icons/mir.png'
import visaImg from 'icons/visa.png'
import mastercardImg from 'icons/mastercard.png'
import jcbImg from 'icons/jcb.png'
import { logoIcon } from 'icons/index'
// Api
import { useGetInfoFooterQuery } from 'api/apiSlice'
import {getPaymentsPageImage} from "../../api/settings/paymentsPageImage";
import {useEffect, useLayoutEffect, useState} from "react";
import {useTranslation} from "react-i18next";

const ClientLayout = ({ children, parkingID, title }) => {
  const { t } = useTranslation();
  const { data } = useGetInfoFooterQuery(parkingID)
  const [bannerPicture, setBannerPicture] = useState(null);

  useEffect(()=>{
    getPaymentsPageImage(parkingID).then((res)=>{
      setBannerPicture(res.config.baseURL + res.config.url)
    })
  },[])

  return (
    <div className={css.layout}>
      <div className={css.content}>
        <div className={css.client}>
          <img src={bannerPicture} alt={data?.name} />
          <div className={css.client_title}>{title || t('components.clientLayout.loading')}</div>
          <a className={css.phone} href={`tel:${data?.operator_phone_number}`}>
            <Telephone fill="rgba(28, 128, 241, 1)" />
            <div className={css.phone_title}>{t('components.clientLayout.operator')}</div>
          </a>
        </div>
        <div className={css.layout_content}>
          <div className={css.layout_content_wrap}>{children}</div>
        </div>
      </div>
      <div className={css.footer}>
        {logoIcon}
        <div className={css.footer_text}>
          <span>{data?.name}</span>
          <span>{data?.info}</span>
          <a href={data?.refund} target="_blank" rel="noreferrer">
            {t('components.clientLayout.refund')}
          </a>
          <br/>
          <a href={data?.oferta} target="_blank" rel="noreferrer">
            {t('components.clientLayout.oferta')}
          </a>
          <div className={css.payments}>
            <span>{t('components.clientLayout.paymentOnlyCard')}</span>
            <img src={mirImg} alt="mir" />
            <img src={visaImg} alt="visa" />
            <img src={mastercardImg} alt="mastercard" />
            <img src={jcbImg} alt="jcb" />
          </div>
        </div>
      </div>
    </div>
  )
}

ClientLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
}

export default ClientLayout
