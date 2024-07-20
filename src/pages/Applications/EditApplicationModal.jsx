import { useRef,useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
// Components
import Modal from 'components/Modal'
import Input from 'components/Input'
import { editApplicationFetch } from '../../store/applications/applicationSlice'
import {useTranslation} from "react-i18next";

const EditApplicationModal = ({ show, handleClose }) => {
  const { t } = useTranslation();
  const formikRef = useRef()
  const dispatch = useDispatch()

  const {application} = useSelector((state)=> state.applications.editApplication)


  const onSubmit = (values) => {
    handleClose()
    dispatch(editApplicationFetch({
      ...application,
      vehicle_plate: values.vehicle_plate,
      valid_for_date: values.valid_for_date
    }))
  }

  useEffect(() => {
    if (show && formikRef.current) {
  
     formikRef.current.setFieldValue('vehicle_plate', application.vehicle_plate.full_plate)
     formikRef.current.setFieldValue('valid_for_date', application.valid_for_date)

    }
  }, [application, show])


  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<CustomModal.Title>{t('pages.editApplicationModal.editRequest')}</CustomModal.Title>}
      body={
        <Formik
          initialValues={{}}
          innerRef={formikRef}
          onSubmit={onSubmit}
          validationSchema={null}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} id="edit-application">
              <Input
                label={t('pages.editApplicationModal.vehiclePlate')}
                name="vehicle_plate"
                type="text"
                onChange={(e) =>
                  props.setFieldValue('vehicle_plate', e.target.value)
                }
              />
              <Input
                required
                label={t('pages.editApplicationModal.date')}
                className='mb-3'
                name="valid_for_date"
                onChange={(e) => props.setFieldValue('valid_for_date', e.target.value)}
                type='date'
              />
            </form>
          )}
        </Formik>
      }
      footer={
        <Button type="submit" form="edit-application">
          {t('pages.editApplicationModal.edit')}
        </Button>
      }
    />
  )
}

EditApplicationModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default EditApplicationModal
