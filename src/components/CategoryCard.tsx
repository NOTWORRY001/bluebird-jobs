import { useLanguage } from '@/contexts/LanguageContext';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    nameHi: string;
    icon: string;
  };
  isSelected: boolean;
  onClick: () => void;
  colorIndex: number;
}

export function CategoryCard({ category, isSelected, onClick, colorIndex }: CategoryCardProps) {
  const { language } = useLanguage();
  const IconComponent = (Icons as any)[category.icon];
  
  const gradients = [
    'from-orange-500 to-red-500',
    'from-blue-500 to-indigo-600', 
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-pink-600',
    'from-red-500 to-rose-600',
    'from-teal-500 to-cyan-600',
    'from-pink-500 to-fuchsia-600',
    'from-indigo-500 to-purple-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-blue-600'
  ];

  const bgGradients = [
    'from-orange-50 to-red-50',
    'from-blue-50 to-indigo-50', 
    'from-emerald-50 to-teal-50',
    'from-purple-50 to-pink-50',
    'from-red-50 to-rose-50',
    'from-teal-50 to-cyan-50',
    'from-pink-50 to-fuchsia-50',
    'from-indigo-50 to-purple-50',
    'from-amber-50 to-orange-50',
    'from-cyan-50 to-blue-50'
  ];

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 shrink-0 min-w-[100px] ${
        isSelected 
          ? `bg-gradient-to-br ${gradients[colorIndex % gradients.length]} shadow-lg scale-105` 
          : `bg-gradient-to-br ${bgGradients[colorIndex % bgGradients.length]} hover:shadow-md hover:scale-102 border border-white/50`
      }`}
    >
      <div className="p-4 flex flex-col items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
          isSelected 
            ? 'bg-white/20 backdrop-blur-sm' 
            : `bg-gradient-to-br ${gradients[colorIndex % gradients.length]} shadow-sm`
        }`}>
          <IconComponent className={`w-6 h-6 ${
            isSelected ? 'text-white' : 'text-white'
          }`} />
        </div>
        
        <span className={`text-xs font-semibold text-center leading-tight ${
          isSelected ? 'text-white' : 'text-gray-700'
        }`}>
          {language === 'hi' ? category.nameHi : category.name}
        </span>
      </div>
      
      {/* Hover effect overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[colorIndex % gradients.length]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
    </button>
  );
}