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
// Store
import Select from "../../Select";

import { carParkFetch, changeCurrentPage, setFilters } from '../../../store/carPark/carParkSlice'
import { useRentersQuery } from '../../../api/renters/renters.api'


const FilterForm = () => {
  const dispatch = useDispatch()
  const formikRef = useRef()
  const {data: renters} = useRentersQuery()

  const companiesOptions = renters?.map((renter)=>{
    return {
      name: renter.company_name,
      value: renter.company_name
    }
  })


  const defaultValues = {
    vehiclePlate: '',
     companyName: ''
  }
    const resetHandle = () => {
        formikRef.current.resetForm()
        dispatch(carParkFetch())
        dispatch(setFilters(null))
        dispatch(changeCurrentPage(1))
    }

    const onSubmit = (values) => {
        dispatch(carParkFetch(values))
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
                    <Select
                        label="Имя компании"
                        options={companiesOptions ? companiesOptions : []}
                        onChange={(e) => props.setFieldValue('companyName', e.target.value)}
                        name="companyName"
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
