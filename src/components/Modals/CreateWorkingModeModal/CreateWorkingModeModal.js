import { useEffect, useRef, useState} from 'react'
import css from './CreateWorkingModeModal.module.scss'
import PropTypes from 'prop-types'
import { Button, Modal as CustomModal } from 'react-bootstrap'
import { Formik } from 'formik'
import { useDispatch } from 'react-redux'
import Modal from 'components/Modal'
import Input from 'components/Input'
import Select from 'components/Select'

import { createWorkingModeFetch } from 'store/workingModes/workingModesSlice'

import {
    createWorkingModesShemaPayByDay, createWorkingModesShemaPayByFirstHours,
    creatWorkingModesSchema,
    creatWorkingModesSchemaClosed,
    creatWorkingModesSchemaHour,
    creatWorkingModesSchemaInterval,
} from './utils'

import { passModeOptions } from 'constants'

const CreateWorkingModeModal = ({ show, handleClose }) => {
  const dispatch = useDispatch()
  const formikRef = useRef()
  const [isDisabledPassByInterval, setIsDisabledPassByInterval] = useState(false)
  const [isDisabledPassByHour, setIsDisabledPassByHour] = useState(false)
  const [isDisabledPassByClosed, setIsDisabledPassByClosed] = useState(false);
  const [isDisabledPayByDay, setIsDisabledPayByDay] = useState(false);
  const [isDisabledPayByFirstHours, setIsDisabledByFirstHours] = useState(false)
  const [disableAll, setDisableAll] = useState(true);

  const onSubmit = (values) => {
   dispatch(createWorkingModeFetch(values));
  }

  const onChangePassMode = (value) => {
      switch (value){
          case 'pay_by_interval':
              setIsDisabledPassByInterval(true)
              setIsDisabledPassByHour(false)
              setIsDisabledPassByClosed(false)
              setIsDisabledByFirstHours(true)
              setIsDisabledPayByDay(true)
              formikRef.current.setFieldValue('entry_fee', 0)
              formikRef.current.setFieldValue('free_time_min', 0)
              formikRef.current.setFieldValue('time_gte_hour', 0)
              formikRef.current.setFieldValue('time_gte_min', 0)
              formikRef.current.setFieldValue('time_lte_hour', 0)
              formikRef.current.setFieldValue('time_lte_min', 0)
              break;
          case 'pay_by_hour':
              setIsDisabledPassByHour(true)
              setIsDisabledPassByInterval(false)
              setIsDisabledPayByDay(true)
              setIsDisabledByFirstHours(true)
              setIsDisabledPassByClosed(false)
              formikRef.current.setFieldValue('interval', 0)
              break;
          case 'closed':
              setIsDisabledPassByClosed(true)
              setIsDisabledPayByDay(true)
              setIsDisabledPassByHour(false)
              setIsDisabledPassByInterval(false)
              formikRef.current.setFieldValue('price', 0)
              formikRef.current.setFieldValue('entry_fee', 0)
              formikRef.current.setFieldValue('interval', 0)
              formikRef.current.setFieldValue('free_time_min', 0)
              break;
          case 'pay_by_day':
              setIsDisabledPayByDay(false)
              setIsDisabledPassByClosed(false)
              setIsDisabledPassByHour(true)
              setIsDisabledPassByInterval(true)
              setIsDisabledByFirstHours(true)
              formikRef.current.setFieldValue('price', 0)
              formikRef.current.setFieldValue('day_counts_from_mins', 0)
              formikRef.current.setFieldValue('price', 0)
              formikRef.current.setFieldValue('entry_fee', 0)
              formikRef.current.setFieldValue('interval', 0)
              formikRef.current.setFieldValue('entry_fee', 0)
              formikRef.current.setFieldValue('free_time_min', 0)
              formikRef.current.setFieldValue('time_gte_hour', 0)
              formikRef.current.setFieldValue('time_gte_min', 0)
              formikRef.current.setFieldValue('time_lte_hour', 0)
              formikRef.current.setFieldValue('time_lte_min', 0)
              formikRef.current.setFieldValue('transit_block_time_min', 0)
              break;
          case 'pay_by_first_hours':
              setIsDisabledPayByDay(true)
              setIsDisabledPassByHour(true)
              setIsDisabledPassByInterval(true)
              setIsDisabledPassByClosed(false)
              setIsDisabledByFirstHours(false)
              formikRef.current.setFieldValue('price', 0)
              formikRef.current.setFieldValue('entry_fee', 0)
              formikRef.current.setFieldValue('interval', 0)
              formikRef.current.setFieldValue('free_time_min', 0)
              formikRef.current.setFieldValue('number_of_first_mins', 0)
              formikRef.current.setFieldValue('time_gte_hour', 0)
              formikRef.current.setFieldValue('time_gte_min', 0)
              formikRef.current.setFieldValue('time_lte_hour', 0)
              formikRef.current.setFieldValue('time_lte_min', 0)
              formikRef.current.setFieldValue('transit_block_time_min', 0)
      }
      formikRef.current.setFieldValue('pass_mode', value)
  }

  useEffect(()=>{
     if(formikRef.current?.values){
         if(formikRef.current?.values.pass_mode === ''){
             setDisableAll(true)
         }else{
             setDisableAll(false)
         }
     }
  },[formikRef.current])

    const validationSchema = isDisabledPassByClosed
        ? creatWorkingModesSchemaClosed
        : isDisabledPassByHour
            ? creatWorkingModesSchemaHour
            : isDisabledPassByInterval
                ? creatWorkingModesSchemaInterval
                : creatWorkingModesSchema

    const validator = () =>{
      if(!isDisabledPayByFirstHours){
          return createWorkingModesShemaPayByFirstHours
      }else if(!isDisabledPayByDay){
          return createWorkingModesShemaPayByDay
      }else{
          return validationSchema
      }
    }
  return (
    <Modal
      show={show}
      handleClose={handleClose}
      header={<CustomModal.Title>Добавить режим</CustomModal.Title>}
      body={
        <Formik
          initialValues={{
              time_lte_hour: '',
              time_gte_hour: '',
              time_lte_min: '',
              time_gte_min: '',
              transit_block_time_min: '',
              free_time_min: '',
              price: '',
              description: '',
              pass_mode: '',
              entry_fee: '',
              interval: '',
              day_counts_from_mins: '',
              number_of_first_mins: '',
          }}
          onSubmit={onSubmit}
          validationSchema={validator}
          innerRef={formikRef}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} id="create-working-mode">
                <Select
                    label="Пропускной режим"
                    options={passModeOptions}
                    onChange={(e) => onChangePassMode(e.target.value)}
                    name="pass_mode"
                    className={css.input}
                />
              <Input
                label="Название"
                name="description"
                type="text"
                onChange={(e) =>
                  props.setFieldValue('description', e.target.value)
                }
                disabled={disableAll}
                className={css.input}
              />
              <Input
                label="Цена"
                name="price"
                type="number"
                onChange={(e) => props.setFieldValue('price', e.target.value)}
                className={css.input}
                disabled={isDisabledPassByClosed || disableAll}
              />
                <Input
                    label="Количество минут для запуска суточного режима"
                    name="day_counts_from_mins"
                    type="number"
                    onChange={(e) => props.setFieldValue('day_counts_from_mins', e.target.value)}
                    className={css.input}
                    disabled={isDisabledPayByDay || disableAll}
                />
                <Input
                    label="Количество первых N минут"
                    name="number_of_first_mins"
                    type="number"
                    onChange={(e) => props.setFieldValue('number_of_first_mins', e.target.value)}
                    className={css.input}
                    disabled={isDisabledPayByFirstHours || disableAll}
                />
              <Input
                label="Входная плата"
                name="entry_fee"
                type="number"
                onChange={(e) =>
                  props.setFieldValue('entry_fee', e.target.value)
                }
                className={css.input}
                disabled={isDisabledPassByInterval || isDisabledPassByClosed || disableAll}
              />
              <Input
                label="Интервал"
                name="interval"
                type="number"
                onChange={(e) =>
                  props.setFieldValue('interval', e.target.value)
                }
                className={css.input}
                disabled={isDisabledPassByHour || isDisabledPassByClosed || disableAll}
              />
              <Input
                label="Время транзитной блокировки(мин)"
                name="transit_block_time_min"
                type="number"
                disabled={!isDisabledPayByDay || !isDisabledPayByFirstHours || disableAll}
                onChange={(e) =>
                  props.setFieldValue('transit_block_time_min', e.target.value)
                }
                className={css.input}
              />
              <Input
                label="Свободное время(мин)"
                name="free_time_min"
                type="number"
                onChange={(e) =>
                  props.setFieldValue('free_time_min', e.target.value)
                }
                className={css.input}
                disabled={isDisabledPassByInterval || isDisabledPassByClosed || disableAll}
              />

              <div className={css.input_wrap}>
                  <Input
                      label="Время(от) час"
                      name="time_lte_hour"
                      type="number"
                      onChange={(e) =>
                          props.setFieldValue('time_lte_hour', e.target.value)
                      }
                      className={css.input}
                      disabled={isDisabledPassByInterval || disableAll}
                  />
                  <Input
                      label="Время(от) мин"
                      name="time_lte_min"
                      type="number"
                      onChange={(e) =>
                          props.setFieldValue('time_lte_min', e.target.value)
                      }
                      className={css.input}
                      disabled={isDisabledPassByInterval || disableAll}
                  />
                  <Input
                      label="Время(до) час"
                      name="time_gte_hour"
                      type="number"
                      onChange={(e) =>
                          props.setFieldValue('time_gte_hour', e.target.value)
                      }
                      className={css.input}
                      disabled={isDisabledPassByInterval || disableAll}
                  />
                  <Input
                      label="Время(до) мин"
                      name="time_gte_min"
                      type="number"
                      onChange={(e) =>
                          props.setFieldValue('time_gte_min', e.target.value)
                      }
                      className={css.input}
                      disabled={isDisabledPassByInterval || disableAll}
                  />
              </div>
            </form>
          )}
        </Formik>
      }
      footer={
        <Button type="submit" form="create-working-mode">
          Создать
        </Button>
      }
    />
  )
}

CreateWorkingModeModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
}

export default CreateWorkingModeModal
