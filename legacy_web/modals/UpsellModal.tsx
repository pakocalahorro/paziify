import React from 'react';
import { X, Check, Star, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const UpsellModal: React.FC = () => {
  const { showUpsell, setShowUpsell, updateUserState } = useApp();

  if (!showUpsell) return null;

  const handleUpgrade = () => {
    updateUserState({ isPlusMember: true });
    setShowUpsell(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowUpsell(false)}></div>
      <div className="bg-surface border border-white/10 rounded-3xl w-full max-w-md p-6 relative overflow-hidden animate-fade-in shadow-2xl">
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[60px] pointer-events-none -mr-20 -mt-20"></div>

        <button 
          onClick={() => setShowUpsell(false)}
          className="absolute top-4 right-4 text-text-muted hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-2 mb-4">
            <span className="bg-accent/20 text-accent text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                <Zap size={12} className="fill-accent"/> Comparativa
            </span>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
          Paziify Plus <br/>
          <span className="text-accent">vs Plan Gratis</span>
        </h2>
        <p className="text-sm text-text-muted mb-6">Ciencia de datos para acelerar tu bienestar.</p>

        <div className="space-y-3 mb-8">
            <div className="grid grid-cols-4 text-xs font-bold text-text-muted uppercase tracking-wider mb-2 border-b border-white/5 pb-2">
                <div className="col-span-2">Característica</div>
                <div className="text-center">Gratis</div>
                <div className="text-center text-accent">Plus</div>
            </div>
            
            {[
                { label: 'Contenido', free: 'Limitado', plus: 'Ilimitado' },
                { label: 'Herramientas', free: 'Básicas', plus: 'Binaurales' },
                { label: 'Cursos TCC', free: '-', plus: 'Completos' },
                { label: 'Offline', free: '-', plus: 'Sí' },
            ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 text-sm items-center py-2 border-b border-white/5 last:border-0">
                    <div className="col-span-2 text-white font-medium">{row.label}</div>
                    <div className="text-center text-text-muted text-xs">{row.free === '-' ? <X size={14} className="mx-auto opacity-50"/> : row.free}</div>
                    <div className="text-center text-accent font-bold text-xs">{row.plus === 'Sí' ? <Check size={16} className="mx-auto"/> : row.plus}</div>
                </div>
            ))}
        </div>

        <button 
            onClick={handleUpgrade}
            className="w-full py-4 bg-gradient-to-r from-accent to-yellow-600 rounded-xl font-bold text-black text-lg shadow-lg hover:shadow-accent/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
            <Star className="fill-black" size={20}/>
            Comenzar Expansión
        </button>
        <p className="text-center text-[10px] text-text-muted mt-3">Cancela cuando quieras. 7 días de prueba gratis.</p>
      </div>
    </div>
  );
};

export default UpsellModal;