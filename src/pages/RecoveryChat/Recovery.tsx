import { useRef, useState } from 'react';
import ChatHeader from '@/components/Header/ChatHeader';
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

import '../Chat/Chat.scss';

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
      const exists = await chatService.existsChat(values.folio);

      if (exists) {
        localStorage.setItem('conversationId', values.folio);
        navigate('/chat');
      } else {
        setAlert(true, 'error', t.errors.folio);
      }
    } catch (error) {
      setAlert(true, 'error', t.errors.folio);
    }
  };

  return (
    <div className="container">
      <div className="chatbot-popup">
        <ChatHeader />
        <div className="chat-body">
          <div className="recovery-body">
            <div>
              <p>{t.folio_welcome}</p>
            </div>
            <div>
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
      </div>
    </div>
  );
};

export default Recovery;
