import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { GreetingCard } from '@/components/GreetingCard';
import { CategoryCard } from '@/components/CategoryCard';
import { JobCard } from '@/components/JobCard';
import { jobCategories } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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

export default function WorkerHome() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [applications, setApplications] = useState<Map<string, 'interested' | 'not_interested'>>(new Map());
  const [location, setLocation] = useState<string>('Fetching location...');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocation('Near Sector 62, Noida'),
        () => setLocation('Location not available')
      );
    }
    fetchJobs();
    fetchApplications();
    fetchSavedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setJobs(data);
        return;
      }
    } catch (error) {
      console.log('Supabase error, using localStorage');
    }
    const localJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    setJobs(localJobs);
  };

  const fetchApplications = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('job_id, status')
        .eq('worker_id', user.id);
      if (!error && data) {
        const appMap = new Map();
        data.forEach(app => appMap.set(app.job_id, app.status));
        setApplications(appMap);
        return;
      }
    } catch (error) {
      console.log('Supabase error, using localStorage for applications');
    }
    const localApps = JSON.parse(localStorage.getItem(`applications_${user?.id}`) || '{}');
    setApplications(new Map(Object.entries(localApps)));
  };

  const handleStatusChange = async (jobId: string, status: 'interested' | 'not_interested') => {
    if (!user?.id) return;
    try {
      const { error } = await supabase
        .from('job_applications')
        .upsert({
          job_id: jobId,
          worker_id: user.id,
          worker_name: user.user_metadata?.full_name || 'Worker',
          status: status
        });
      if (error) throw error;
    } catch (error) {
      const localApps = JSON.parse(localStorage.getItem(`applications_${user.id}`) || '{}');
      localApps[jobId] = status;
      localStorage.setItem(`applications_${user.id}`, JSON.stringify(localApps));
    }
    const newApplications = new Map(applications);
    newApplications.set(jobId, status);
    setApplications(newApplications);
    toast({
      title: status === 'interested'
        ? (language === 'hi' ? "रुचि दिखाई गई!" : "Interest Shown!")
        : (language === 'hi' ? "रुचि नहीं दिखाई" : "Not Interested"),
      description: status === 'interested'
        ? (language === 'hi' ? "नियोक्ता की जानकारी अब दिखाई जा रही है" : "Employer details are now visible")
        : (language === 'hi' ? "आपकी प्राथमिकता सहेजी गई" : "Your preference has been saved"),
    });
  };

  const fetchSavedJobs = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('worker_id', user.id);
      if (!error && data) {
        const savedSet = new Set(data.map(item => item.job_id));
        setSavedJobs(savedSet);
        return;
      }
    } catch (error) {
      console.log('Supabase error, using localStorage for saved jobs');
    }
    const localSaved = JSON.parse(localStorage.getItem(`saved_jobs_${user?.id}`) || '[]');
    setSavedJobs(new Set(localSaved));
  };

  const handleSaveChange = (jobId: string, saved: boolean) => {
    const newSavedJobs = new Set(savedJobs);
    if (saved) {
      newSavedJobs.add(jobId);
    } else {
      newSavedJobs.delete(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const filteredJobs = selectedCategory ? jobs.filter(job => job.job_type === selectedCategory) : jobs;
  const applicationsCount = Array.from(applications.values()).filter(status => status === 'interested').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Sidebar />

      <div className="ml-16 lg:ml-64">
        <div className="w-full px-6 py-6 space-y-8">
          {/* Greeting Section */}
          <section id="greeting">
            <GreetingCard
              location={location}
              jobCount={jobs.length}
              applicationsCount={applicationsCount}
            />
          </section>

          {/* Categories Section */}
          <section id="categories">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {language === 'hi' ? 'काम की श्रेणी' : 'Job Categories'}
            </h3>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4">
                {jobCategories.map((category, index) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    isSelected={selectedCategory === category.id}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                    colorIndex={index}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Jobs Section */}
          <section id="jobs">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {filteredJobs.length} {language === 'hi' ? 'नौकरियां उपलब्ध' : 'Jobs Available'}
              </h2>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {language === 'hi' ? 'सभी देखें' : 'Clear Filter'}
                </button>
              )}
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  applicationStatus={applications.get(job.id) || null}
                  onStatusChange={(status) => handleStatusChange(job.id, status)}
                  isSaved={savedJobs.has(job.id)}
                  onSaveChange={(saved) => handleSaveChange(job.id, saved)}
                />
              ))}

              {filteredJobs.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'hi' ? 'कोई नौकरी नहीं मिली' : 'No jobs found'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'hi' ? 'कृपया बाद में फिर से जांचें' : 'Check back later for new opportunities'}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
