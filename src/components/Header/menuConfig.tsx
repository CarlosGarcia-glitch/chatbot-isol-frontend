import {
  Language,
  LockOutline,
  Logout,
  Menu as MenuIcon,
} from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import FindInPageIcon from '@mui/icons-material/FindInPage';

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
  {
    key: 'language',
    label: 'lang',
    icon: <Language fontSize="small" />,
    path: '',
    visibleOn: ['*'],
  },
  {
    key: 'recovery',
    label: 'recovery',
    icon: <FindInPageIcon fontSize="small" />,
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
