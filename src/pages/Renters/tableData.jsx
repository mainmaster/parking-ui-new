import styles from '../Settings/settings.module.css';
import { Button } from 'react-bootstrap';
import { enqueueSnackbar } from 'notistack';

export let rentersTitles = [
  { id: 1, name: '#' },
  { id: 2, name: 'Логин' },
  { id: 4, name: 'Арендатор' },
  { id: 5, name: 'Контакты' },
  { id: 6, name: 'Действие' }
];

export let rentersRows = (
  renters,
  activateRenter,
  deactivateRenter,
  editRenter
) => {
  return renters?.map((renter) => {
    return (
      <tr key={renter.id} className={styles.operatorCard}>
        <td style={{ width: '10%' }}>{renter.id}</td>
        <td style={{ width: '20%' }}>{renter.username}</td>
        <td style={{ width: '30%' }}>{renter.company_name}</td>
        <td style={{ width: '70%' }}>{renter.contacts}</td>

        <td
          style={{
            display: 'flex',
            gap: '10px',
            width: '250px',
            justifyContent: 'space-between'
          }}
        >
          <Button
            variant={`${renter.is_active ? 'primary' : 'success'}`}
            style={{
              borderRadius: 10,
              fontSize: 13,
              width: '100%'
            }}
            onClick={() => {
              renter.is_active
                ? deactivateRenter(renter.id).then(() => {
                    enqueueSnackbar(
                      `Арендатор ${renter.username} деактивирован`,
                      { variant: 'success' }
                    );
                  })
                : activateRenter(renter.id).then(() => {
                    enqueueSnackbar(
                      `Арендатор ${renter.username} активирован`,
                      { variant: 'success' }
                    );
                  });
            }}
          >
            {renter.is_active ? 'Деактивировать' : 'Активировать'}
          </Button>

          <Button
            style={{
              borderRadius: 10,
              fontSize: 13
            }}
            onClick={() => editRenter(renter)}
          >
            Изменить
          </Button>
        </td>
      </tr>
    );
  });
};
