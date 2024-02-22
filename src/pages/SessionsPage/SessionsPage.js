/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react'
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap'
import css from './SessionsPage.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'
import Lightbox from 'react-18-image-lightbox'
// Store
import {
  sessionsFetch,
  sessionsChangePageFetch,
  changeDataModal,
  changeCurrentPage,
  statusSessionFetch,
  paidSessionFetch,
} from 'store/sessions/sessionsSlice'
// Components
import SessionsCard from 'components/SessionsCard'
import Table from 'components/Table'
import CardSessionModal from 'components/Modals/CardSessionModal'
import PaginationCustom from 'components/Pagination'
import FilterForm from 'components/pages/sessions/FilterForm'
// Utils
import { titles } from './utils'
import { formatDate, getDayMinuteSecondsByNumber } from 'utils'
// Constants
import { statusSessionName, BREAKPOINT_MD } from 'constants'
import { CheckSquareFill, XSquareFill } from 'react-bootstrap-icons'
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard'
import { CloseOlderThanDateModal } from './components/CloseOlderThanDateModal'
import { useParkingInfoQuery } from '../../api/settings/settings'
import TypeAuto from '../../components/TypeAuto'

const SessionsPage = () => {
  const dispatch = useDispatch()
  const sessions = useSelector((state) => state.sessions.sessions)
  const pages = useSelector((state) => state.sessions.pages)
  const currentPage = useSelector((state) => state.sessions.currentPage)
  const isLoading = useSelector((state) => state.sessions.isLoadingFetch)
  const isError = useSelector((state) => state.sessions.isErrorFetch)
  const [isActiveModal, setIsActiveModal] = useState(false)
  const [closeOlderDateModal, setCloseOlderDateModal] = useState(false)
  const [isActiveModalMobile, setIsActiveModalMobile] = useState(false)
  const { data: parkingInfo } = useParkingInfoQuery()

  const [imageModal, setImageModal] = useState({
    isOpen: false,
    src: '',
  })

  const changeActiveImageModal = (src) =>
    setImageModal({
      src: src,
      isOpen: !imageModal.isOpen,
    })

  useEffect(() => {
    dispatch(sessionsFetch())
    return () => dispatch(changeCurrentPage(1))
  }, [dispatch])

  const changePage = (index) => {
    dispatch(sessionsChangePageFetch(index))
  }

  const changeModal = (item) => {
    dispatch(changeDataModal(item))

    if (window.innerWidth < BREAKPOINT_MD) {
      changeMobileModal()
      setIsActiveModal(true)
    }
  }

  const changeMobileModal = () => {
    setIsActiveModalMobile(!isActiveModalMobile)
  }

  const paidHandle = (id) => {
    dispatch(paidSessionFetch({ id, is_paid: true }))
  }

  const statusHandle = (id) => {
    dispatch(statusSessionFetch({ id, status: 'closed' }))
  }

  useEffect(() => {
    if (window.innerWidth < BREAKPOINT_MD) {
      setIsActiveModal(true)
    }
  }, [])

  const spinnerContent = (
    <div className={css.spinner}>
      <Spinner animation="border" />
    </div>
  )

  const errorContent = (
    <div className={css.error}>Что-то пошло не так! Попробуйте позже</div>
  )
  const rowsTable =
    sessions.length !== 0
      ? sessions.map((item, index) => (
          <tr
            className="selected_row"
            tabIndex={1}
            key={index}
            onClick={() => changeModal(item)}
          >
            <td>
              {item.events[0].vehicle_plate.number === '' ? (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                ></div>
              ) : (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>№ {item.id}</Tooltip>}
                  >
                    <CarNumberCard
                      carNumber={item.events[0].vehicle_plate}
                      isTable
                    />
                  </OverlayTrigger>

                  <div>
                    <TypeAuto type={item.events[0]?.access_status_code} />
                  </div>
                </div>
              )}
            </td>

            <td>{statusSessionName(item.status)}</td>
            <td>{formatDate(item.create_datetime)}</td>
            <td>
              {item.closed_datetime ? formatDate(item.closed_datetime) : '-'}
            </td>
            <td>{getDayMinuteSecondsByNumber(item.time_on_parking)}</td>
            <td>{item.payment_amount}</td>
            <td style={{ width: '30px' }}>
              {item.is_paid ? (
                <CheckSquareFill color="#1cd80f" size={30} />
              ) : (
                <XSquareFill color="#de0103" size={30} />
              )}
            </td>
            <td>
              {item.payment_is_valid_until
                ? formatDate(item.payment_is_valid_until)
                : '-'}
            </td>
            <td style={{ width: '20%' }}>
              <div className={css.table_btns}>
                {item.payment_amount > 0 && (
                  <Button
                    variant="success"
                    onClick={() => {
                      paidHandle(item?.id)
                    }}
                  >
                    Обнулить долг
                  </Button>
                )}
                {item.status !== 'closed' && (
                  <Button
                    variant="danger"
                    onClick={() => statusHandle(item.id)}
                  >
                    Закрыть
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))
      : null

  const mainContent = (
    <div>
      <div className={css.wrap}>
        <div className={css.flex}>
          <div className={cn(css.wrap_table, isActiveModal && css.active)}>
            {parkingInfo?.userType === 'admin' && (
              <Button
                style={{ marginBottom: '10px' }}
                onClick={() => setCloseOlderDateModal(true)}
              >
                Закрыть сессии старше даты
              </Button>
            )}

            <Table
              titles={titles}
              rows={rowsTable}
              hover
              className={css.table}
            />
          </div>

          <SessionsCard
            className={cn(css.card, isActiveModal && css.hidden)}
            onClickImage={changeActiveImageModal}
          />
        </div>
      </div>
      <PaginationCustom
        pages={pages}
        changePage={changePage}
        currentPage={currentPage}
      />
    </div>
  )

  const hasData = !(isLoading || isError)
  const errorMessage = isError ? errorContent : null
  const spinner = isLoading ? spinnerContent : null
  const content = hasData ? mainContent : null

  return (
    <>
      <FilterForm />
      {errorMessage}
      {spinner}
      {content}
      <CloseOlderThanDateModal
        show={closeOlderDateModal}
        handleClose={setCloseOlderDateModal}
      />
      <CardSessionModal
        show={isActiveModalMobile}
        handleClose={changeMobileModal}
      />
      {imageModal.isOpen && (
        <Lightbox
          onCloseRequest={changeActiveImageModal}
          mainSrc={imageModal.src}
          imagePadding={100}
        />
      )}
    </>
  )
}

export default SessionsPage
