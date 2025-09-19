import { LockOutline, Logout } from '@mui/icons-material';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';

export interface MenuItemConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  visibleOn: string[];
  excludeFrom?: string[];
}

export const menuItemsConfig: MenuItemConfig[] = [
  {
    key: 'chat',
    label: 'Chat',
    icon: <HomeIcon fontSize="small" />,
    path: '/chat',
    visibleOn: ['/change-password', '/recovery'],
  },
  {
    key: 'change-password',
    label: 'change_password',
    icon: <LockOutline fontSize="small" />,
    path: '/change-password',
    visibleOn: ['/chat', '/recovery'],
  },
  /* {
    key: 'language',
    label: 'lang',
    icon: <Language fontSize="small" />,
    path: '',
    visibleOn: ['*'],
  }, */
  {
    key: 'recovery',
    label: 'recovery',
    icon: <HistoryIcon fontSize="small" />,
    path: '/recovery',
    visibleOn: ['/chat', '/change-password'],
  },
  {
    key: 'logout',
    label: 'logout',
    icon: <Logout fontSize="small" />,
    path: '/logout',
    visibleOn: ['*'],
  },
];
