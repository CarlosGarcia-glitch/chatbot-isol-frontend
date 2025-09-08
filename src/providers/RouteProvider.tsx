import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute ';
import Login from '@/pages/Login/Login';
import Chat from '@/pages/Chat/Chat';
import Account from '@/pages/Account/Account';
import Recovery from '@/pages/RecoveryChat/Recovery';

export const RouterProvider = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/change-password" element={<Account />} />
          <Route path="/recovery" element={<Recovery />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};
