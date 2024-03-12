import { useLayoutEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard'
import Image from 'react-bootstrap/Image'
import { Spinner, Button } from 'react-bootstrap'
import { formatDate, getDayMinuteSecondsByNumber } from 'utils'
import {
  paidSessionSelectFetch,
  sessionSelectFetch,
  statusSessionSelectFetch,
} from '../../store/sessions/sessionsSlice'
import { statusSessionName } from 'constants'
import { useDispatch, useSelector } from 'react-redux'

export const SessionPage = () => {
  const { id } = useParams()
  const session = useSelector((state) => state.sessions.selectSession)
  const loading = useSelector((state) => state.sessions.isLoadingSelect)
  const errorLoad = useSelector((state) => state.sessions.isErrorSelect)

  const dispatch = useDispatch()

  const paidHandle = (id) => {
    dispatch(paidSessionSelectFetch({ id, is_paid: true }))
  }

  const statusHandle = (id) => {
    dispatch(statusSessionSelectFetch({ id, status: 'closed' }))
  }

  useLayoutEffect(() => {
    dispatch(sessionSelectFetch(id))
    document.title = `Сессия №${id}` || 'Загрузка'
    return ()=>{
      document.title = 'Parking'
    }
  }, [dispatch, id])

  const errorContent = <h1>События с №{id} не найдено</h1>

  return (
    <div style={{ padding: 20 }}>
      <NavLink to="/sessions">Назад</NavLink>
      {loading && <Spinner />}
      {errorLoad && errorContent}
      {session && (
        <>
          <div style={{ marginTop: '20px' }}>
            <h2>Сессия №{id}</h2>
            <div
              style={{ display: 'flex', marginTop: '20px', flexWrap: 'wrap' }}
            >
              <div>
                {session?.events[0]?.car_img_path && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {session?.events.map((event) => {
                      return (
                        <Image
                          style={{
                            maxWidth: '500px',
                            borderRadius: '10px',
                            marginBottom: '10px',
                            marginRight: '20px',
                          }}
                          src={
                            process.env.REACT_APP_API_URL +
                            '/' +
                            event.car_img_path
                          }
                        />
                      )
                    })}

                    {session?.events[0]?.plate_img_path && (
                      <Image
                        style={{
                          maxWidth: '500px',
                          marginTop: '10px',
                          borderRadius: '10px',
                        }}
                        src={
                          process.env.REACT_APP_API_URL +
                          '/' +
                          session?.events[0]?.plate_img_path
                        }
                      />
                    )}
                  </div>
                )}
              </div>
              <div>
                {session?.events[0].vehicle_plate?.full_plate !== '' && (
                  <CarNumberCard carNumber={session?.events[0].vehicle_plate} />
                )}
                <h4>
                  <strong>Времени на парковке:</strong>
                  <br />
                  {getDayMinuteSecondsByNumber(session.time_on_parking)}
                </h4>

                {session?.create_datetime && (
                  <h4>
                    <strong>Дата создания:</strong>
                    <br />
                    <span>{formatDate(session.create_datetime)}</span>
                  </h4>
                )}
                {session?.events[0]?.description && (
                  <h4>
                    <strong>Описание: </strong>
                    <br />
                    <span>{session?.events[0]?.description}</span>
                  </h4>
                )}
                <div style={{ display: 'flex', gap: '20px' }}>
                  <h4>
                    <strong>Статус оплаты:</strong>
                    <br />
                    {session.is_paid ? 'Оплачено' : 'Не оплачено'}
                  </h4>
                  <h4>
                    <strong>Долг:</strong>
                    <br />
                    {session.payment_amount}₽
                  </h4>
                  <h4>
                    <strong>Статус:</strong>
                    <br />
                    {statusSessionName(session.status)}
                  </h4>
                </div>
                <div>
                  {session.payment_amount > 0 && (
                    <Button
                      variant="success"
                      onClick={() => {
                        paidHandle(session?.id)
                      }}
                    >
                      Обнулить долг
                    </Button>
                  )}
                  {session.status !== 'closed' && (
                    <Button
                      variant="danger"
                      onClick={() => statusHandle(session.id)}
                    >
                      Закрыть
                    </Button>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                  }}
                >
                  <h4>
                    <strong>События:</strong>
                  </h4>
                  {session.events.map((ev) => {
                    return (
                      <NavLink to={`/events/${ev?.id}`}>
                        Ссылка на событие №{ev.id}
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
