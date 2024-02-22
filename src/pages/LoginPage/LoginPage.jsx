import Layout from "../../components/Layout";
import styles from './loginPage.module.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'

import {useState} from "react";
import {login} from "../../api/auth/login";
import {useSnackbar} from "notistack";
import getParkingData from "../../api/auth/parking-data";

    const LoginPage = () =>{

        const { enqueueSnackbar } = useSnackbar()
        const [username, setUsername] = useState()
        const [password, setPassword] = useState()

        const submitLogin =  () =>{
            try {
                 login({username, password})
                     .then((res)=>{
                         getParkingData().then(res => {
                             const data = res.data
                             if(data.userType === 'operator'){
                                 localStorage.setItem('notificationsSound', 'true')
                             }
                         })
                         document.location.href = "/"
                     })
                     .catch(()=>{
                         enqueueSnackbar("Неверный логин или пароль", {
                             variant: 'error',
                         })
                     })
            }catch (e){
            }
        }

        return(
            <Layout title="Вход">
                <div style={{ display: 'flex', height: '40vh', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
                    <h1>Вход</h1>
                    <Form className={styles.wrapForm}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control onChange={(e)=> setUsername(e.target.value)}  type="email" placeholder="username" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control  onChange={(e)=> setPassword(e.target.value)}  type="password" placeholder="Пароль" />
                        </Form.Group>
                        <Button color="red" onClick={submitLogin}>Войти</Button>
                    </Form>

                </div>
            </Layout>
        )
}

export default LoginPage