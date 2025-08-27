import React, { useEffect, useState } from 'react';
import {
  useAlert,
  useAppContext,
  useTranslations,
} from '../contexts/AppContext';
import { chatService } from '@/services/chatService';
import { TextField } from '@mui/material';

type ChatbotFormProps = {
  isThinking: boolean;
  setIsThinking: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatbotForm = ({ isThinking, setIsThinking }: ChatbotFormProps) => {
  const t = useTranslations();
  const { setChatHistory, language } = useAppContext();
  const [inputValue, setInputValue] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [placeholder, setPlaceholder] = useState<string>('');
  const { setAlert } = useAlert();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsThinking(true);
    const userMessage = file?.name ?? inputValue;
    setChatHistory((history) => [
      ...history,
      { role: 'user', message: userMessage },
    ]);

    try {
      const botResponse = await chatService.sendMessageToAgent(
        userMessage,
        file,
      );
      setChatHistory((history) => [
        ...history,
        { role: 'bot', message: botResponse },
      ]);
    } catch (error) {
      console.error('Error sending message to agent:', error);
      setAlert(true, 'error', t.errors.ask_agent.alert);
      setChatHistory((history) => [
        ...history,
        {
          role: 'bot',
          message: t.errors.ask_agent.chat,
        },
      ]);
    } finally {
      setIsThinking(false);
    }

    setFile(null);
    setInputValue('');
  };

  const handleOnSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setInputValue('');
  };

  const clearInput = () => {
    setFile(null);
    setInputValue('');
  };

  useEffect(() => {
    const text = file ? `${t.selected}${file.name}` : t.input.placeholder;
    setPlaceholder(text);
  }, [language, file]);

  return (
    <form onSubmit={onSubmit} className="chat-form">
      <TextField
        size='medium'
        multiline
        maxRows={4}
        id="message"
        placeholder={placeholder}
        disabled={!!file || isThinking}
        className="message-input"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setInputValue(e.target.value);
        }}
        value={isThinking ? '' : inputValue}
        sx={{
          marginBottom: '0px !important',
          '& .MuiOutlinedInput-root': {
            padding: 0,
            borderRadius: '32px !important',
            alignItems: 'center',
            minHeight: '47px',
          },
          '& .MuiInputBase-inputMultiline': {
            padding: '12px 16px',
            lineHeight: '23px',
            borderRadius: '32px !important',
          },
          '& .MuiInputAdornment-root': {
            height: '46px',
            marginRight: '4px',
          },
        }}
        slotProps={{
          input: {
            endAdornment: (
              <>
                {!isThinking && inputValue || file ? (
                  <div className="buttons">
                    <button
                      type="button"
                      className="material-symbols-outlined button clear"
                      onClick={clearInput}
                    >
                      close_small
                    </button>
                    <button type="submit" className="material-symbols-outlined button" disabled={!inputValue || isThinking}>
                      send
                    </button>
                  </div>
                ) : (
                  <label className={`button ${isThinking ? 'disabled' : ''}`}>
                    <input
                      id="document"
                      type="file"
                      name="document"
                      accept="image/png,image/jpg,application/pdf"
                      disabled={isThinking}
                      required
                      style={{ display: 'none' }}
                      onChange={handleOnSelectFile}
                    />
                    <span className="material-symbols-outlined">attach_file</span>
                  </label>
                )}
              </>
            ),
          }
        }}
      />
    </form>
  );
};

export default ChatbotForm;
