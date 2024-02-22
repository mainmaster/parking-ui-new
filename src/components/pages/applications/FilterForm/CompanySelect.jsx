import { useRentersQuery } from '../../../../api/renters/renters.api'
import Select from '../../../Select'
import css from '../../main-page/FilterForm/FilterForm.module.scss'

export const CompanySelect = ({ props, on_id }) => {
  const { data: renters } = useRentersQuery()

  return (
    <>
      {renters && (
        <Select
          label="Компания"
          options={
            on_id
              ? [
                  ...renters?.map((item) => {
                    return {
                      name: item.company_name,
                      value: item.id,
                    }
                  }),
                ].sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) {
                      return -1;
                    }
                    if (a.name.toLowerCase() > b.name.toLowerCase()) {
                      return 1;
                    }
                    return 0;
                  })
              : [
                  ...renters?.map((item) => {
                    return {
                      name: item.company_name,
                      value: item.id,
                    }
                  }),
                  { value: '', name: '' },
                ].sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) {
                      return -1;
                    }
                    if (a.name.toLowerCase() > b.name.toLowerCase()) {
                      return 1;
                    }
                    return 0;
                  })
          }
          onChange={(e) => {
            on_id
              ? props.setFieldValue('company_id', e.target.value)
              : props.setFieldValue('companyID', e.target.value)
          }}
          name={on_id ? 'company_id' : 'company_name'}
          className={css.input}
        />
      )}
    </>
  )
}
