import { useState } from 'react';
import { IndianRupee, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Payment } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const mockPayments: Payment[] = [
  {
    id: '1',
    jobId: '1',
    workerId: 'worker1',
    workerName: 'Ramesh Kumar',
    joiningDate: '2024-01-15',
    salaryAmount: 15000,
    paymentStatus: 'pending',
  },
  {
    id: '2',
    jobId: '2',
    workerId: 'worker2',
    workerName: 'Suresh Yadav',
    joiningDate: '2024-01-10',
    salaryAmount: 12000,
    paymentStatus: 'paid',
  },
];

export default function Payments() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>(mockPayments);

  const handleMarkPaid = (paymentId: string) => {
    setPayments(prev =>
      prev.map(p => p.id === paymentId ? { ...p, paymentStatus: 'paid' } : p)
    );
    
    toast({
      title: language === 'hi' ? 'भुगतान चिह्नित' : 'Payment Marked',
      description: language === 'hi' 
        ? 'भुगतान को पूर्ण के रूप में चिह्नित किया गया'
        : 'Payment marked as completed',
    });
  };

  const pendingTotal = payments
    .filter(p => p.paymentStatus === 'pending')
    .reduce((sum, p) => sum + p.salaryAmount, 0);

  const paidTotal = payments
    .filter(p => p.paymentStatus === 'paid')
    .reduce((sum, p) => sum + p.salaryAmount, 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        title={language === 'hi' ? 'भुगतान प्रबंधन' : 'Payment Management'}
      />

      <div className="px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-warning/10 border-warning/20">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-warning" />
              <p className="text-xl font-bold text-warning">₹{pendingTotal.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'hi' ? 'बकाया' : 'Pending'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 mx-auto mb-2 text-success" />
              <p className="text-xl font-bold text-success">₹{paidTotal.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'hi' ? 'भुगतान किया' : 'Paid'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment List */}
        <div>
          <h3 className="font-semibold text-lg mb-3">
            {language === 'hi' ? 'भुगतान सूची' : 'Payment List'}
          </h3>
          
          <div className="space-y-3">
            {payments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        {payment.workerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium">{payment.workerName}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {language === 'hi' ? 'शामिल:' : 'Joined:'}{' '}
                              {new Date(payment.joiningDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <Badge 
                          variant={payment.paymentStatus === 'paid' ? 'default' : 'secondary'}
                          className={cn(
                            payment.paymentStatus === 'paid' 
                              ? 'bg-success text-success-foreground'
                              : 'bg-warning/10 text-warning'
                          )}
                        >
                          {payment.paymentStatus === 'paid' 
                            ? (language === 'hi' ? 'भुगतान' : 'Paid')
                            : (language === 'hi' ? 'बकाया' : 'Pending')
                          }
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-lg font-semibold">
                          <IndianRupee className="w-4 h-4" />
                          <span>{payment.salaryAmount.toLocaleString()}</span>
                        </div>
                        
                        {payment.paymentStatus === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkPaid(payment.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {language === 'hi' ? 'भुगतान करें' : 'Mark Paid'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
