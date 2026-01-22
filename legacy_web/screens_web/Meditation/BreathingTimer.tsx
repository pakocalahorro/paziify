import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Screen } from '../../types';
import BreathingOrb from '../../components/BreathingOrb';

const BreathingTimer: React.FC = () => {
  const { navigate } = useApp();
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      navigate(Screen.SESSION_END);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="h-screen w-full bg-background-dark flex flex-col relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542259648-9b8b0c809967?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        
        <header className="relative z-10 p-6 pt-10 flex justify-between items-center">
            <button onClick={() => navigate(Screen.HOME)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
                <X size={24} className="text-white/80"/>
            </button>
            <div className="text-center">
                <p className="text-primary text-[10px] font-bold uppercase tracking-widest">Modo Enfoque</p>
                <div className="flex items-center justify-center gap-1 text-white/50 text-xs">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span> 432Hz
                </div>
            </div>
            <div className="w-10"></div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center relative z-10">
            <h2 className="text-2xl font-light text-white/90 mb-12 tracking-wide animate-pulse-slow">Inhala...</h2>
            
            <BreathingOrb />

            <div className="mt-12 text-5xl font-light tabular-nums tracking-tighter text-white">
                {formatTime(timeLeft)}
            </div>
            <p className="text-white/40 text-sm mt-4 font-medium tracking-wide">Mantén 4 segundos</p>
        </main>

        <div className="relative z-10 p-6 pb-12 w-full max-w-md mx-auto">
            <div className="bg-surface/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
                {/* Sliders Mock */}
                <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-white/80 text-sm">
                        <Volume2 size={16}/> Ondas Binaurales
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-[40%] h-full bg-primary"></div>
                        </div>
                    </div>
                     <div className="flex items-center gap-3 text-white/80 text-sm">
                        <Volume2 size={16}/> Lluvia
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-[70%] h-full bg-primary"></div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button 
                        onClick={() => setIsActive(!isActive)}
                        className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(74,103,65,0.4)] hover:scale-105 transition-transform"
                    >
                        {isActive ? <Pause className="fill-white text-white" size={24}/> : <Play className="fill-white text-white pl-1" size={24}/>}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default BreathingTimer;