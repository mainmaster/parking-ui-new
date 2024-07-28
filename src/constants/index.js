import i18n from '../translation/index'

export const BREAKPOINT_SM = 768;
export const BREAKPOINT_MD = 991;

export const EVENTS_ON_PAGE = 50;
export const SESSIONS_ON_PAGE = 50;
export const CARS_ON_PAGE = 50;
export const ITEM_MIN_WIDTH = 365;
export const ITEM_MAX_WIDTH = 466;

export let passModeOptions = [
  { name: i18n.t('constants.payByHour'), value: 'pay_by_hour' },
  { name: i18n.t('constants.payByInterval'), value: 'pay_by_interval' },
  { name: i18n.t('constants.payByDay'), value: 'pay_by_day' },
  { name: i18n.t('constants.payByFirstHours'), value: 'pay_by_first_hours' },
  { name: i18n.t('constants.closed'), value: 'closed' }
];

export const directionOptions = [
  { name: 'Въезд', value: 'in' },
  { name: 'Выезд', value: 'out' },
  { name: 'Внутренняя', value: 'inner' }
];

export let ledTypeOptions = [
  { name: i18n.t('constants.magnit'), value: 'magnit' },
  { name: i18n.t('constants.zapusk'), value: 'zapusk' }
];

export const terminalTypeOptions = [
  { name: 'aqsi', value: 'aqsi' },
  { name: 'vendotek', value: 'vendotek' }
];

export const eventCodes = [
  { name: 'Номер не распознан, доступ не предоставлен', value: 1003 },
  { name: 'Авто из черного списка, доступ не предоставлен', value: 1004 },
  { name: 'Сессия не оплачена', value: 1005 },
  { name: 'Доступ предоставлен', value: 1006 },
  { name: 'Проезд зарегистрирован', value: 1007 },
  { name: 'Авто из автопарка, доступ предоставлен', value: 1008 },
  { name: 'Точка доступа закрыта, доступ не предоставлен', value: 1009 },
  { name: 'Доступ не предоставлен, запрет транзита', value: 1010 },
  { name: 'Сессия не найдена', value: 1011 },
  { name: 'Оплата проведена', value: 1013 },
  { name: 'Ручное открытие', value: 1014 },
  { name: 'Ручное закрытие', value: 1015 },
  { name: 'Возобновление работы событий', value: 1016 },
  { name: 'Ручное открытие для всех', value: 1017 },
  { name: 'Ручное закрытие для всех', value: 1018 },
  { name: 'Возобновление работы событий для всех', value: 1019 },
  { name: 'Быстрое открытие', value: 1020 },
  { name: 'Сессия уже открыта', value: 1021 },
  { name: 'Куплен абонемент', value: 1022 },
  { name: 'Срок действия абонемента закончился', value: 1023 },
  { name: 'Запрет проезда - реверсивное движение', value: 1024 },
  { name: 'Доступ предоставлен оператором', value: 1025 },
  { name: 'Долг обнулен вручную', value: 1026 },
  { name: 'Сессия закрыта вручную', value: 1027 },
  { name: 'Авто из заявки, доступ предоставлен', value: 1028 },
  { name: 'Въезд осуществляется только по заявкам', value: 1029 },
  { name: 'Авто с открытой сессией, доступ предоставлен', value: 1030 },
  { name: 'Номер не обнаружен', value: 1033 },
  { name: 'Проезд не зарегистрирован', value: 1035 },
  { name: 'Терминал оплаты активирован', value: 1036 },
  { name: 'Контроль устройства доступа', value: 1037 }
];

export const relayNumberOptions = [...Array(4).keys()].map((item, index) => ({
  name: String(index + 1),
  value: index + 1
}));

export const statusContactOptions = [...Array(6).keys()].map((item, index) => ({
  name: String(index + 1),
  value: index + 1
}));

export const directionName = (direction) => {
  let name;

  switch (direction) {
    case 'in':
      name = 'Въезд';
      break;
    case 'out':
      name = 'Выезд';
      break;
    case 'inner':
      name = 'Внутренняя';
      break;
    default:
      name = '';
      break;
  }

  return name;
};

export const statusSessionName = (status) => {
  let name;

  switch (status) {
    case 'closed':
      name = 'Закрыта';
      break;
    case 'open':
      name = 'Открыта';
      break;
    default:
      name = '';
      break;
  }

  return name;
};

export const statusPaidName = (status) => {
  let name;

  switch (status) {
    case true:
      name = 'Оплачен';
      break;
    case false:
      name = 'Не оплачен';
      break;
    default:
      name = '';
      break;
  }

  return name;
};

export let operatorAccessOptions = [
  {
    name: i18n.t('constants.eventsAndReport'),
    route: '/events',
    value: 'access_to_events',
    child: false,
    children: [
      'access_to_open_access_point',
      'access_to_close_access_point',
      'access_to_working_mode_access_point',
      'access_to_send_message_led_board',
      'access_to_clear_led_board'
    ]
  },
  {
    name: i18n.t('constants.openLaurent'),
    value: 'access_to_open_access_point',
    child: true,
    parent: 'access_to_events'
  },
  {
    name: i18n.t('constants.closeLaurent'),
    value: 'access_to_close_access_point',
    child: true,
    parent: 'access_to_events'
  },
  {
    name: i18n.t('constants.changeModeLaurent'),
    value: 'access_to_working_mode_access_point',
    child: true,
    parent: 'access_to_events'
  },
  {
    name: i18n.t('constants.sendMessageToLed'),
    value: 'access_to_send_message_led_board',
    child: true,
    parent: 'access_to_events'
  },
  {
    name: i18n.t('constants.clearLed'),
    value: 'access_to_clear_led_board',
    child: true,
    parent: 'access_to_events'
  },
  {
    name: i18n.t('constants.sessions'),
    route: '/sessions',
    value: 'access_to_sessions',
    child: false,
    children: [
      'access_to_close_session',
      'access_to_close_sessions_before_date',
      'access_to_reset_duty_session'
    ]
  },
  {
    name: i18n.t('constants.oneClose'),
    value: 'access_to_close_session',
    child: true,
    parent: 'access_to_sessions'
  },
  {
    name: i18n.t('constants.allClose'),
    value: 'access_to_close_sessions_before_date',
    child: true,
    parent: 'access_to_sessions'
  },
  {
    name: i18n.t('constants.resetDuty'),
    value: 'access_to_reset_duty_session',
    child: true,
    parent: 'access_to_sessions'
  },
  {
    name: i18n.t('constants.autoPark'),
    route: '/auto-park/active',
    value: 'access_to_car_park',
    child: false
  },
  {
    name: i18n.t('constants.blackList'),
    route: '/black-list/active',
    value: 'access_to_black_list',
    child: false
  },
  {
    name: i18n.t('constants.request'),
    route: '/requests',
    value: 'access_to_requests',
    child: false
  },
  {
    name: i18n.t('constants.setting'),
    route: '/settings',
    value: 'access_to_settings',
    child: false
  },
  {
    name: i18n.t('constants.accessPoint'),
    route: '/access-points',
    value: 'access_to_access_points',
    child: false
  },
  {
    name: i18n.t('constants.cameras'),
    route: '/cameras',
    value: 'access_to_cameras',
    child: false
  },
  {
    name: i18n.t('constants.led'),
    route: '/led',
    value: 'access_to_led_boards',
    child: false
  },
  {
    name: i18n.t('constants.terminal'),
    route: '/terminals',
    value: 'access_to_terminals',
    child: false
  },
  {
    name: i18n.t('constants.modes'),
    route: '/working-modes',
    value: 'access_to_working_modes',
    child: false
  },
  {
    name: i18n.t('constants.payments'),
    route: '/payments',
    value: 'access_to_payments',
    child: false
  },
  {
    name: i18n.t('constants.controller'),
    route: '/controllers',
    value: 'access_to_laurents',
    child: false
  },
  {
    name: i18n.t('constants.access'),
    virtual: true,
    value: 'access_to_operators, access_to_renters',
    child: false,
    children: ['access_to_operators', 'access_to_renters']
  },
  {
    name: i18n.t('constants.operator'),
    route: '/users/operators',
    value: 'access_to_operators',
    child: true,
    parent: 'access_to_operators, access_to_renters'
  },
  {
    name: i18n.t('constants.renter'),
    route: '/users/renters',
    value: 'access_to_renters',
    child: true,
    parent: 'access_to_operators, access_to_renters'
  }
  //{ name: 'Логи поиска', value: 'access_to_search_logs' }
];

const updateConst = () => {
  operatorAccessOptions = [
    {
      name: i18n.t('constants.eventsAndReport'),
      route: '/events',
      value: 'access_to_events',
      child: false,
      children: [
        'access_to_open_access_point',
        'access_to_close_access_point',
        'access_to_working_mode_access_point',
        'access_to_send_message_led_board',
        'access_to_clear_led_board'
      ]
    },
    {
      name: i18n.t('constants.openLaurent'),
      value: 'access_to_open_access_point',
      child: true,
      parent: 'access_to_events'
    },
    {
      name: i18n.t('constants.closeLaurent'),
      value: 'access_to_close_access_point',
      child: true,
      parent: 'access_to_events'
    },
    {
      name: i18n.t('constants.changeModeLaurent'),
      value: 'access_to_working_mode_access_point',
      child: true,
      parent: 'access_to_events'
    },
    {
      name: i18n.t('constants.sendMessageToLed'),
      value: 'access_to_send_message_led_board',
      child: true,
      parent: 'access_to_events'
    },
    {
      name: i18n.t('constants.clearLed'),
      value: 'access_to_clear_led_board',
      child: true,
      parent: 'access_to_events'
    },
    {
      name: i18n.t('constants.sessions'),
      route: '/sessions',
      value: 'access_to_sessions',
      child: false,
      children: [
        'access_to_close_session',
        'access_to_close_sessions_before_date',
        'access_to_reset_duty_session'
      ]
    },
    {
      name: i18n.t('constants.oneClose'),
      value: 'access_to_close_session',
      child: true,
      parent: 'access_to_sessions'
    },
    {
      name: i18n.t('constants.allClose'),
      value: 'access_to_close_sessions_before_date',
      child: true,
      parent: 'access_to_sessions'
    },
    {
      name: i18n.t('constants.resetDuty'),
      value: 'access_to_reset_duty_session',
      child: true,
      parent: 'access_to_sessions'
    },
    {
      name: i18n.t('constants.autoPark'),
      route: '/auto-park/active',
      value: 'access_to_car_park',
      child: false
    },
    {
      name: i18n.t('constants.blackList'),
      route: '/black-list/active',
      value: 'access_to_black_list',
      child: false
    },
    {
      name: i18n.t('constants.request'),
      route: '/requests',
      value: 'access_to_requests',
      child: false
    },
    {
      name: i18n.t('constants.setting'),
      route: '/settings',
      value: 'access_to_settings',
      child: false
    },
    {
      name: i18n.t('constants.accessPoint'),
      route: '/access-points',
      value: 'access_to_access_points',
      child: false
    },
    {
      name: i18n.t('constants.cameras'),
      route: '/cameras',
      value: 'access_to_cameras',
      child: false
    },
    {
      name: i18n.t('constants.led'),
      route: '/led',
      value: 'access_to_led_boards',
      child: false
    },
    {
      name: i18n.t('constants.terminal'),
      route: '/terminals',
      value: 'access_to_terminals',
      child: false
    },
    {
      name: i18n.t('constants.modes'),
      route: '/working-modes',
      value: 'access_to_working_modes',
      child: false
    },
    {
      name: i18n.t('constants.payments'),
      route: '/payments',
      value: 'access_to_payments',
      child: false
    },
    {
      name: i18n.t('constants.controller'),
      route: '/controllers',
      value: 'access_to_laurents',
      child: false
    },
    {
      name: i18n.t('constants.access'),
      virtual: true,
      value: 'access_to_operators, access_to_renters',
      child: false,
      children: ['access_to_operators', 'access_to_renters']
    },
    {
      name: i18n.t('constants.operator'),
      route: '/users/operators',
      value: 'access_to_operators',
      child: true,
      parent: 'access_to_operators, access_to_renters'
    },
    {
      name: i18n.t('constants.renter'),
      route: '/users/renters',
      value: 'access_to_renters',
      child: true,
      parent: 'access_to_operators, access_to_renters'
    }
    //{ name: 'Логи поиска', value: 'access_to_search_logs' }
  ];
  ledTypeOptions =  [
    { name: i18n.t('constants.magnit'), value: 'magnit' },
    { name: i18n.t('constants.zapusk'), value: 'zapusk' }
  ];
  passModeOptions = [
    { name: i18n.t('constants.payByHour'), value: 'pay_by_hour' },
    { name: i18n.t('constants.payByInterval'), value: 'pay_by_interval' },
    { name: i18n.t('constants.payByDay'), value: 'pay_by_day' },
    { name: i18n.t('constants.payByFirstHours'), value: 'pay_by_first_hours' },
    { name: i18n.t('constants.closed'), value: 'closed' }
  ];
}

i18n.on('loaded', () => {
  updateConst();
})

i18n.on('languageChanged', () => {
  updateConst();
})