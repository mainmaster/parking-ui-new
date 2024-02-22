import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import css from './LedPage.module.scss'
import { Button, Spinner } from 'react-bootstrap'
// Components
import LedItem from 'components/LedItem'
import CreateLedModal from 'components/Modals/CreateLedModal'
import EditLedModal from 'components/Modals/EditLedModal'
// Store
import {
  deleteLedFetch,
  ledsFetch,
  editModalHandler,
  createModalHandler,
} from 'store/led/ledSlice'
import _ from "lodash";

const LedPage = () => {
  const dispatch = useDispatch()
  const leds = useSelector((state) => state.leds.leds)
  const isLoadingFetch = useSelector((state) => state.leds.isLoadingFetch)
  const isErrorFetch = useSelector((state) => state.leds.isErrorFetch)
  const isEditModal = useSelector((state) => state.leds.isEditModal)
  const isCreateModal = useSelector((state) => state.leds.isCreateModal)

  useEffect(() => {
    dispatch(ledsFetch())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const editPopupHandler = (id) => {
    dispatch(editModalHandler(id))
  }

  const createPopupHandler = () => {
    dispatch(createModalHandler())
  }

  const deleteHandler = (id) => {
    dispatch(deleteLedFetch(id))
  }

  const spinnerContent = (
    <div className={css.spinner}>
      <Spinner animation="border" />
    </div>
  )

  const errorContent = (
    <div className={css.error}>Что-то пошло не так! Попробуйте позже</div>
  )

  const emptyData = <div className={css.empty}>LED таблиц нет</div>

  const cardsContent = (
    <div className={css.cards}>
      {leds.length !== 0
        ? _.sortBy(leds, ['id'])?.map((item) => (
            <LedItem
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
        <Button className="mb-4 mt-3" onClick={createPopupHandler}>Добавить LED табло</Button>
      </div>
      {errorMessage}
      {spinner}
      {content}
      <CreateLedModal show={isCreateModal} handleClose={createPopupHandler} />
      <EditLedModal show={isEditModal} handleClose={editPopupHandler} />
    </>
  )
}

export default LedPage
