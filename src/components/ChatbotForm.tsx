import React, { useEffect, useState } from 'react';
import { useAppContext, useTranslations } from '../contexts/AppContext';
import { chatService } from '@/services/chatService';

const ChatbotForm = () => {
  const t = useTranslations();
  const { setChatHistory, language } = useAppContext();
  const [inputValue, setInputValue] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [placeholder, setPlaceholder] = useState<string>('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        { role: 'bot', message: botResponse.textResponse },
      ]);
    } catch (error) {
      console.error('Error sending message to agent:', error);
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
      <input
        id="file"
        type="text"
        placeholder={placeholder}
        disabled={!!file}
        className="message-input"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setInputValue(e.target.value);
        }}
        value={inputValue}
      />

      {inputValue || file ? (
        <div className="buttons">
          <button
            type="button"
            className="material-symbols-outlined button clear"
            onClick={clearInput}
          >
            close_small
          </button>
          <button type="submit" className="material-symbols-outlined button">
            send
          </button>
        </div>
      ) : (
        <label className="button">
          <input
            id="document"
            type="file"
            name="document"
            accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
            required
            style={{ display: 'none' }}
            onChange={handleOnSelectFile}
          />
          <span className="material-symbols-outlined">attach_file</span>
        </label>
      )}
    </form>
  );
};

export default ChatbotForm;
