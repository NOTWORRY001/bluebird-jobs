import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  selected?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon: Icon, label, sublabel, size = 'md', variant = 'default', selected, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-16 h-16',
      md: 'w-20 h-20',
      lg: 'w-24 h-24',
    };

    const iconSizes = {
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-10 h-10',
    };

    const variantClasses = {
      default: 'bg-card hover:bg-accent border border-border',
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary hover:bg-secondary/80',
      ghost: 'hover:bg-accent',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl transition-all duration-200',
          'active:scale-95 shadow-card hover:shadow-soft',
          sizeClasses[size],
          variantClasses[variant],
          selected && 'ring-2 ring-primary ring-offset-2',
          className
        )}
        {...props}
      >
        <Icon className={cn(iconSizes[size], 'mb-1')} />
        <span className="text-xs font-medium text-center leading-tight">{label}</span>
        {sublabel && (
          <span className="text-[10px] text-muted-foreground">{sublabel}</span>
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton };
