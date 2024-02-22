import {Button, Form, Modal as CustomModal} from "react-bootstrap";
import {useLayoutEffect, useState} from "react";
import {createOperator, getAllOperators} from "api/operator/operator.api";
import {useSnackbar} from "notistack";
import Table from "components/Table";
import Modal from 'components/Modal'
import {operatorsRows, operatorsTitles} from "./tableData";

export const Operators = () =>{
    const {enqueueSnackbar} = useSnackbar()
    const [operators, setOperators] = useState([])
    const [modalActive, setModalActive] = useState(false)
    const [operatorFormData, setOperatorFormData] = useState({
        username: '',
        password: ''
    })
    useLayoutEffect(()=>{
        getAllOperators()
            .then((response)=> setOperators(response.data))
    },[])

    const submitCreateOperator = (e) =>{
        e.preventDefault()
        e.stopPropagation()
        createOperator(operatorFormData)
            .then(()=>{
                setModalActive(false)
                enqueueSnackbar('Оператор создан', {variant: 'success'})
                setOperatorFormData({
                    username: '',
                    password: ''
                })
                getAllOperators()
                    .then((response)=> setOperators(response.data))
            })
    }

    return(
        <div className="mb-3">
            <Button onClick={()=>setModalActive(true)} className="mb-4 mt-3">Добавить оператора</Button>
            <Modal
                show={modalActive}
                handleClose={()=>setModalActive(false)}
                header={<CustomModal.Title>Добавить оператора</CustomModal.Title>}
                body={<Form onSubmit={submitCreateOperator}>
                    <Form.Group >
                        <Form.Label>Логин</Form.Label>
                        <Form.Control
                            required
                            className='mb-3'
                            type='name'
                            value={operatorFormData.username}
                            onChange={(e)=> setOperatorFormData(
                                {...operatorFormData, username: e.target.value})}
                        />
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            required
                            className='mb-3'
                            type='text'
                            value={operatorFormData.password}
                            onChange={(e)=> setOperatorFormData(
                                {...operatorFormData, password: e.target.value})}
                        />
                        <Button type='submit'>Создать</Button>
                    </Form.Group>
                </Form>}
            />

            <h4 className="mb-4">Операторы</h4>
            <Table titles={operatorsTitles} rows={operatorsRows(operators, setOperators)} hover/>
        </div>
    )
}