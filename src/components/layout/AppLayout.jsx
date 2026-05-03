import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-app-surface">
      <Sidebar />
      
      <main className="relative min-h-screen flex-1 overflow-hidden pb-24 md:ml-64 md:pb-0">
        <div className="app-grid-lines pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(124,58,237,0.22),transparent)]" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
          <Outlet />
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
