import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import css from './CarParkPage.module.scss'
import { Button, Spinner, Tab, Tabs } from 'react-bootstrap'
// Components
import CreateCarParkModal from 'components/Modals/CreateCarParkModal'
import EditCarParkModal from 'components/Modals/EditCarParkModal'
import Table from 'components/Table'
import PaginationCustom from 'components/Pagination'

// Store
import {
  carParkFetch,
  editModalHandler,
  createModalHandler,
  deleteCarParkFetch,
} from 'store/carPark/carParkSlice'
// Utils
import { titles } from './utils'
import { formatDateWithoutTime } from 'utils'
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useRentersQuery } from '../../api/renters/renters.api'
import FilterForm from '../../components/pages/car-park/FilterForm'
import { carParkChangePageFetch } from '../../store/carPark/carParkSlice'

const CarParkPage = () => {
  const dispatch = useDispatch()
  const carParks = useSelector((state) => state.carPark.carParks)
  const isLoadingFetch = useSelector((state) => state.carPark.isLoadingFetch)
  const isErrorFetch = useSelector((state) => state.carPark.isErrorFetch)
  const isEditModal = useSelector((state) => state.carPark.isEditModal)
  const isCreateModal = useSelector((state) => state.carPark.isCreateModal)
  const pages = useSelector((state) => state.carPark.pages)
  const currentPage = useSelector((state) => state.carPark.currentPage)

  const { data: renters } = useRentersQuery()

  const navigate = useNavigate()
  const urlStatus = useParams()
  const [params] = useSearchParams()
  const [select, setSelect] = useState(
    `/${document.location.href.split('/')[4]}`
  )
  console.log(select)

  const changePage = (index) => {
    dispatch(carParkChangePageFetch(index))
  }

  useEffect(() => {
    dispatch(carParkFetch())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlStatus, params])

  const spinnerContent = (
    <div className={css.spinner}>
      <Spinner animation="border" />
    </div>
  )

  const errorContent = (
    <div className={css.error}>Что-то пошло не так! Попробуйте позже</div>
  )

  const rowsTable =
    carParks?.count !== 0
      ? carParks?.car_park?.map((item, index) => (
          <tr key={index}>
            <td>{item.id}</td>
            <td>
              <CarNumberCard carNumber={item.vehicle_plate} isTable />
            </td>
            <td>{item.description}</td>
            <td>
              {
                renters?.find((renter) => renter.id == item.renter)
                  ?.company_name
              }
            </td>
            <td>{formatDateWithoutTime(item.valid_until)}</td>
            <td className={css.table_btns}>
              <Button
                variant="success"
                onClick={() => dispatch(editModalHandler(item.id))}
              >
                Изменить
              </Button>
              <Button
                variant="danger"
                onClick={() =>
                  dispatch(
                    deleteCarParkFetch({
                      id: item.id,
                    })
                  )
                }
              >
                Удалить
              </Button>
            </td>
          </tr>
        ))
      : null

  const tableContent = (
    <div>
      <div className={css.wrap}>
        <div className={css.wrap_table}>
          <Tabs
            activeKey={select}
            onSelect={(e) => {
              navigate(e.replace('/', ''))
              setSelect(e)
            }}
            defaultActiveKey={select}
          >
            <Tab eventKey="/active" title="Активные">
              <Table
                titles={titles}
                rows={rowsTable}
                hover
                className={css.table}
              />
            </Tab>
            <Tab eventKey="/inactive" title="Неактивные">
              <Table
                titles={titles}
                rows={rowsTable}
                hover
                className={css.table}
              />
            </Tab>
            <Tab eventKey="/subscribe" title="Абонементы">
              <Table
                titles={titles}
                rows={rowsTable}
                hover
                className={css.table}
              />
            </Tab>
          </Tabs>
          <PaginationCustom
            pages={pages}
            changePage={changePage}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  )

  const hasData = !(isLoadingFetch || isErrorFetch)
  const errorMessage = isErrorFetch ? errorContent : null
  const spinner = isLoadingFetch ? spinnerContent : null
  const content = hasData ? tableContent : null

  return (
    <>
      <FilterForm />
      <div className={css.top}>
        <Button
          className="mb-4 mt-3"
          onClick={() => dispatch(createModalHandler())}
        >
          Добавить машину
        </Button>
      </div>
      {errorMessage}
      {spinner}
      {content}
      <CreateCarParkModal
        show={isCreateModal}
        handleClose={() => dispatch(createModalHandler())}
      />
      <EditCarParkModal
        show={isEditModal}
        handleClose={() => dispatch(editModalHandler())}
      />
    </>
  )
}

export default CarParkPage
