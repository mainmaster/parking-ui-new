import { memo, useMemo } from 'react'
import css from './WorkingModeItem.module.scss'
import PropTypes from 'prop-types'
import { Button, Card } from 'react-bootstrap'
// Components
import Table from 'components/Table'
// Utils
import { titles } from './utils'
// Constants
import { passModeOptions } from 'constants'

const WorkingModeItem = ({
  description,
  free_time_min,
  pass_mode,
  price,
  time_gte_hour,
  time_gte_min,
  time_lte_hour,
  time_lte_min,
  transit_block_time_min,
  entry_fee,
  editHandler,
  deleteHandler,
}) => {
  const rowsTable = useMemo(
    () => (
      <>
        <tr>
          <td className={css.table_tr}>Время (от)</td>
          <td>{time_gte_hour}</td>
          <td>{time_gte_min}</td>
        </tr>
        <tr>
          <td className={css.table_tr}>Время (до)</td>
          <td>{time_lte_hour}</td>
          <td>{time_lte_min}</td>
        </tr>
      </>
    ),
    [time_gte_hour, time_gte_min, time_lte_hour, time_lte_min]
  )

  const passModeName = useMemo(() => {
    return passModeOptions.find((item) => item.value === pass_mode)
  }, [pass_mode])

  return (
    <Card>
      <Card.Header>{description}</Card.Header>
      <Card.Body>
        <Card.Text>
          <span className={css.text}>
            <span className={css.text_value}>Свободное время:</span>
            <span>{free_time_min} мин</span>
          </span>
          <span className={css.text}>
            <span className={css.text_value}>Пропускной режим:</span>
            <span>{passModeName?.name}</span>
          </span>
          <span className={css.text}>
            <span className={css.text_value}>Цена:</span>
            <span>{price}</span>
          </span>
          <span className={css.text}>
            <span className={css.text_value}>Время транзитной блокировки:</span>
            <span>{transit_block_time_min} мин</span>
          </span>
          <span className={css.text}>
            <span className={css.text_value}>Оплата за въезд:</span>
            <span>{entry_fee}</span>
          </span>
          <div>
            <Table
                titles={titles}
                rows={rowsTable}
                size="sm"
                className={css.table}
            />
          </div>
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

WorkingModeItem.propTypes = {
  description: PropTypes.string,
  free_time_min: PropTypes.number,
  pass_mode: PropTypes.string,
  price: PropTypes.number,
  time_gte_hour: PropTypes.number,
  time_gte_min: PropTypes.number,
  time_lte_hour: PropTypes.number,
  time_lte_min: PropTypes.number,
  transit_block_time_min: PropTypes.number,
  entry_fee: PropTypes.number,
  editHandler: PropTypes.func,
  deleteHandler: PropTypes.func,
}

export default memo(WorkingModeItem)
