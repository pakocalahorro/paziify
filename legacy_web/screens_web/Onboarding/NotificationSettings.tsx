import React from 'react';
import { Bell, Moon, Sun, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Screen } from '../../types';

const NotificationSettings: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen flex flex-col p-6 pt-8 max-w-md mx-auto">
       <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center border border-white/10" onClick={() => navigate(Screen.REGISTER)}>
             <ArrowRight className="rotate-180" size={16}/>
          </div>
          <span className="font-bold">Notificaciones</span>
       </div>

       <div className="bg-surface border border-white/5 rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <p className="text-lg font-medium text-white mb-2">Ciencia del Hábito</p>
          <p className="text-sm text-text-muted leading-relaxed">
             Las notificaciones inteligentes se adaptan a tu <span className="text-primary font-bold">ritmo circadiano</span> para maximizar la adherencia.
          </p>
       </div>

       <div className="space-y-4 mb-auto">
          <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-white/5">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
                   <Sun size={20} />
                </div>
                <div>
                   <p className="font-bold text-white">Rutina de Mañana</p>
                   <p className="text-xs text-text-muted">Start with intention</p>
                </div>
             </div>
             <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
             </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-white/5">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                   <Moon size={20} />
                </div>
                <div>
                   <p className="font-bold text-white">Sugerencia Nocturna</p>
                   <p className="text-xs text-text-muted">Wind down properly</p>
                </div>
             </div>
             <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
             </div>
          </div>
          
          <div className="p-4 bg-surface rounded-xl border border-white/5 mt-6">
             <div className="flex items-center gap-2 mb-2">
                <Bell size={16} className="text-text-muted"/>
                <p className="text-xs font-bold uppercase text-text-muted">Zona de Calma</p>
             </div>
             <div className="flex justify-between items-center bg-background rounded-lg p-3 border border-white/5">
                <span className="text-sm">Horario de Silencio</span>
                <span className="text-primary font-mono font-bold">22:00 - 07:00</span>
             </div>
          </div>
       </div>

       <button 
          onClick={() => navigate(Screen.HOME)}
          className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl shadow-lg mt-8 flex items-center justify-center gap-2 active:scale-95 transition-all"
       >
         Continuar
         <Check size={20} />
       </button>
    </div>
  );
};

export default NotificationSettings;