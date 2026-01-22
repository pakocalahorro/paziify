import React from 'react';
import { Smile, Meh, Frown, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Screen } from '../../types';

const SessionEndScreen: React.FC = () => {
  const { navigate, updateUserState, userState } = useApp();

  const handleFinish = () => {
    updateUserState({ 
        isDailySessionDone: true,
        streak: userState.streak + 1 
    });
    navigate(Screen.HOME);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
        <button onClick={handleFinish} className="absolute top-8 right-6 p-2 rounded-full hover:bg-white/5">
            <X size={24} className="text-text-muted"/>
        </button>

        <div className="text-center animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
            <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Sesión Completada</span>
            <h1 className="text-4xl font-bold text-white mt-6 mb-2">¿Cómo te <br/>sientes ahora?</h1>
        </div>

        <div className="flex gap-4 my-12 animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
             {[Frown, Meh, Smile].map((Icon, i) => (
                 <button key={i} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary hover:text-primary text-text-muted transition-all duration-300 group">
                     <Icon size={32} className="group-hover:scale-110 transition-transform"/>
                 </button>
             ))}
        </div>

        <div className="bg-surface border border-white/5 rounded-2xl p-4 flex gap-4 max-w-sm animate-fade-in opacity-0" style={{ animationDelay: '0.5s' }}>
             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                 <span className="font-bold text-white text-xs">G.G.</span>
             </div>
             <div>
                 <p className="text-xs font-bold text-text-muted uppercase mb-1">G.G. Assistant</p>
                 <p className="text-sm text-white">Este dato nos ayuda a medir tu resiliencia semanal.</p>
             </div>
        </div>

        <button 
            onClick={handleFinish}
            className="w-full max-w-sm bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg mt-12 hover:bg-primary-hover transition-colors"
        >
            Guardar y Continuar
        </button>
    </div>
  );
};

export default SessionEndScreen;