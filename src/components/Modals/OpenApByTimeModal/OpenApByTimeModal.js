import css from './OpenApByTimeModal.module.scss'
import PropTypes from 'prop-types'
import { Button, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
// Components
import Modal from 'components/Modal'
import Input from 'components/Input'
// Store
import { openApTimeFetch } from 'store/events/eventsSlice'
// Utils
import { openApSchema } from './utils'
import {useTranslation} from "react-i18next";

const OpenApByTimeModal = ({ show, handleClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const accessPointId = useSelector((state) => state.cameras.accessPointId)

  const onSubmit = (values) => {
    const payload = {
      accessPointid: accessPointId,
      seconds: values.time,
    }
    dispatch(openApTimeFetch(payload))
  }

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={
        <CustomModal.Title>
          {t('components.openApByTimeModal.openForNSeconds')}
        </CustomModal.Title>
      }
      body={
        <Formik
          initialValues={{
            time: '',
          }}
          onSubmit={onSubmit}
          validationSchema={openApSchema}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} id="open-ap-plate">
              <Input
                label={t('components.openApByTimeModal.secondsCount')}
                name="time"
                type="text"
                onChange={(e) => props.setFieldValue('time', e.target.value)}
                className={css.input}
              />
            </form>
          )}
        </Formik>
      }
      footer={
        <Button type="submit" form="open-ap-plate">
          {t('components.openApByTimeModal.open')}
        </Button>
      }
    />
  )
}

OpenApByTimeModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default OpenApByTimeModal
