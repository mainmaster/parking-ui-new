import { useMemo } from 'react'
import css from './MultiSelect.module.scss'
import PropTypes from 'prop-types'
import Select from 'react-select'
import cn from 'classnames'
import { ErrorMessage, useField } from 'formik'
import { Form } from 'react-bootstrap'

const MultiSelect = ({ options, label, className, onChange, ...props }) => {
  const [field, meta] = useField(props)

  const error = meta.touched && meta.error

  const customStyles = useMemo(
    () => ({
      control: (provided, state) => ({
        ...provided,
        borderColor: error ? '#dc3545' : 'hsl(0, 0%, 80%)',
      }),
    }),
    [error]
  )

  return (
    <Form.Group className={cn(css.select, className)}>
      <Form.Label>{label}</Form.Label>
      <div>
        <Select
          styles={customStyles}
          label={label}
          closeMenuOnSelect={false}
          isMulti
          options={options}
          name={field.name}
          value={field.value || ''}
          menuPlacement="auto"
          noOptionsMessage={() => <div>Ничего не найдено</div>}
          onChange={onChange}
          placeholder=""
        />
      </div>
      <ErrorMessage component="div" name={field.name}>
        {(msg) => <div className={css.select_error}>{msg}</div>}
      </ErrorMessage>
    </Form.Group>
  )
}

MultiSelect.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }).isRequired
  ).isRequired,
}

export default MultiSelect
