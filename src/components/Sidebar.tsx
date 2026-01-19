import { Home, FileText, Bookmark, User, Settings, HelpCircle, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { language } = useLanguage();

  const navItems = [
    { icon: Home, label: language === 'hi' ? 'होम' : 'Home', path: '/worker', key: 'home' },
    { icon: FileText, label: language === 'hi' ? 'आवेदन' : 'Applications', path: '/worker/applications', key: 'applications' },
    { icon: Bookmark, label: language === 'hi' ? 'सेव्ड' : 'Saved', path: '/worker/saved', key: 'saved' },
    { icon: User, label: language === 'hi' ? 'प्रोफाइल' : 'Profile', path: '/worker/profile', key: 'profile' },
    { icon: Settings, label: language === 'hi' ? 'सेटिंग्स' : 'Settings', path: '/worker/settings', key: 'settings' },
    { icon: HelpCircle, label: language === 'hi' ? 'सहायता' : 'Help', path: '/worker/help', key: 'help' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-xl z-40 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.phone?.slice(-2) || 'W'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Worker</p>
                <p className="text-xs text-gray-500">{user?.phone}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all mb-1 ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="font-medium text-sm">
            {language === 'hi' ? 'लॉगआउट' : 'Logout'}
          </span>}
        </button>
      </div>
    </div>
  );
}