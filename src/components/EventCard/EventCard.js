import cn from 'classnames'
import css from './EventCard.module.scss'
import PropTypes from 'prop-types'
import { Accordion, Card } from 'react-bootstrap'
import { useSelector } from 'react-redux'
// Utils
import { formatDate, isEmptyObject } from 'utils'
import { CarNumberCard } from '../CarNumberCard/CarNumberCard'
import { Link, NavLink } from 'react-router-dom'

const EventCard = ({ className, onClickImage }) => {
  const dataModal = useSelector((state) => state.events.dataModal)
  return (
    <Card className={cn(css.card, className)}>
      {!isEmptyObject(dataModal) ? (
        <>
          <Card.Body className={css.card_body}>
            {dataModal?.vehicle_plate.number === '' ? null : (
              <CarNumberCard carNumber={dataModal?.vehicle_plate} />
            )}
            <img
              style={{ marginTop: '10px' }}
              src={
                process.env.REACT_APP_API_URL + '/' + dataModal?.car_img_path
              }
              alt="img"
              onClick={() =>
                onClickImage(
                  process.env.REACT_APP_API_URL + '/' + dataModal?.car_img_path
                )
              }
            />

            {dataModal?.plate_img_path && (
              <img
                src={
                  process.env.REACT_APP_API_URL +
                  '/' +
                  dataModal?.plate_img_path
                }
              />
            )}

            {dataModal?.scores === null ||
            dataModal?.scores === undefined ? null : (
              <Accordion>
                <Accordion.Item eventKey="">
                  <Accordion.Header>Детали</Accordion.Header>
                  <Accordion.Body>
                    <pre style={{ height: '300px' }}>
                      {Object.entries(dataModal?.scores).map((item) => {
                        return (
                          <div>
                            {Array.isArray(item[1]) ? (
                              <div>
                                <b>{item[0]}:</b>
                                <ul>
                                  {item[1].map((li) => (
                                    <li>{li}</li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <div>
                                <b>{item[0]}</b>:{item[1]}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </pre>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
            <Card.Text>
              <NavLink to={`${dataModal.id}`}>Ссылка на событие</NavLink><br/>
              <span>Описание:</span> {dataModal?.description}
              <br />
              {dataModal?.car_brand && (
                <>
                  <span>Марка:</span> {dataModal?.car_brand}
                  <br />
                </>
              )}
              {dataModal?.initiator && (
                <>
                  <span>Инициатор:</span> {dataModal?.initiator}
                  <br />
                </>
              )}
              <span>Время создания:</span>{' '}
              {formatDate(dataModal?.create_datetime)}
            </Card.Text>
          </Card.Body>
        </>
      ) : (
        <div className={css.card_empty}>Выберите событие</div>
      )}
    </Card>
  )
}

EventCard.propTypes = {
  className: PropTypes.string,
  onClickImage: PropTypes.func,
}

export default EventCard
