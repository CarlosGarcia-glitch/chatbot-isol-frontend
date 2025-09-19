import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  useTranslations,
  useAppContext,
  useAlert,
} from '../../contexts/AppContext';
import AuthService from '@/services/authService';
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ChatbotIcon from '../icons/ChatbotIcon';
import Styles from './_ChatHeader.module.scss';
import { menuItemsConfig, MenuItemConfig } from './menuConfig';

interface ChatHeaderProps {
  folioNumber?: string;
}

const handleNewConversation = () => {
  localStorage.removeItem('conversationId');
  window.location.reload();
};

const ChatHeader = ({ folioNumber }: ChatHeaderProps) => {
  const t = useTranslations();
  const { language, setLanguage } = useAppContext();
  const { setUser } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { setAlert } = useAlert();

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      navigate('/');
      handleClose();
    }
  };

  const handleMenuAction = (item: MenuItemConfig) => {
    if (item.key === 'language') {
      toggleLanguage();
    } else if (item.key === 'logout') {
      handleLogout();
    } else {
      navigate(item.path);
      handleClose();
    }
  };

  const isItemVisible = (item: MenuItemConfig): boolean => {
    if (item.visibleOn.includes('*')) return true;
    return item.visibleOn.includes(location.pathname);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(folioNumber ?? '');
      setAlert(true, 'success', t.text_copied);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shouldShowNewChat = location.pathname === '/chat';
  const visibleMenuItems = menuItemsConfig.filter(isItemVisible);

  return (
    <>
      <header className={Styles.header}>
        <section className={Styles.header_top}>
          <div className={Styles.header_top_info}>
            <ChatbotIcon />
            <h2 className={Styles.logo_text}>{t.header}</h2>
          </div>

          <div className={Styles.header_top_menu}>
            {shouldShowNewChat && (
              <Button onClick={handleNewConversation}>
                {t.menu.new_conversation}
              </Button>
            )}

            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              className={Styles.menu_button}
            >
              <MenuIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button',
                },
              }}
            >
              {visibleMenuItems.map((item) => (
                <MenuItem key={item.key} onClick={() => handleMenuAction(item)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText>
                    {item.key === 'chat'
                      ? item.label
                      : t.menu[item.label as keyof typeof t.menu]}
                  </ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </div>
        </section>
        {shouldShowNewChat && folioNumber && (
          <div className={Styles.header_bottom}>
            <p onClick={handleCopyClick}>
              {`${t.folio}: ${folioNumber}`}{' '}
              <ContentCopyIcon fontSize="inherit" />
            </p>
          </div>
        )}
      </header>
    </>
  );
};

export default ChatHeader;
