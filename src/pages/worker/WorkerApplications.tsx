import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, UserCheck, Trophy } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockJobs, Job } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

type ApplicationStatus = 'applied' | 'selected' | 'joined' | 'completed';

interface Application {
  id: string;
  job: Job;
  status: ApplicationStatus;
  appliedAt: string;
}

const statusConfig = {
  applied: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Applied', labelHi: 'आवेदन किया' },
  selected: { icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10', label: 'Selected', labelHi: 'चुना गया' },
  joined: { icon: UserCheck, color: 'text-success', bg: 'bg-success/10', label: 'Joined', labelHi: 'शामिल हुआ' },
  completed: { icon: Trophy, color: 'text-accent-foreground', bg: 'bg-accent', label: 'Completed', labelHi: 'पूरा हुआ' },
};

export default function WorkerApplications() {
  const { t, language } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    // Load applied jobs and create mock applications
    const saved = localStorage.getItem('appliedJobs');
    if (saved) {
      const appliedIds = JSON.parse(saved);
      const apps: Application[] = appliedIds.map((id: string, index: number) => {
        const job = mockJobs.find(j => j.id === id);
        if (!job) return null;
        
        // Random status for demo
        const statuses: ApplicationStatus[] = ['applied', 'selected', 'joined', 'completed'];
        const status = statuses[index % statuses.length];
        
        return {
          id: `app_${id}`,
          job,
          status,
          appliedAt: new Date(Date.now() - Math.random() * 604800000).toISOString(),
        };
      }).filter(Boolean);
      
      setApplications(apps);
    }
  }, []);

  const groupedApplications = {
    active: applications.filter(a => ['applied', 'selected', 'joined'].includes(a.status)),
    completed: applications.filter(a => a.status === 'completed'),
  };

  const ApplicationCard = ({ app }: { app: Application }) => {
    const config = statusConfig[app.status];
    const StatusIcon = config.icon;
    
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", config.bg)}>
              <StatusIcon className={cn("w-5 h-5", config.color)} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{app.job.jobTitle}</h3>
                  <p className="text-sm text-muted-foreground">{app.job.adminName}</p>
                </div>
                <Badge variant="secondary" className={cn(config.bg, config.color)}>
                  {language === 'hi' ? config.labelHi : config.label}
                </Badge>
              </div>
              
              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{app.job.salary}</span>
                <span>•</span>
                <span>{app.job.landmark}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        title={t('nav.applications')} 
        speakText={language === 'hi' ? 'आपके आवेदन' : 'Your applications'}
      />

      <div className="px-4 py-4">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              {language === 'hi' ? 'सक्रिय' : 'Active'} ({groupedApplications.active.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              {language === 'hi' ? 'पूर्ण' : 'Completed'} ({groupedApplications.completed.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-4 space-y-3">
            {groupedApplications.active.length > 0 ? (
              groupedApplications.active.map(app => (
                <ApplicationCard key={app.id} app={app} />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{language === 'hi' ? 'कोई सक्रिय आवेदन नहीं' : 'No active applications'}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4 space-y-3">
            {groupedApplications.completed.length > 0 ? (
              groupedApplications.completed.map(app => (
                <ApplicationCard key={app.id} app={app} />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{language === 'hi' ? 'कोई पूर्ण नौकरी नहीं' : 'No completed jobs'}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
