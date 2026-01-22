import React, { useMemo } from 'react';
import { Play, TrendingUp, Calendar, Moon, Sun, RefreshCw, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Screen } from '../../types';
import GGAssistant from '../../components/GGAssistant';

const HomeScreen: React.FC = () => {
  const { userState, navigate, isNightMode, updateUserState, setSelectedSession } = useApp();

  const handleStartSession = () => {
      setSelectedSession({
          id: 'daily',
          title: 'Sesión Diaria',
          duration: 10,
          category: 'Mindfulness',
          isPlus: false,
          image: ''
      });
      navigate(Screen.TRANSITION_TUNNEL);
  };

  // Determine state
  const isRecovery = userState.hasMissedDay;
  const isDone = userState.isDailySessionDone;

  const renderContent = () => {
    if (isDone) {
      return (
        <>
          <GGAssistant 
            title="Sesión Completada" 
            message="Increíble trabajo hoy. Has fortalecido tu resiliencia. Descansa profundamente." 
            type="default"
          />
          <div className="bg-surface border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-fade-in">
             <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                <CheckCircle size={32} />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">Todo listo por hoy</h2>
             <p className="text-text-muted text-sm">Vuelve mañana para continuar tu racha.</p>
             
             <button onClick={() => navigate(Screen.WEEKLY_REPORT)} className="mt-6 text-sm font-bold text-primary border-b border-primary/30 pb-1">Ver Resumen Semanal</button>
          </div>
        </>
      );
    }

    if (isRecovery) {
      return (
        <>
          <GGAssistant 
            title="Prevención de Abandono" 
            message="No pasa nada por perder un día. Lo importante es retomar hoy. ¿Hacemos una sesión corta?" 
            actionLabel="Empezar 5 min"
            onAction={handleStartSession}
            type="recovery"
          />
          <div className="bg-surface border border-white/5 rounded-2xl p-6 relative overflow-hidden group cursor-pointer" onClick={handleStartSession}>
             <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop)' }}></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
             <div className="relative z-10 pt-20">
                <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-1 rounded uppercase mb-2 inline-block">Recuperación</span>
                <h3 className="text-xl font-bold text-white mb-1">Retomando el camino</h3>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Play size={12} className="fill-white"/> 5 min • Suave
                </div>
             </div>
          </div>
        </>
      );
    }

    if (isNightMode) {
      return (
        <>
          <div className="flex items-center gap-2 mb-6">
             <Moon className="text-indigo-400" size={20} />
             <h2 className="text-2xl font-light text-white">Buenas noches, <span className="font-bold">{userState.name}</span></h2>
          </div>
          <GGAssistant 
            title="Sugerencia Nocturna" 
            message="Tu sistema nervioso está listo para desconectar. Una sesión interoceptiva ayudará." 
            actionLabel="Empezar Sesión"
            onAction={handleStartSession}
            type="night"
          />
           <div className="bg-surface border border-white/5 rounded-2xl p-6 relative overflow-hidden cursor-pointer group" onClick={handleStartSession}>
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-black z-0"></div>
             <div className="relative z-10 flex flex-col items-center text-center py-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                    <Play className="fill-white ml-1" size={20}/>
                </div>
                <h3 className="text-lg font-bold text-white">Sesión de Sueño Profundo</h3>
                <p className="text-xs text-indigo-200 mt-1">15 min • Delta Waves</p>
             </div>
          </div>
        </>
      );
    }

    // Base State (Day)
    return (
      <>
        <div className="flex items-center gap-2 mb-6">
             <Sun className="text-orange-400" size={20} />
             <h2 className="text-2xl font-light text-white">Buenos días, <span className="font-bold">{userState.name}</span></h2>
        </div>
        <GGAssistant 
            title="Informe Diario" 
            message={`Hoy es tu ${userState.streak}º día consecutivo. Tu resiliencia ha subido un 5%.`}
            actionLabel="Empezar dosis diaria"
            onAction={handleStartSession}
        />
        
        <div className="relative w-full rounded-2xl overflow-hidden shadow-soft group cursor-pointer h-64 mb-6" onClick={handleStartSession}>
            <div className="absolute inset-0">
               <img src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=2525&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Meditation" />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background"></div>
            </div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
                <span className="bg-white/10 backdrop-blur-md text-white border border-white/10 text-[10px] font-bold px-2 py-1 rounded uppercase mb-2 inline-block">Recomendado</span>
                <h2 className="text-2xl font-bold text-white mb-1">Iniciar Sesión Diaria</h2>
                <p className="text-text-muted text-sm">10 min • Enfoque y Claridad</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Play size={32} className="fill-white ml-1"/>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-text-muted">
                    <TrendingUp size={16}/> <span className="text-xs font-bold uppercase">Racha</span>
                </div>
                <p className="text-2xl font-bold text-white">{userState.streak} <span className="text-sm font-normal text-text-muted">días</span></p>
            </div>
             <div className="bg-surface p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-text-muted">
                    <Calendar size={16}/> <span className="text-xs font-bold uppercase">Hoy</span>
                </div>
                <p className="text-2xl font-bold text-white">0 <span className="text-sm font-normal text-text-muted">min</span></p>
            </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto relative px-6 pt-10">
      {/* Dev Controls for Demo */}
      <div className="absolute top-2 right-2 opacity-20 hover:opacity-100 transition-opacity z-50 flex gap-2">
         <button onClick={() => updateUserState({ isDailySessionDone: !userState.isDailySessionDone })} className="p-1 bg-surface rounded"><CheckCircle size={12}/></button>
         <button onClick={() => updateUserState({ hasMissedDay: !userState.hasMissedDay })} className="p-1 bg-surface rounded"><RefreshCw size={12}/></button>
      </div>

      {renderContent()}
    </div>
  );
};

export default HomeScreen;