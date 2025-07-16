import * as Yup from 'yup'

export const getLoginFormSchema = (t: any) => Yup.object().shape({
   email: Yup.string().email(t.login.email.invalid).required(t.login.email.required),
   password: Yup.string().required(t.login.password.required)
})