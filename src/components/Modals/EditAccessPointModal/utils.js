import * as yup from 'yup'

export const editAccessPointSchema = yup.object().shape({
  cam_id: yup.number().required('Введите что-нибудь!'),
  laurent_id: yup.number().required('Введите что-нибудь!'),
  open_relay_number: yup.number().required('Введите что-нибудь!'),
  close_relay_number: yup.number().required('Введите что-нибудь!'),
  working_modes: yup
    .array()
    .min(1, 'Введите что-нибудь!')
    .required('Введите что-нибудь!')
    .nullable(),
  direction: yup.string().required('Введите что-нибудь!'),
  description: yup.string().required('Введите что-нибудь!'),
  led_board_id: yup.string().required('Введите что-нибудь!'),
})
