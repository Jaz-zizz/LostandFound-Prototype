import React from 'react';
import { User, MapPin } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onOpenProfile: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onOpenProfile, onGoHome }) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-3 py-2 flex items-center justify-between"
    >
      <button
        id="btn-header-home"
        type="button"
        onClick={onGoHome}
        className="flex items-center gap-1.5 text-left active:opacity-75 transition-opacity"
      >
        <div className="w-7 h-7 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
          FI
        </div>
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1">
            <span className="font-bold text-base tracking-tight text-zinc-900">FindIt</span>
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded">
              มช.
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-normal flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5 text-zinc-400" />
            มหาวิทยาลัยเชียงใหม่
          </span>
        </div>
      </button>

      <button
        id="btn-header-profile"
        type="button"
        onClick={onOpenProfile}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          currentTab === 'profile'
            ? 'bg-indigo-700 text-white shadow-xs'
            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
        }`}
        aria-label="โปรไฟล์ผู้ใช้งาน"
      >
        <User className="w-4 h-4" />
      </button>
    </header>
  );
};
