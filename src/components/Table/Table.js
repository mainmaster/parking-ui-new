import css from './Table.module.scss'
import { Table as CustomTable } from 'react-bootstrap'
import PropTypes from 'prop-types'
import cn from 'classnames'

const Table = ({ titles, rows, className, ...props }) => {
  return (
    <div style={{ position: 'sticky', display: 'flex',overflow: 'scroll'}}>
      <CustomTable  bordered className={cn(css.table, className)} {...props}>
      <thead style={{position: 'sticky', top: '-5px'}}>
          <tr>
            {titles.map((title) => (
              <th key={title.id}>{title.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </CustomTable>
    </div>
  )
}

Table.propTypes = {
  titles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  rows: PropTypes.node,
  className: PropTypes.string,
}

export default Table
