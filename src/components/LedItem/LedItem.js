import css from './LedItem.module.scss'
import PropTypes from 'prop-types'
import { Button, Card } from 'react-bootstrap'

const LedItem = ({ description, ip_address, editHandler, deleteHandler, led_board_type }) => (
  <Card>
    <Card.Header>{description}</Card.Header>
    <Card.Body>
      <Card.Text>
        <span className={css.text}>
          <span className={css.text_value}>Ip адрес:</span>
          <span>{ip_address}</span>
        </span>
        <span className={css.text}>
          <span className={css.text_value}>Тип табло:</span>
          <span>{led_board_type}</span>
        </span>
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

LedItem.propTypes = {
  description: PropTypes.string,
  ip_address: PropTypes.string,
  editHandler: PropTypes.func,
  deleteHandler: PropTypes.func,
}

export default LedItem
