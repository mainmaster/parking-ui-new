export const BREAKPOINT_SM = 768;
export const BREAKPOINT_MD = 991;

export const EVENTS_ON_PAGE = 50;
export const SESSIONS_ON_PAGE = 50;
export const CARS_ON_PAGE = 50;
export const ITEM_MIN_WIDTH = 365;
export const ITEM_MAX_WIDTH = 466;

export const passModeOptions = [
  { name: 'Оплата по часам', value: 'pay_by_hour' },
  { name: 'Оплата за интервал', value: 'pay_by_interval' },
  { name: 'Оплата по дням', value: 'pay_by_day' },
  { name: 'Оплата по первым часам', value: 'pay_by_first_hours' },
  { name: 'Закрыто', value: 'closed' }
];

export const directionOptions = [
  { name: 'Въезд', value: 'in' },
  { name: 'Выезд', value: 'out' },
  { name: 'Внутренняя', value: 'inner' }
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
  { name: 'Контроль устройства доступа', value: 1037 },

  { name: '', value: null }
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

export const operatorAccessOptions = [
  {
    name: 'События и отчёты (главная)',
    route: '/events',
    value: 'access_to_events',
    child: false
    // children: [
    //   'access_to_open_access_point',
    //   'access_to_close_access_point',
    //   'access_to_working_mode_access_point',
    //   'access_to_send_message_led_board',
    //   'access_to_clear_led_board'
    // ]
  },
  {
    name: 'Открытие шлагбаумов',
    value: 'access_to_open_access_point',
    child: true
    // parent: 'access_to_events'
  },
  {
    name: 'Закрытие шлагбаумов',
    value: 'access_to_close_access_point',
    child: true
    // parent: 'access_to_events'
  },
  {
    name: 'Смена режимов шлагбаумов',
    value: 'access_to_working_mode_access_point',
    child: true
    // parent: 'access_to_events'
  },
  {
    name: 'Отправка сообщений на LED-панель',
    value: 'access_to_send_message_led_board',
    child: true
    // parent: 'access_to_events'
  },
  {
    name: 'Очистка LED-панели',
    value: 'access_to_clear_led_board',
    child: true
    // parent: 'access_to_events'
  },
  {
    name: 'Сессии',
    route: '/sessions',
    value: 'access_to_sessions',
    child: false
    // children: [
    //   'access_to_close_session',
    //   'access_to_close_sessions_before_date',
    //   'access_to_reset_duty_session'
    // ]
  },
  {
    name: 'Штучное закрытие',
    value: 'access_to_close_session',
    child: true
    // parent: 'access_to_sessions'
  },
  {
    name: 'Массовое закрытие',
    value: 'access_to_close_sessions_before_date',
    child: true
    // parent: 'access_to_sessions'
  },
  {
    name: 'Сброс долга',
    value: 'access_to_reset_duty_session',
    child: true
    // parent: 'access_to_sessions'
  },
  {
    name: 'Автопарк',
    route: '/auto-park/active',
    value: 'access_to_car_park',
    child: false
  },
  {
    name: 'Чёрный список',
    route: '/black-list/active',
    value: 'access_to_black_list',
    child: false
  },
  {
    name: 'Заявки',
    route: '/requests',
    value: 'access_to_requests',
    child: false
  },
  {
    name: 'Настройки',
    route: '/settings',
    value: 'access_to_settings',
    child: false
  },
  {
    name: 'Точки доступа',
    route: '/access-points',
    value: 'access_to_access_points',
    child: false
  },
  {
    name: 'Камеры',
    route: '/cameras',
    value: 'access_to_cameras',
    child: false
  },
  {
    name: 'LED табло',
    route: '/led',
    value: 'access_to_led_boards',
    child: false
  },
  {
    name: 'Терминалы',
    route: '/terminals',
    value: 'access_to_terminals',
    child: false
  },
  {
    name: 'Режимы',
    route: '/working-modes',
    value: 'access_to_working_modes',
    child: false
  },
  {
    name: 'Оплаты',
    route: '/payments',
    value: 'access_to_payments',
    child: false
  },
  {
    name: 'Контроллеры',
    route: '/controllers',
    value: 'access_to_laurents',
    child: false
  },
  {
    name: 'Доступы',
    virtual: true,
    value: 'access_to_operators, access_to_renters',
    child: false,
    children: ['access_to_operators', 'access_to_renters']
  },
  {
    name: 'Операторы',
    route: '/users/operators',
    value: 'access_to_operators',
    child: true,
    parent: 'access_to_operators, access_to_renters'
  },
  {
    name: 'Арендаторы',
    route: '/users/renters',
    value: 'access_to_renters',
    child: true,
    parent: 'access_to_operators, access_to_renters'
  }
  //{ name: 'Логи поиска', value: 'access_to_search_logs' }
];
