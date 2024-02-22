import styles from '../Settings/settings.module.css'
import {formatDate} from '../../utils/index'

export let titles = [
  { id: 1, name: '#' },
  { id: 2, name: 'Запрос'},
  { id: 3, name: 'Время создания'}
]
export let rows = (searchs) => {
  return searchs?.map((search) => {
    return (
      <tr key={search.id} className={styles.operatorCard}>
        <td style={{ width: '10%' }}>{search.id}</td>
        <td style={{ width: '60%' }}>{search.search_request}</td>
        <td style={{ width: '10%' }}>{formatDate(search.create_datetime)}</td>
      </tr>
    )
  })
}
