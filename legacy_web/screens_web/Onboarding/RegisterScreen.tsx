import React from 'react';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Screen } from '../../types';

const RegisterScreen: React.FC = () => {
  const { navigate, updateUserState } = useApp();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserState({ isRegistered: true });
    navigate(Screen.NOTIFICATION_SETTINGS);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 pt-12 max-w-md mx-auto relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] left-[-20%] w-96 h-96 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-20%] w-96 h-96 bg-accent/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Bienvenido a <br/><span className="text-primary">Paziify</span></h1>
        <p className="text-text-muted mb-10 text-lg">Tu santuario te espera.</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Nombre" 
              className="w-full bg-surface border border-transparent focus:border-primary/50 rounded-xl py-4 pl-12 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              className="w-full bg-surface border border-transparent focus:border-primary/50 rounded-xl py-4 pl-12 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="w-full bg-surface border border-transparent focus:border-primary/50 rounded-xl py-4 pl-12 text-white outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-lg py-4 rounded-xl shadow-lg mt-8 flex items-center justify-center gap-2 group transition-all active:scale-95"
          >
            Crear Cuenta
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
          </button>
        </form>
      </div>
      
      <p className="text-center text-sm text-text-muted mt-8">
        ¿Ya tienes cuenta? <span className="text-accent font-bold cursor-pointer hover:underline">Iniciar sesión</span>
      </p>
    </div>
  );
};

export default RegisterScreen;