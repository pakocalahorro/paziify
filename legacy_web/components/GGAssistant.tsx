import React from 'react';
import { Bot } from 'lucide-react';

interface GGAssistantProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'default' | 'night' | 'recovery';
}

const GGAssistant: React.FC<GGAssistantProps> = ({ title, message, actionLabel, onAction, type = 'default' }) => {
  const bgClass = type === 'night' 
    ? 'bg-indigo-900/20 border-indigo-500/20' 
    : type === 'recovery' 
      ? 'bg-orange-900/10 border-orange-500/20'
      : 'bg-surface border-white/5';

  const iconBgClass = type === 'night' ? 'bg-indigo-500' : type === 'recovery' ? 'bg-orange-500' : 'bg-primary';

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border shadow-lg ${bgClass} mb-6`}>
      <div className="flex items-start gap-4 relative z-10">
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${iconBgClass} shrink-0`}>
           <Bot className="text-white w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">{title}</p>
          <p className="text-sm font-medium leading-relaxed text-text-main/90 mb-3">{message}</p>
          {actionLabel && (
            <button 
              onClick={onAction}
              className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              {actionLabel} →
            </button>
          )}
        </div>
      </div>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
    </div>
  );
};

export default GGAssistant;