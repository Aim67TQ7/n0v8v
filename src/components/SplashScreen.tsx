import { useEffect, useState } from 'react';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const SPLASH_DURATION = 2000; // 2 seconds in milliseconds
  const FADE_DURATION = 500;    // 500ms for fade out

  useEffect(() => {
    // Show splash for SPLASH_DURATION milliseconds
    const splashTimer = setTimeout(() => {
      setIsAnimating(false);
      
      // Wait for fade out animation before completing
      const fadeTimer = setTimeout(onComplete, FADE_DURATION);
      
      // Cleanup fade timer
      return () => clearTimeout(fadeTimer);
    }, SPLASH_DURATION);

    // Cleanup splash timer
    return () => clearTimeout(splashTimer);
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