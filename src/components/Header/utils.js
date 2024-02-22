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
import MainIcon from '../../assets/svg/main_icon.svg';
import SessionsIcon from '../../assets/svg/sessions_icon.svg';
import ParkIcon from '../../assets/svg/park_icon.svg';
import BlackListIcon from '../../assets/svg/blacklist_icon.svg';
import RequestsIcon from '../../assets/svg/requests_icon.svg';
import SettingsIcon from '../../assets/svg/settings_icon.svg';
import MainIconSelected from '../../assets/svg/main_icon_selected.svg';
import SessionsIconSelected from '../../assets/svg/sessions_icon_selected.svg';
import ParkIconSelected from '../../assets/svg/park_icon_selected.svg';
import BlackListIconSelected from '../../assets/svg/blacklist_icon_selected.svg';
import RequestsIconSelected from '../../assets/svg/requests_icon_selected.svg';
import SettingsIconSelected from '../../assets/svg/settings_icon_selected.svg';

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
    height: 26
  },
  {
    route: '/requests',
    icon: RequestsIcon,
    selected: RequestsIconSelected,
    height: 21
  },
  {
    route: '/settings',
    icon: SettingsIcon,
    selected: SettingsIconSelected,
    height: 27
  }
];
