import css from './CardEventModal.module.scss'
import PropTypes from 'prop-types'
import { Modal as CustomModal } from 'react-bootstrap'
import { useSelector } from 'react-redux'
// Components
import Modal from 'components/Modal'
// Utils
import { formatDate } from 'utils'
import {CarNumberCard} from "../../CarNumberCard/CarNumberCard";

const CardEventModal = ({ show, handleClose }) => {
  const dataModal = useSelector((state) => state.events.dataModal)

  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<CustomModal.Title>
          <CarNumberCard  carNumber={dataModal?.vehicle_plate}/>
      </CustomModal.Title>}
      body={
        <div className={css.modal}>
          <img
            alt="img"
            src={process.env.REACT_APP_API_URL + '/' + dataModal?.car_img_path}
          />
          <div>
            <span>Описание:</span> {dataModal?.description}
            <br />
            <span>Время создания:</span> {formatDate(dataModal?.create_datetime)}
          </div>
        </div>
      }
    />
  )
}

CardEventModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default CardEventModal
