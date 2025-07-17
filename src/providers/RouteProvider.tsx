import { HashRouter, Routes, Route } from 'react-router-dom';
import Chat from '../pages/Chat';
import Login from '../pages/Login/Login';

export const RouterProvider = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </HashRouter>
  );
};
