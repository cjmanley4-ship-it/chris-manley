import React from 'react';
import { WorkflowMode, WorkflowStep, AgentState, AgentId } from '../types';
import { 
  Play, 
  RotateCcw, 
  CheckCircle, 
  Settings2, 
  ArrowRight, 
  HelpCircle, 
  ShieldAlert, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Check,
  Edit3
} from 'lucide-react';

interface WorkflowControlsProps {
  mode: WorkflowMode;
  onModeChange: (mode: WorkflowMode) => void;
  currentStep: WorkflowStep;
  isProcessing: boolean;
  waitingForReview: boolean;
  onStartWorkflow: () => void;
  onApproveAndContinue: () => void;
  onResetWorkflow: () => void;
  managerQuestion: string;
  onQuestionChange: (q: string) => void;
  agents: Record<AgentId, AgentState>;
  onToggleAgentRun: (id: AgentId) => void;
  onOpenInspector: (id: AgentId) => void;
  isDark: boolean;
}

export const WorkflowControls: React.FC<WorkflowControlsProps> = ({
  mode,
  onModeChange,
  currentStep,
  isProcessing,
  waitingForReview,
  onStartWorkflow,
  onApproveAndContinue,
  onResetWorkflow,
  managerQuestion,
  onQuestionChange,
  agents,
  onToggleAgentRun,
  onOpenInspector,
  isDark,
}) => {
  const steps = [
    { num: 1, name: '1. Orchestration Plan', agent: 'Agent 4' },
    { num: 2, name: '2. Specialist Analysis', agent: 'Agents 1, 2, 3, 6' },
    { num: 3, name: '3. Executive Analytics', agent: 'Agent 5' },
    { num: 4, name: '4. Final Decision', agent: 'Agent 4' },
  ];

  const specialistIds: AgentId[] = ['agent1', 'agent2', 'agent3', 'agent6'];

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 md:p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Top Bar: Manager Question Input & Mode Selector */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-teal-500" />
              Manager's Core Inquiry
            </label>
            <div className="relative">
              <input
                type="text"
                value={managerQuestion}
                onChange={(e) => onQuestionChange(e.target.value)}
                disabled={isProcessing}
                placeholder="What should management fix first to improve patient experience, and which cases need human review?"
                className="w-full text-sm font-medium px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/70 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-inner"
              />
              {managerQuestion !== "What should management fix first to improve patient experience, and which cases need human review?" && (
                <button
                  onClick={() => onQuestionChange("What should management fix first to improve patient experience, and which cases need human review?")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                >
                  Reset Default
                </button>
              )}
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold px-2 text-slate-500 dark:text-slate-400">
              Run Mode:
            </span>
            <button
              onClick={() => onModeChange('auto')}
              disabled={isProcessing}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'auto'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Auto Run (Hands-free)
            </button>
            <button
              onClick={() => onModeChange('step_by_step')}
              disabled={isProcessing}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'step_by_step'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Step-by-Step Review
            </button>
          </div>
        </div>

        {/* Stepper Progression */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {steps.map((s) => {
            const isCurrent = currentStep === s.num;
            const isDone = currentStep > s.num;
            return (
              <div
                key={s.num}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-teal-500 dark:border-teal-400 bg-teal-500/10 shadow-md ring-1 ring-teal-500/30'
                    : isDone
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-70'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-teal-600 text-white animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {s.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {s.agent}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Step-by-Step Review Bar */}
      {waitingForReview && (
        <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 space-y-3 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400">
                <CheckCircle className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Step {currentStep} Complete &bull; Human Review Checkpoint
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                  Inspect the results generated below before approving transmission to downstream agents.
                </p>
              </div>
            </div>

            <button
              onClick={onApproveAndContinue}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Approve & Continue to Step {currentStep + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* After Step 1: User can turn specialists on/off and edit tasks */}
          {currentStep === 1 && (
            <div className="pt-2 border-t border-amber-200 dark:border-amber-900/60">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide block mb-2">
                Configure Stage 2 Specialists (Toggle On/Off or Edit Tasks):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {specialistIds.map((id) => {
                  const ag = agents[id];
                  return (
                    <div
                      key={id}
                      className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between gap-2 ${
                        ag.runEnabled
                          ? 'border-teal-300 dark:border-teal-700 bg-white/90 dark:bg-slate-900'
                          : 'border-slate-300 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{ag.name}</span>
                        <button
                          onClick={() => onToggleAgentRun(id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ag.runEnabled
                              ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {ag.runEnabled ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 italic">
                        "{ag.task || 'Default task'}"
                      </p>
                      <button
                        onClick={() => onOpenInspector(id)}
                        className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 self-start font-medium"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit Task
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {currentStep === 0 ? (
            <button
              onClick={onStartWorkflow}
              disabled={isProcessing}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Multi-Agent System</span>
            </button>
          ) : waitingForReview ? (
            <button
              onClick={onApproveAndContinue}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve & Continue Workflow</span>
            </button>
          ) : isProcessing ? (
            <div className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center gap-2 border border-blue-300 dark:border-blue-700 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
              <span>Multi-Agent System Processing Stage {currentStep}...</span>
            </div>
          ) : (
            <div className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center gap-2 border border-emerald-300 dark:border-emerald-700">
              <CheckCircle className="w-4 h-4" />
              <span>All 4 Stages Complete & Verified</span>
            </div>
          )}

          <button
            onClick={onResetWorkflow}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Workflow</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Click on any agent box at any time to inspect payloads, tasks, and raw JSON.</span>
        </div>
      </div>
    </div>
  );
};
