import * as yup from 'yup'

export const createBlackListSchema = yup.object().shape({
  description: yup.string().required('Введите что-нибудь!'),
  vehicle_plate: yup.string().required('Введите что-нибудь!'),
})
