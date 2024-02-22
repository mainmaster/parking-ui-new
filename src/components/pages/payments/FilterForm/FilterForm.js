import {useEffect, useRef} from 'react'
import css from './FilterForm.module.scss'
import { Accordion, Col, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { Button } from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
// Components
import Input from 'components/Input'
// Utils
import { colSpan, validationSchema } from './utils'
// Store
import { paymentsFetch } from 'store/payments/paymentsSlice'
import Select from "../../../Select";
import Form from "react-bootstrap/Form";
import {
 setFilters
} from "../../../../store/payments/paymentsSlice";
import {changeCurrentPage} from "../../../../store/payments/paymentsSlice";


const FilterForm = () => {
  const dispatch = useDispatch()
  const formikRef = useRef()

  const defaultValues = {
     vehicle_plate: ''
  }
    const resetHandle = () => {
        formikRef.current.resetForm()
        dispatch(paymentsFetch())
        dispatch(setFilters(null))
        dispatch(changeCurrentPage(1))
    }

    const onSubmit = (values) => {
        dispatch(paymentsFetch(values))
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
                        label="Способ оплаты"
                        options={[
                          {value: 'sber', name: 'Сбер'},
                          {value: 'yookassa', name: 'Yookassa'},
                          {value: 'pos_terminal', name: 'Пос терминал'},
                          {value: null, name: ''}
                        ]}
                        onChange={(e) => props.setFieldValue('paymentType', e.target.value)}
                        name="isPaid"
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
                        label="Статус возврата"
                        options={[
                          {value: "True", name: 'С возвратом'},
                          {value: "false", name: 'Без возврата'},
                          {value: null, name: ''}
                        ]}
                        onChange={(e) => props.setFieldValue('isRefund', e.target.value)}
                        name="isRefund"
                        className={css.input}
                    />
                      <Select
                        label="Тип оплаты"
                        options={[
                          {value: "subscription", name: 'Абонемент'},
                          {value: "session", name: 'Разовый'},
                          {value: null, name: ''}
                        ]}
                        onChange={(e) => props.setFieldValue('paymentFor', e.target.value)}
                        name="paymentFor"
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