import * as yup from 'yup'

export const validationSchema = yup.object().shape({
  number: yup.string().required('Введите что-нибудь!'),
})
