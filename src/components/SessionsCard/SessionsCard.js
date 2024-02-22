import cn from 'classnames'
import css from './SessionsCard.module.scss'
import PropTypes from 'prop-types'
import { Accordion, Card } from 'react-bootstrap'
import { useSelector } from 'react-redux'
// Utils
import { formatDate, isEmptyObject } from 'utils'
import { CarNumberCard } from '../CarNumberCard/CarNumberCard'
import { NavLink } from 'react-router-dom'

const SessionsCard = ({ className, onClickImage }) => {
  const dataModal = useSelector((state) => state.sessions.dataModal)

  return (
    <Card className={cn(css.card, className)}>
      {!isEmptyObject(dataModal) ? (
        <>
          <Card.Body className={css.card_body}>
            <CarNumberCard carNumber={dataModal?.events[0]?.vehicle_plate} />

            <span>Въезд:</span>
            <br />
            <img
              src={
                process.env.REACT_APP_API_URL +
                '/' +
                dataModal.events[0]?.car_img_path
              }
              alt="img"
              onClick={() =>
                onClickImage(
                  process.env.REACT_APP_API_URL +
                    '/' +
                    dataModal.events[0]?.car_img_path
                )
              }
            />
            {dataModal?.scores === null ||
            dataModal?.scores === undefined ? null : (
              <Accordion>
                <Accordion.Item eventKey="">
                  <Accordion.Header>Детали</Accordion.Header>
                  <Accordion.Body>
                    <pre>{JSON.stringify(dataModal?.events[0].scores)}</pre>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}

            <Card.Text>
              <NavLink to={`${dataModal.id}`}>Ссылка на сессию</NavLink><br/>
              <span>Описание:</span> {dataModal.events[0].description}<br />
              <span>Время:</span>{' '}
              {formatDate(dataModal.events[0].create_datetime)}
            </Card.Text>
            <div>
              {dataModal.events.length === 2 ? (
                <>
                  <img
                    src={
                      process.env.REACT_APP_API_URL +
                      '/' +
                      dataModal.events[1].car_img_path
                    }
                    alt="img"
                    onClick={() =>
                      onClickImage(
                        process.env.REACT_APP_API_URL +
                          '/' +
                          dataModal.events[1].car_img_path
                      )
                    }
                  />
                  <Card.Text>
                    <span>Описание:</span> {dataModal.events[1].description}
                    <br />
                    <span>Время:</span>{' '}
                    {formatDate(dataModal.events[1].create_datetime)}
                  </Card.Text>
                </>
              ) : null}
            </div>
          </Card.Body>
        </>
      ) : (
        <div className={css.card_empty}>Выберите машину</div>
      )}
    </Card>
  )
}

SessionsCard.propTypes = {
  className: PropTypes.string,
}

export default SessionsCard
