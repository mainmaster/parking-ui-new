import css from './OpenApByVehiclePlateModal.module.scss'
import PropTypes from 'prop-types'
import { Button, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
// Components
import Modal from 'components/Modal'
import Input from 'components/Input'
// Store
import { openApByVehiclePlateFetch } from 'store/events/eventsSlice'
// Utils
import { openApSchema } from './utils'
import { useEffect, useState } from 'react'
import {
  getAccessPointById,
  getAccessPointSnapshot,
} from '../../../api/access-points'
import { getOpenedSessionsRequest } from '../../../api/sessions'

const Chip = ({ number, onClick }) => {
  return (
    <div onClick={onClick} className={css.chip}>
      {number.vehicle_plate.full_plate}
    </div>
  )
}

const OpenApByVehiclePlateModal = ({ show, handleClose }) => {
  const dispatch = useDispatch()
  const accessPointId = useSelector((state) => state.cameras.accessPointId)
  const [accessPoint, setAccessPoint] = useState(null)
  const [carNumbers, setCarNumbers] = useState([])
  const [snapshot, setSnapshot] = useState(null)

  useEffect(() => {
    if (accessPointId != null) {
      getAccessPointById(accessPointId)
        .then((res) =>
          setAccessPoint(res.data.filter((item) => item.id == accessPointId)[0])
        )
        .catch((err) => console.error(err))

      getOpenedSessionsRequest(accessPointId)
        .then((res) => setCarNumbers(res.data))
        .catch((err) => console.error(err))
      getAccessPointSnapshot(accessPointId).then((res) => {
        console.log(res)
        setSnapshot(res.data)
      })
    }
  }, [accessPointId])

  const onSubmit = (values) => {
    const payload = {
      accessPointid: accessPointId,
      vehiclePlate: values.vehiclePlate,
    }
    dispatch(openApByVehiclePlateFetch(payload))
  }

  return (
    <Modal
      show={show}
      size="lg"
      handleClose={handleClose}
      header={
        <CustomModal.Title>Открыть с подтверждением номера</CustomModal.Title>
      }
      body={
        <Formik
          initialValues={{
            vehiclePlate: '',
          }}
          onSubmit={onSubmit}
          validationSchema={openApSchema}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} id="open-ap-plate">
              {snapshot && (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    marginBottom: '10px',
                  }}
                  src={URL.createObjectURL(snapshot)}
                />
              )}
              <Input
                label="Номер машины"
                name="vehiclePlate"
                type="text"
                onChange={(e) =>
                  props.setFieldValue('vehiclePlate', e.target.value)
                }
                className={css.input}
              />

              {accessPoint && (
                <>
                  <div className={css.chipWrap}>
                    {accessPoint.direction === 'out' &&
                      carNumbers?.map((number) => {
                        return (
                          <Chip
                            onClick={() =>
                              props.setFieldValue(
                                'vehiclePlate',
                                number.vehicle_plate.full_plate
                              )
                            }
                            number={number}
                          />
                        )
                      })}
                  </div>
                </>
              )}
            </form>
          )}
        </Formik>
      }
      footer={
        <Button type="submit" form="open-ap-plate">
          Открыть
        </Button>
      }
    />
  )
}

OpenApByVehiclePlateModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default OpenApByVehiclePlateModal
