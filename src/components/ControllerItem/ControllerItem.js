import css from './ControllerItem.module.scss'
import PropTypes from 'prop-types'
import { Button, Card } from 'react-bootstrap'

const ControllerItem = ({
  description,
  ip_address,
  editHandler,
  deleteHandler,
}) => (
  <Card>
    <Card.Header>{description}</Card.Header>
    <Card.Body>
      <span className={css.text}>
        <span className={css.text_value}>Ip адрес:</span>
        <span>{ip_address}</span>
      </span>
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

ControllerItem.propTypes = {
  description: PropTypes.string,
  ip_address: PropTypes.string,
  editHandler: PropTypes.func,
  deleteHandler: PropTypes.func,
}

export default ControllerItem
