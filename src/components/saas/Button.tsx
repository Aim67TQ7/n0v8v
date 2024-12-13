import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingProgress?: number;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

export const Button = ({ 
  isLoading, 
  loadingProgress = 0,
  children, 
  className,
  disabled,
  variant = 'default',
  size = 'default',
  ...props 
}: ButtonProps) => {
  return (
    <div className="relative w-full">
      <ShadcnButton
        className={cn(
          "w-full flex items-center justify-center gap-2 overflow-hidden",
          isLoading && "min-h-[40px]",
          className
        )}
        disabled={isLoading || disabled}
        variant={variant}
        size={size}
        {...props}
      >
        {children}
        {isLoading && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="loading-bar" />
          </div>
        )}
      </ShadcnButton>
    </div>
  );
};