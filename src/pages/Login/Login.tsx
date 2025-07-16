import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormikValues, useFormik } from 'formik';
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

import Footer from '@/components/Footer/Footer';
import { getLoginFormSchema } from '@/utils/schemas/loginFormSchema';

import Styles from './_Login.module.scss';
import { useTranslations } from '@/contexts/AppContext';

import { AuthService } from '@/services/firebase';

type Props = {};

const Login = (props: Props) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>();
  const [showPassword, setShowPassword] = useState<boolean>();

  const schema = getLoginFormSchema(t);

  const { errors, touched, values, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: { email: '', password: '' },
      enableReinitialize: true,
      validationSchema: schema,
      onSubmit: async (vals: FormikValues) => {
        try {
          setLoading(true);
          await AuthService.login(vals.email, vals.password);
          navigate('/chat');
          
        } catch (error) {
          console.error(error);
        }
      },
    });

  return (
    <div className={Styles.page__layout}>
      <div className={Styles.page__content}>
        <div className={Styles.login__card}>
          <div className={Styles.login__card_img}>
            {/* <img src={Logo} alt="" /> */}
          </div>
          <div className={Styles.login__card_body}>
            <div className={Styles.login__card_title}>
              <h3>{t.login.labels.title}</h3>
            </div>
            <InputLabel htmlFor="email">{t.login.labels.email}</InputLabel>
            <TextField
              id="email"
              name="email"
              placeholder="example@isol.com"
              value={values.email}
              error={touched?.email && Boolean(errors.email)}
              helperText={
                touched.email && typeof errors.email === 'string'
                  ? errors.email
                  : undefined
              }
              onBlur={handleBlur}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <InputLabel htmlFor="password">
              {t.login.labels.password}
            </InputLabel>
            <TextField
              id="password"
              name="password"
              placeholder=""
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              error={touched?.password && Boolean(errors.password)}
              helperText={
                touched.password && typeof errors.password === 'string'
                  ? errors.password
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
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? (
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
          <div className={Styles.login__card_footer}>
            <Button
              disabled={loading}
              variant="contained"
              color="secondary"
              startIcon={
                loading ? (
                  <CircularProgress
                    size="1.5rem"
                    style={{ color: '#C0C0C0' }}
                  />
                ) : undefined
              }
              onClick={() => handleSubmit()}
            >
              {loading ? t.login.labels.signingIn : t.login.labels.signIn}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Login;
