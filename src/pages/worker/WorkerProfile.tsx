import { useState, useRef, useEffect } from 'react';
import { Camera, User, Check, Bookmark, MapPin, IndianRupee, Clock, X, CreditCard, Briefcase } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JobCard } from '@/components/JobCard';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { jobCategories } from '@/lib/mockData';
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

export default function WorkerProfile() {
  const { user, workerProfile, updateWorkerProfile } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(workerProfile?.name || '');
  const [aadhaarNumber, setAadhaarNumber] = useState(workerProfile?.aadhaarNumber || '');
  const [category, setCategory] = useState(workerProfile?.jobCategory || '');
  const [experience, setExperience] = useState(workerProfile?.experienceYears?.toString() || '0');
  const [availability, setAvailability] = useState(workerProfile?.availability || 'available');
  const [photo, setPhoto] = useState<string | null>(workerProfile?.photo || null);
  const [pastExperience, setPastExperience] = useState<string[]>(workerProfile?.pastExperience || []);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(false);

  useEffect(() => {
    fetchSavedJobs();
  }, [user?.id]);

  const fetchSavedJobs = async () => {
    if (!user?.id) return;
    setLoadingSavedJobs(true);

    try {
      // Fetch saved job IDs
      const { data: savedData, error: savedError } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('worker_id', user.id);

      if (savedError) throw savedError;

      const jobIds = savedData?.map(item => item.job_id) || [];
      setSavedJobIds(new Set(jobIds));

      if (jobIds.length > 0) {
        // Fetch job details
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .in('id', jobIds);

        if (!jobsError && jobsData) {
          setSavedJobs(jobsData);
        }
      } else {
        setSavedJobs([]);
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      // Fallback to localStorage
      const localSaved = JSON.parse(localStorage.getItem(`saved_jobs_${user.id}`) || '[]');
      setSavedJobIds(new Set(localSaved));
    } finally {
      setLoadingSavedJobs(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 12) {
      setAadhaarNumber(value);
    }
  };

  const togglePastExperience = (categoryId: string) => {
    if (pastExperience.includes(categoryId)) {
      setPastExperience(pastExperience.filter(id => id !== categoryId));
    } else {
      setPastExperience([...pastExperience, categoryId]);
    }
  };

  const handleUnsaveJob = async (jobId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('worker_id', user.id)
        .eq('job_id', jobId);

      if (error) throw error;

      // Update local state
      setSavedJobs(savedJobs.filter(job => job.id !== jobId));
      const newSavedIds = new Set(savedJobIds);
      newSavedIds.delete(jobId);
      setSavedJobIds(newSavedIds);

      // Update localStorage
      const localSaved = Array.from(newSavedIds);
      localStorage.setItem(`saved_jobs_${user.id}`, JSON.stringify(localSaved));

      toast({
        title: language === 'hi' ? 'हटाया गया' : 'Removed',
        description: language === 'hi' ? 'नौकरी बुकमार्क से हटाई गई' : 'Job removed from bookmarks',
      });
    } catch (error) {
      console.error('Error unsaving job:', error);
    }
  };

  const handleSave = () => {
    updateWorkerProfile({
      name,
      aadhaarNumber,
      jobCategory: category,
      experienceYears: parseInt(experience) || 0,
      availability: availability as 'available' | 'busy' | 'unavailable',
      photo,
      pastExperience,
    });

    toast({
      title: language === 'hi' ? 'प्रोफाइल सहेजी गई!' : 'Profile Saved!',
      description: language === 'hi'
        ? 'आपकी प्रोफाइल अपडेट हो गई है'
        : 'Your profile has been updated',
    });
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white';
      case 'busy':
        return 'bg-gradient-to-r from-orange-500 to-amber-600 text-white';
      case 'unavailable':
        return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Sidebar />

      <div className="ml-16 lg:ml-64">
        <div className="w-full px-6 py-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'hi' ? 'मेरी प्रोफाइल' : 'My Profile'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'hi' ? 'अपनी जानकारी अपडेट करें' : 'Update your information'}
              </p>
            </div>
          </div>

          {/* Profile Photo Section */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div
                  className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-1 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {photo ? (
                      <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center border-4 border-white">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <p className="mt-3 text-sm text-gray-600">
                  {language === 'hi' ? 'फोटो बदलने के लिए क्लिक करें' : 'Click to change photo'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                {language === 'hi' ? 'बुनियादी जानकारी' : 'Basic Information'}
              </h2>

              <div>
                <Label htmlFor="name">{language === 'hi' ? 'नाम' : 'Name'}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'hi' ? 'अपना नाम लिखें' : 'Enter your name'}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">{language === 'hi' ? 'फोन नंबर' : 'Phone Number'}</Label>
                <Input
                  id="phone"
                  value={user?.phone || ''}
                  disabled
                  className="mt-1 bg-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="aadhaar" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  {language === 'hi' ? 'आधार कार्ड नंबर' : 'Aadhaar Card Number'}
                </Label>
                <Input
                  id="aadhaar"
                  value={aadhaarNumber}
                  onChange={handleAadhaarChange}
                  placeholder={language === 'hi' ? '12 अंकों का आधार नंबर' : '12-digit Aadhaar number'}
                  className="mt-1"
                  maxLength={12}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {aadhaarNumber.length}/12 {language === 'hi' ? 'अंक' : 'digits'}
                </p>
              </div>

              <div>
                <Label>{language === 'hi' ? 'अनुभव (वर्ष)' : 'Experience (Years)'}</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((y) => (
                    <button
                      key={y}
                      onClick={() => setExperience(y.toString())}
                      className={cn(
                        "px-4 py-2 rounded-lg border-2 transition-all",
                        experience === y.toString()
                          ? "border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-semibold"
                          : "border-gray-200 hover:border-emerald-300"
                      )}
                    >
                      {y} {language === 'hi' ? 'वर्ष' : 'yrs'}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Category */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                {language === 'hi' ? 'मुख्य काम की श्रेणी' : 'Primary Job Category'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {jobCategories.map((cat) => {
                  const IconComponent = (Icons as any)[cat.icon];
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                        category === cat.id
                          ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50"
                          : "border-gray-200 hover:border-emerald-300"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        category === cat.id
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                          : "bg-gray-100"
                      )}>
                        <IconComponent className={cn(
                          "w-6 h-6",
                          category === cat.id ? "text-white" : "text-gray-600"
                        )} />
                      </div>
                      <span className={cn(
                        "text-sm font-medium text-center",
                        category === cat.id ? "text-emerald-700" : "text-gray-700"
                      )}>
                        {language === 'hi' ? cat.nameHi : cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Past Experience */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                {language === 'hi' ? 'पिछला अनुभव' : 'Past Experience'}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {language === 'hi' ? 'उन सभी क्षेत्रों को चुनें जिनमें आपने काम किया है' : 'Select all areas where you have worked'}
              </p>
              <div className="flex flex-wrap gap-2">
                {jobCategories.map((cat) => {
                  const IconComponent = (Icons as any)[cat.icon];
                  const isSelected = pastExperience.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => togglePastExperience(cat.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all",
                        isSelected
                          ? "border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                          : "border-gray-300 hover:border-emerald-300 text-gray-700"
                      )}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {language === 'hi' ? cat.nameHi : cat.name}
                      </span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'hi' ? 'उपलब्धता' : 'Availability'}
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {(['available', 'busy', 'unavailable'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setAvailability(status)}
                    className={cn(
                      "py-4 px-4 rounded-xl border-2 transition-all font-semibold",
                      availability === status
                        ? getAvailabilityColor(status) + " border-transparent shadow-lg"
                        : "border-gray-300 bg-white text-gray-700 hover:border-emerald-300"
                    )}
                  >
                    {language === 'hi'
                      ? (status === 'available' ? 'उपलब्ध' : status === 'busy' ? 'व्यस्त' : 'अनुपलब्ध')
                      : (status.charAt(0).toUpperCase() + status.slice(1))
                    }
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Saved Jobs */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-emerald-600" />
                  {language === 'hi' ? 'सहेजी गई नौकरियां' : 'Saved Jobs'}
                </h2>
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  {savedJobs.length} {language === 'hi' ? 'नौकरियां' : 'jobs'}
                </Badge>
              </div>

              {loadingSavedJobs ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">{language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}</p>
                </div>
              ) : savedJobs.length > 0 ? (
                <div className="space-y-4">
                  {savedJobs.map((job) => (
                    <div key={job.id} className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full"
                        onClick={() => handleUnsaveJob(job.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <JobCard
                        job={job}
                        isSaved={true}
                        onSaveChange={() => { }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                    <Bookmark className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'hi' ? 'कोई सहेजी गई नौकरी नहीं' : 'No saved jobs'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'hi' ? 'अपनी पसंद की नौकरियों को सहेजें' : 'Save jobs you\'re interested in'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="sticky bottom-6 z-20">
            <Button
              className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
              onClick={handleSave}
            >
              <Check className="w-5 h-5 mr-2" />
              {language === 'hi' ? 'प्रोफाइल सहेजें' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
