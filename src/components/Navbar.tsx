import React from 'react';
import { SCHOOL_CREST_PATH, SCHOOL_NAME } from '../assets/crest';
import { LogOut, Sliders } from 'lucide-react';
import { Student } from '../types/student';

interface NavbarProps {
  currentTab: 'report' | 'broadsheet' | 'analytics' | 'files';
  setCurrentTab: (tab: 'report' | 'broadsheet' | 'analytics' | 'files') => void;
  loggedInStudent: Student | null;
  isAdmin: boolean;
  onLogout: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  loggedInStudent,
  isAdmin,
  onLogout,
  onOpenSettings
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
            <img
              src={SCHOOL_CREST_PATH}
              alt="SBS Crest"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback styled monogram if image cannot load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="leading-tight">
            <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-heading">
              {SCHOOL_NAME}
            </span>
            <div className="text-[11px] text-slate-500 whitespace-nowrap">
              Midterm Assessment Portal · 2026
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {loggedInStudent && (
            <button
              onClick={() => setCurrentTab('report')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                currentTab === 'report' ? 'border-sky-600 text-slate-900 font-semibold' : 'border-transparent text-slate-600'
              }`}
            >
              My Report Sheet
            </button>
          )}

          <button
            onClick={() => setCurrentTab('broadsheet')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              currentTab === 'broadsheet' ? 'border-sky-600 text-slate-900 font-semibold' : 'border-transparent text-slate-600'
            }`}
          >
            Class Broadsheet
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              currentTab === 'analytics' ? 'border-sky-600 text-slate-900 font-semibold' : 'border-transparent text-slate-600'
            }`}
          >
            Performance Analytics
          </button>

          <button
            onClick={() => setCurrentTab('files')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              currentTab === 'files' ? 'border-sky-600 text-slate-900 font-semibold' : 'border-transparent text-slate-600'
            }`}
          >
            Migration & Score Files
          </button>
        </nav>

        {/* Zone 3: Primary Action & User indicator */}
        <div className="flex items-center gap-3 shrink-0">
          {isAdmin && (
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Portal Settings"
              aria-label="Portal Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex flex-col text-right text-xs">
            <span className="font-semibold text-slate-800 truncate max-w-[150px]">
              {loggedInStudent ? loggedInStudent.fullName : isAdmin ? 'Administrator' : 'Guest'}
            </span>
            <span className="text-slate-500 text-[10px]">
              {loggedInStudent ? `${loggedInStudent.gradeLevel} · ${loggedInStudent.registrationNo}` : isAdmin ? 'Staff Access' : 'First Term 2026'}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
