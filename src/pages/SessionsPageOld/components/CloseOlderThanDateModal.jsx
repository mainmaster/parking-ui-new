import Modal from "../../../components/Modal";
import {Button, Modal as CustomModal} from "react-bootstrap";
import Input from "../../../components/Input";
import {Formik} from "formik";
import css from "../../../components/Modals/EditCameraModal/EditCameraModal.module.scss";
import {useDispatch} from "react-redux";
import {closeOlderThanDateSessionsFetch} from "../../../store/sessions/sessionsSlice";

export const CloseOlderThanDateModal = ({show, handleClose}) =>{
    const dispatch = useDispatch()

    const handleSubmit = (e) =>{
        try{
            dispatch(closeOlderThanDateSessionsFetch(e.date))
            handleClose()
        }catch (e){
            console.error(e)
        }
    }

    return(
        <Modal
            show={show}
            handleClose={handleClose}
            body={
                <Formik
                    initialValues={{ date: ''}}
                    onSubmit={handleSubmit}
                >
                    {(props)=>(
                        <form onSubmit={props.handleSubmit}>
                            <h5>Дата</h5>
                            <Input
                                name='date'
                                onChange={null}
                                type='date'
                                required
                                label=''/>
                            <Button
                                className='mt-3'
                                type='submit'
                                onClick={()=>{

                                }}
                            >
                                Закрыть сессии
                            </Button>
                        </form>
                    )}
                </Formik>
            }
        />
    )
}