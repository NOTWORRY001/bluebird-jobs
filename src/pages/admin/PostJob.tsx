import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Mic, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconButton } from '@/components/ui/icon-button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { jobCategories, Job } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import * as Icons from 'lucide-react';

const shifts = [
  { value: 'morning', label: 'Morning (6 AM - 2 PM)', labelHi: 'सुबह (6 AM - 2 PM)' },
  { value: 'afternoon', label: 'Afternoon (2 PM - 10 PM)', labelHi: 'दोपहर (2 PM - 10 PM)' },
  { value: 'night', label: 'Night (10 PM - 6 AM)', labelHi: 'रात (10 PM - 6 AM)' },
  { value: 'fullday', label: 'Full Day (8 AM - 6 PM)', labelHi: 'पूरा दिन (8 AM - 6 PM)' },
];

export default function PostJob() {
  const navigate = useNavigate();
  const { user, adminProfile } = useAuth();
  const { language, t } = useLanguage();
  const { toast } = useToast();

  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState('');
  const [salary, setSalary] = useState('');
  const [salaryType, setSalaryType] = useState<'daily' | 'monthly'>('daily');
  const [shift, setShift] = useState('');
  const [location, setLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = () => {
    if (!jobTitle || !jobType || !salary || !shift || !location) {
      toast({
        variant: "destructive",
        title: language === 'hi' ? 'सभी फ़ील्ड भरें' : 'Fill all fields',
        description: language === 'hi' 
          ? 'कृपया सभी आवश्यक जानकारी दें'
          : 'Please provide all required information',
      });
      return;
    }

    const newJob: Job = {
      id: `job_${Date.now()}`,
      adminId: user?.id || '',
      adminName: adminProfile?.businessName || 'Employer',
      jobTitle,
      jobType,
      salary: `₹${salary}/${salaryType === 'daily' ? 'day' : 'month'}`,
      shift: shifts.find(s => s.value === shift)?.label || shift,
      location,
      landmark: landmark || location,
      latitude: 28.6139 + Math.random() * 0.1,
      longitude: 77.2090 + Math.random() * 0.1,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existingJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
    localStorage.setItem('postedJobs', JSON.stringify([newJob, ...existingJobs]));

    toast({
      title: language === 'hi' ? 'नौकरी पोस्ट हो गई!' : 'Job Posted!',
      description: language === 'hi' 
        ? 'कामगार अब आपकी नौकरी देख सकते हैं'
        : 'Workers can now see your job posting',
    });

    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header 
        title={t('admin.postJob')} 
        showBack
      />

      <div className="px-4 py-6 space-y-6">
        {/* Job Type Selection */}
        <Card>
          <CardContent className="p-4">
            <Label className="mb-3 block">{t('admin.jobType')}</Label>
            <div className="grid grid-cols-4 gap-3">
              {jobCategories.slice(0, 8).map((cat) => {
                const IconComponent = (Icons as any)[cat.icon];
                return (
                  <IconButton
                    key={cat.id}
                    icon={IconComponent}
                    label={language === 'hi' ? cat.nameHi : cat.name}
                    size="sm"
                    selected={jobType === cat.id}
                    onClick={() => {
                      setJobType(cat.id);
                      if (!jobTitle) {
                        setJobTitle(language === 'hi' ? cat.nameHi : cat.name);
                      }
                    }}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="jobTitle">{t('admin.jobTitle')}</Label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder={language === 'hi' ? 'नौकरी का शीर्षक' : 'e.g., Construction Worker'}
                className="mt-1"
              />
            </div>

            <div>
              <Label>{t('admin.salary')}</Label>
              <div className="flex gap-2 mt-1">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="500"
                    className="pl-8"
                  />
                </div>
                <Select value={salaryType} onValueChange={(v) => setSalaryType(v as 'daily' | 'monthly')}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{language === 'hi' ? 'प्रति दिन' : 'Per Day'}</SelectItem>
                    <SelectItem value="monthly">{language === 'hi' ? 'प्रति माह' : 'Per Month'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>{t('admin.shift')}</Label>
              <Select value={shift} onValueChange={setShift}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={language === 'hi' ? 'शिफ्ट चुनें' : 'Select shift'} />
                </SelectTrigger>
                <SelectContent>
                  {shifts.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {language === 'hi' ? s.labelHi : s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="location">{t('admin.location')}</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={language === 'hi' ? 'पता दर्ज करें' : 'Enter address'}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="landmark">{language === 'hi' ? 'लैंडमार्क' : 'Nearby Landmark'}</Label>
              <Input
                id="landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={language === 'hi' ? 'जैसे: मेट्रो स्टेशन के पास' : 'e.g., Near Metro Station'}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Voice Description */}
        <Card>
          <CardContent className="p-4">
            <Label className="mb-3 block">
              {language === 'hi' ? 'आवाज में विवरण (वैकल्पिक)' : 'Voice Description (Optional)'}
            </Label>
            <Button
              variant={isRecording ? "destructive" : "outline"}
              className="w-full h-14"
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className="w-5 h-5 mr-2" />
              {isRecording 
                ? (language === 'hi' ? 'रोकने के लिए टैप करें' : 'Tap to Stop')
                : (language === 'hi' ? 'रिकॉर्ड करें' : 'Record Voice Description')
              }
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background">
        <Button
          className="w-full h-14 text-lg font-semibold rounded-xl"
          onClick={handleSubmit}
        >
          <Check className="w-5 h-5 mr-2" />
          {t('admin.post')}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
