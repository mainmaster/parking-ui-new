import { colors } from '../../theme/colors';

export const typeText = {
  1006: {
    label: 'Разовый',
    color: colors.carlist.bg.once,
    textColor: colors.carlist.text.black
  },
  1034: {
    label: 'Абонемент',
    color: '#EDBD05',
    textColor: colors.carlist.text.black
  },
  1008: {
    label: 'Белый список',
    color: colors.carlist.bg.white,
    textColor: colors.carlist.text.black
  },
  1028: {
    label: 'Заявка',
    color: '#3F89BA',
    textColor: colors.carlist.text.black
  },
  1004: {
    label: 'Черный список',
    color: colors.carlist.bg.black,
    textColor: colors.carlist.text.white
  },
  open: {
    label: 'Открыта',
    color: colors.session.status.open.bg,
    textColor: colors.session.status.open.text
  },
  closed: {
    label: 'Закрыта',
    color: colors.session.status.close.bg,
    textColor: colors.session.status.close.text
  },
  paid: {
    label: 'Оплачено',
    color: colors.session.payment.paid,
    textColor: colors.element.light
  },
  not_paid: {
    label: 'Не оплачено',
    color: colors.session.payment.not_paid,
    textColor: colors.element.light
  },
  used: {
    label: 'Использована',
    color: colors.element.inactive,
    textColor: colors.element.light
  },
  not_used: {
    label: 'Не использована',
    color: colors.request_status.not_used,
    textColor: colors.element.light
  },
  sber: {
    label: 'Сбер',
    color: colors.payment_method.sber,
    textColor: colors.element.light
  },
  yookassa: {
    label: 'Yookassa',
    color: colors.payment_method.yookassa,
    textColor: colors.element.light
  },
  pos_terminal: {
    label: 'Пос терминал',
    color: colors.payment_method.pos_terminal,
    textColor: colors.element.light
  },
  refund: {
    label: 'Возврат',
    color: colors.refund,
    textColor: colors.element.light
  },
  subscription: {
    label: 'Абонемент',
    color: colors.payment_type.subscription,
    textColor: colors.element.light
  },
  session: {
    label: 'Разовый',
    color: colors.payment_type.session,
    textColor: colors.element.light
  }
};
