import Styles from './_Account.module.scss';
import ChatHeader from '@/components/Header/ChatHeader';
import ChangePasswordForm from '@/components/ChangePasswordForm/ChangePasswordForm';
import ChatFooter from '@/components/ChatFooter/ChatFooter';

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
