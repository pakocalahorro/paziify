import React from 'react';

const BreathingOrb: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer Glow */}
      <div className="absolute w-full h-full bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      {/* Middle Ring */}
      <div className="absolute w-48 h-48 border border-primary/30 rounded-full animate-breathe animation-delay-1000"></div>
      
      {/* Core */}
      <div className="w-32 h-32 bg-gradient-to-br from-primary to-emerald-900 rounded-full shadow-[0_0_40px_rgba(74,103,65,0.4)] animate-breathe flex items-center justify-center z-10">
         <div className="w-full h-full rounded-full bg-white/5 backdrop-blur-sm"></div>
      </div>
    </div>
  );
};

export default BreathingOrb;