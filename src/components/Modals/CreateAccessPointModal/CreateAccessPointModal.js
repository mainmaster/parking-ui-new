import { useMemo } from 'react'
import css from './CreateAccessPointModal.module.scss'
import PropTypes from 'prop-types'
import { Button, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
// Components
import Modal from 'components/Modal'
import Input from 'components/Input'
import Select from 'components/Select'
import MultiSelect from 'components/MultiSelect'
// Store
import { createAccessPointFetch } from 'store/accessPoints/accessPointsSlice'
// Utils
import { createAccessPointSchema } from './utils'
// Constants
import { directionOptions, relayNumberOptions } from 'constants'
import Form from 'react-bootstrap/Form'
import { useTerminalsQuery } from 'api/terminal/terminal.api'
import { statusContactOptions } from '../../../constants'

const CreateAccessPointModal = ({ show, handleClose }) => {
  const dispatch = useDispatch()
  const cameras = useSelector((state) => state.cameras.cameras)
  const controllers = useSelector((state) => state.controllers.controllers)
  const workingModes = useSelector((state) => state.workingModes.workingModes)
  const leds = useSelector((state) => state.leds.leds)
  const reversePoints = useSelector((state) => state.accessPoints.accessPoints)
  const { data: terminals } = useTerminalsQuery()

  const onSubmit = (values) => {
    values.working_modes = values.working_modes.map((item) => item.value)
    values.cam_id = Number(values.cam_id)
    values.laurent_id = Number(values.laurent_id)
    values.led_board_id = Number(values.led_board_id)
    values.reverse_access_point = Number(values.reverse_access_point)
    values.open_relay_number = Number(values.open_relay_number)
    values.close_relay_number = Number(values.close_relay_number)

    values.is_reverse_access_point = Boolean(values.is_reverse_access_point)

    if (values.terminal_id == null) {
      values.terminal_id = null
    } else {
      values.terminal_id = Number(values.terminal_id)
    }

    dispatch(createAccessPointFetch(values))
  }

  const camerasOptions = useMemo(() => {
    return cameras.map((item) => ({
      name: item.description,
      value: item.id,
    }))
  }, [cameras])

  const reversOptions = useMemo(() => {
    return reversePoints.map((item) => ({
      name: item.description,
      value: item.id,
    }))
  }, [reversePoints])

  const controllersOptions = useMemo(() => {
    return controllers.map((item) => ({
      name: item.description,
      value: item.id,
    }))
  }, [controllers])

  const terminalOptions = useMemo(() => {
    return terminals?.map((item) => ({
      name: item.description,
      value: item.id,
    }))
  }, [terminals])

  const workingModesOptions = useMemo(() => {
    return workingModes.map((item) => ({
      label: item.description,
      value: item.id,
    }))
  }, [workingModes])

  const ledsOptions = useMemo(() => {
    return leds.map((item) => ({
      name: item.description,
      value: item.id,
    }))
  }, [leds])

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<CustomModal.Title>Добавить точку доступа</CustomModal.Title>}
      body={
        <Formik
          initialValues={{
            cam_id: '',
            laurent_id: '',
            open_relay_number: '',
            close_relay_number: '',
            status_contact_number: '',
            working_modes: [],
            direction: '',
            description: '',
            seconds_before_laurent_checks: '',
            laurent_checks_amount: '',
            led_board_id: '',
            terminal_id: null,
          }}
          onSubmit={onSubmit}
          validationSchema={createAccessPointSchema}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} id="create-access-point">
              <Input
                label="Название"
                name="description"
                type="text"
                onChange={(e) =>
                  props.setFieldValue('description', e.target.value)
                }
                className={css.input}
              />
              <Select
                label="Камера"
                options={camerasOptions}
                onChange={(e) => props.setFieldValue('cam_id', e.target.value)}
                name="cam_id"
                className={css.input}
              />
              <Select
                label="Контроллер"
                options={controllersOptions}
                onChange={(e) =>
                  props.setFieldValue('laurent_id', e.target.value)
                }
                name="laurent_id"
                className={css.input}
              />
              <Select
                label="Направление"
                options={directionOptions}
                onChange={(e) =>
                  props.setFieldValue('direction', e.target.value)
                }
                name="direction"
                className={css.input}
              />
              <Select
                label="Номер реле для открытия"
                options={relayNumberOptions}
                onChange={(e) =>
                  props.setFieldValue('open_relay_number', e.target.value)
                }
                name="open_relay_number"
                className={css.input}
              />
              <Select
                label="Номер реле для закрытия"
                options={relayNumberOptions}
                onChange={(e) =>
                  props.setFieldValue('close_relay_number', e.target.value)
                }
                name="close_relay_number"
                className={css.input}
              />
              <Select
                label="Номер контакта статуса открытия"
                options={statusContactOptions}
                onChange={(e) =>
                  props.setFieldValue('status_contact_number', e.target.value)
                }
                name="status_contact_number"
                className={css.input}
              />
              <Select
                label="LED Табло"
                options={ledsOptions}
                onChange={(e) =>
                  props.setFieldValue('led_board_id', e.target.value)
                }
                name="led_board_id"
                className={css.input}
              />
              <Input
                label="Задержка перед закрытием (cекунд)"
                name="seconds_before_close_laurent"
                type="text"
                onChange={(e) =>
                  props.setFieldValue(
                    'seconds_before_close_laurent',
                    e.target.value
                  )
                }
                className={css.input}
              />
              <Input
                label="Секунд между проверкой статуса шлагбаума"
                name="seconds_between_laurent_checks"
                type="text"
                onChange={(e) =>
                  props.setFieldValue(
                    'seconds_between_laurent_checks',
                    e.target.value
                  )
                }
                className={css.input}
              />
              <Input
                label="Секунд перед проверкой статуса шлагбаума"
                name="seconds_before_laurent_checks"
                type="text"
                onChange={(e) =>
                  props.setFieldValue(
                    'seconds_before_laurent_checks',
                    e.target.value
                  )
                }
                className={css.input}
              />
              <Input
                label="Кол-во проверок статуса шлагбаума"
                name="laurent_checks_amount"
                type="text"
                onChange={(e) =>
                  props.setFieldValue('laurent_checks_amount', e.target.value)
                }
                className={css.input}
              />
              <Select
                label="Терминал"
                options={terminalOptions}
                onChange={(e) =>
                  props.setFieldValue('terminal_id', e.target.value)
                }
                name="terminal_id"
                className={css.input}
              />
              {props.values.is_reverse_access_point && (
                <Select
                  label="Реверс"
                  options={reversOptions}
                  onChange={(e) =>
                    props.setFieldValue('reverse_access_point', e.target.value)
                  }
                  name="reverse_access_point"
                  className={css.input}
                />
              )}
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Включить реверс</Form.Label>
                <Form.Check
                  size={200}
                  onChange={(e) =>
                    props.setFieldValue(
                      'is_reverse_access_point',
                      e.target.checked
                    )
                  }
                  name="is_reverse_access_point "
                  type="switch"
                />
              </Form.Group>
              <MultiSelect
                label="Режимы"
                className={css.input}
                options={workingModesOptions}
                name="working_modes"
                onChange={(option) =>
                  props.setFieldValue('working_modes', option)
                }
              />
            </form>
          )}
        </Formik>
      }
      footer={
        <Button type="submit" form="create-access-point">
          Создать
        </Button>
      }
    />
  )
}

CreateAccessPointModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default CreateAccessPointModal
