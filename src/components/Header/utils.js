import {
  BarChart,
  Bullseye,
  CameraVideo,
  Easel,
  FileEarmarkSpreadsheet,
  Soundwave,
  StopCircle,
  Table,
  GearFill,
  Wallet
} from 'react-bootstrap-icons';
import { CarIcon } from 'icons/index';
import MainIcon from '../../assets/svg/theme/main_icon.svg';
import VlMainIcon from '../../assets/svg/vltheme/main_icon.svg';
import SessionsIcon from '../../assets/svg/sessions_icon.svg';
import ParkIcon from '../../assets/svg/park_icon.svg';
import BlackListIcon from '../../assets/svg/blacklist_icon.svg';
import RequestsIcon from '../../assets/svg/requests_icon.svg';
import SettingsIcon from '../../assets/svg/settings_icon.svg';
import AccessPointIcon from '../../assets/svg/accesspoint_icon.svg';
import CameraIcon from '../../assets/svg/camera_icon.svg';
import LedIcon from '../../assets/svg/led_icon.svg';
import TerminalIcon from '../../assets/svg/terminal_icon.svg';
import LogIcon from '../../assets/svg/log_icon.svg';
import TimeIcon from '../../assets/svg/time_icon.svg';
import WifiIcon from '../../assets/svg/wifi_icon.svg';
import IdIcon from '../../assets/svg/id_icon.svg';
import UsersIcon from '../../assets/svg/users_icon.svg';
import CardIcon from '../../assets/svg/card_icon.svg';
import MainIconSelected from '../../assets/svg/theme/main_icon_selected.svg';
import VlMainIconSelected from '../../assets/svg/vltheme/main_icon_selected.svg';
import SessionsIconSelected from '../../assets/svg/theme/sessions_icon_selected.svg';
import VlSessionsIconSelected from '../../assets/svg/vltheme/sessions_icon_selected.svg';
import ParkIconSelected from '../../assets/svg/theme/park_icon_selected.svg';
import VlParkIconSelected from '../../assets/svg/vltheme/park_icon_selected.svg';
import BlackListIconSelected from '../../assets/svg/theme/blacklist_icon_selected.svg';
import VlBlackListIconSelected from '../../assets/svg/vltheme/blacklist_icon_selected.svg';
import RequestsIconSelected from '../../assets/svg/theme/requests_icon_selected.svg';
import VlRequestsIconSelected from '../../assets/svg/vltheme/requests_icon_selected.svg';
import SettingsIconSelected from '../../assets/svg/theme/settings_icon_selected.svg';
import VlSettingsIconSelected from '../../assets/svg/vltheme/settings_icon_selected.svg';
import AccessPointIconSelected from '../../assets/svg/theme/accesspoint_icon_selected.svg';
import VlAccessPointIconSelected from '../../assets/svg/vltheme/accesspoint_icon_selected.svg';
import CameraIconSelected from '../../assets/svg/theme/camera_icon_selected.svg';
import VlCameraIconSelected from '../../assets/svg/vltheme/camera_icon_selected.svg';
import LedIconSelected from '../../assets/svg/theme/led_icon_selected.svg';
import VlLedIconSelected from '../../assets/svg/vltheme/led_icon_selected.svg';
import TerminalIconSelected from '../../assets/svg/theme/terminal_icon_selected.svg';
import VlTerminalIconSelected from '../../assets/svg/vltheme/terminal_icon_selected.svg';
import LogIconSelected from '../../assets/svg/log_icon_selected.svg';
import TimeIconSelected from '../../assets/svg/theme/time_icon_selected.svg';
import VlTimeIconSelected from '../../assets/svg/vltheme/time_icon_selected.svg';
import WifiIconSelected from '../../assets/svg/theme/wifi_icon_selected.svg';
import VlWifiIconSelected from '../../assets/svg/vltheme/wifi_icon_selected.svg';
import IdIconSelected from '../../assets/svg/id_icon_selected.svg';
import UsersIconSelected from '../../assets/svg/theme/users_icon_selected.svg';
import VlUsersIconSelected from '../../assets/svg/vltheme/users_icon_selected.svg';
import CardIconSelected from '../../assets/svg/theme/card_icon_selected.svg';
import VlCardIconSelected from '../../assets/svg/vltheme/card_icon_selected.svg';
import MoreBlackListIcon from '../../assets/svg/more_blacklist_icon.svg';
import MoreRequestsIcon from '../../assets/svg/more_requests_icon.svg';
import MoreSettingsIcon from '../../assets/svg/more_settings_icon.svg';
import MoreAccessPointIcon from '../../assets/svg/more_accesspoint_icon.svg';
import MoreCameraIcon from '../../assets/svg/more_camera_icon.svg';
import MoreLedIcon from '../../assets/svg/more_led_icon.svg';
import MoreTerminalIcon from '../../assets/svg/more_terminal_icon.svg';
import MoreLogIcon from '../../assets/svg/more_log_icon.svg';
import MoreTimeIcon from '../../assets/svg/more_time_icon.svg';
import MoreWifiIcon from '../../assets/svg/more_wifi_icon.svg';
import MoreIdIcon from '../../assets/svg/more_id_icon.svg';
import MoreUsersIcon from '../../assets/svg/more_users_icon.svg';
import MoreCardIcon from '../../assets/svg/more_card_icon.svg';
import ReportIcon from '../../assets/svg/report_menu.svg';
import ReportSelectIcon from '../../assets/svg/report_select.svg';
import ActionLogsIcon from '../../assets/svg/theme/action_logs_icon.svg';
import ActionLogsSelectedIcon from '../../assets/svg/theme/action_logs_icon_selected.svg';
import MoreActionLogsSelectedIcon from '../../assets/svg/more_action_logs_icon.svg';

export const links = [
  { id: 1, name: 'События', to: '/', icon: <BarChart /> },
  { id: 2, name: 'Сессии', to: '/sessions', icon: <FileEarmarkSpreadsheet /> },
  { id: 10, name: 'Оплаты', to: '/payment', icon: <Wallet /> },
  {
    id: 3,
    name: 'Автопарк',
    to: '/car-park',
    icon: CarIcon
  },
  { id: 8, name: 'Черный список', to: '/black-list', icon: <StopCircle /> },
  { id: 4, name: 'Точки доступа', to: '/access-points', icon: <Soundwave /> },
  { id: 5, name: 'Режимы', to: '/working-modes', icon: <Bullseye /> },
  { id: 6, name: 'Камеры', to: '/cameras', icon: <CameraVideo /> },
  { id: 7, name: 'Контроллеры', to: '/controllers', icon: <Easel /> },
  { id: 9, name: 'LED Табло', to: '/led', icon: <Table /> },
  { id: 10, name: 'Настройки', to: '/settings', icon: <GearFill /> }
];

export const icons = [
  { route: '/', icon: MainIcon, selected: MainIconSelected, height: 19 },
  { route: '/events', icon: MainIcon, selected: MainIconSelected, height: 19 },
  {
    route: '/events-logs',
    icon: MainIcon,
    selected: MainIconSelected,
    height: 19
  },
  {
    route: '/sessions',
    icon: SessionsIcon,
    selected: SessionsIconSelected,
    height: 21
  },
  {
    route: '/auto-park/active',
    icon: ParkIcon,
    selected: ParkIconSelected,
    height: 16
  },
  {
    route: '/black-list/active',
    icon: BlackListIcon,
    selected: BlackListIconSelected,
    height: 26,
    more: MoreBlackListIcon
  },
  {
    route: '/requests',
    icon: RequestsIcon,
    selected: RequestsIconSelected,
    height: 21,
    more: MoreRequestsIcon
  },
  {
    route: '/settings',
    icon: SettingsIcon,
    selected: SettingsIconSelected,
    height: 27,
    more: MoreSettingsIcon
  },
  {
    route: '/access-points',
    icon: AccessPointIcon,
    selected: AccessPointIconSelected,
    height: 28,
    more: MoreAccessPointIcon
  },
  {
    route: '/cameras',
    icon: CameraIcon,
    selected: CameraIconSelected,
    height: 22,
    more: MoreCameraIcon
  },
  {
    route: '/led',
    icon: LedIcon,
    selected: LedIconSelected,
    height: 18,
    more: MoreLedIcon
  },
  {
    route: '/terminals',
    icon: TerminalIcon,
    selected: TerminalIconSelected,
    height: 21,
    more: MoreTerminalIcon
  },
  {
    route: '/search-logs',
    icon: LogIcon,
    selected: LogIconSelected,
    height: 23,
    more: MoreLogIcon
  },
  {
    route: '/working-modes',
    icon: TimeIcon,
    selected: TimeIconSelected,
    height: 26,
    more: MoreTimeIcon
  },
  {
    route: '/controllers',
    icon: WifiIcon,
    selected: WifiIconSelected,
    height: 21,
    more: MoreWifiIcon
  },
  {
    route: '/users/operators',
    icon: UsersIcon,
    selected: UsersIconSelected,
    height: 22,
    more: MoreUsersIcon
  },
  {
    route: '/payments',
    icon: CardIcon,
    selected: CardIconSelected,
    height: 21,
    more: MoreCardIcon
  },
  {
    route: '/reports',
    icon: ReportIcon,
    selected: ReportSelectIcon,
    height: 30,
    more: MoreCardIcon
  },
  {
    route: '/action-logs',
    icon: ActionLogsIcon,
    selected: ActionLogsSelectedIcon,
    more: MoreActionLogsSelectedIcon,
  },
];

export const vlicons = [
  { route: '/', icon: VlMainIcon, selected: VlMainIconSelected, height: 19 },
  {
    route: '/events',
    icon: VlMainIcon,
    selected: VlMainIconSelected,
    height: 21
  },
  {
    route: '/events-logs',
    icon: VlMainIcon,
    selected: VlMainIconSelected,
    height: 21
  },
  {
    route: '/sessions',
    icon: SessionsIcon,
    selected: VlSessionsIconSelected,
    height: 21
  },
  {
    route: '/auto-park/active',
    icon: ParkIcon,
    selected: VlParkIconSelected,
    height: 16
  },
  {
    route: '/black-list/active',
    icon: BlackListIcon,
    selected: VlBlackListIconSelected,
    height: 26,
    more: MoreBlackListIcon
  },
  {
    route: '/requests',
    icon: RequestsIcon,
    selected: VlRequestsIconSelected,
    height: 21,
    more: MoreRequestsIcon
  },
  {
    route: '/settings',
    icon: SettingsIcon,
    selected: VlSettingsIconSelected,
    height: 27,
    more: MoreSettingsIcon
  },
  {
    route: '/access-points',
    icon: AccessPointIcon,
    selected: VlAccessPointIconSelected,
    height: 28,
    more: MoreAccessPointIcon
  },
  {
    route: '/cameras',
    icon: CameraIcon,
    selected: VlCameraIconSelected,
    height: 22,
    more: MoreCameraIcon
  },
  {
    route: '/led',
    icon: LedIcon,
    selected: VlLedIconSelected,
    height: 18,
    more: MoreLedIcon
  },
  {
    route: '/terminals',
    icon: TerminalIcon,
    selected: VlTerminalIconSelected,
    height: 21,
    more: MoreTerminalIcon
  },
  {
    route: '/search-logs',
    icon: LogIcon,
    selected: LogIconSelected,
    height: 23,
    more: MoreLogIcon
  },
  {
    route: '/working-modes',
    icon: TimeIcon,
    selected: VlTimeIconSelected,
    height: 26,
    more: MoreTimeIcon
  },
  {
    route: '/controllers',
    icon: WifiIcon,
    selected: VlWifiIconSelected,
    height: 21,
    more: MoreWifiIcon
  },
  {
    route: '/users/operators',
    icon: UsersIcon,
    selected: VlUsersIconSelected,
    height: 22,
    more: MoreUsersIcon
  },
  {
    route: '/payments',
    icon: CardIcon,
    selected: VlCardIconSelected,
    height: 21,
    more: MoreCardIcon
  },
  {
    route: '/action-logs',
    icon: ActionLogsIcon,
    selected: ActionLogsSelectedIcon,
    height: 32,
    more: MoreActionLogsSelectedIcon,
  },
];
