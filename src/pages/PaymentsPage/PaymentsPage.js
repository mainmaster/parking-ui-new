import { useEffect } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import css from './PaymentsPage.module.scss'
import { useDispatch, useSelector } from 'react-redux'
// Store
import {
  paymentsFetch,
  paymentsChangePageFetch,
  changeCurrentPage,
} from 'store/payments/paymentsSlice'
// Components
import Table from 'components/Table'
import PaginationCustom from 'components/Pagination'
import FilterForm from 'components/pages/payments/FilterForm'
// Utils
import { titles } from './utils'
import { formatDate } from 'utils'
import { useSnackbar } from 'notistack'
import { usePostPaymentRefundMutation } from '../../api/apiSlice'
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard'
import { NavLink } from 'react-router-dom'

const PaymentsPage = () => {
  const dispatch = useDispatch()
  const payments = useSelector((state) => state.payments.payments)
  const pages = useSelector((state) => state.payments.pages)
  const currentPage = useSelector((state) => state.payments.currentPage)
  const isLoading = useSelector((state) => state.payments.isLoadingFetch)
  const isError = useSelector((state) => state.payments.isErrorFetch)
  const totalPayment = useSelector((state) => state.payments.totalPayment)
  const [addRefund] = usePostPaymentRefundMutation()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    dispatch(paymentsFetch())
    return () => dispatch(changeCurrentPage(1))
  }, [dispatch])

  const handleRefundPayment = (id) => {
    addRefund(id)
      .unwrap()
      .then(() => {
        enqueueSnackbar(`Возврат по ID - ${id}`, {
          variant: 'success',
        })
        dispatch(paymentsFetch())
      })
  }

  const changePage = (index) => {
    dispatch(paymentsChangePageFetch(index))
  }

  const spinnerContent = (
    <div className={css.spinner}>
      <Spinner animation="border" />
    </div>
  )

  const errorContent = (
    <div className={css.error}>Что-то пошло не так! Попробуйте позже</div>
  )

  const rowsTable =
    payments.length !== 0
      ? payments.map((item, index) => (
          <tr key={index}>
            <td>{item.id}</td>
            <td>
              <CarNumberCard carNumber={item.vehicle_plate} isTable />
            </td>
            <td>{item.email}</td>
            <td>{item.totalPayedSum}</td>
            <td>{formatDate(item.create_datetime)}</td>
            <td>{item.paymentType}</td>
            <td>{item.isRefund ? <>Возврат</> : null}</td>
            <td>
              {item.isRefund ? null : (
                <Button
                  style={{ marginRight: '5px' }}
                  onClick={() => handleRefundPayment(item.id)}
                >
                  Возврат
                </Button>
              )}

              <NavLink to={`${item.id}`}>
                <Button variant="success">Страница оплаты</Button>
              </NavLink>
            </td>
          </tr>
        ))
      : null

  const mainContent = (
    <div>
      <div className={css.wrap}>
        <div className={css.wrap_table}>
          <div style={{ backgroundColor: 'white', padding: '20px 10px' }}>
            <h3>Общая сумма оплат: {totalPayment}&#8381;</h3>
          </div>
          <Table titles={titles} rows={rowsTable} hover className={css.table} />
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
    </>
  )
}

export default PaymentsPage
