import css from './CreateCameraModal.module.scss'
import PropTypes from 'prop-types'
import { Button, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch } from 'react-redux'
// Components
import Modal from 'components/Modal'
import Input from 'components/Input'
// Store
import { createCameraFetch } from 'store/cameras/camerasSlice'
// Utils
import { createCameraSchema } from './utils'

const CreateCameraModal = ({ show, handleClose }) => {
  const dispatch = useDispatch()

  const onSubmit = (values) => {
    dispatch(createCameraFetch(values))
  }

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<CustomModal.Title>Добавить камеру</CustomModal.Title>}
      body={
        <Formik
          initialValues={{
            login: '',
            password: '',
            ip_address: '',
            description: '',
            mjpeg_url: '',
            snapshot_url: '',
            port: 80
          }}
          onSubmit={onSubmit}
          validationSchema={createCameraSchema}
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
                label="Адрес трансляции"
                name="mjpeg_url"
                type="text"
                onChange={(e) =>
                  props.setFieldValue('mjpeg_url', e.target.value)
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
                <Input
                    label="Ссылка на снапшот"
                    name="snapshot_url"
                    type="text"
                    onChange={(e) =>
                        props.setFieldValue('snapshot_url', e.target.value)
                    }
                    className={css.input}
                />
              <Input
                label="Логин"
                name="login"
                type="text"
                onChange={(e) => props.setFieldValue('email', e.target.value)}
                className={css.input}
              />
              <Input
                label="Пароль"
                name="password"
                type="password"
                onChange={(e) =>
                  props.setFieldValue('password', e.target.value)
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

CreateCameraModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default CreateCameraModal
