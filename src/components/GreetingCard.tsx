import { MapPin, TrendingUp, Clock, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface GreetingCardProps {
  location: string;
  jobCount: number;
  applicationsCount: number;
}

export function GreetingCard({ location, jobCount, applicationsCount }: GreetingCardProps) {
  const { user } = useAuth();
  const { language } = useLanguage();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return language === 'hi' ? 'सुप्रभात' : 'Good Morning';
    } else if (hour < 17) {
      return language === 'hi' ? 'नमस्कार' : 'Good Afternoon';
    } else {
      return language === 'hi' ? 'शुभ संध्या' : 'Good Evening';
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">{getGreeting()}!</h2>
          <p className="text-emerald-100 text-sm">
            {language === 'hi' ? 'आज के लिए तैयार हैं?' : 'Ready for today?'}
          </p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Star className="w-6 h-6 text-yellow-300" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-emerald-200" />
        <span className="text-emerald-100 text-sm">{location}</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-200" />
            <span className="text-xs text-emerald-200">
              {language === 'hi' ? 'नई जॉब्स' : 'New Jobs'}
            </span>
          </div>
          <p className="text-xl font-bold">{jobCount}</p>
        </div>

        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-emerald-200" />
            <span className="text-xs text-emerald-200">
              {language === 'hi' ? 'आवेदन' : 'Applied'}
            </span>
          </div>
          <p className="text-xl font-bold">{applicationsCount}</p>
        </div>

        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-emerald-200" />
            <span className="text-xs text-emerald-200">
              {language === 'hi' ? 'रेटिंग' : 'Rating'}
            </span>
          </div>
          <p className="text-xl font-bold">4.8</p>
        </div>
      </div>
    </div>
  );
}