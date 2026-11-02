import React from 'react';
import { 
  Activity, 
  Moon, 
  Sun, 
  FileSpreadsheet, 
  RefreshCw, 
  ShieldCheck, 
  Bot,
  Sparkles
} from 'lucide-react';
import { WorkflowStep } from '../types';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenDataModal: () => void;
  recordCount: number;
  distinctCount: number;
  currentStep: WorkflowStep;
  isProcessing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onOpenDataModal,
  recordCount,
  distinctCount,
  currentStep,
  isProcessing,
}) => {
  const getStepStatus = () => {
    if (isProcessing) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 animate-pulse">
          <RefreshCw className="w-3 h-3 animate-spin" />
          Stage {currentStep} Active
        </span>
      );
    }
    if (currentStep === 4) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
          <ShieldCheck className="w-3.5 h-3.5" />
          Intelligence Cycle Completed
        </span>
      );
    }
    if (currentStep > 0) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
          <Sparkles className="w-3 h-3" />
          Stage {currentStep} Awaiting Next Action
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        Ready for Orchestration
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 ring-2 ring-teal-500/30">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-slate-50">
                Hospital Patient Experience Intelligence System
              </h1>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                6-Agent Team
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Collaborative multi-agent architecture: Feedback &bull; Monitoring &bull; Triage &bull; Communication &bull; Executive Analytics
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Status Badge */}
          <div className="hidden lg:block">
            {getStepStatus()}
          </div>

          {/* Dataset button */}
          <button
            onClick={onOpenDataModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Dataset ({recordCount})</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 animate-in spin-in-90 duration-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
