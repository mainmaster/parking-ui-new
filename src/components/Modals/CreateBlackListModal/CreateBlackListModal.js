import { useState } from 'react'
import css from './CreateBlackListModal.module.scss'
import PropTypes from 'prop-types'
import { Button, Form, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch } from 'react-redux'
import { DatePicker } from 'rsuite'
import { isBefore } from 'date-fns'
// Components
import Modal from 'components/Modal'
import Input from 'components/Input'
// Store
import { createBlackListFetch } from 'store/blackList/blackListSlice'
// Utils
import { createBlackListSchema } from './utils'


const CreateBlackListModal = ({ show, handleClose }) => {
  const dispatch = useDispatch()
  const [date, setDate] = useState(null)


  const onSubmit = (values) => {
    date.setHours(23, 59, 0, 0)
    dispatch(createBlackListFetch({ valid_until: date, ...values }))
  }

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<CustomModal.Title>Добавить в черный список</CustomModal.Title>}
      body={
        <Formik
          initialValues={{
            description: '',
            vehicle_plate: '',
          }}
          onSubmit={onSubmit}
          validationSchema={createBlackListSchema}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} id="create-black-list">
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
        <Button type="submit" form="create-black-list">
          Добавить
        </Button>
      }
    />
  )
}

CreateBlackListModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default CreateBlackListModal
