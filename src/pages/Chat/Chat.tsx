import { useEffect, useRef, useState } from 'react';
import {
  useAlert,
  useAppContext,
  useTranslations,
} from '../../contexts/AppContext';

import ChatbotThinking from '@/components/ChatbotThinking/ChatbotThinking';
import AuthService from '@/services/authService';
import { chatService } from '@/services/chatService';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatbotForm from '@/components/Form/ChatbotForm';
import ChatHeader from '@/components/Header/ChatHeader';
import ChatbotMessage, { IChat } from '@/components/Message/ChatbotMessage';
import Styles from './_Chat.module.scss';

const Chat = () => {
  const t = useTranslations();
  const { setUser } = useAppContext();
  const navigate = useNavigate();

  const [folioNumber, setFolioNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const { chatHistory, setChatHistory } = useAppContext();
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);
  const { setAlert } = useAlert();

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const initChat = async () => {
      try {
        const conversationId = localStorage.getItem('conversationId');

        if (conversationId) {
          try {
            const exists = await chatService.existsChat();
            if (exists) {
              const history = await chatService.getChatHistory();
              setChatHistory(history);
              setLoading(false);
              setFolioNumber(conversationId);
              return;
            } else {
              localStorage.removeItem('conversationId');
            }
          } catch (error) {
            throw new Error();
          }
        }

        try {
          const { message, conversationId } = await chatService.startChat();
          setFolioNumber(conversationId);
          setChatHistory([{ role: 'bot', message }]);
        } catch (error) {
          throw new Error();
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        setAlert(true, 'error', t.errors.init_chat.alert);
        setChatHistory([
          {
            role: 'bot',
            message: t.errors.init_chat.chat,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, []);

  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatHistory]);

  const lastBotIndex = chatHistory?.map((m) => m.role).lastIndexOf('bot');

  const handleNewConversation = () => {
    localStorage.removeItem('conversationId');
    window.location.reload();
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.chat}>
        {/* Chatbot Header */}
        <ChatHeader
          folioNumber={folioNumber}
          onNewConversation={handleNewConversation}
        />

        {/* Chatbot Body */}
        <div className={Styles.chat_body} ref={chatBodyRef}>
          {loading ? (
            <div className={Styles.chat_loading}>
              <CircularProgress />
            </div>
          ) : (
            <>
              {chatHistory.map((chat: IChat, index: number) => (
                <ChatbotMessage
                  key={index}
                  role={chat.role}
                  message={chat.message}
                  isLastMsg={chat.role === 'bot' && index === lastBotIndex}
                />
              ))}
              {isThinking && <ChatbotThinking />}
            </>
          )}
        </div>

        {/* Chatbot Footer */}
        <div className={Styles.chat_footer}>
          <ChatbotForm isThinking={isThinking} setIsThinking={setIsThinking} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
