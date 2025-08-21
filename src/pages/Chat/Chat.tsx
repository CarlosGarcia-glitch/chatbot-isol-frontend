import { useEffect, useRef, useState } from 'react';
import {
  useAlert,
  useAppContext,
  useTranslations,
} from '../../contexts/AppContext';

import ChatbotThinking from '@/components/ChatbotThinking/ChatbotThinking';
import AuthService from '@/services/authService';
import { chatService } from '@/services/chatService';
import {
  Language,
  LockOutline,
  Logout,
  Menu as MenuIcon,
} from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatbotForm from '../../components/ChatbotForm';
import ChatbotMessage, { IChat } from '../../components/ChatbotMessage';
import ChatbotIcon from '../../components/icons/ChatbotIcon';
import './Chat.scss';

const Chat = () => {
  const t = useTranslations();
  const { setUser } = useAppContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isThinking, setIsThinking] = useState(false);
  const { language, setLanguage, chatHistory, setChatHistory } =
    useAppContext();
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);
  const { setAlert } = useAlert();
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const initChat = async () => {
      try {
        const conversationId = localStorage.getItem('conversationId');

        if (conversationId) {
          try {
            const exists = await chatService.existsChat();
            if (exists) {
              const history = await chatService.getChatHistory();
              setChatHistory(history);
              setLoading(false);
              return;
            } else {
              localStorage.removeItem('conversationId');
            }
          } catch (error) {
            throw new Error();
          }
        }

        try {
          const message = await chatService.startChat();
          setChatHistory([{ role: 'bot', message }]);
        } catch (error) {
          throw new Error();
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        setAlert(true, 'error', t.errors.init_chat.alert);
        setChatHistory([
          {
            role: 'bot',
            message: t.errors.init_chat.chat,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, []);

  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatHistory]);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
  };

  const lastBotIndex = chatHistory?.map((m) => m.role).lastIndexOf('bot');

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
    <div className="container">
      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">{t.header}</h2>
          </div>
          <div className="buttons-header">
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
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t.menu.logout}</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        </div>

        {/* Chatbot Body */}
        <div className="chat-body" ref={chatBodyRef}>
          {loading ? (
            <div className="chat-loading">
              <CircularProgress />
            </div>
          ) : (
            <>
              {chatHistory.map((chat: IChat, index: number) => (
                <ChatbotMessage
                  key={index}
                  role={chat.role}
                  message={chat.message}
                  isLastMsg={chat.role === 'bot' && index === lastBotIndex}
                />
              ))}
              {isThinking && <ChatbotThinking />}
            </>
          )}
        </div>

        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatbotForm isThinking={isThinking} setIsThinking={setIsThinking} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
