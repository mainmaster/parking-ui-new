import css from './CreateControllerModal.module.scss'
import PropTypes from 'prop-types'
import { Button, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch } from 'react-redux'
// Components
import Modal from 'components/Modal'
import Input from 'components/Input'
// Store
import { createControllerFetch } from 'store/controllers/controllersSlice'
// Utils
import { createControllerSchema } from './utils'

const CreateControllerModal = ({ show, handleClose }) => {
  const dispatch = useDispatch()

  const onSubmit = (values) => {
    dispatch(createControllerFetch(values))
  }

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<CustomModal.Title>Добавить контроллер</CustomModal.Title>}
      body={
        <Formik
          initialValues={{
              ip_address: '',
              description: '',
              password: '',
              port: 80
          }}
          onSubmit={onSubmit}
          validationSchema={createControllerSchema}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} id="create-camera">
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
                <Input
                    label="Пароль"
                    name="password"
                    type="text"
                    onChange={(e) =>
                        props.setFieldValue('ip_address', e.target.value)
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
        <Button type="submit" form="create-camera">
          Создать
        </Button>
      }
    />
  )
}

CreateControllerModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default CreateControllerModal
