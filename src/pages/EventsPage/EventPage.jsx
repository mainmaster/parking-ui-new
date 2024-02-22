import { useLayoutEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { getEvent } from '../../api/events'
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard'
import Image from 'react-bootstrap/Image'
import { Spinner, Accordion } from 'react-bootstrap'
import { formatDate } from 'utils'

export const EventPage = () => {
  const { id } = useParams()
  const [errorEvent, setErrorEvent] = useState(false)
  const [loading, setLoading] = useState(true)
  const [event, setEvent] = useState()

  const errorContent = <div>Нет события с ID - {id}</div>

  useLayoutEffect(() => {
    getEvent(id)
      .then((res) => {
        setLoading(false)
        setEvent(res.data)
      })
      .catch((error) => {
        setLoading(false)
        setErrorEvent(true)
      })
    document.title = `Событие №${id}` || 'Загрузка'
    return ()=>{
      document.title = 'Parking'
    }
  }, [id])

  return (
    <div style={{ padding: 20 }}>
      {loading && <Spinner />}
      {errorEvent && errorContent}
      {event && (
        <>
          <NavLink to="/events">Назад</NavLink>
          <div style={{ marginTop: '20px' }}>
            <h2>Событие №{id}</h2>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
              <div>
                {event?.car_img_path && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Image
                      style={{ maxWidth: '500px', borderRadius: '10px', width: '100%' }}
                      src={
                        process.env.REACT_APP_API_URL +
                        '/' +
                        event?.car_img_path
                      }
                    />
                    {event?.plate_img_path && (
                      <Image
                        style={{
                          maxWidth: '500px',
                          marginTop: '10px',
                          borderRadius: '10px',
                        }}
                        src={
                          process.env.REACT_APP_API_URL +
                          '/' +
                          event?.plate_img_path
                        }
                      />
                    )}
                  </div>
                )}
              </div>
              <div>
                {event.vehicle_plate.full_plate !== '' && (
                  <CarNumberCard carNumber={event.vehicle_plate} />
                )}
                {event?.create_datetime && (
                  <h4>
                    <strong>Дата создания:</strong>
                    <br />
                    <span>{formatDate(event.create_datetime)}</span>
                  </h4>
                )}
                {event?.car_brand && (
                  <h4>
                    <strong>Марка авто:</strong>
                    <br />
                    <span>{event.car_brand}</span>
                  </h4>
                )}
                {event?.initiator && (
                  <h4>
                    <strong>Инициатор:</strong>
                    <br />
                    {event.initiator}
                  </h4>
                )}
                {event?.direction && (
                  <h4>
                    <strong>Направление:</strong>
                    <br />
                    {event.direction === 'in' ? 'Въезд' : 'Выезд'}
                  </h4>
                )}
                {event?.description && (
                  <h4>
                    <strong>Описание: </strong>
                    <br />
                    <span>{event.description}</span>
                  </h4>
                )}
                {event?.scores === undefined ||
                event?.scores === null ? null : (
                  <Accordion style={{ maxWidth: '500px' }}>
                    <Accordion.Item eventKey="">
                      <Accordion.Header>Детали</Accordion.Header>
                      <Accordion.Body>
                        <pre>
                          {Object.entries(event?.scores).map((item) => {
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
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
