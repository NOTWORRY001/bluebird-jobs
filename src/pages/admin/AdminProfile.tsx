import { useState } from 'react';
import { Building2, MapPin, Phone, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export default function AdminProfile() {
  const { user, adminProfile, updateAdminProfile } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();

  const [businessName, setBusinessName] = useState(adminProfile?.businessName || '');
  const [location, setLocation] = useState(adminProfile?.location || '');
  const [contactNumber, setContactNumber] = useState(adminProfile?.contactNumber || user?.phone || '');

  const handleSave = () => {
    updateAdminProfile({
      businessName,
      location,
      contactNumber,
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
        title={language === 'hi' ? 'व्यवसाय प्रोफाइल' : 'Business Profile'}
        showLogout
      />

      <div className="px-4 py-6 space-y-6">
        {/* Business Icon */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center shadow-soft">
            <Building2 className="w-12 h-12 text-primary-foreground" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {language === 'hi' ? 'आपकी व्यवसाय प्रोफाइल' : 'Your Business Profile'}
          </p>
        </div>

        {/* Business Info */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="businessName" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {language === 'hi' ? 'व्यवसाय का नाम' : 'Business Name'}
              </Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={language === 'hi' ? 'अपने व्यवसाय का नाम दर्ज करें' : 'Enter your business name'}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {language === 'hi' ? 'स्थान' : 'Location'}
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={language === 'hi' ? 'अपना पता दर्ज करें' : 'Enter your address'}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="contactNumber" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {language === 'hi' ? 'संपर्क नंबर' : 'Contact Number'}
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  +91
                </span>
                <Input
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9999999999"
                  className="pl-12"
                  maxLength={10}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">
              {language === 'hi' ? 'खाता जानकारी' : 'Account Information'}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>{language === 'hi' ? 'फोन' : 'Phone'}</span>
                <span className="font-medium text-foreground">+91 {user?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'hi' ? 'खाता प्रकार' : 'Account Type'}</span>
                <span className="font-medium text-foreground">
                  {language === 'hi' ? 'नियोक्ता' : 'Employer'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'hi' ? 'सदस्य बने' : 'Member Since'}</span>
                <span className="font-medium text-foreground">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background">
        <Button
          className="w-full h-14 text-lg font-semibold rounded-xl"
          onClick={handleSave}
        >
          <Check className="w-5 h-5 mr-2" />
          {language === 'hi' ? 'प्रोफाइल सहेजें' : 'Save Profile'}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
