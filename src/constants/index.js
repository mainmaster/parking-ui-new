export const BREAKPOINT_SM = 768;
export const BREAKPOINT_MD = 991;

export const EVENTS_ON_PAGE = 50;

export const passModeOptions = [
  { name: 'Оплата по часам', value: 'pay_by_hour' },
  { name: 'Оплата за интервал', value: 'pay_by_interval' },
  { name: 'Оплата по дням', value: 'pay_by_day' },
  { name: 'Оплата по первым часам', value: 'pay_by_first_hours' },
  { name: 'Закрыто', value: 'closed' }
];

export const directionOptions = [
  { name: 'Въезд', value: 'in' },
  { name: 'Выезд', value: 'out' }
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
