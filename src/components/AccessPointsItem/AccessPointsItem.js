import { Fragment, useMemo } from 'react'
import css from './AccessPointsItem.module.scss'
import PropTypes from 'prop-types'
import { Button, Card } from 'react-bootstrap'
// Constants
import { directionName } from 'constants'

const AccessPointsItem = ({
  cam_id,
  description,
  direction,
  laurent_id,
  close_relay_number,
  open_relay_number,
  working_modes,
  led_board_id,
  editHandler,
  deleteHandler,
  cameras,
  controllers,
  leds,
  workingModes,
  terminal_id,
  terminals,
  accessPoints,
  reverse_access_point,
  status_contact_number,
  seconds_before_close_laurent,
  recognition_scenario_id,
  confirmation_scenario_id,
  seconds_between_laurent_checks
}) => {
  const cameraName = useMemo(() => {
    return cameras.length !== 0
      ? cameras?.find((item) => item.id === cam_id).description
      : ''
  }, [cameras, cam_id])
  const recognition_scenario_id = useMemo(() => {
    return recognition_scenario_id.length !== 0
      ? recognition_scenario_id?.find((item) => item.id === cam_id).description
      : ''
  }, [cameras, cam_id])
  const confirmation_scenario_id = useMemo(() => {
    return cameconfirmation_scenario_idras.length !== 0
      ? confirmation_scenario_id?.find((item) => item.id === cam_id).description
      : ''
  }, [cameras, cam_id])

  const controllerName = useMemo(() => {
    return controllers.length !== 0
      ? controllers.find((item) => item.id === laurent_id).description
      : ''
  }, [controllers, laurent_id])

  const ledName = useMemo(() => {
    return leds.length !== 0 && led_board_id !== null
      ? leds.find((item) => item.id === led_board_id).description
      : ''
  }, [leds, led_board_id])

  const reverseName = useMemo(() => {
    return accessPoints.length !== 0 && reverse_access_point !== null
        ? accessPoints.find((item) => item.id === reverse_access_point).description
        : ''
  }, [accessPoints, reverse_access_point])


  const terminalName = useMemo(() => {
   if(terminals){
     return terminals.length !== 0 && terminal_id !== null
         ? terminals.find((item) => item.id === terminal_id).description
         : ''
   }
  }, [terminals, terminal_id])

  return (
    <Card>
      <Card.Header>{description}</Card.Header>
      <Card.Body>
        <Card.Text>
          <span className={css.text}>
            <span className={css.text_value}>Камера:</span>
            <span>{cameraName}</span>
          </span>
          <span className={css.text}>
            <span className={css.text_value}>Контроллер:</span>
            <span>{controllerName}</span>
          </span>
          <span className={css.text}>
            <span className={css.text_value}>Направление:</span>
            <span>{directionName(direction)}</span>
          </span>
          <span className={css.text}>
            <span className={css.text_value}>Номер реле для открытия:</span>
            <span>{open_relay_number}</span>
          </span>
          <span className={css.text}>
            <span className={css.text_value}>Номер реле для закрытия:</span>
            <span>{close_relay_number}</span>
          </span>
          <span className={css.text}>
            <span className={css.text_value}>Номер контакта статуса открытия:</span>
            <span>{status_contact_number}</span>
          </span>
          {ledName && (
            <span className={css.text}>
              <span className={css.text_value}>LED Табло:</span>
              <span>{ledName}</span>
            </span>
          )}
          <span className={css.text}>
            <span className={css.text_value}>Задержка перед закрытием (cекунд):</span>
            <span>{seconds_before_close_laurent}</span>
          </span>
          <span className={css.text}>
            <span className={css.text_value}>Секунд между проверкой статуса шлагбаума:</span>
            <span>{seconds_between_laurent_checks}</span>
          </span>
          <span className={css.text}>
            <span className={css.text_value}>Терминал:</span>
            <span>{terminalName}</span>
          </span>
          <span className={css.text}>
            <span className={css.text_value}>Реверс:</span>
            <span>{reverseName}</span>
          </span>
        </Card.Text>
        <Card.Title>Режимы</Card.Title>
        <Card.Text>
          {working_modes.map((id, index) => (
            <Fragment key={id}>
              <span>
                {index + 1}.{' '}
                {workingModes.find((item) => item.id === id)?.description}
              </span>
              <br />
            </Fragment>
          ))}
        </Card.Text>
        <div className={css.btns}>
          <Button variant="success" onClick={editHandler}>
            Изменить
          </Button>
          <Button variant="danger" onClick={deleteHandler}>
            Удалить
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

AccessPointsItem.propTypes = {
  cam_id: PropTypes.number,
  description: PropTypes.string,
  direction: PropTypes.string,
  laurent_id: PropTypes.number,
  led_board_id: PropTypes.number,
  relay_number: PropTypes.number,
  working_modes: PropTypes.array,
  editHandler: PropTypes.func,
  deleteHandler: PropTypes.func,
  cameras: PropTypes.array,
  controllers: PropTypes.array,
  leds: PropTypes.array,
}

export default AccessPointsItem
