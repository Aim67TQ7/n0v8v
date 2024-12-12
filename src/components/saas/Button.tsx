import { Loader2 } from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

export const Button = ({ 
  isLoading, 
  children, 
  className,
  disabled,
  variant = 'default',
  size = 'default',
  ...props 
}: ButtonProps) => {
  return (
    <ShadcnButton
      className={cn("w-full flex items-center justify-center gap-2", className)}
      disabled={isLoading || disabled}
      variant={variant}
      size={size}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </ShadcnButton>
  );
};