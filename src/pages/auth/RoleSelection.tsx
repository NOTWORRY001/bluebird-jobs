import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<'worker' | 'admin' | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/auth/login?role=${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mb-6 shadow-soft">
          <Briefcase className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2">
          {t('auth.welcome')}
        </h1>
        <p className="text-muted-foreground text-center text-lg mb-12">
          {t('auth.selectRole')}
        </p>

        {/* Role Cards */}
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => setSelectedRole('worker')}
            className={cn(
              "w-full p-6 rounded-2xl border-2 transition-all duration-200",
              "flex items-center gap-4 text-left",
              "hover:border-primary hover:shadow-soft",
              selectedRole === 'worker'
                ? "border-primary bg-accent shadow-soft"
                : "border-border bg-card"
            )}
          >
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center",
              selectedRole === 'worker' ? "bg-primary text-primary-foreground" : "bg-accent"
            )}>
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{t('auth.worker')}</h3>
              <p className="text-muted-foreground">{t('auth.workerDesc')}</p>
            </div>
          </button>

          <button
            onClick={() => setSelectedRole('admin')}
            className={cn(
              "w-full p-6 rounded-2xl border-2 transition-all duration-200",
              "flex items-center gap-4 text-left",
              "hover:border-primary hover:shadow-soft",
              selectedRole === 'admin'
                ? "border-primary bg-accent shadow-soft"
                : "border-border bg-card"
            )}
          >
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center",
              selectedRole === 'admin' ? "bg-primary text-primary-foreground" : "bg-accent"
            )}>
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{t('auth.admin')}</h3>
              <p className="text-muted-foreground">{t('auth.adminDesc')}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-6 pb-8">
        <Button
          size="lg"
          className={cn(
            "w-full h-14 text-lg font-semibold rounded-xl",
            "transition-all duration-200 active:scale-[0.98]"
          )}
          disabled={!selectedRole}
          onClick={handleContinue}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
