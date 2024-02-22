import {useEffect, useRef} from 'react'
import css from './FilterForm.module.scss'
import { Accordion, Col, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
// Components
import Input from 'components/Input'
// Utils
import { colSpan, validationSchema } from './utils'
// Store
import { sessionsFetch, setFilters, changeCurrentPage } from 'store/sessions/sessionsSlice'
;
import {setActiveFilter} from "../../../../store/sessions/sessionsSlice";
import Select from "../../../Select";
import {eventCodes} from "constants";

const defaultValues = {
  vehiclePlate: '',
}

const FilterForm = () => {
  const dispatch = useDispatch()
  const formikRef = useRef()

  const onSubmit = (values) => {
    dispatch(sessionsFetch(values))
    dispatch(setFilters(values))
    dispatch(changeCurrentPage(1))
  }

  const resetHandle = () => {
    formikRef.current.resetForm()
    dispatch(setActiveFilter(false))
    dispatch(sessionsFetch())
    dispatch(setFilters(null))
    dispatch(changeCurrentPage(1))
  }

  useEffect(()=>{
    return ()=>{
      dispatch(setFilters(null))
    }
  }, [])

  return (
    <Accordion defaultActiveKey="0" className={css.wrapper}>
      <Accordion.Item>
        <Accordion.Header>Фильтр</Accordion.Header>
        <Accordion.Body>
          <Formik
            initialValues={defaultValues}
            onSubmit={onSubmit}
            innerRef={formikRef}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <Row>
                  <Col {...colSpan}>
                    <Input
                      label="Номер машины"
                      name="vehiclePlate"
                      type="text"
                      onChange={(e) =>
                        props.setFieldValue('vehiclePlate', e.target.value)
                      }
                      className={css.input}
                    />
                    <Select
                        label="Статус сессии"
                        options={[
                          {value: 'open', name: 'Открытые'},
                          {value: 'closed', name: 'Закрытые'},
                          {value: null, name: ''}
                        ]}
                        onChange={(e) => props.setFieldValue('status', e.target.value)}
                        name="status"
                        className={css.input}
                    />
                  </Col>
                  <Col {...colSpan}>
                    <Input
                        label="От"
                        name="createDateFrom"
                        onChange={(e) =>
                            props.setFieldValue('createDateFrom', e.target.value)
                        }
                        className={css.input}
                        type='date'
                    />
                    <Input
                        label="До"
                        name="createDateTo"
                        onChange={(e) =>
                            props.setFieldValue('createDateTo', e.target.value)
                        }
                        className={css.input}
                        type='date'
                    />
                  </Col>
                  <Col {...colSpan}>
                    <Select
                        label="Статус оплаты"
                        type="select"
                        options={[
                          {value: "True", name: 'Оплачено'},
                          {value: false, name: 'Не оплачено'},
                          {value: null, name: ''}
                        ]}
                        onChange={(e) => props.setFieldValue('isPaid', e.target.value)}
                        className={css.input}
                        name="isPaid"
                    />
                  </Col>
                </Row>
                <div className={css.btns}>
                  <Button type="submit">Применить</Button>
                  <Button variant="danger" type='reset' onClick={resetHandle}>
                    Сбросить
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default FilterForm
