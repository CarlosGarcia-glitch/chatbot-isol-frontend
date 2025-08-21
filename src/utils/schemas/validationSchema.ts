import * as Yup from 'yup';

export const getLoginFormSchema = (t: any) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t.login.email.invalid)
      .required(t.login.email.required),
    password: Yup.string().required(t.login.password.required),
  });

export const changePasswordSchema = (t: any) =>
  Yup.object().shape({
    old_password: Yup.string().required(t.login.password.required),
    new_password: Yup.string()
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        t.change_password.validations.no_valid,
      )
      .required(t.login.password.required),
    confirm_password: Yup.string()
      .oneOf(
        [Yup.ref('new_password')],
        t.change_password.validations.no_password_match,
      )
      .required(t.login.password.required),
  });
