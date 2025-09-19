import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, CircularProgress, TextField } from '@mui/material';
import { FormikValues, useFormik } from 'formik';
import * as Yup from 'yup';

import ChatHeader from '@/components/Header/ChatHeader';
import { chatService } from '@/services/chatService';
import { useAlert, useTranslations } from '../../contexts/AppContext';
import Styles from './_Recovery.module.scss';

const Recovery = () => {
  const t = useTranslations();
  const { setAlert } = useAlert();
  const navigate = useNavigate();
  const [isloading, setIsloading] = useState(false);

  const schema = Yup.object({
    folio: Yup.string().required(t.errors.required),
  });

  const { errors, touched, values, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        folio: '',
      },
      validationSchema: schema,
      onSubmit: async (values: FormikValues) => {
        setIsloading(true);
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
        } finally {
          setIsloading(false);
        }
      },
    });

  return (
    <div className={Styles.container}>
      <div className={Styles.recovery_card}>
        <ChatHeader />
        <div className={Styles.recovery_card_body}>
          <p className={Styles.description}>{t.folio_welcome}</p>
          <TextField
            variant="outlined"
            disabled={isloading}
            id="folio"
            name="folio"
            label="Número de folio"
            value={values.folio}
            error={touched?.folio && Boolean(errors.folio)}
            helperText={
              touched.folio && typeof errors.folio === 'string'
                ? errors.folio
                : undefined
            }
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button
            onClick={() => handleSubmit()}
            variant="contained"
            color="primary"
            startIcon={
              isloading && (
                <CircularProgress size="1.5rem" style={{ color: '#C0C0C0' }} />
              )
            }
          >
            {!isloading && t.button.send}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
