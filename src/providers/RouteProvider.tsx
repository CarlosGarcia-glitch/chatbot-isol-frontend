import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute ';
import Login from '@/pages/Login/Login';
import Chat from '@/pages/Chat/Chat';
import Account from '@/pages/Account/Account';

export const RouterProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/change-password" element={<Account />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
