import ChangePasswordForm from '@/components/ChangePasswordForm/ChangePasswordForm';
import ChatHeader from '@/components/Header/ChatHeader';
import Styles from './_Account.module.scss';

const ChatPage = () => {
  return (
    <div className={Styles.container}>
      <div className={Styles.card}>
        <ChatHeader />
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChatPage;
