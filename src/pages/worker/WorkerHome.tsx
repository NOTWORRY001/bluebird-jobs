import { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { JobCard } from '@/components/JobCard';
import { IconButton } from '@/components/ui/icon-button';
import { Badge } from '@/components/ui/badge';
import { mockJobs, jobCategories, Job } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import * as Icons from 'lucide-react';

export default function WorkerHome() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [location, setLocation] = useState<string>('Fetching location...');
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, reverse geocode to get address
          setLocation('Near Sector 62, Noida');
        },
        () => {
          setLocation('Location not available');
        }
      );
    }

    // Load applied jobs from storage
    const saved = localStorage.getItem('appliedJobs');
    if (saved) {
      setAppliedJobs(new Set(JSON.parse(saved)));
    }
  }, []);

  const filteredJobs = selectedCategory
    ? jobs.filter(job => job.jobType === selectedCategory)
    : jobs;

  const handleApply = (jobId: string) => {
    const newApplied = new Set(appliedJobs).add(jobId);
    setAppliedJobs(newApplied);
    localStorage.setItem('appliedJobs', JSON.stringify([...newApplied]));
    
    toast({
      title: language === 'hi' ? "आवेदन भेजा गया!" : "Application Sent!",
      description: language === 'hi' 
        ? "नियोक्ता को आपकी जानकारी भेज दी गई है"
        : "Your details have been sent to the employer",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        title={t('worker.nearbyJobs')} 
        showLogout 
        speakText={language === 'hi' ? 'आस-पास की नौकरियां दिखाई जा रही हैं' : 'Showing nearby jobs'}
      />

      {/* Location Banner */}
      <div className="px-4 py-3 bg-accent/50 flex items-center gap-2">
        <Navigation className="w-4 h-4 text-primary" />
        <span className="text-sm">{location}</span>
        <Badge variant="secondary" className="ml-auto">
          <MapPin className="w-3 h-3 mr-1" />
          5 km
        </Badge>
      </div>

      {/* Category Filter */}
      <div className="px-4 py-4 overflow-x-auto">
        <div className="flex gap-3 pb-2">
          {jobCategories.slice(0, 6).map((category) => {
            const IconComponent = (Icons as any)[category.icon];
            return (
              <IconButton
                key={category.id}
                icon={IconComponent}
                label={language === 'hi' ? category.nameHi : category.name}
                size="sm"
                selected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Jobs List */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">
            {filteredJobs.length} {language === 'hi' ? 'नौकरियां उपलब्ध' : 'Jobs Available'}
          </h2>
        </div>

        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            applied={appliedJobs.has(job.id)}
            onApply={() => handleApply(job.id)}
          />
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{language === 'hi' ? 'कोई नौकरी नहीं मिली' : 'No jobs found'}</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
