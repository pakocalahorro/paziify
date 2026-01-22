import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Screen } from '../../types';

const TransitionTunnel: React.FC = () => {
  const { navigate } = useApp();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(Screen.BREATHING_TIMER);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-[#0c0e0b] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Bio-Organic Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className="w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow"></div>
         <div className="w-[400px] h-[400px] bg-primary/10 rounded-full blur-[60px] animate-breathe"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
         <div className="text-[140px] font-thin text-white/10 leading-none tracking-tighter mix-blend-overlay select-none font-sans">
            {count}
         </div>
         <div className="mt-12 text-center space-y-2 animate-fade-in">
             <h2 className="text-white/90 text-2xl font-light tracking-wide">Prepara tu espacio...</h2>
             <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase">El silencio comienza en breve</p>
         </div>
      </div>
    </div>
  );
};

export default TransitionTunnel;