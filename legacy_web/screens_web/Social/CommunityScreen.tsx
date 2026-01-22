import React from 'react';
import { useApp } from '../../context/AppContext';

const CommunityScreen: React.FC = () => {
  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-background flex flex-col relative overflow-hidden">
        <header className="p-6 text-center z-10">
            <h1 className="text-primary text-xs font-bold tracking-[0.2em] uppercase opacity-80">Comunidad Cero Ruido</h1>
        </header>

        <div className="flex-1 flex flex-col relative z-10">
            {/* Visualizer Area */}
            <div className="min-h-[40vh] flex flex-col items-center justify-center relative">
                 {/* Simulated Dots */}
                 {[...Array(15)].map((_, i) => (
                     <div 
                        key={i}
                        className="absolute rounded-full bg-primary/40 animate-pulse"
                        style={{
                            width: Math.random() * 6 + 2 + 'px',
                            height: Math.random() * 6 + 2 + 'px',
                            top: Math.random() * 80 + 10 + '%',
                            left: Math.random() * 80 + 10 + '%',
                            animationDuration: Math.random() * 3 + 2 + 's'
                        }}
                     ></div>
                 ))}
                 
                 <div className="text-center space-y-2 z-20">
                     <p className="text-5xl font-light text-white tracking-tight">842</p>
                     <p className="text-sm font-medium text-text-muted leading-relaxed">presencias silenciosas <br/> ahora mismo</p>
                 </div>
            </div>

            <div className="flex-1 px-6 pb-6 flex flex-col justify-end">
                <h2 className="text-lg font-medium text-white mb-4 pl-1">Círculos de Apoyo</h2>
                <div className="space-y-3 mb-8">
                    {['Gestión del Estrés', 'Rutinas de Mañana', 'Ansiedad Social', 'Sueño Profundo'].map(topic => (
                        <div key={topic} className="w-full bg-surface border border-white/5 rounded-xl p-4 flex justify-between items-center hover:bg-white/5 cursor-pointer group transition-colors">
                            <span className="text-gray-300 font-medium">{topic}</span>
                            <span className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </div>
                    ))}
                </div>
                
                <div className="text-center mb-4">
                    <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Sin likes. Sin perfiles. Solo presencia.</p>
                </div>
                <button className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-hover transition-colors">
                    Entrar en silencio
                </button>
            </div>
        </div>
    </div>
  );
};

export default CommunityScreen;