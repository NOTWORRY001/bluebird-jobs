import { useState, useRef } from 'react';
import { Camera, Video, Mic, Check, User } from 'lucide-react';
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
import { jobCategories } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

export default function WorkerProfile() {
  const { user, workerProfile, updateWorkerProfile } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(workerProfile?.name || '');
  const [category, setCategory] = useState(workerProfile?.jobCategory || '');
  const [experience, setExperience] = useState(workerProfile?.experienceYears?.toString() || '0');
  const [availability, setAvailability] = useState(workerProfile?.availability || 'available');
  const [photo, setPhoto] = useState<string | null>(null);
  const [introType, setIntroType] = useState<'video' | 'audio' | null>(null);

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

  const handleSave = () => {
    updateWorkerProfile({
      name,
      jobCategory: category,
      experienceYears: parseInt(experience) || 0,
      availability: availability as 'available' | 'busy' | 'unavailable',
    });

    toast({
      title: language === 'hi' ? 'प्रोफाइल सहेजी गई!' : 'Profile Saved!',
      description: language === 'hi' 
        ? 'आपकी प्रोफाइल अपडेट हो गई है'
        : 'Your profile has been updated',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header 
        title={t('nav.profile')} 
        showLogout
        speakText={language === 'hi' ? 'अपनी प्रोफाइल संपादित करें' : 'Edit your profile'}
      />

      <div className="px-4 py-6 space-y-6">
        {/* Photo Upload */}
        <div className="flex flex-col items-center">
          <div 
            className="relative w-28 h-28 rounded-full bg-accent flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {photo ? (
              <img src={photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-muted-foreground" />
            )}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Camera className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {language === 'hi' ? 'फोटो अपलोड करें' : 'Tap to upload photo'}
          </p>
        </div>

        {/* Basic Info */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="name">{t('profile.name')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'hi' ? 'अपना नाम लिखें' : 'Enter your name'}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">{t('profile.phone')}</Label>
              <Input
                id="phone"
                value={user?.phone || ''}
                disabled
                className="mt-1 bg-muted"
              />
            </div>

            <div>
              <Label>{t('profile.experience')}</Label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y} {t('profile.years')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Job Category */}
        <Card>
          <CardContent className="p-4">
            <Label className="mb-3 block">{t('profile.category')}</Label>
            <div className="grid grid-cols-4 gap-3">
              {jobCategories.slice(0, 8).map((cat) => {
                const IconComponent = (Icons as any)[cat.icon];
                return (
                  <IconButton
                    key={cat.id}
                    icon={IconComponent}
                    label={language === 'hi' ? cat.nameHi : cat.name}
                    size="sm"
                    selected={category === cat.id}
                    onClick={() => setCategory(cat.id)}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardContent className="p-4">
            <Label className="mb-3 block">{t('profile.availability')}</Label>
            <div className="flex gap-3">
              {(['available', 'busy', 'unavailable'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setAvailability(status)}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl border-2 transition-all",
                    availability === status
                      ? "border-primary bg-accent"
                      : "border-border"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium",
                    availability === status && "text-primary"
                  )}>
                    {t(`profile.${status}`)}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Video/Voice Introduction */}
        <Card>
          <CardContent className="p-4">
            <Label className="mb-3 block">
              {language === 'hi' ? 'परिचय वीडियो/ऑडियो' : 'Introduction Video/Audio'}
            </Label>
            <div className="flex gap-3">
              <Button
                variant={introType === 'video' ? 'default' : 'outline'}
                className="flex-1 h-16"
                onClick={() => setIntroType('video')}
              >
                <Video className="w-6 h-6 mr-2" />
                {t('profile.uploadVideo')}
              </Button>
              <Button
                variant={introType === 'audio' ? 'default' : 'outline'}
                className="flex-1 h-16"
                onClick={() => setIntroType('audio')}
              >
                <Mic className="w-6 h-6 mr-2" />
                {t('profile.uploadVoice')}
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground text-center">
              {language === 'hi' 
                ? '30 सेकंड का परिचय अपलोड करें'
                : 'Upload a 30-second introduction'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Save Button - Fixed at bottom */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background">
        <Button
          className="w-full h-14 text-lg font-semibold rounded-xl"
          onClick={handleSave}
        >
          <Check className="w-5 h-5 mr-2" />
          {t('profile.save')}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
