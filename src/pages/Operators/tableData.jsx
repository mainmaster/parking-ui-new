import styles from "../Settings/settings.module.css";
import {Button} from "react-bootstrap";
import {enqueueSnackbar} from "notistack";
import {deleteOperator, getAllOperators} from "../../api/operator/operator.api";

export let operatorsTitles = [
    {id: 1, name: '#'},
    {id: 2, name: 'Логин'},
    {id: 3, name: "Действие"}
]

export let operatorsRows = (operators, setOperators) =>{
    return operators.map((operator)=>{
        return <tr key={operator.id} className={styles.operatorCard}>
            <td style={{width: '10%'}}>{operator.id}</td>
            <td style={{width: '70%'}}>{operator.username}</td>
            <td style={{width: '20%',height: '20px'}}>
                <Button onClick={()=> {
                    deleteOperator(operator.id).then(()=>{
                        enqueueSnackbar(`Оператор ${operator.username} удалён`, {
                            variant: 'success'
                        })
                        getAllOperators()
                            .then((response)=> setOperators(response.data))
                    })
                }
                } style={{
                    borderRadius: 10,
                    fontSize: 13,
                    margin: 0,
                    paddingTop: '3px',
                    paddingBottom: '3px'
                }} >Удалить</Button>
            </td>
        </tr>
    })
}