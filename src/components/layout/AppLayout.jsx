import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-cream-50 flex">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 pb-24 md:pb-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Outlet />
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
