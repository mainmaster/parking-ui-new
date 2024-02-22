import { useEffect, useRef, useState } from 'react'
import css from './EditBlackListModal.module.scss'
import PropTypes from 'prop-types'
import { Button, Form, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { DatePicker } from 'rsuite'
import { isBefore } from 'date-fns'
// Components
import Modal from 'components/Modal'
import Input from 'components/Input'
// Store
import { editBlackListFetch } from 'store/blackList/blackListSlice'
// Utils
import { editBlackListSchema } from './utils'

const EditBlackListModal = ({ show, handleClose }) => {
  const dispatch = useDispatch()
  const formikRef = useRef()
  const blackListEdit = useSelector((state) => state.blackList.blackListEdit)
  const [date, setDate] = useState(null)

  const onSubmit = (values) => {
    dispatch(editBlackListFetch({ valid_until: date, ...values }))
  }

  useEffect(() => {
    if (show && formikRef.current) {
      formikRef.current.setFieldValue('description', blackListEdit.description)
      formikRef.current.setFieldValue(
        'vehicle_plate',
        blackListEdit.vehicle_plate.full_plate
      )
      setDate(new Date(blackListEdit.valid_until))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={
        <CustomModal.Title>Изменить черный список</CustomModal.Title>
      }
      body={
        <Formik
          initialValues={{
            description: '',
            vehicle_plate: '',
          }}
          onSubmit={onSubmit}
          innerRef={formikRef}
          validationSchema={editBlackListSchema}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} id="edit-black-list">
              <div className={css.input}>
                <Form.Label htmlFor="datepicker">Доступ запрещен до</Form.Label>
                <DatePicker
                  format="yyyy-MM-dd"
                  value={date}
                  onChange={setDate}
                  disabledDate={(date) => isBefore(date, new Date())}
                  id="datepicker"
                  className={css.datepicker}
                  placeholder="Дата"
                  ranges={[]}
                />
              </div>
              <Input
                label="Название"
                name="description"
                type="text"
                onChange={(e) =>
                  props.setFieldValue('description', e.target.value)
                }
                className={css.input}
              />
              <Input
                label="Номер машины"
                name="vehicle_plate"
                type="text"
                onChange={(e) =>
                  props.setFieldValue('vehicle_plate', e.target.value)
                }
                className={css.input}
              />
            </form>
          )}
        </Formik>
      }
      footer={
        <Button type="submit" form="edit-black-list">
          Изменить
        </Button>
      }
    />
  )
}

EditBlackListModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default EditBlackListModal
