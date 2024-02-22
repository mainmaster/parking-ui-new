import {useEffect, useRef} from 'react'
import css from './FilterForm.module.scss'
import { Accordion, Col, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { Button } from 'react-bootstrap'
import {useDispatch} from 'react-redux'
// Components
import Input from 'components/Input'
// Utils
import { colSpan, } from './utils'
import { blackListFetch, changeCurrentPage, setFilters } from '../../../store/blackList/blackListSlice'
// Store



const FilterForm = () => {
  const dispatch = useDispatch()
  const formikRef = useRef()

  const defaultValues = {
    vehiclePlate: '',
  }
    const resetHandle = () => {
        formikRef.current.resetForm()
        dispatch(blackListFetch())
        dispatch(setFilters(null))
        dispatch(changeCurrentPage(1))
    }

    const onSubmit = (values) => {
        dispatch(blackListFetch(values))
        dispatch(setFilters(values))
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
                  </Col>
                </Row>
                <div className={css.btns}>
                  <Button type="submit">Применить</Button>
                  <Button variant="danger" type="reset" onClick={()=>{
                      resetHandle()
                  }}>
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
