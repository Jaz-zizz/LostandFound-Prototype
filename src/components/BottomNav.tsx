import React from 'react';
import { Home, PlusCircle, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'report' | 'profile' | 'search';
  onSelectTab: (tab: 'home' | 'report' | 'profile') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const isHomeActive = currentTab === 'home' || currentTab === 'search';
  const isReportActive = currentTab === 'report';
  const isProfileActive = currentTab === 'profile';

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 max-w-[430px] mx-auto bg-white/95 backdrop-blur-md border-t border-zinc-200/90 px-3 py-1.5 flex items-center justify-around shadow-sm"
    >
      <button
        id="nav-tab-home"
        type="button"
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center py-0.5 px-3 rounded-lg transition-colors ${
          isHomeActive ? 'text-indigo-700 font-semibold' : 'text-zinc-500 hover:text-zinc-800'
        }`}
      >
        <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[11px] mt-0.5">หน้าแรก</span>
      </button>

      <button
        id="nav-tab-report"
        type="button"
        onClick={() => onSelectTab('report')}
        className={`flex flex-col items-center justify-center py-0.5 px-3 rounded-lg transition-colors ${
          isReportActive ? 'text-indigo-700 font-semibold' : 'text-zinc-500 hover:text-zinc-800'
        }`}
      >
        <PlusCircle className={`w-5 h-5 ${isReportActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[11px] mt-0.5">แจ้งของ</span>
      </button>

      <button
        id="nav-tab-profile"
        type="button"
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center justify-center py-0.5 px-3 rounded-lg transition-colors ${
          isProfileActive ? 'text-indigo-700 font-semibold' : 'text-zinc-500 hover:text-zinc-800'
        }`}
      >
        <User className={`w-5 h-5 ${isProfileActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[11px] mt-0.5">โปรไฟล์</span>
      </button>
    </nav>
  );
};
