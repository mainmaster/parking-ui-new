import * as yup from 'yup'

export const createCameraSchema = yup.object().shape({
  login: yup.string().required('Введите что-нибудь!'),
  password: yup.string().required('Введите что-нибудь!'),
  ip_address: yup.string().required('Введите что-нибудь!'),
  description: yup.string().required('Введите что-нибудь!'),
})
