import * as yup from 'yup'

export const editControllerSchema = yup.object().shape({
  ip_address: yup.string().required('Введите что-нибудь!'),
  description: yup.string().required('Введите что-нибудь!'),
})
