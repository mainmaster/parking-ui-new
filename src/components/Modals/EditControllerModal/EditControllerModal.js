import { useEffect, useRef } from 'react'
import css from './EditControllerModal.module.scss'
import PropTypes from 'prop-types'
import { Button, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
// Components
import Modal from 'components/Modal'
import Input from 'components/Input'
// Store
import { editControllerFetch } from 'store/controllers/controllersSlice'
// Utils
import { editControllerSchema } from './utils'

const EditControllerModal = ({ show, handleClose }) => {
  const dispatch = useDispatch()
  const formikRef = useRef()
  const controllerEdit = useSelector(
    (state) => state.controllers.controllerEdit
  )

  const onSubmit = (values) => {
    dispatch(editControllerFetch(values))
  }

  useEffect(() => {
    if (show && formikRef.current) {
        formikRef.current.setFieldValue('description', controllerEdit.description)
        formikRef.current.setFieldValue('ip_address', controllerEdit.ip_address)
        formikRef.current.setFieldValue('password', controllerEdit.password)
        formikRef.current.setFieldValue('port', controllerEdit.port)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<CustomModal.Title>Редактировать контроллер</CustomModal.Title>}
      body={
        <Formik
          initialValues={{
                ip_address: '',
                description: '',
                password: '',
                port: 0
          }}
          onSubmit={onSubmit}
          innerRef={formikRef}
          validationSchema={editControllerSchema}
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
        <Button type="submit" form="edit-camera">
          Изменить
        </Button>
      }
    />
  )
}

EditControllerModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default EditControllerModal
