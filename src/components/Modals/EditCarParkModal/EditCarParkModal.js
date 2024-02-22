import { useEffect, useRef, useState } from 'react'
import css from './EditCarParkModal.module.scss'
import PropTypes from 'prop-types'
import { Button, Form, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { DatePicker } from 'rsuite'
import { isBefore } from 'date-fns'
// Components
import Modal from 'components/Modal'
import Input from 'components/Input'
import Select from 'components/Select'
// Store
import { editCarParkFetch } from 'store/carPark/carParkSlice'
// Utils
import { editCarParkSchema } from './utils'
import { useRentersQuery } from '../../../api/renters/renters.api'
import { useParams } from 'react-router-dom'



const EditCarParkModal = ({ show, handleClose }) => {
  const dispatch = useDispatch()
  const formikRef = useRef()
  const carParkEdit = useSelector((state) => state.carPark.carParkEdit)
  const {data: renters} = useRentersQuery()
  const [date, setDate] = useState(null)
  const urlStatus = useParams()


  const onSubmit = (values) => {
    dispatch(editCarParkFetch({ valid_until: date, ...values }))
  }

  useEffect(() => {
    if (show && formikRef.current) {
      formikRef.current.setFieldValue('description', carParkEdit.description)
      formikRef.current.setFieldValue('renter', carParkEdit.renter)

      formikRef.current.setFieldValue(
        'vehicle_plate',
        carParkEdit.vehicle_plate.full_plate
      )
      setDate(new Date(carParkEdit.valid_until))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

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
      header={<CustomModal.Title>Редактировать машину</CustomModal.Title>}
      body={
        <Formik
          initialValues={{
            description: '',
            vehicle_plate: '',
            status: urlStatus['*'],
          }}
          onSubmit={onSubmit}
          innerRef={formikRef}
          validationSchema={editCarParkSchema}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} id="edit-car">
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
        <Button type="submit" form="edit-car">
          Изменить
        </Button>
      }
    />
  )
}

EditCarParkModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default EditCarParkModal
