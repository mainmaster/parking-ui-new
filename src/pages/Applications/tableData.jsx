import styles from '../Settings/settings.module.css';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useParkingInfoQuery } from '../../api/settings/settings';
import { CarNumberCard } from '../../components/CarNumberCard/CarNumberCard';
import { Link } from 'react-router-dom';

export let titles = [
  { id: 1, name: '#' },
  { id: 2, name: 'Номер машины' },
  { id: 4, name: 'Арендатор' },
  { id: 5, name: 'Использована' },
  { id: 6, name: 'Дата' },
  { id: 7, name: 'Действие' }
];
export let rows = (applications, deleteApplication, editApplication) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: parkingInfo } = useParkingInfoQuery();
  return applications?.map((application) => {
    return (
      <tr key={application.id} className={styles.operatorCard}>
        <td style={{ width: '10%' }}>{application.id}</td>
        <td style={{ width: '20%' }}>
          <CarNumberCard carNumber={application.vehicle_plate} isTable />
        </td>
        <td style={{ width: '25%' }}>{application.company_name}</td>
        <td style={{ width: '5%' }}>{application.is_used ? 'Да' : 'Нет'}</td>
        <td style={{ width: '100%' }}>{application.valid_for_date}</td>
        <td style={{ width: '20%', display: 'flex', gap: '10px' }}>
          <Button
            disabled={
              parkingInfo.userType !== 'renter' && !application.is_used
                ? false
                : true
            }
            onClick={() => {
              deleteApplication(application.id);
            }}
            style={{
              borderRadius: 10,
              fontSize: 13
            }}
          >
            Удалить
          </Button>
          <Button
            variant="success"
            disabled={
              parkingInfo.userType !== 'renter' && !application.is_used
                ? false
                : true
            }
            onClick={() => {
              editApplication(application);
            }}
            style={{
              borderRadius: 10,
              fontSize: 13
            }}
          >
            Изменить
          </Button>

          {application?.session_id ? (
            <Link to={`/sessions/${application?.session_id}`}>
              <Button variant="danger">Сессия</Button>
            </Link>
          ) : (
            <OverlayTrigger overlay={<Tooltip>Сессия не найдена</Tooltip>}>
              <span className="d-inline-block">
                <Button
                  style={{
                    borderRadius: 10,
                    fontSize: 13,
                    pointerEvents: 'none'
                  }}
                  disabled
                  variant="danger"
                >
                  Сессия
                </Button>
              </span>
            </OverlayTrigger>
          )}
        </td>
      </tr>
    );
  });
};
