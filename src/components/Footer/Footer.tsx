import { useTranslations } from '@/contexts/AppContext'
import Styles from './_Footer.module.scss'

const Footer = () => {
   const t = useTranslations()
   return (
      <div className={Styles.footer}>
         <div>{t.footer}</div>
      </div>
   )
}

export default Footer