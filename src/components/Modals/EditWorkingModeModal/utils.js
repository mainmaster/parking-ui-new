import * as yup from 'yup'

export const editWorkingModesSchema = yup.object().shape({
  time_lte_hour: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(23, 'Число должно быть меньше 23')
    .required('Введите что-нибудь!'),
  time_gte_hour: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(23, 'Число должно быть меньше 23')
    .required('Введите что-нибудь!'),
  time_lte_min: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(59, 'Число должно быть меньше 59')
    .required('Введите что-нибудь!'),
  time_gte_min: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(59, 'Число должно быть меньше 59')
    .required('Введите что-нибудь!'),
  transit_block_time_min: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(59, 'Число должно быть меньше 59')
    .required('Введите что-нибудь!'),
  free_time_min: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(59, 'Число должно быть меньше 59')
    .required('Введите что-нибудь!'),
  price: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .required('Введите что-нибудь!'),
  description: yup.string().required('Введите что-нибудь!'),
  pass_mode: yup.string().required('Введите что-нибудь!'),
  entry_fee: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .required('Введите что-нибудь!'),
  interval: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .required('Введите что-нибудь!'),
})

export const editWorkingModesSchemaInterval = yup.object().shape({
  transit_block_time_min: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(59, 'Число должно быть меньше 59')
    .required('Введите что-нибудь!'),
  price: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .required('Введите что-нибудь!'),
  description: yup.string().required('Введите что-нибудь!'),
  pass_mode: yup.string().required('Введите что-нибудь!'),
  interval: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .required('Введите что-нибудь!'),
})

export const editWorkingModesSchemaHour = yup.object().shape({
  time_lte_hour: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(23, 'Число должно быть меньше 23')
    .required('Введите что-нибудь!'),
  time_gte_hour: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(23, 'Число должно быть меньше 23')
    .required('Введите что-нибудь!'),
  time_lte_min: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(59, 'Число должно быть меньше 59')
    .required('Введите что-нибудь!'),
  time_gte_min: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(59, 'Число должно быть меньше 59')
    .required('Введите что-нибудь!'),
  transit_block_time_min: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(59, 'Число должно быть меньше 59')
    .required('Введите что-нибудь!'),
  free_time_min: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(59, 'Число должно быть меньше 59')
    .required('Введите что-нибудь!'),
  price: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .required('Введите что-нибудь!'),
  description: yup.string().required('Введите что-нибудь!'),
  pass_mode: yup.string().required('Введите что-нибудь!'),
  entry_fee: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .required('Введите что-нибудь!'),
})

export const editWorkingModesSchemaClosed = yup.object().shape({
  time_lte_hour: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(23, 'Число должно быть меньше 23')
    .required('Введите что-нибудь!'),
  time_gte_hour: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(23, 'Число должно быть меньше 23')
    .required('Введите что-нибудь!'),
  time_lte_min: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(59, 'Число должно быть меньше 59')
    .required('Введите что-нибудь!'),
  time_gte_min: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(59, 'Число должно быть меньше 59')
    .required('Введите что-нибудь!'),
  transit_block_time_min: yup
    .number()
    .min(0, 'Число должно быть больше нуля')
    .max(59, 'Число должно быть меньше 59')
    .required('Введите что-нибудь!'),
  description: yup.string().required('Введите что-нибудь!'),
  pass_mode: yup.string().required('Введите что-нибудь!'),
})
