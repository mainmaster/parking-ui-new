import css from "./Header.module.scss";
import {Button, Dropdown} from "react-bootstrap";
import {logout} from "../../api/auth/login";
import {useParkingInfoQuery} from "../../api/settings/settings";

export const DisplayDataHeader = ({userData}) =>{
    const {data: parkingData} = useParkingInfoQuery()

    return (
        <>
            <span style={{fontWeight: 700}}>
                {parkingData?.userType === 'admin' && 'Админ'}
                {parkingData?.userType === 'operator' && 'Оператор'}
                {parkingData?.userType === 'renter' && 'Арендатор'}
            </span>
            <div className={css.parkingInfo} style={{display:'flex', gap: '10px'}}>
                <Dropdown.Item disabled >ID: {parkingData?.parkingID}</Dropdown.Item>
                <Dropdown.Item disabled >Имя: {parkingData?.name}</Dropdown.Item>
                <Dropdown.Item disabled >Адрес: {parkingData?.address}</Dropdown.Item>
            </div>
            <Dropdown drop="down-centered" style={{marginRight: '20px'}}>
                <Dropdown.Toggle id="dropdown-basic">
                    {userData.username}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item disabled >email: {userData.email}</Dropdown.Item>
                    <Dropdown.Divider />
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Button style={{width: '90%'}} onClick={()=>logout()}>
                            Выйти
                        </Button>
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}