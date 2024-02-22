import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import css from './Input.module.scss'
import cn from 'classnames'
import { ErrorMessage, useField } from 'formik'

const Input = ({ onChange, label, className, ...props }) => {
  const [field, meta] = useField(props)

  const error = meta.touched && meta.error

  return (
    <div className={cn(css.input, className)}>
      <Form.Label htmlFor={props.name}>{label}</Form.Label>
      <Form.Control id={props.name} isInvalid={error} {...field} {...props} />
      <ErrorMessage component="div" name={field.name}>
        {(msg) => <div className={css.input_error}>{msg}</div>}
      </ErrorMessage>
    </div>
  )
}

Input.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default Input
