import * as yup from 'yup'

export const editLedSchema = yup.object().shape({
  ip_address: yup.string().required('Введите что-нибудь!'),
  description: yup.string().required('Введите что-нибудь!'),
})
