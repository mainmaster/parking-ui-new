import i18n from '../../translation/index'

export const typeText = ({ colors }) => {
  return {
    1006: {
      label: i18n.t('components.typeAutoType.oneTime'),
      color: colors.carlist.bg.once,
      textColor: colors.carlist.text.black
    },
    1034: {
      label: i18n.t('components.typeAutoType.aboniment'),
      color: '#EDBD05',
      textColor: colors.carlist.text.black
    },
    1008: {
      label: i18n.t('components.typeAutoType.whiteList'),
      color: colors.carlist.bg.white,
      textColor: colors.carlist.text.black
    },
    1028: {
      label: i18n.t('components.typeAutoType.request'),
      color: '#3F89BA',
      textColor: colors.carlist.text.black
    },
    1004: {
      label: i18n.t('components.typeAutoType.blackList'),
      color: colors.carlist.bg.black,
      textColor: colors.carlist.text.white
    },
    open: {
      label: i18n.t('components.typeAutoType.open'),
      color: colors.session.status.open.bg,
      textColor: colors.session.status.open.text
    },
    closed: {
      label: i18n.t('components.typeAutoType.close'),
      color: colors.session.status.close.bg,
      textColor: colors.session.status.close.text
    },
    paid: {
      label: i18n.t('components.typeAutoType.paid'),
      color: colors.session.payment.paid,
      textColor: colors.element.light
    },
    not_paid: {
      label: i18n.t('components.typeAutoType.notPaid'),
      color: colors.session.payment.not_paid,
      textColor: colors.element.light
    },
    used: {
      label: i18n.t('components.typeAutoType.used'),
      color: colors.element.inactive,
      textColor: colors.element.light
    },
    not_used: {
      label: i18n.t('components.typeAutoType.notUsed'),
      color: colors.request_status.not_used,
      textColor: colors.element.light
    },
    sber: {
      label: i18n.t('components.typeAutoType.sber'),
      color: colors.payment_method.sber,
      textColor: colors.element.light
    },
    yookassa: {
      label: i18n.t('components.typeAutoType.yookassa'),
      color: colors.payment_method.yookassa,
      textColor: colors.element.light
    },
    pos_terminal: {
      label: i18n.t('components.typeAutoType.afterTerminal'),
      color: colors.payment_method.pos_terminal,
      textColor: colors.element.light
    },
    refund: {
      label: i18n.t('components.typeAutoType.refund'),
      color: colors.refund,
      textColor: colors.element.light
    },
    subscription: {
      label: i18n.t('components.typeAutoType.aboniment'),
      color: colors.payment_type.subscription,
      textColor: colors.element.light
    },
    session: {
      label: i18n.t('components.typeAutoType.oneTime'),
      color: colors.payment_type.session,
      textColor: colors.element.light
    }
  };
};
