import React from 'react';
import { Home, Flower2, Users, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Screen } from '../types';

const BottomNav: React.FC = () => {
  const { currentScreen, navigate } = useApp();

  const getIconColor = (isActive: boolean) => isActive ? 'text-primary' : 'text-text-muted';

  const navItems = [
    { screen: Screen.HOME, label: 'Inicio', icon: Home },
    { screen: Screen.LIBRARY, label: 'Meditar', icon: Flower2 },
    { screen: Screen.COMMUNITY, label: 'Comunidad', icon: Users },
    { screen: Screen.PROFILE, label: 'Perfil', icon: User },
  ];

  // Only show nav on main screens
  const showNav = [Screen.HOME, Screen.LIBRARY, Screen.COMMUNITY, Screen.PROFILE, Screen.ACADEMY].includes(currentScreen);

  if (!showNav) return null;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-lg border-t border-white/5 pb-6 pt-3 px-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen || (item.screen === Screen.LIBRARY && currentScreen === Screen.ACADEMY);
          return (
            <button 
              key={item.label}
              onClick={() => navigate(item.screen)}
              className="flex flex-col items-center gap-1 w-16 group"
            >
              <item.icon 
                className={`w-6 h-6 ${getIconColor(isActive)} transition-colors group-hover:text-primary-hover`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-text-muted'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;