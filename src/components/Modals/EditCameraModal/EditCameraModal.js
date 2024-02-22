import { useEffect, useRef } from 'react'
import css from './EditCameraModal.module.scss'
import PropTypes from 'prop-types'
import { Button, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
// Components
import Modal from 'components/Modal'
import Input from 'components/Input'
// Store
import { editCameraFetch } from 'store/cameras/camerasSlice'
// Utils
import { editCameraSchema } from './utils'

const EditCameraModal = ({ show, handleClose }) => {
  const dispatch = useDispatch()
  const formikRef = useRef()
  const cameraEdit = useSelector((state) => state.cameras.cameraEdit)

  const onSubmit = (values) => {
    dispatch(editCameraFetch(values))
  }

  useEffect(() => {
    if (show && formikRef.current) {
      formikRef.current.setFieldValue('description', cameraEdit.description)
      formikRef.current.setFieldValue('ip_address', cameraEdit.ip_address)
      formikRef.current.setFieldValue('login', cameraEdit.login)
      formikRef.current.setFieldValue('password', cameraEdit.password)
      formikRef.current.setFieldValue('mjpeg_url', cameraEdit.mjpeg_url)
      formikRef.current.setFieldValue('snapshot_url', cameraEdit.snapshot_url)
      formikRef.current.setFieldValue('port', cameraEdit.port)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<CustomModal.Title>Изменить камеру</CustomModal.Title>}
      body={
        <Formik
          initialValues={{
            login: '',
            password: '',
            ip_address: '',
            description: '',
            mjpeg_url: '',
            snapshot_url: '',
            port: 0
          }}
          onSubmit={onSubmit}
          innerRef={formikRef}
          validationSchema={editCameraSchema}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} id="edit-camera">
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
                onChange={(e) => props.setFieldValue('login', e.target.value)}
                className={css.input}
              />
              <Input
                label="Пароль"
                name="password"
                type="text"
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
        <Button type="submit" form="edit-camera">
          Изменить
        </Button>
      }
    />
  )
}

EditCameraModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default EditCameraModal
