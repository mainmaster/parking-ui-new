import { useEffect, useRef } from 'react'
import css from './EditLedModal.module.scss'
import PropTypes from 'prop-types'
import { Button, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
// Components
import Modal from 'components/Modal'
import Input from 'components/Input'
// Store
import { editLedFetch } from 'store/led/ledSlice'
// Utils
import { editLedSchema } from './utils'
import Select from 'components/Select'


const EditLedModal = ({ show, handleClose }) => {
  const dispatch = useDispatch()
  const formikRef = useRef()
  const ledEdit = useSelector((state) => state.leds.ledEdit)

  const onSubmit = (values) => {
    dispatch(editLedFetch(values))
  }

  useEffect(() => {
    if (show && formikRef.current) {
      formikRef.current.setFieldValue('led_board_type', ledEdit.led_board_type)
      formikRef.current.setFieldValue('description', ledEdit.description)
      formikRef.current.setFieldValue('ip_address', ledEdit.ip_address)
      formikRef.current.setFieldValue('port', ledEdit.port)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<CustomModal.Title>Редактировать LED табло</CustomModal.Title>}
      body={
        <Formik
          initialValues={{
            ip_address: '',
            description: '',
            led_board_type: '',
            port: 0
          }}
          onSubmit={onSubmit}
          innerRef={formikRef}
          validationSchema={editLedSchema}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} id="edit-led">
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
                label="Ip адрес"
                name="ip_address"
                type="text"
                onChange={(e) =>
                  props.setFieldValue('ip_address', e.target.value)
                }
                className={css.input}
              />
               <Select
                label="Тип табло"
                name="led_board_type"
                options={[
                  {name: 'Магнит', value: 'magnit'},
                  {name: 'Запуск', value: 'zapusk'}
                ]}
                onChange={(e) =>
                  props.setFieldValue('led_board_type', e.target.value)
                }
                className={css.input}
              />
                <Input
                    label="Порт"
                    name="port"
                    type="number"
                    onChange={(e) =>
                        props.setFieldValue('port', Number(e.target.value))
                    }
                    className={css.input}
                />
            </form>
          )}
        </Formik>
      }
      footer={
        <Button type="submit" form="edit-led">
          Изменить
        </Button>
      }
    />
  )
}

EditLedModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default EditLedModal
