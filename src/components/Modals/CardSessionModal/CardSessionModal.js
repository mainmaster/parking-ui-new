import css from './CardSessionModal.module.scss'
import PropTypes from 'prop-types'
import {Accordion, Card, Modal as CustomModal} from 'react-bootstrap'
import { useSelector } from 'react-redux'
// Components
import Modal from 'components/Modal'
// Utils
import { formatDate } from 'utils'

const CardSessionModal = ({ show, handleClose }) => {
  const dataModal = useSelector((state) => state.sessions.dataModal)

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<CustomModal.Title>{dataModal?.vehicle_plate}</CustomModal.Title>}
      body={
        show ? (
          <div className={css.modal}>
            <span>Въезд:</span>
            <img
              src={
                process.env.REACT_APP_API_URL +
                '/' +
                dataModal?.events[0]?.car_img_path
              }
              alt="img"
            />
              {dataModal?.scores === null || dataModal?.scores === undefined
                  ? null
                  : <Accordion>
                      <Accordion.Item eventKey=''>
                          <Accordion.Header>Детали</Accordion.Header>
                          <Accordion.Body>
                              {JSON.stringify(dataModal?.scores)}
                          </Accordion.Body>
                      </Accordion.Item>
                  </Accordion>
              }
            <Card.Text>
              <span>Описание:</span> {dataModal?.events[0]?.description}
              <br />
              <span>Время:</span>
              {formatDate(dataModal?.events[0]?.create_datetime)}
            </Card.Text>
            {dataModal?.events?.length === 2 ? (
              <>
                <span>Выезд:</span>
                <img
                  src={
                    process.env.REACT_APP_API_URL +
                    '/' +
                    dataModal?.events[1]?.car_img_path
                  }
                  alt="img"
                />
                <Card.Text>
                  <span>Описание:</span> {dataModal?.events[1]?.description}
                  <br />
                  <span>Время:</span>{' '}
                  {formatDate(dataModal?.events[1]?.create_datetime)}
                </Card.Text>
              </>
            ) : null}
          </div>
        ) : null
      }
    />
  )
}

CardSessionModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default CardSessionModal
