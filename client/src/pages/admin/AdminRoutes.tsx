import { Route, Routes, Navigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { LoginPage } from './Login';
import { PostsAdmin } from './PostsAdmin';
import { ProjectsAdmin } from './ProjectsAdmin';
import { CareersAdmin } from './CareersAdmin';
import { SettingsAdmin } from './SettingsAdmin';

function useAuthed() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return Boolean(token);
}

export function AdminRoutes() {
  const authed = useAuthed();
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={authed ? <AdminLayout /> : <Navigate to="/admin/login" replace />} >
        <Route path="" element={<Navigate to="posts" replace />} />
        <Route path="posts" element={<PostsAdmin />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="careers" element={<CareersAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>
    </Routes>
  );
}