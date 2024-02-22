import * as yup from 'yup'

export const createLedSchema = yup.object().shape({
  ip_address: yup.string().required('Введите что-нибудь!'),
  led_board_type: yup.string().required('Выберите что-нибудь!'),
  description: yup.string().required('Введите что-нибудь!'),
})
