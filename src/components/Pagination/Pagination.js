// import css from './Pagination.module.scss'
import PropTypes from 'prop-types'
import { PaginationControl } from 'react-bootstrap-pagination-control'

const PaginationCustom = ({ pages, changePage, currentPage }) => (
  <PaginationControl
    page={currentPage}
    between={4}
    total={pages}
    limit={50}
    changePage={changePage}
    ellipsis={1}
    last
  />
)

PaginationCustom.propTypes = {
  pages: PropTypes.number,
  currentPage: PropTypes.number,
  changePage: PropTypes.func,
}

export default PaginationCustom
