import { useState, useEffect } from 'react';
import { MapPin, Clock, IndianRupee, Building2, Volume2, Phone, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { jobCategories } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface Job {
  id: string;
  admin_id: string;
  admin_name: string;
  admin_phone?: string;
  admin_photo?: string;
  job_title: string;
  job_type: string;
  salary: string;
  shift: string;
  location: string;
  landmark: string;
  latitude: number;
  longitude: number;
  distance?: number;
  created_at: string;
}

interface JobCardProps {
  job: Job;
  applicationStatus?: 'interested' | 'not_interested' | null;
  onStatusChange?: (status: 'interested' | 'not_interested') => void;
  onClick?: () => void;
  isSaved?: boolean;
  onSaveChange?: (saved: boolean) => void;
}

export function JobCard({ job, applicationStatus, onStatusChange, onClick, isSaved = false, onSaveChange }: JobCardProps) {
  const { speak, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [saved, setSaved] = useState(isSaved);
  const [isSharing, setIsSharing] = useState(false);

  const category = jobCategories.find(c => c.id === job.job_type);
  const IconComponent = category ? (Icons as any)[category.icon] : Building2;

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = language === 'hi'
      ? `${job.job_title}। वेतन ${job.salary}। स्थान ${job.landmark}।`
      : `${job.job_title}. Salary ${job.salary}. Location ${job.landmark}.`;
    speak(text);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (job.admin_phone) {
      window.open(`tel:${job.admin_phone}`);
    }
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (job.admin_phone) {
      window.open(`https://wa.me/${job.admin_phone.replace(/[^0-9]/g, '')}`);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) {
      toast({
        title: language === 'hi' ? 'लॉगिन आवश्यक' : 'Login Required',
        description: language === 'hi' ? 'कृपया पहले लॉगिन करें' : 'Please login first',
        variant: 'destructive',
      });
      return;
    }

    const newSavedState = !saved;
    setSaved(newSavedState);

    try {
      if (newSavedState) {
        // Save the job
        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            worker_id: user.id,
            job_id: job.id,
          });
        if (error) throw error;
      } else {
        // Unsave the job
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('worker_id', user.id)
          .eq('job_id', job.id);
        if (error) throw error;
      }

      // Update local storage as fallback
      const savedJobs = JSON.parse(localStorage.getItem(`saved_jobs_${user.id}`) || '[]');
      if (newSavedState) {
        savedJobs.push(job.id);
      } else {
        const index = savedJobs.indexOf(job.id);
        if (index > -1) savedJobs.splice(index, 1);
      }
      localStorage.setItem(`saved_jobs_${user.id}`, JSON.stringify(savedJobs));

      // Notify parent component
      onSaveChange?.(newSavedState);

      toast({
        title: newSavedState
          ? (language === 'hi' ? 'सहेजा गया!' : 'Saved!')
          : (language === 'hi' ? 'हटाया गया' : 'Removed'),
        description: newSavedState
          ? (language === 'hi' ? 'नौकरी बुकमार्क में जोड़ी गई' : 'Job added to bookmarks')
          : (language === 'hi' ? 'नौकरी बुकमार्क से हटाई गई' : 'Job removed from bookmarks'),
      });
    } catch (error) {
      console.error('Save error:', error);
      // Fallback to localStorage only
      const savedJobs = JSON.parse(localStorage.getItem(`saved_jobs_${user.id}`) || '[]');
      if (newSavedState) {
        savedJobs.push(job.id);
        localStorage.setItem(`saved_jobs_${user.id}`, JSON.stringify(savedJobs));
      } else {
        const index = savedJobs.indexOf(job.id);
        if (index > -1) {
          savedJobs.splice(index, 1);
          localStorage.setItem(`saved_jobs_${user.id}`, JSON.stringify(savedJobs));
        }
      }
      onSaveChange?.(newSavedState);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSharing(true);

    const shareData = {
      title: job.job_title,
      text: `${job.job_title} at ${job.admin_name}\nSalary: ${job.salary}\nLocation: ${job.landmark}`,
      url: window.location.href,
    };

    try {
      // Try native Web Share API (works on mobile)
      if (navigator.share) {
        await navigator.share(shareData);

        // Track the share
        await supabase.from('job_shares').insert({
          job_id: job.id,
          worker_id: user?.id,
          shared_via: 'native',
        });

        toast({
          title: language === 'hi' ? 'शेयर किया गया!' : 'Shared!',
          description: language === 'hi' ? 'नौकरी शेयर की गई' : 'Job shared successfully',
        });
      } else {
        // Fallback: Copy to clipboard
        const textToCopy = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(textToCopy);

        // Track the share
        await supabase.from('job_shares').insert({
          job_id: job.id,
          worker_id: user?.id,
          shared_via: 'clipboard',
        });

        toast({
          title: language === 'hi' ? 'कॉपी किया गया!' : 'Copied!',
          description: language === 'hi' ? 'नौकरी विवरण क्लिपबोर्ड में कॉपी किया गया' : 'Job details copied to clipboard',
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: language === 'hi' ? 'शेयर नहीं हो सका' : 'Failed to share',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Card className="group overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">{job.job_title}</h3>
                <p className="text-emerald-100 text-sm">{job.admin_name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={handleSpeak}
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={handleSave}
              >
                <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={handleShare}
                disabled={isSharing}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{language === 'hi' ? 'वेतन' : 'Salary'}</p>
                <p className="font-bold text-green-600 text-sm">{job.salary}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{language === 'hi' ? 'शिफ्ट' : 'Shift'}</p>
                <p className="font-medium text-gray-700 text-sm">{job.shift}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">{language === 'hi' ? 'स्थान' : 'Location'}</p>
              <p className="font-medium text-gray-700 text-sm">{job.landmark}</p>
            </div>
            {job.distance && (
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
                {job.distance} km
              </Badge>
            )}
          </div>

          {/* Admin details if interested */}
          {applicationStatus === 'interested' && job.admin_phone && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-4 border border-emerald-200">
              <div className="flex items-center gap-3 mb-3">
                {job.admin_photo ? (
                  <img
                    src={job.admin_photo}
                    alt={job.admin_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{job.admin_name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{job.admin_name}</p>
                  <p className="text-sm text-emerald-600">{job.admin_phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
                  onClick={handleCall}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {language === 'hi' ? 'कॉल करें' : 'Call'}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white border-0"
                  onClick={handleChat}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {language === 'hi' ? 'चैट' : 'Chat'}
                </Button>
              </div>
            </div>
          )}

          {/* Interest buttons */}
          {onStatusChange && (
            <div>
              {applicationStatus === null ? (
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 h-12 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange('interested');
                    }}
                  >
                    {language === 'hi' ? 'रुचि है' : 'Interested'}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 h-12 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange('not_interested');
                    }}
                  >
                    {language === 'hi' ? 'रुचि नहीं' : 'Not Interested'}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-3">
                  <Badge
                    className={`px-4 py-2 text-sm font-semibold ${applicationStatus === 'interested'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                      }`}
                  >
                    {applicationStatus === 'interested'
                      ? (language === 'hi' ? 'रुचि दिखाई गई' : 'Interest Shown')
                      : (language === 'hi' ? 'रुचि नहीं दिखाई' : 'Not Interested')
                    }
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
