import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import css from './AccessPointsPage.module.scss'
import { Button, Spinner } from 'react-bootstrap'
// Components
import EditAccessPointModal from 'components/Modals/EditAccessPointModal'
import AccessPointsItem from 'components/AccessPointsItem'
import CreateAccessPointModal from 'components/Modals/CreateAccessPointModal'
// Store
import {
  accessPointsFetch,
  editModalHandler,
  createModalHandler,
  deleteAccessPointFetch,
} from 'store/accessPoints/accessPointsSlice'
import {useTerminalsQuery} from "api/terminal/terminal.api";
import _ from 'lodash'

const AccessPointsPage = () => {
  const dispatch = useDispatch()
  const accessPoints = useSelector((state) => state.accessPoints.accessPoints)
  const cameras = useSelector((state) => state.cameras.cameras)
  const controllers = useSelector((state) => state.controllers.controllers)
  const leds = useSelector((state) => state.leds.leds)
  const workingModes = useSelector((state) => state.workingModes.workingModes)
  const isLoadingFetch = useSelector(
    (state) => state.accessPoints.isLoadingFetch
  )
  const isErrorFetch = useSelector((state) => state.accessPoints.isErrorFetch)
  const isEditModal = useSelector((state) => state.accessPoints.isEditModal)
  const isCreateModal = useSelector((state) => state.accessPoints.isCreateModal)
  const {data: terminals} = useTerminalsQuery()

  useEffect(() => {
    dispatch(accessPointsFetch())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const editPopupHandler = (id) => {
    dispatch(editModalHandler(id))
  }

  const createPopupHandler = () => {
    dispatch(createModalHandler())
  }

  const deleteHandler = (id) => {
    dispatch(deleteAccessPointFetch(id))
  }

  const spinnerContent = (
    <div className={css.spinner}>
      <Spinner animation="border" />
    </div>
  )

  const errorContent = (
    <div className={css.error}>Что-то пошло не так! Попробуйте позже</div>
  )

  const emptyData = <div className={css.empty}>Точек доступа нет</div>

  const cardsContent = (
    <div className={css.cards}>
      {accessPoints.length !== 0
        ? _.sortBy(accessPoints, ['id'])?.map((item) => (
            <AccessPointsItem
              key={item.id}
              cameras={cameras}
              controllers={controllers}
              leds={leds}
              workingModes={workingModes}
              terminals={terminals}
              accessPoints={accessPoints}
              {...item}
              editHandler={() => editPopupHandler(item.id)}
              deleteHandler={() => deleteHandler(item.id)}
            />
          ))
        : emptyData}
    </div>
  )

  const hasData = !(isLoadingFetch || isErrorFetch)
  const errorMessage = isErrorFetch ? errorContent : null
  const spinner = isLoadingFetch ? spinnerContent : null
  const content = hasData ? cardsContent : null

  return (
    <>
      <div className={css.top}>
        <Button className="mb-4 mt-3" onClick={createPopupHandler}>Добавить точку доступа</Button>
      </div>
      {errorMessage}
      {spinner}
      {content}
      <CreateAccessPointModal
        show={isCreateModal}
        handleClose={createPopupHandler}
      />
      <EditAccessPointModal show={isEditModal} handleClose={editPopupHandler} />
    </>
  )
}

export default AccessPointsPage
