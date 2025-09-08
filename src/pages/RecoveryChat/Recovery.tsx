import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Home,
  Language,
  LockOutline,
  Logout,
  Menu as MenuIcon,
} from '@mui/icons-material';

import {
  useAlert,
  useAppContext,
  useTranslations,
} from '../../contexts/AppContext';
import AuthService from '@/services/authService';
import { chatService } from '@/services/chatService';
import ChatbotIcon from '../../components/icons/ChatbotIcon';

import './_Recovery.module.scss';

const Recovery = () => {
  const t = useTranslations();
  const { setUser, language, setLanguage } = useAppContext();
  const { setAlert } = useAlert();
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

  const validationSchema = Yup.object({
    folio: Yup.string().required(t.errors.required),
  });

  const handleSubmit = async (values: { folio: string }) => {
    try {
      localStorage.setItem('conversationId', values.folio);

      const exists = await chatService.existsChat();
      if (exists) {
        navigate('/chat');
      } else {
        setAlert(true, 'error', t.errors.folio);
        localStorage.removeItem('conversationId');
      }
    } catch (error) {
      setAlert(true, 'error', t.errors.folio);
      localStorage.removeItem('conversationId');
    }
  };

  return (
    <div className="container">
      <div className="chatbot-popup">
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

              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate('/chat');
                }}
              >
                <ListItemIcon>
                  <Home fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t.menu.chat}</ListItemText>
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

        <div className="chat-body">
          <Formik
            initialValues={{ folio: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="recovery-form">
                <div>
                  <label htmlFor="folio">{t.folio}</label>
                  <Field id="folio" name="folio" type="text" />
                  {errors.folio && touched.folio && (
                    <div className="error">{errors.folio}</div>
                  )}
                </div>
                <Button type="submit" variant="contained" color="primary">
                  {t.button.send}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
