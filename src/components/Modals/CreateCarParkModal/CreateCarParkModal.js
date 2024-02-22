import { useState } from 'react'
import css from './CreateCarParkModal.module.scss'
import PropTypes from 'prop-types'
import { Button, Form, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch } from 'react-redux'
import { DatePicker } from 'rsuite'
import { isBefore } from 'date-fns'
// Components
import Modal from 'components/Modal'
import Input from 'components/Input'
import Select from 'components/Select'

// Store
import { createCarParkFetch } from 'store/carPark/carParkSlice'
// Utils
import { useParams } from 'react-router-dom'
import { createCarParkSchema } from './utils'
import { useRentersQuery } from '../../../api/renters/renters.api'

const CreateCarParkModal = ({ show, handleClose }) => {
  const dispatch = useDispatch()
  const [date, setDate] = useState(null)
  const {data: renters} = useRentersQuery()
  const urlStatus = useParams()

  const onSubmit = (values) => {
    date.setHours(23, 59, 0, 0)
    dispatch(createCarParkFetch({ valid_until: date, ...values }))
  }

  const renterOptions = renters?.map((renter)=>{
    return {
      name: renter.company_name,
      value: renter.id
    }
  })

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<CustomModal.Title>Добавить машину</CustomModal.Title>}
      body={
        <Formik
          initialValues={{
            description: '',
            vehicle_plate: '',
            status: urlStatus['*'],
            renter: '',
            is_active: true
          }}
          onSubmit={onSubmit}
          validationSchema={createCarParkSchema}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} id="create-car">
              <div className={css.input}>
                <Form.Label htmlFor="datepicker">Пропуск активен до</Form.Label>
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
              <Select
                label="Арендатор"
                options={renterOptions}
                onChange={(e) =>
                  props.setFieldValue('renter', e.target.value)
                }
                name="renter"
                className={css.input}
              />
            </form>
          )}
        </Formik>
      }
      footer={
        <Button type="submit" form="create-car">
          Добавить
        </Button>
      }
    />
  )
}

CreateCarParkModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default CreateCarParkModal
