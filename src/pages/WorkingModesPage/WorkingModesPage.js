import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import css from './WorkingModesPage.module.scss'
import { Button, Spinner } from 'react-bootstrap'
// Components
import EditWorkingModeModal from 'components/Modals/EditWorkingModeModal/EditWorkingModeModal'
import WorkingModeItem from 'components/WorkingModeItem'
import CreateWorkingModeModal from 'components/Modals/CreateWorkingModeModal'
// Store
import {
  workingModesFetch,
  editModalHandler,
  createModalHandler,
  deleteWorkingModeFetch,
} from 'store/workingModes/workingModesSlice'
import _ from 'lodash'


const WorkingModesPage = () => {
  const dispatch = useDispatch()
  const workingModes = useSelector((state) => state.workingModes.workingModes)
  const isLoadingFetch = useSelector(
    (state) => state.workingModes.isLoadingFetch
  )
  const isErrorFetch = useSelector((state) => state.workingModes.isErrorFetch)
  const isEditModal = useSelector((state) => state.workingModes.isEditModal)
  const isCreateModal = useSelector((state) => state.workingModes.isCreateModal)

  useEffect(() => {
    dispatch(workingModesFetch())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const editPopupHandler = (id) => {
    dispatch(editModalHandler(id))
  }

  const createPopupHandler = () => {
    dispatch(createModalHandler())
  }

  const deleteHandler = (id) => {
    dispatch(deleteWorkingModeFetch(id))
  }

  const spinnerContent = (
    <div className={css.spinner}>
      <Spinner animation="border" />
    </div>
  )

  const errorContent = (
    <div className={css.error}>Что-то пошло не так! Попробуйте позже</div>
  )

  const emptyData = <div className={css.empty}>Режимов нет</div>

  const cardsContent = (
    <div className={css.cards}>
      {workingModes.length !== 0
        ? _.sortBy(workingModes, ['id'])?.map((item) => (
            <WorkingModeItem
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
        <Button className="mb-4 mt-3" onClick={createPopupHandler}>Добавить режим</Button>
      </div>
      {errorMessage}
      {spinner}
      {content}
      <CreateWorkingModeModal
        show={isCreateModal}
        handleClose={createPopupHandler}
      />
      <EditWorkingModeModal show={isEditModal} handleClose={editPopupHandler} />
    </>
  )
}

export default WorkingModesPage
