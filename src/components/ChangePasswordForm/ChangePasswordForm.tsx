import { useState } from 'react';
import { useFormik, FormikValues } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import { Save } from '@mui/icons-material';

import { useTranslations, useAlert } from '../../contexts/AppContext';
import AuthService from '@/services/authService';
import { changePasswordSchema } from '@/utils/schemas/validationSchema';

import Styles from '@/pages/Account/_Account.module.scss';
import PasswordField from '../PasswordField/PasswordField';

const ChangePasswordForm = () => {
  const t = useTranslations();
  const navigate = useNavigate();
  const { setAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = changePasswordSchema(t);

  const { errors, touched, values, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        old_password: '',
        new_password: '',
        confirm_password: '',
      },
      validationSchema: schema,
      onSubmit: async (vals: FormikValues) => {
        setLoading(true);
        try {
          await AuthService.changePassword({
            old_password: vals.old_password,
            new_password: vals.new_password,
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

  return (
    <>
      <div className={Styles.card_body}>
        <PasswordField
          id="old_password"
          name="old_password"
          placeholder={t.change_password.labels.old_password}
          value={values.old_password}
          error={errors.old_password as string}
          touched={Boolean(touched.old_password)}
          show={showOldPassword}
          setShow={setShowOldPassword}
          disabled={loading}
          onChange={handleChange}
          onBlur={handleBlur}
          onEnter={handleSubmit}
        />
        <PasswordField
          id="new_password"
          name="new_password"
          placeholder={t.change_password.labels.new_password}
          value={values.new_password}
          error={errors.new_password as string}
          touched={Boolean(touched.new_password)}
          show={showNewPassword}
          setShow={setShowNewPassword}
          disabled={loading}
          onChange={handleChange}
          onBlur={handleBlur}
          onEnter={handleSubmit}
        />
        <PasswordField
          id="confirm_password"
          name="confirm_password"
          placeholder={t.change_password.labels.confirm_password}
          value={values.confirm_password}
          error={errors.confirm_password as string}
          touched={Boolean(touched.confirm_password)}
          show={showConfirmPassword}
          setShow={setShowConfirmPassword}
          disabled={loading}
          onChange={handleChange}
          onBlur={handleBlur}
          onEnter={handleSubmit}
        />
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
    </>
  );
};

export default ChangePasswordForm;
