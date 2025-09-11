import { useEffect, useRef, useState } from 'react';
import { useTranslations } from '../../contexts/AppContext';

import AuthService from '@/services/authService';
import {
  AddCircleOutline,
  Language,
  LockOutline,
  Logout,
  Menu as MenuIcon,
} from '@mui/icons-material';
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import ChatbotIcon from '../icons/ChatbotIcon';
import Styles from './_ChatHeader.module.scss';

interface ChatHeaderProps {
  folioNumber: string;
  onNewConversation: () => void;
}

const ChatHeader = ({ folioNumber, onNewConversation }: ChatHeaderProps) => {
  const t = useTranslations();
  const { language, setLanguage } = useAppContext();
  const { setUser } = useAppContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
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
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className={Styles.chat_header}>
      <section className={Styles.chat_header_top}>
        <div className={Styles.header_info}>
          <ChatbotIcon />
          <h2 className={Styles.logo_text}>{t.header}</h2>
        </div>

        <div className={Styles.new_chat_container}>
          <div className={Styles.new_chat}>
            <Button onClick={onNewConversation}>
              <p className={Styles.new_chat_text}>{t.menu.new_conversation}</p>
            </Button>
          </div>

          <div className={Styles.buttons_header}>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
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
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate('/change-password');
                }}
              >
                <ListItemIcon>
                  <LockOutline fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t.menu.change_password}</ListItemText>
              </MenuItem>
              <MenuItem onClick={toggleLanguage}>
                <ListItemIcon>
                  <Language fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t.menu.lang}</ListItemText>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate('/recovery');
                }}
              >
                <ListItemIcon>
                  <FindInPageIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t.menu.recovery}</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t.menu.logout}</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </section>

      <div className={Styles.folio_number}>
        {folioNumber && <p>{`${t.folio}: ${folioNumber}`}</p>}
      </div>
    </header>
  );
};

export default ChatHeader;
