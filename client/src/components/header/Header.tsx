import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export function Header() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      const firstButton = drawerRef.current?.querySelector<HTMLAnchorElement>('a, button');
      firstButton?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl font-bold text-primary">Oasis Hospitality</Link>

        <nav aria-label="Primary Navigation" className="hidden md:flex gap-6">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'text-primary font-medium' : 'text-dark hover:text-primary')}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="md:hidden inline-flex items-center gap-2 px-3 py-2 rounded bg-primary text-white"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        ref={drawerRef}
        className={`md:hidden fixed inset-0 bg-dark/50 ${open ? '' : 'hidden'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        onClick={() => setOpen(false)}
      >
        <div className="bg-white w-80 h-full p-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <span className="font-serif text-lg font-bold text-primary">Oasis Hospitality</span>
            <button className="px-2 py-1 rounded bg-secondary text-dark" onClick={() => setOpen(false)}>Close</button>
          </div>
          <nav className="flex flex-col gap-3">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'text-primary font-medium' : 'text-dark hover:text-primary')}>
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

const links = [
  { to: '/', label: 'Home' },
  { to: '/management-services', label: 'Management Services' },
  { to: '/development-renovation', label: 'Development & Renovation' },
  { to: '/projects', label: 'Portfolio' },
  { to: '/news', label: 'News & Insights' },
  { to: '/careers', label: 'Careers' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' }
];