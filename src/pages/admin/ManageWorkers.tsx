import { useState } from 'react';
import { Phone, Play, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockApplications, mockJobs, JobApplication } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ManageWorkers() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);

  const groupedByStatus = {
    applied: applications.filter(a => a.status === 'applied'),
    selected: applications.filter(a => a.status === 'selected'),
    joined: applications.filter(a => a.status === 'joined'),
  };

  const handleStatusChange = (appId: string, newStatus: JobApplication['status']) => {
    setApplications(prev => 
      prev.map(a => a.id === appId ? { ...a, status: newStatus } : a)
    );
    
    toast({
      title: language === 'hi' ? 'स्थिति अपडेट हो गई' : 'Status Updated',
      description: language === 'hi' 
        ? `कर्मचारी को ${newStatus} के रूप में चिह्नित किया गया`
        : `Worker marked as ${newStatus}`,
    });
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const WorkerCard = ({ app }: { app: JobApplication }) => {
    const job = mockJobs.find(j => j.id === app.jobId);
    
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-accent text-accent-foreground">
                {app.workerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{app.workerName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {app.workerExperience} {t('profile.years')} • {app.workerCategory}
                  </p>
                </div>
                {app.introMediaUrl && (
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Play className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {job && (
                <Badge variant="secondary" className="mt-2">
                  {language === 'hi' ? 'के लिए:' : 'For:'} {job.jobTitle}
                </Badge>
              )}

              <div className="flex gap-2 mt-3">
                {app.status === 'applied' && (
                  <>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStatusChange(app.id, 'selected')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {t('admin.select')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleStatusChange(app.id, 'completed')}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      {t('admin.reject')}
                    </Button>
                  </>
                )}
                
                {app.status === 'selected' && (
                  <>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStatusChange(app.id, 'joined')}
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      {t('admin.markJoined')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCall('+919999999999')}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </>
                )}
                
                {app.status === 'joined' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleCall('+919999999999')}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    {t('admin.call')}
                  </Button>
                )}
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
        title={language === 'hi' ? 'कामगारों का प्रबंधन' : 'Manage Workers'}
      />

      <div className="px-4 py-4">
        <Tabs defaultValue="applied" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applied">
              {language === 'hi' ? 'नए' : 'New'} ({groupedByStatus.applied.length})
            </TabsTrigger>
            <TabsTrigger value="selected">
              {language === 'hi' ? 'चुने गए' : 'Selected'} ({groupedByStatus.selected.length})
            </TabsTrigger>
            <TabsTrigger value="joined">
              {language === 'hi' ? 'शामिल' : 'Joined'} ({groupedByStatus.joined.length})
            </TabsTrigger>
          </TabsList>

          {(['applied', 'selected', 'joined'] as const).map(status => (
            <TabsContent key={status} value={status} className="mt-4 space-y-3">
              {groupedByStatus[status].length > 0 ? (
                groupedByStatus[status].map(app => (
                  <WorkerCard key={app.id} app={app} />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {language === 'hi' 
                      ? 'इस श्रेणी में कोई कर्मचारी नहीं'
                      : 'No workers in this category'
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
