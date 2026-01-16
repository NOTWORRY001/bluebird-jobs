import { MapPin, Clock, IndianRupee, Building2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Job, jobCategories } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface JobCardProps {
  job: Job;
  applied?: boolean;
  onApply?: () => void;
  onClick?: () => void;
}

export function JobCard({ job, applied, onApply, onClick }: JobCardProps) {
  const { t, speak, language } = useLanguage();
  
  const category = jobCategories.find(c => c.id === job.jobType);
  const IconComponent = category ? (Icons as any)[category.icon] : Building2;
  const categoryName = language === 'hi' ? category?.nameHi : category?.name;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = language === 'hi'
      ? `${job.jobTitle}। वेतन ${job.salary}। स्थान ${job.landmark}। ${job.distance} किलोमीटर दूर।`
      : `${job.jobTitle}. Salary ${job.salary}. Location ${job.landmark}. ${job.distance} kilometers away.`;
    speak(text);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-soft cursor-pointer",
        "active:scale-[0.98]"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <IconComponent className="w-6 h-6 text-accent-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-base leading-tight">{job.jobTitle}</h3>
                <p className="text-sm text-muted-foreground">{job.adminName}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 -mt-1 -mr-2 text-primary"
                onClick={handleSpeak}
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <IndianRupee className="w-4 h-4 text-success" />
                <span className="font-medium text-success">{job.salary}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{job.shift}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{job.landmark}</span>
                {job.distance && (
                  <Badge variant="secondary" className="shrink-0">
                    {job.distance} {t('worker.distance')}
                  </Badge>
                )}
              </div>
            </div>

            {onApply && (
              <Button
                className={cn(
                  "w-full mt-4 h-12 text-base font-semibold",
                  "transition-all duration-200 active:scale-[0.98]"
                )}
                variant={applied ? "secondary" : "default"}
                onClick={(e) => {
                  e.stopPropagation();
                  onApply();
                }}
                disabled={applied}
              >
                {applied ? t('worker.applied') : t('worker.apply')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
