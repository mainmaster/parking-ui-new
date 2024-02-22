import css from './CameraItem.module.scss'
import PropTypes from 'prop-types'
import { Button, Card } from 'react-bootstrap'

const CameraItem = ({
  description,
  login,
  password,
  ip_address,
  editHandler,
  deleteHandler,
  mjpeg_url,
  snapshot_url
}) => (
  <Card>
    <Card.Header>{description}</Card.Header>
    <Card.Body>
      <Card.Text>
        <span className={css.text}>
          <span className={css.text_value}>Ip адрес:</span>
          <span>{ip_address}</span>
        </span>
        <span className={css.text_bottom}>
          <span className={css.text_value}>Адрес трансляции:</span>
          <div>{mjpeg_url}</div>
        </span>
        <span className={css.text_bottom}>
          <span className={css.text_value}>Ссылка на снапшот:</span>
          <div>{snapshot_url}</div>
        </span>
        <span className={css.text}>
          <span className={css.text_value}>Логин:</span>
          <span>{login}</span>
        </span>
        <span className={css.text}>
          <span className={css.text_value}>Пароль:</span>
          <span>{password}</span>
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

CameraItem.propTypes = {
  description: PropTypes.string,
  login: PropTypes.string,
  password: PropTypes.string,
  mjpeg_url: PropTypes.string,
  ip_address: PropTypes.string,
  editHandler: PropTypes.func,
  deleteHandler: PropTypes.func,
}

export default CameraItem
