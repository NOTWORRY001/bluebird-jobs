import { useState, useEffect } from 'react';
import { Plus, Users, Briefcase, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockJobs, mockApplications, Job } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function AdminHome() {
  const { adminProfile } = useAuth();
  const { language } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeWorkers: 0,
  });

  useEffect(() => {
    // Load jobs from localStorage or use mock data
    const savedJobs = localStorage.getItem('postedJobs');
    const allJobs = savedJobs ? JSON.parse(savedJobs) : mockJobs.slice(0, 2);
    setJobs(allJobs);

    setStats({
      totalJobs: allJobs.length,
      totalApplications: mockApplications.length,
      activeWorkers: mockApplications.filter(a => a.status === 'joined').length,
    });
  }, []);

  const statCards = [
    { 
      label: language === 'hi' ? 'पोस्ट की गई नौकरियां' : 'Jobs Posted', 
      value: stats.totalJobs, 
      icon: Briefcase,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    { 
      label: language === 'hi' ? 'कुल आवेदन' : 'Total Applications', 
      value: stats.totalApplications, 
      icon: Users,
      color: 'text-success',
      bg: 'bg-success/10'
    },
    { 
      label: language === 'hi' ? 'सक्रिय कर्मचारी' : 'Active Workers', 
      value: stats.activeWorkers, 
      icon: TrendingUp,
      color: 'text-warning',
      bg: 'bg-warning/10'
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        title={adminProfile?.businessName || (language === 'hi' ? 'डैशबोर्ड' : 'Dashboard')}
        showLogout
      />

      <div className="px-4 py-6 space-y-6">
        {/* Welcome Banner */}
        <Card className="gradient-primary text-primary-foreground overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-2">
              {language === 'hi' ? 'नमस्ते!' : 'Welcome!'}
            </h2>
            <p className="text-primary-foreground/80 mb-4">
              {language === 'hi' 
                ? 'आज कामगारों को काम पर रखें'
                : 'Hire workers today'
              }
            </p>
            <Link to="/admin/post-job">
              <Button variant="secondary" className="gap-2">
                <Plus className="w-4 h-4" />
                {language === 'hi' ? 'नई नौकरी पोस्ट करें' : 'Post New Job'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className={cn("w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Jobs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">
              {language === 'hi' ? 'हाल की नौकरियां' : 'Recent Jobs'}
            </h3>
            <Link to="/admin/workers" className="text-sm text-primary">
              {language === 'hi' ? 'सभी देखें' : 'View All'}
            </Link>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 3).map((job) => (
              <Card key={job.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{job.jobTitle}</h4>
                      <p className="text-sm text-muted-foreground">{job.salary}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">
                        {mockApplications.filter(a => a.jobId === job.id).length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'hi' ? 'आवेदक' : 'applicants'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {jobs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{language === 'hi' ? 'कोई नौकरी पोस्ट नहीं की गई' : 'No jobs posted yet'}</p>
                <Link to="/admin/post-job">
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    {language === 'hi' ? 'पहली नौकरी पोस्ट करें' : 'Post Your First Job'}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
