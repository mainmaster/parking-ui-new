import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import css from './ControllersPage.module.scss'
import { Button, Spinner } from 'react-bootstrap'
// Components
import ControllerItem from 'components/ControllerItem'
import CreateControllerModal from 'components/Modals/CreateControllerModal'
import EditControllerModal from 'components/Modals/EditControllerModal'
// Store
import {
  controllersFetch,
  editModalHandler,
  createModalHandler,
  deleteControllerFetch,
} from 'store/controllers/controllersSlice'
import _ from 'lodash'


const ControllersPage = () => {
  const dispatch = useDispatch()
  const controllers = useSelector((state) => state.controllers.controllers)
  const isLoadingFetch = useSelector(
    (state) => state.controllers.isLoadingFetch
  )
  const isErrorFetch = useSelector((state) => state.controllers.isErrorFetch)
  const isEditModal = useSelector((state) => state.controllers.isEditModal)
  const isCreateModal = useSelector((state) => state.controllers.isCreateModal)

  useEffect(() => {
    dispatch(controllersFetch())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const editPopupHandler = (id) => {
    dispatch(editModalHandler(id))
  }

  const createPopupHandler = () => {
    dispatch(createModalHandler())
  }

  const deleteHandler = (id) => {
    dispatch(deleteControllerFetch(id))
  }

  const spinnerContent = (
    <div className={css.spinner}>
      <Spinner animation="border" />
    </div>
  )

  const errorContent = (
    <div className={css.error}>Что-то пошло не так! Попробуйте позже</div>
  )

  const emptyData = <div className={css.empty}>Контроллеров нет</div>

  const cardsContent = (
    <div className={css.cards}>
      {controllers.length !== 0
        ? _.sortBy(controllers, ['id']).map((item) => (
            <ControllerItem
              key={item.id}
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
        <Button className="mb-4 mt-3" onClick={createPopupHandler}>Добавить контроллер</Button>
      </div>
      {errorMessage}
      {spinner}
      {content}
      <CreateControllerModal
        show={isCreateModal}
        handleClose={createPopupHandler}
      />
      <EditControllerModal show={isEditModal} handleClose={editPopupHandler} />
    </>
  )
}

export default ControllersPage
