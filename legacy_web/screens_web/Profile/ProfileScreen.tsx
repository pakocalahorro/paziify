import React from 'react';
import { Settings, TrendingUp, Sun, Anchor, Lock, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Screen } from '../../types';

const ProfileScreen: React.FC = () => {
  const { userState, navigate } = useApp();

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto px-6 pt-6">
       <header className="flex justify-between items-center mb-8">
           <div className="w-10"></div>
           <h2 className="text-lg font-bold text-white">Tu Resiliencia</h2>
           <button className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center">
               <Settings size={20} className="text-text-muted"/>
           </button>
       </header>

       <div className="flex flex-col items-center justify-center mb-10 relative">
           <div className="w-48 h-48 bg-primary/10 rounded-full blur-3xl absolute"></div>
           <div className="relative w-64 h-64 flex items-center justify-center">
               <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="45" fill="none" stroke="#2A3131" strokeWidth="6" />
                   <circle cx="50" cy="50" r="45" fill="none" stroke="#4A6741" strokeWidth="6" strokeDasharray="283" strokeDashoffset="45" strokeLinecap="round" />
               </svg>
               <div className="absolute text-center">
                   <span className="text-5xl font-bold text-white block">{userState.resilienceScore}</span>
                   <span className="text-primary text-xs font-bold uppercase tracking-wider">Excelente</span>
               </div>
           </div>
           <p className="text-text-muted text-sm text-center max-w-[200px] mt-4">
               Tu línea base ha mejorado un <span className="text-primary font-bold">12%</span> este mes.
           </p>
       </div>

       <div className="bg-surface border border-white/5 rounded-2xl p-6 mb-6">
           <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-white">Mejora del Ánimo</h3>
               <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-primary text-xs font-bold">
                   <TrendingUp size={12}/> +12%
               </div>
           </div>
           {/* Simple Chart Visualization */}
           <div className="h-32 w-full flex items-end justify-between gap-1">
               {[20, 35, 45, 30, 50, 65, 55, 70, 85].map((h, i) => (
                   <div key={i} className="w-full bg-primary/20 rounded-t-sm relative group">
                       <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-primary rounded-t-sm group-hover:bg-primary-hover transition-colors"></div>
                   </div>
               ))}
           </div>
           <div className="flex justify-between text-[10px] text-text-muted mt-2 uppercase font-bold">
               <span>Hace 30 días</span>
               <span>Hoy</span>
           </div>
       </div>

        <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Insignias</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
                <div className="min-w-[140px] bg-surface border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <Sun size={20}/>
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">Calma Matutina</p>
                        <p className="text-xs text-text-muted mt-1">Racha de 7 días</p>
                    </div>
                </div>
                <div className="min-w-[140px] bg-surface border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Anchor size={20}/>
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">El Ancla</p>
                        <p className="text-xs text-text-muted mt-1">30 Días</p>
                    </div>
                </div>
                 <div className="min-w-[140px] bg-surface border border-white/5 p-4 rounded-xl flex flex-col gap-3 opacity-50">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/40">
                        <Lock size={20}/>
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">Maestro Zen</p>
                        <p className="text-xs text-text-muted mt-1">???</p>
                    </div>
                </div>
            </div>
        </div>
        
        <p className="text-center text-[10px] text-text-muted flex items-center justify-center gap-1">
            <Lock size={10}/> Tus datos están encriptados y son privados.
        </p>
    </div>
  );
};

export default ProfileScreen;