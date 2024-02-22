import { Fragment } from 'react'
import css from './Select.module.scss'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import cn from 'classnames'
import { ErrorMessage, useField } from 'formik'

const Select = ({ options, label, className, ...props }) => {
  const [field, meta] = useField(props)

  const error = meta.touched && meta.error

  return (
    <Form.Group className={cn(css.select, className)}>
      <Form.Label>{label}</Form.Label>
      <Form.Select {...field} {...props} isInvalid={error}>
        {options.map((option) => (
          <Fragment key={option.value}>
            <option hidden value />
            <option value={option.value}>{option.name}</option>
          </Fragment>
        ))}
      </Form.Select>
      <ErrorMessage component="div" name={field.name}>
        {(msg) => <div className={css.select_error}>{msg}</div>}
      </ErrorMessage>
    </Form.Group>
  )
}

Select.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }).isRequired
  ).isRequired,
}

export default Select
