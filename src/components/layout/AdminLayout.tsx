import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  LayoutDashboard,
  Package,
  FileText,
  Mail,
  LogOut,
  Menu,
  X,
  Briefcase,
  Award,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: Package },
    { href: '/admin/experience', label: 'Experience', icon: Briefcase },
    { href: '/admin/certifications', label: 'Certifications', icon: Award },
    { href: '/admin/blogs', label: 'Blogs', icon: BookOpen },
    { href: '/admin/content', label: 'Content', icon: FileText },
    { href: '/admin/messages', label: 'Messages', icon: Mail },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_user');
    toast({
      title: 'Success',
      description: 'Logged out successfully',
    });
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="font-bold text-xl">Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start ${!sidebarOpen && 'justify-center'}`}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;
