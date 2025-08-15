import logo from '../../../public/logo.jpg';
import Styles from './_Avatar.module.scss';

const BotAvatar = () => {
  return (
    <div className={Styles.avatar}>
      <img src={logo} alt="bot avatar" />
    </div>
  );
};

export default BotAvatar;
