import React from 'react';
import { ArrowLeft, PlayCircle, Lock, Calendar, Clock, BarChart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Screen } from '../../types';

const CBTDetailScreen: React.FC = () => {
  const { navigate, selectedCourse } = useApp();

  if (!selectedCourse) return null;

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto bg-background relative">
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background/90 backdrop-blur-md border-b border-white/5">
        <button onClick={() => navigate(Screen.ACADEMY)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10">
            <ArrowLeft size={24} />
        </button>
      </nav>

      <main className="p-6 pt-2">
          {/* Instructor */}
          <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-primary/30 overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop" className="w-full h-full object-cover"/>
              </div>
              <div>
                  <h3 className="text-lg font-bold text-white">{selectedCourse.author}</h3>
                  <p className="text-primary text-sm font-medium">Especialista en Ansiedad</p>
              </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{selectedCourse.title}</h1>
          
          <div className="flex gap-2 mb-8">
              <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                  Basado en Evidencia
              </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-10">
              <div className="bg-surface border border-white/5 rounded-2xl p-3 flex flex-col justify-between h-24">
                  <Calendar className="text-primary mb-2" size={24}/>
                  <div>
                      <p className="text-lg font-bold">7 Días</p>
                      <p className="text-[10px] text-text-muted uppercase">Duración</p>
                  </div>
              </div>
              <div className="bg-surface border border-white/5 rounded-2xl p-3 flex flex-col justify-between h-24">
                  <Clock className="text-primary mb-2" size={24}/>
                  <div>
                      <p className="text-lg font-bold">15 min</p>
                      <p className="text-[10px] text-text-muted uppercase">Diario</p>
                  </div>
              </div>
              <div className="bg-surface border border-white/5 rounded-2xl p-3 flex flex-col justify-between h-24">
                  <BarChart className="text-primary mb-2" size={24}/>
                  <div>
                      <p className="text-lg font-bold">Medio</p>
                      <p className="text-[10px] text-text-muted uppercase">Nivel</p>
                  </div>
              </div>
          </div>

          <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Plan del Curso</h2>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">14% Completado</span>
          </div>

          <div className="relative pl-4 space-y-8 border-l-2 border-white/10 ml-3">
              {/* Day 1 (Active) */}
              <div className="relative pl-8 group">
                  <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-primary ring-4 ring-background shadow-[0_0_10px_rgba(74,103,65,0.5)]"></div>
                  <div className="bg-gradient-to-br from-surface to-[#233536] border border-primary/40 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-full"></div>
                       <div className="flex justify-between items-start mb-2 relative z-10">
                           <span className="text-xs font-bold text-primary uppercase">Día 1</span>
                       </div>
                       <h3 className="text-xl font-bold text-white mb-3 relative z-10">Identificando Detonantes</h3>
                       <div className="flex items-center justify-between relative z-10">
                           <span className="text-sm text-text-muted">8 min</span>
                           <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                               <PlayCircle className="fill-white text-white" size={24}/>
                           </button>
                       </div>
                  </div>
              </div>

              {/* Day 2 (Locked) */}
              <div className="relative pl-8 opacity-60">
                   <div className="absolute -left-[7px] top-6 w-3 h-3 rounded-full bg-surface border-2 border-text-muted"></div>
                   <div className="bg-surface border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                       <div>
                           <span className="text-xs font-semibold text-text-muted uppercase">Día 2</span>
                           <h3 className="text-base font-bold text-white mt-1">Reestructuración Cognitiva</h3>
                           <p className="text-xs text-text-muted mt-1">10 min • Audio</p>
                       </div>
                       <Lock size={20} className="text-text-muted"/>
                   </div>
              </div>
              
              {/* Day 3 (Locked) */}
               <div className="relative pl-8 opacity-60">
                   <div className="absolute -left-[7px] top-6 w-3 h-3 rounded-full bg-surface border-2 border-text-muted"></div>
                   <div className="bg-surface border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                       <div>
                           <span className="text-xs font-semibold text-text-muted uppercase">Día 3</span>
                           <h3 className="text-base font-bold text-white mt-1">Exposición Gradual</h3>
                           <p className="text-xs text-text-muted mt-1">12 min • Video</p>
                       </div>
                       <Lock size={20} className="text-text-muted"/>
                   </div>
              </div>
          </div>
      </main>
      
      <div className="fixed bottom-0 left-0 w-full p-6 pt-12 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
          <button className="w-full bg-primary text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-primary/20 pointer-events-auto active:scale-95 transition-transform flex items-center justify-center gap-2">
              <PlayCircle className="fill-white" size={24}/> Comenzar Día 1
          </button>
      </div>
    </div>
  );
};

export default CBTDetailScreen;