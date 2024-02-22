import { useEffect, useRef } from 'react'
import css from './FilterForm.module.scss'
import { Accordion, Col, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { Button } from 'react-bootstrap'
// Components
import Input from 'components/Input'

// Utils
import { colSpan } from './utils'
import { CompanySelect } from './CompanySelect'
import { useParkingInfoQuery } from '../../../../api/settings/settings'
import { useDispatch } from 'react-redux'
import {
  applicationsFetch,
  changeCurrentPage,
  setFilters,
} from '../../../../store/applications/applicationSlice'
import Select from 'components/Select'

const FilterForm = () => {
  const { data: parkingInfo } = useParkingInfoQuery()
  const dispatch = useDispatch()
  const formikRef = useRef()

  const onSubmit = (values) => {
    console.log(values)
    dispatch(applicationsFetch(values))
    dispatch(setFilters(values))
    dispatch(changeCurrentPage(1))
  }

  const resetHandle = () => {
    formikRef.current.resetForm()
    dispatch(applicationsFetch())
    dispatch(changeCurrentPage(1))
  }

  useEffect(() => {
    return () => {
      dispatch(setFilters(null))
    }
  }, [])

  return (
    <>
      <Accordion defaultActiveKey="0" className={css.wrapper}>
        <Accordion.Item>
          <Accordion.Header>Фильтр</Accordion.Header>
          <Accordion.Body>
            <Formik initialValues={{}} onSubmit={onSubmit} innerRef={formikRef}>
              {(props) => (
                <form onSubmit={props.handleSubmit}>
                  <Row>
                    <Col {...colSpan}>
                      <Input
                        label="От"
                        name="validForDateFrom"
                        onChange={(e) =>
                          props.setFieldValue(
                            'validForDateFrom',
                            e.target.value
                          )
                        }
                        className={css.input}
                        type="date"
                      />
                      <Input
                        label="До"
                        name="validForDateTo"
                        onChange={(e) =>
                          props.setFieldValue('validForDateTo', e.target.value)
                        }
                        className={css.input}
                        type="date"
                      />
                    </Col>
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
                      {parkingInfo.userType !== 'renter' && (
                        <CompanySelect props={props} />
                      )}
                    </Col>
                    <Col {...colSpan}>
                      <Select
                          label="Статус заявки"
                          options={[
                            { name: 'Использована', value: true},
                            { name: 'Не использована', value: false},
                            { name: '', value: null}
                          ]}
                          onChange={(e) => {
                            props.setFieldValue('isUsed', e.target.value)
                          }}
                          name="status"
                          className={css.input}
                      />
                    </Col>
                  </Row>
                  <div className={css.btns}>
                    <Button type="submit">Применить</Button>
                    <Button variant="danger" type="reset" onClick={resetHandle}>
                      Сбросить
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default FilterForm
