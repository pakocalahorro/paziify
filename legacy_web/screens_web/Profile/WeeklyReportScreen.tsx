import React from 'react';
import { ArrowLeft, Share2, Bot } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Screen } from '../../types';

const WeeklyReportScreen: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto px-6 pt-6">
        <header className="flex items-center justify-between mb-8">
            <button onClick={() => navigate(Screen.HOME)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center -ml-2">
                <ArrowLeft size={24}/>
            </button>
            <h2 className="text-base font-bold text-white">Resumen Semanal</h2>
            <div className="w-8"></div>
        </header>

        <div className="bg-surface border border-white/5 rounded-2xl p-5 mb-6 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-[50px] group-hover:bg-primary/30 transition-all duration-700"></div>
            <div className="relative z-10 flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center shadow-lg">
                     <Bot className="text-white w-4 h-4"/>
                 </div>
                 <div>
                     <p className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1">Insight Científico</p>
                     <p className="text-[15px] font-medium leading-relaxed text-gray-200">
                         Tu velocidad de retorno al estado basal ha mejorado un <span className="text-primary font-bold text-lg">12%</span> esta semana.
                     </p>
                 </div>
            </div>
        </div>

        <div className="bg-surface border border-white/5 rounded-2xl p-6 mb-6">
            <h3 className="text-gray-400 text-sm font-medium mb-4">Consistencia Semanal</h3>
            <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">5<span className="text-gray-600 text-2xl font-normal">/7</span></span>
                <span className="text-sm text-gray-500 font-medium">días activos</span>
            </div>
            
            <div className="h-32 flex items-end justify-between gap-2">
                {/* Mock Chart Bars */}
                {[
                    { d: 'L', h: '40%', a: true }, 
                    { d: 'M', h: '70%', a: true },
                    { d: 'M', h: '5%', a: false },
                    { d: 'J', h: '90%', a: true },
                    { d: 'V', h: '60%', a: true },
                    { d: 'S', h: '5%', a: false },
                    { d: 'D', h: '50%', a: true }
                ].map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                        <div className="w-full bg-surface/50 rounded-t relative h-32 overflow-hidden flex items-end">
                             <div 
                                style={{ height: day.h }} 
                                className={`w-full rounded-t-sm transition-opacity ${day.a ? 'bg-primary shadow-[0_0_15px_rgba(74,103,65,0.4)]' : 'bg-gray-700'}`}
                             ></div>
                        </div>
                        <span className={`text-[10px] font-bold ${day.a ? 'text-white' : 'text-gray-600'}`}>{day.d}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent pb-8">
            <button 
                onClick={() => navigate(Screen.HOME)}
                className="w-full h-14 bg-primary text-white font-bold text-base rounded-xl shadow-glow hover:bg-primary-hover transition-all mb-3"
            >
                Continuar
            </button>
            <button className="w-full h-12 flex items-center justify-center gap-2 border border-white/10 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-all text-sm font-semibold">
                <Share2 size={18}/> Compartir Logro
            </button>
        </div>
    </div>
  );
};

export default WeeklyReportScreen;