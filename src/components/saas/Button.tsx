import { Loader2 } from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

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
          "w-full flex items-center justify-center gap-2",
          isLoading && "min-h-[40px]",
          className
        )}
        disabled={isLoading || disabled}
        variant={variant}
        size={size}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </ShadcnButton>
      {isLoading && loadingProgress > 0 && (
        <div className="absolute bottom-0 left-0 right-0">
          <Progress value={loadingProgress} className="h-1 rounded-none" />
        </div>
      )}
    </div>
  );
};