
import PaginationCustom from 'components/Pagination'
import { useDispatch, useSelector } from 'react-redux'
import Table from 'components/Table'
import { useEffect } from 'react'
import { rows, titles } from './tableData'
import { searchLogsFetch, changeCurrentPage, searchLogsChangePageFetch } from './searchLogs.slice'

export const SearchLogsPage = () => {
    
  const searchLogs = useSelector((state) => state.searchLogs.searchLogs)
  const currentPage = useSelector((state) => state.searchLogs.currentPage)
  const pages = useSelector((state) => state.searchLogs.pages)

  const dispatch = useDispatch()


  const changePage = (index) => {
    dispatch(searchLogsChangePageFetch(index))
  }

  useEffect(() => {
    dispatch(searchLogsFetch())
    return () => dispatch(changeCurrentPage(1))
  }, [dispatch])


  return (
    <div>
      <Table
        titles={titles}
        rows={rows(searchLogs?.search)}
      />
      <PaginationCustom
        pages={pages}
        changePage={changePage}
        currentPage={currentPage}
      />
    </div>
  )
}
