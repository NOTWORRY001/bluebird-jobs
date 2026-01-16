import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, User, Plus, Users, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const workerLinks = [
    { to: '/worker', icon: Home, label: t('nav.home') },
    { to: '/worker/applications', icon: Briefcase, label: t('nav.applications') },
    { to: '/worker/profile', icon: User, label: t('nav.profile') },
  ];

  const adminLinks = [
    { to: '/admin', icon: Home, label: t('nav.home') },
    { to: '/admin/post-job', icon: Plus, label: t('nav.postJob') },
    { to: '/admin/workers', icon: Users, label: t('nav.workers') },
    { to: '/admin/payments', icon: CreditCard, label: t('nav.payments') },
    { to: '/admin/profile', icon: User, label: t('nav.profile') },
  ];

  const links = user.role === 'worker' ? workerLinks : adminLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <link.icon className={cn('w-6 h-6', isActive && 'scale-110 transition-transform')} />
              <span className="text-xs mt-1 font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
