import * as yup from 'yup'

export const editBlackListSchema = yup.object().shape({
  vehicle_plate: yup.string().required('Введите что-нибудь!'),
  description: yup.string().required('Введите что-нибудь!'),
})
