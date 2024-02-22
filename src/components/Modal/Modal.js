// import css from './Modal.module.scss'
import PropTypes from 'prop-types'
import { Modal as CustomModal } from 'react-bootstrap'

const Modal = ({
  show,
  handleClose,
  header,
  footer,
  body,
  size = 'md',
  ...props
}) => (
  <CustomModal {...props} size={size} centered show={show} onHide={handleClose}>
    <CustomModal.Header closeButton>{header}</CustomModal.Header>
    <CustomModal.Body>{body}</CustomModal.Body>
    {footer && <CustomModal.Footer>{footer}</CustomModal.Footer>}
  </CustomModal>
)

Modal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  header: PropTypes.node,
  footer: PropTypes.node,
  body: PropTypes.node,
  size: PropTypes.string,
}

export default Modal
