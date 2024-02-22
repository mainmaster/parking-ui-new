import * as yup from 'yup'

export const openApSchema = yup.object().shape({
  time: yup.string().required('Введите что-нибудь!'),
})
