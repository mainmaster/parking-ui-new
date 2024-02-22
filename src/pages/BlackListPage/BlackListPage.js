import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import css from './BlackListPage.module.scss'
import { Button, Spinner, Tab, Tabs } from 'react-bootstrap'
// Components
import CreateBlackListModal from 'components/Modals/CreateBlackListModal'
import EditBlackListModal from 'components/Modals/EditBlackListModal'
import PaginationCustom from 'components/Pagination'
import Table from 'components/Table'
// Store
import {
  blackListFetch,
  deleteBlackListFetch,
  createModalHandler,
  editModalHandler,
} from 'store/blackList/blackListSlice'
// Utils
import { titles } from './utils'
import { formatDateWithoutTime } from 'utils'
import {CarNumberCard} from "../../components/CarNumberCard/CarNumberCard";
import { useNavigate, useParams } from 'react-router-dom'
import FilterForm from '../../components/pages/black-list/FilterForm'
import { blackListChangePageFetch } from '../../store/blackList/blackListSlice'


const BlackListPage = () => {
  const dispatch = useDispatch()
  const blackList = useSelector((state) => state.blackList.blackList)
  const isLoadingFetch = useSelector((state) => state.blackList.isLoadingFetch)
  const isErrorFetch = useSelector((state) => state.blackList.isErrorFetch)
  const isEditModal = useSelector((state) => state.blackList.isEditModal)
  const isCreateModal = useSelector((state) => state.blackList.isCreateModal)
  const pages = useSelector((state) => state.blackList.pages)
  const currentPage = useSelector((state) => state.blackList.currentPage)



  const navigate = useNavigate()
  const urlStatus = useParams()

  useEffect(() => {
    dispatch(blackListFetch(urlStatus['*']))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlStatus])

  const changePage = (index) => {
    dispatch(blackListChangePageFetch(index))
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
    blackList.count !== 0
      ? blackList?.black_list?.map((item, index) => (
          <tr key={index}>
            <td>{item.id}</td>
              <td>
                  <CarNumberCard carNumber={item.vehicle_plate} isTable/>
              </td>
            <td>{item.description}</td>
            <td>{formatDateWithoutTime(item.valid_until)}</td>
            <td className={css.table_btns}>
              <Button
                variant="success"
                onClick={() => dispatch(editModalHandler(item.id))}
              >
                Редактировать
              </Button>
              <Button
                variant="danger"
                onClick={() => dispatch(deleteBlackListFetch({
                  id: item.id,
                  status: urlStatus['*']
                }))}
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
          <Tabs onSelect={(e)=>navigate(e.replace('/',''))} defaultActiveKey={"/"+urlStatus['*']}>
            <Tab eventKey="/active" title="Активные">
              <Table titles={titles} rows={rowsTable} hover className={css.table} />
            </Tab>
            <Tab eventKey="/inactive" title="Неактивные">
              <Table titles={titles} rows={rowsTable} hover className={css.table} />
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
      <FilterForm/>
      <div className={css.top}>
        <Button className="mb-4 mt-3" onClick={() => dispatch(createModalHandler())}>
          Добавить в черный список
        </Button>
      </div>
      {errorMessage}
      {spinner}
      {content}
      <CreateBlackListModal
        show={isCreateModal}
        handleClose={() => dispatch(createModalHandler())}
      />
      <EditBlackListModal
        show={isEditModal}
        handleClose={() => dispatch(editModalHandler())}
      />
    </>
  )
}

export default BlackListPage
