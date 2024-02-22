import css from './Backdrop.module.scss'
import PropTypes from 'prop-types'
import cn from 'classnames'

const BackDrop = ({ onClick, className }) => (
  <div className={cn(css.backdrop, className)} onClick={onClick} />
)

BackDrop.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default BackDrop
