import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [searchParams] = useSearchParams();
  const role = (searchParams.get('role') as 'worker' | 'admin') || 'worker';
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
      });
      return;
    }

    setIsLoading(true);
    // Mock OTP send - will be replaced with Supabase
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep('otp');
    
    toast({
      title: "OTP Sent",
      description: "Enter 1234 as OTP (demo mode)",
    });
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the complete OTP",
      });
      return;
    }

    setIsLoading(true);
    // Mock OTP verify - accepts any 4-digit OTP in demo mode
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await login(phone, role);
    setIsLoading(false);
    
    navigate(role === 'worker' ? '/worker' : '/admin');
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => step === 'phone' ? navigate('/') : setStep('phone')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-8">
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
          "bg-primary text-primary-foreground shadow-soft"
        )}>
          {step === 'phone' ? <Phone className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">
          {step === 'phone' ? t('auth.enterPhone') : t('auth.verifyOtp')}
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          {step === 'phone' 
            ? 'We will send you an OTP to verify'
            : t('auth.enterOtp')
          }
        </p>

        {step === 'phone' ? (
          <div className="w-full max-w-sm">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                +91
              </span>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="h-14 pl-14 text-lg rounded-xl"
                maxLength={10}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <InputOTP
              maxLength={4}
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="w-14 h-14 text-xl" />
                <InputOTPSlot index={1} className="w-14 h-14 text-xl" />
                <InputOTPSlot index={2} className="w-14 h-14 text-xl" />
                <InputOTPSlot index={3} className="w-14 h-14 text-xl" />
              </InputOTPGroup>
            </InputOTP>
            <p className="mt-4 text-sm text-muted-foreground">
              Sent to +91 {phone}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="p-6 pb-8">
        <Button
          size="lg"
          className={cn(
            "w-full h-14 text-lg font-semibold rounded-xl",
            "transition-all duration-200 active:scale-[0.98]"
          )}
          onClick={step === 'phone' ? handleSendOtp : handleVerifyOtp}
          disabled={isLoading || (step === 'phone' ? phone.length < 10 : otp.length < 4)}
        >
          {isLoading ? t('common.loading') : (step === 'phone' ? t('auth.sendOtp') : t('auth.verifyOtp'))}
        </Button>
      </div>
    </div>
  );
}
