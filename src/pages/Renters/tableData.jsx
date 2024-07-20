import styles from '../Settings/settings.module.css';
import { Button } from 'react-bootstrap';
import { enqueueSnackbar } from 'notistack';
import i18n from '../../translation/index'
import {useTranslation} from "react-i18next";

export let rentersTitles = [
  { id: 1, name: '#' },
  { id: 2, name: i18n.t('pages.renterTableData.login') },
  { id: 4, name: i18n.t('pages.renterTableData.renter') },
  { id: 5, name: i18n.t('pages.renterTableData.contacts') },
  { id: 6, name: i18n.t('pages.renterTableData.action') }
];

export let rentersRows = (
  renters,
  activateRenter,
  deactivateRenter,
  editRenter
) => {
  const { t } = useTranslation();
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
                      `${t('pages.renterTableData.renter')} ${renter.username} ${t('pages.renterTableData.inactive')}`,
                      { variant: 'success' }
                    );
                  })
                : activateRenter(renter.id).then(() => {
                    enqueueSnackbar(
                      `${t('pages.renterTableData.renter')} ${renter.username} ${t('pages.renterTableData.activated')}`,
                      { variant: 'success' }
                    );
                  });
            }}
          >
            {renter.is_active ? t('pages.renterTableData.deactive') : t('pages.renterTableData.active')}
          </Button>

          <Button
            style={{
              borderRadius: 10,
              fontSize: 13
            }}
            onClick={() => editRenter(renter)}
          >
            {t('pages.renterTableData.change')}
          </Button>
        </td>
      </tr>
    );
  });
};
