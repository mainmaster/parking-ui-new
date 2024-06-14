import {useEffect, useRef, useState} from 'react'
import css from './FilterForm.module.scss'
import { Accordion, Col, Row, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
// Components
import Input from 'components/Input'
// Utils
import { colSpan, validationSchema } from './utils'
// Store
import Select from "../../../Select";
import {getAccessPointsRequest} from "../../../../api/access-points";
import {eventCodes} from "constants";
import {changeCurrentPage, setFilters, eventsFetch} from "../../../../store/events/eventsSlice";

const defaultValues = {
  vehiclePlate: '',
}

const FilterForm = () => {
  const dispatch = useDispatch()
  const formikRef = useRef()
  const [accessPoints, setAccessPointsState] = useState([])



  const resetHandle = () => {
    formikRef.current.resetForm()
    dispatch(eventsFetch())
    dispatch(setFilters(null))
    dispatch(changeCurrentPage(1))
  }

  const onSubmit = (values) => {
    dispatch(eventsFetch(values))
    dispatch(setFilters(values))
    dispatch(changeCurrentPage(1))
  }

  useEffect(()=>{
    return ()=>{
      dispatch(setFilters(null))
    }
  }, [])

  useEffect(()=>{

    getAccessPointsRequest()
        .then(r =>{
          let access = r.data.map((point) => {
            return {
              name: point.description,
              value: point.id
            }
          })
          setAccessPointsState([...access, {value: null, name:''}])
        })

    },[])
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
                        label="Тип события"
                        options={eventCodes}
                        onChange={(e) => props.setFieldValue('eventCode', e.target.value)}
                        name="eventCode"
                        className={css.input}
                        clear
                    />
                  </Col>
                  <Col {...colSpan}>
                    <Input
                        label="От"
                        name="createDateFrom"
                        onChange={(e) =>
                            props.setFieldValue('createDateFrom', e.target.value.toISOString().split('T')[0])
                        }
                        className={css.input}
                        type='date'
                    />
                    <Input
                        label="До"
                        name="createDateTo"
                        onChange={(e) =>
                            props.setFieldValue('createDateTo', e.target.value.toISOString().split('T')[0])
                        }
                        className={css.input}
                        type='date'
                    />
                  </Col>
                  <Col {...colSpan}>
                    <Select
                        label="Точка доступа"
                        options={accessPoints}
                        onChange={(e) => props.setFieldValue('accessPoint', e.target.value)}
                        name="accessPoint"
                        className={css.input}
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
