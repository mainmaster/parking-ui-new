import * as yup from 'yup'

export const validationSchema = yup.object().shape({
  vehiclePlate: yup.string().required('Введите что-нибудь!'),
})

export const colSpan = {
  xxl: 3,
  xl: 6,
  lg: 6,
  md: 6,
  sm: 12,
  xs: 12,
}
