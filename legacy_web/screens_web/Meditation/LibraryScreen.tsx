import React from 'react';
import { Search, Lock, Star, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Screen, Session } from '../../types';

const categories = ['Todo', '10-20 min', 'Sueño', 'Ansiedad', 'Foco'];

const sessions: Session[] = [
    { id: '1', title: 'Respiración Resonante', duration: 10, category: 'Ansiedad', isPlus: true, image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=2673&auto=format&fit=crop' },
    { id: '2', title: 'Escaneo Corporal', duration: 20, category: 'Sueño', isPlus: false, image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=2670&auto=format&fit=crop' },
    { id: '3', title: 'Compasión', duration: 15, category: 'Conexión', isPlus: false, image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2670&auto=format&fit=crop' },
    { id: '4', title: 'Sonidos Binaurales', duration: 30, category: 'Foco', isPlus: true, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2670&auto=format&fit=crop' },
];

const LibraryScreen: React.FC = () => {
  const { navigate, userState, setShowUpsell, setSelectedSession } = useApp();

  const handleSessionClick = (session: Session) => {
    if (session.isPlus && !userState.isPlusMember) {
        setShowUpsell(true);
    } else {
        setSelectedSession(session);
        navigate(Screen.TRANSITION_TUNNEL);
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto px-6 pt-6">
       <div className="flex items-center justify-between mb-6">
           <h1 className="text-2xl font-bold text-white">Biblioteca</h1>
           <button onClick={() => navigate(Screen.ACADEMY)} className="text-xs font-bold text-accent border border-accent/30 px-3 py-1.5 rounded-full hover:bg-accent/10 transition-colors">
             Ir a Academia TCC
           </button>
       </div>

       <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
             type="text" 
             placeholder="Encuentra claridad..." 
             className="w-full bg-surface border border-white/5 rounded-2xl py-3 pl-12 text-sm text-white focus:border-primary/50 outline-none"
          />
       </div>

       <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8">
           {categories.map((cat, i) => (
               <button key={cat} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${i === 0 ? 'bg-primary text-white' : 'bg-surface text-text-muted border border-white/5'}`}>
                   {cat}
               </button>
           ))}
       </div>

       <div className="grid grid-cols-2 gap-4">
           {sessions.map(session => (
               <div 
                  key={session.id} 
                  onClick={() => handleSessionClick(session)}
                  className="group relative flex flex-col gap-3 rounded-2xl bg-surface p-2 transition-transform active:scale-95 cursor-pointer border border-transparent hover:border-white/10"
                >
                   <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                       <img src={session.image} alt={session.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />
                       
                       {session.isPlus && !userState.isPlusMember && (
                           <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-accent flex items-center gap-1 border border-accent/20">
                               <Star size={10} className="fill-accent"/> PLUS
                           </div>
                       )}

                       {!session.isPlus || userState.isPlusMember ? (
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                               <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                   <Play size={20} className="fill-white ml-1 text-white"/>
                               </div>
                           </div>
                       ) : (
                           <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <Lock size={24} className="text-white/80"/>
                           </div>
                       )}
                   </div>
                   <div className="px-1 pb-1">
                       <h3 className="text-sm font-bold text-white leading-tight mb-1">{session.title}</h3>
                       <p className="text-xs text-text-muted">{session.duration} min • {session.category}</p>
                   </div>
               </div>
           ))}
       </div>
    </div>
  );
};

export default LibraryScreen;