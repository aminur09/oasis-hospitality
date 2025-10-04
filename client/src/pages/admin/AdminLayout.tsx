import { Outlet, Link, useNavigate } from 'react-router-dom';

export function AdminLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    navigate('/admin/login');
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Admin Panel</h1>
        <button className="px-3 py-1 rounded bg-secondary text-dark" onClick={logout}>Logout</button>
      </div>
      <nav className="mt-4 flex gap-4">
        <Link to="/admin/posts" className="underline">Posts</Link>
        <Link to="/admin/projects" className="underline">Projects</Link>
        <Link to="/admin/careers" className="underline">Careers</Link>
        <Link to="/admin/settings" className="underline">Settings</Link>
      </nav>
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}