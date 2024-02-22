import * as yup from 'yup'

export const createControllerSchema = yup.object().shape({
  ip_address: yup.string().required('Введите что-нибудь!'),
  description: yup.string().required('Введите что-нибудь!'),
})
