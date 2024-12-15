import { useEffect, useState } from 'react';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(onComplete, 500); // Wait for fade out animation before completing
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="animate-fade-up">
        <img
          src="/lovable-uploads/d82a5074-9e9a-4687-839a-bf171acebccc.png"
          alt="n0v8v Logo"
          className="h-48 w-48 object-contain"
        />
      </div>
    </div>
  );
};