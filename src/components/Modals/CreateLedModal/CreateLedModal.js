import css from './CreateLedModal.module.scss'
import PropTypes from 'prop-types'
import { Button, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch } from 'react-redux'
// Components
import Modal from 'components/Modal'
import Input from 'components/Input'
// Store
import { createLedFetch } from 'store/led/ledSlice'
import Select from 'components/Select'

// Utils
import { createLedSchema } from './utils'

const CreateLedModal = ({ show, handleClose }) => {
  const dispatch = useDispatch()

  const onSubmit = (values) => {
    dispatch(createLedFetch(values))
  }

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<CustomModal.Title>Добавить LED табло</CustomModal.Title>}
      body={
        <Formik
          initialValues={{
            ip_address: '',
            description: '',
            led_board_type: '',
            port: 20108
          }}
          onSubmit={onSubmit}
          validationSchema={createLedSchema}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} id="create-led">
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
        <Button type="submit" form="create-led">
          Создать
        </Button>
      }
    />
  )
}

CreateLedModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default CreateLedModal
