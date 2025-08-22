import { useRef, useState } from 'react';
import {
  useAlert,
  useAppContext,
  useTranslations,
} from '../../contexts/AppContext';

import AuthService from '@/services/authService';
import { changePasswordSchema } from '@/utils/schemas/validationSchema';
import {
  Home,
  Language,
  Logout,
  Menu as MenuIcon,
  Save,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  TextField,
  Typography,
} from '@mui/material';
import { FormikValues, useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import ChatbotIcon from '../../components/icons/ChatbotIcon';
import Styles from './_Account.module.scss';

const Chat = () => {
  const t = useTranslations();
  const { setUser, user } = useAppContext();
  const navigate = useNavigate();
  const userName = user?.username
    ?.replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState<boolean>();
  const [showNewPassword, setShowNewPassword] = useState<boolean>();
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>();
  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);
  const { language, setLanguage } = useAppContext();
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const { setAlert } = useAlert();
  const openMenu = Boolean(anchorElMenu);

  const schema = changePasswordSchema(t);

  const { errors, touched, values, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        new_password: '',
        old_password: '',
        confirm_password: '',
      },
      enableReinitialize: true,
      validationSchema: schema,
      onSubmit: async (vals: FormikValues) => {
        setLoading(true);
        try {
          await AuthService.changePassword({
            new_password: vals.new_password,
            old_password: vals.old_password,
            confirm_password: vals.confirm_password,
          });
          setAlert(true, 'success', t.change_password.success);
          navigate('/chat');
        } catch (error) {
          console.error(error);
          setAlert(true, 'error', t.change_password.error);
        } finally {
          setLoading(false);
        }
      },
    });

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
    setAnchorElMenu(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElMenu(null);
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.card}>
        {/* Chatbot Header */}
        <div className={Styles.card_header}>
          <div className={Styles.header_info}>
            <ChatbotIcon />
            <h2 className={Styles.logo_text}>{userName}</h2>
          </div>
          <div className={Styles.buttons_header}>
            <Button
              id="basic-button"
              aria-controls={openMenu ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? 'true' : undefined}
              onClick={handleClick}
            >
              <MenuIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorElMenu}
              open={openMenu}
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
                  navigate('/chat');
                }}
              >
                <ListItemIcon>
                  <Home fontSize="small" />
                </ListItemIcon>
                <ListItemText>Chat</ListItemText>
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
        <div className={Styles.card_body} ref={chatBodyRef}>
          <TextField
            id="old_password"
            name="old_password"
            placeholder={t.change_password.labels.old_password}
            type={showOldPassword ? 'text' : 'password'}
            value={values.old_password}
            error={touched?.old_password && Boolean(errors.old_password)}
            helperText={
              touched.old_password && typeof errors.old_password === 'string'
                ? errors.old_password
                : undefined
            }
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showOldPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            disabled={loading}
          />
          <TextField
            disabled={loading}
            id="new_password"
            name="new_password"
            placeholder={t.change_password.labels.new_password}
            type={showNewPassword ? 'text' : 'password'}
            value={values.new_password}
            error={touched?.new_password && Boolean(errors.new_password)}
            helperText={
              touched.new_password &&
              typeof errors.new_password === 'string' &&
              errors.new_password
            }
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showNewPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            disabled={loading}
            id="confirm_password"
            name="confirm_password"
            placeholder={t.change_password.labels.confirm_password}
            type={showConfirmPassword ? 'text' : 'password'}
            value={values.confirm_password}
            error={
              touched?.confirm_password && Boolean(errors.confirm_password)
            }
            helperText={
              touched.confirm_password &&
              typeof errors.confirm_password === 'string'
                ? errors.confirm_password
                : undefined
            }
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
        {/* Footer */}
        <div className={Styles.card_footer}>
          <Button
            disabled={loading}
            variant="contained"
            color="primary"
            startIcon={
              loading ? (
                <CircularProgress size="1.5rem" style={{ color: '#C0C0C0' }} />
              ) : (
                <Save />
              )
            }
            onClick={() => handleSubmit()}
          >
            {loading
              ? t.change_password.button.loading
              : t.change_password.button.save}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
