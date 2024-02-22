import {Button, Card} from "react-bootstrap";
import css from "../../components/CameraItem/CameraItem.module.scss";
import {useSnackbar} from "notistack";

export const TerminalItem = ({terminal, deleteTerminal, setEditData, showModal}) =>{
    const {enqueueSnackbar} = useSnackbar()

    return(
        <Card>
            <Card.Header>{terminal.description}</Card.Header>
            <Card.Body>
                <Card.Text>
                    <span className={css.text}>
                      <span className={css.text_value}>Ip адрес:</span>
                      <span>{terminal.ip_address}</span>
                    </span>
                    <span className={css.text}>
                      <span className={css.text_value}>Адрес:</span>
                      <span>{terminal.address}</span>
                    </span>
                    <span className={css.text}>
                      <span className={css.text_value}>Место:</span>
                      <span>{terminal.place}</span>
                    </span>
                    <span className={css.text}>
                      <span className={css.text_value}>Номер автомата:</span>
                      <span>{terminal.automat_number}</span>
                    </span>
                    <span className={css.text}>
                      <span className={css.text_value}>Тип:</span>
                      <span>{terminal.terminal_type}</span>
                    </span>
                    <span className={css.text}>
                      <span className={css.text_value}>Порт:</span>
                      <span>{terminal.port}</span>
                    </span>
                </Card.Text>
                <div style={{display: 'flex', gap: '10px'}}>
                    <Button variant="success" onClick={()=>{
                        setEditData(terminal)
                        showModal(true)
                    }}>
                        Редактировать
                    </Button>
                    <Button onClick={()=> {
                        deleteTerminal(terminal.id)
                        enqueueSnackbar(`Терминал с ID ${terminal.id} удалён`, {variant: 'error'})
                    }}>
                        Удалить
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}