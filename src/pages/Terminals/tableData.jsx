import styles from "../Settings/settings.module.css";
import {Button} from "react-bootstrap";
import {enqueueSnackbar} from "notistack";

export let terminalsTitles = [
    {id: 1, name: '#'},
    {id: 2, name: 'Имя'},
    {id: 3, name: "Действие"}
]

export let terminalsRows = (terminals, deleteTerminal) =>{
    return terminals.map((terminal)=>{
        return <tr key={terminal.id} className={styles.operatorCard}>
            <td style={{width: '10%'}}>{terminal.id}</td>
            <td style={{width: '70%'}}>{terminal.description}</td>
            <td style={{width: '20%',height: '20px'}}>
                <Button onClick={async ()=> {
                    let result = await deleteTerminal(terminal.id)
                    if('data' in result){
                        enqueueSnackbar(`Терминал с id ${terminal.id}`, {variant: 'success'})
                    }
                }
                } style={{height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}} >Удалить</Button>
            </td>
        </tr>
    })
}