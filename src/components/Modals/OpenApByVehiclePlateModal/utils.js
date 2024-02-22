import * as yup from 'yup'

export const openApSchema = yup.object().shape({
  vehiclePlate: yup.string().required('Введите что-нибудь!'),
})
