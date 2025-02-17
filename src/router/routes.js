import i18n from '../translation/index';

export let operatorRoutes = [
  { eventKey: '/events', title: i18n.t('routesTitle.visor'), vltitle: 'Vision Labs' },
  { eventKey: '/sessions', title: i18n.t('routesTitle.session') },
  { eventKey: '/auto-park/active', title: i18n.t('routesTitle.park') },
  { eventKey: '/black-list/active', title: i18n.t('routesTitle.blackList')},
  { eventKey: '/requests', title: i18n.t('routesTitle.request') },
  { eventKey: '/settings', title: i18n.t('routesTitle.setting') },
  { eventKey: '/reports', title: i18n.t('routesTitle.reports') },
  { eventKey: '/action-logs', title: i18n.t('routesTitle.actionLogs') },
];
export let renterRoutes = [
  { eventKey: '/events-logs', title: i18n.t('routesTitle.visor'), vltitle: 'Vision Labs' },
  { eventKey: '/sessions', title: i18n.t('routesTitle.session') },
  { eventKey: '/requests', title: i18n.t('routesTitle.request') },
];
export let adminRoutes = [
  { eventKey: '/events', title: i18n.t('routesTitle.visor'), vltitle: 'Vision Labs' },
  { eventKey: '/sessions', title: i18n.t('routesTitle.session') },
  { eventKey: '/auto-park/active', title: i18n.t('routesTitle.park') },
  { eventKey: '/black-list/active', title: i18n.t('routesTitle.blackList')},
  { eventKey: '/requests', title: i18n.t('routesTitle.request') },
  { eventKey: '/settings', title: i18n.t('routesTitle.setting') },
  { eventKey: '/access-points', title: i18n.t('routesTitle.points') },
  { eventKey: '/cameras', title: i18n.t('routesTitle.cameras') },
  { eventKey: '/led', title: i18n.t('routesTitle.led') },
  { eventKey: '/terminals', title: i18n.t('routesTitle.terminal') },
  { eventKey: '/working-modes', title: i18n.t('routesTitle.modes') },
  { eventKey: '/payments', title: i18n.t('routesTitle.payments') },
  { eventKey: '/controllers', title: i18n.t('routesTitle.controllers') },
  { eventKey: '/users/operators', title: i18n.t('routesTitle.access') },
  { eventKey: '/reports', title: i18n.t('routesTitle.reports') },
  { eventKey: '/action-logs', title: i18n.t('routesTitle.actionLogs') },
];

const uploadRouterTile = () => {
  adminRoutes = [
    { eventKey: '/events', title: i18n.t('routesTitle.visor'), vltitle: 'Vision Labs' },
    { eventKey: '/sessions', title: i18n.t('routesTitle.session') },
    { eventKey: '/auto-park/active', title: i18n.t('routesTitle.park') },
    { eventKey: '/black-list/active', title: i18n.t('routesTitle.blackList')},
    { eventKey: '/requests', title: i18n.t('routesTitle.request') },
    { eventKey: '/settings', title: i18n.t('routesTitle.setting') },
    { eventKey: '/access-points', title: i18n.t('routesTitle.points') },
    { eventKey: '/cameras', title: i18n.t('routesTitle.cameras') },
    { eventKey: '/led', title: i18n.t('routesTitle.led') },
    { eventKey: '/terminals', title: i18n.t('routesTitle.terminal') },
    { eventKey: '/working-modes', title: i18n.t('routesTitle.modes') },
    { eventKey: '/payments', title: i18n.t('routesTitle.payments') },
    { eventKey: '/controllers', title: i18n.t('routesTitle.controllers') },
    { eventKey: '/users/operators', title: i18n.t('routesTitle.access') },
    { eventKey: '/reports', title: i18n.t('routesTitle.reports') },
    { eventKey: '/action-logs', title: i18n.t('routesTitle.actionLogs') },
  ];
  renterRoutes = [
    { eventKey: '/events-logs', title: i18n.t('routesTitle.visor'), vltitle: 'Vision Labs' },
    { eventKey: '/sessions', title: i18n.t('routesTitle.session') },
    { eventKey: '/requests', title: i18n.t('routesTitle.request') },
  ];
  operatorRoutes = [
    { eventKey: '/events', title: i18n.t('routesTitle.visor'), vltitle: 'Vision Labs' },
    { eventKey: '/sessions', title: i18n.t('routesTitle.session') },
    { eventKey: '/auto-park/active', title: i18n.t('routesTitle.park') },
    { eventKey: '/black-list/active', title: i18n.t('routesTitle.blackList')},
    { eventKey: '/requests', title: i18n.t('routesTitle.request') },
    { eventKey: '/settings', title: i18n.t('routesTitle.setting') },
    { eventKey: '/reports', title: i18n.t('routesTitle.reports') },
    { eventKey: '/action-logs', title: i18n.t('routesTitle.actionLogs') },
  ];
}

i18n.on('loaded', () => {
  uploadRouterTile()
})

i18n.on('languageChanged', () => {
  uploadRouterTile()
})