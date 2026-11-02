import React from 'react';
import { AgentState, AgentId, WorkflowStep } from '../types';
import { 
  Bot, 
  Activity, 
  MessageSquare, 
  LineChart, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MinusCircle,
  Eye,
  RefreshCw,
  Zap
} from 'lucide-react';

interface AgentDiagramProps {
  agents: Record<AgentId, AgentState>;
  currentStep: WorkflowStep;
  activeFlows: {
    fromAgent4ToSpecialists: boolean;
    fromSpecialistsToAgent5: boolean;
    fromAgent5ToAgent4Final: boolean;
  };
  onSelectAgent: (id: AgentId) => void;
  onRetryAgent?: (id: AgentId) => void;
  isDark: boolean;
}

export const AgentDiagram: React.FC<AgentDiagramProps> = ({
  agents,
  currentStep,
  activeFlows,
  onSelectAgent,
  onRetryAgent,
  isDark,
}) => {
  const agentConfigs: Record<AgentId, {
    title: string;
    sub: string;
    icon: any;
    color: string;
    borderAccent: string;
    bgAccent: string;
    glowColor: string;
  }> = {
    agent4_plan: {
      title: 'Agent 4: Orchestrator (Planning)',
      sub: 'Plans workflow & assigns specialist tasks',
      icon: Sparkles,
      color: 'text-indigo-500 dark:text-indigo-400',
      borderAccent: 'border-indigo-500/40 hover:border-indigo-500',
      bgAccent: 'bg-indigo-50/50 dark:bg-indigo-950/20',
      glowColor: 'rgba(99, 102, 241, 0.4)',
    },
    agent1: {
      title: 'Agent 1: Feedback Insight',
      sub: 'Comment themes, sentiments & operational risks',
      icon: MessageSquare,
      color: 'text-teal-600 dark:text-teal-400',
      borderAccent: 'border-teal-500/40 hover:border-teal-500',
      bgAccent: 'bg-teal-50/50 dark:bg-teal-950/20',
      glowColor: 'rgba(20, 184, 166, 0.4)',
    },
    agent2: {
      title: 'Agent 2: Experience Monitoring',
      sub: 'Demographic trends, equity disparities & risk',
      icon: LineChart,
      color: 'text-cyan-600 dark:text-cyan-400',
      borderAccent: 'border-cyan-500/40 hover:border-cyan-500',
      bgAccent: 'bg-cyan-50/50 dark:bg-cyan-950/20',
      glowColor: 'rgba(6, 182, 212, 0.4)',
    },
    agent3: {
      title: 'Agent 3: Complaint Triage',
      sub: 'Severity L1-L4, safety triage & escalation routes',
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      borderAccent: 'border-amber-500/40 hover:border-amber-500',
      bgAccent: 'bg-amber-50/50 dark:bg-amber-950/20',
      glowColor: 'rgba(245, 158, 11, 0.4)',
    },
    agent6: {
      title: 'Agent 6: Communication Quality',
      sub: 'Clarity/Empathy evaluation & rewritten messages',
      icon: Activity,
      color: 'text-rose-600 dark:text-rose-400',
      borderAccent: 'border-rose-500/40 hover:border-rose-500',
      bgAccent: 'bg-rose-50/50 dark:bg-rose-950/20',
      glowColor: 'rgba(244, 63, 94, 0.4)',
    },
    agent5: {
      title: 'Agent 5: Healthcare Analytics',
      sub: 'Executive synthesis, hidden problems & AI risk',
      icon: LineChart,
      color: 'text-purple-600 dark:text-purple-400',
      borderAccent: 'border-purple-500/40 hover:border-purple-500',
      bgAccent: 'bg-purple-50/50 dark:bg-purple-950/20',
      glowColor: 'rgba(168, 85, 247, 0.4)',
    },
    agent4_final: {
      title: 'Agent 4: Decision Support (Final)',
      sub: 'Top management alert & executive action items',
      icon: Bot,
      color: 'text-blue-600 dark:text-blue-400',
      borderAccent: 'border-blue-500/40 hover:border-blue-500',
      bgAccent: 'bg-blue-50/50 dark:bg-blue-950/20',
      glowColor: 'rgba(59, 130, 246, 0.4)',
    },
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Running
          </span>
        );
      case 'waiting_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-sm shadow-amber-500/20">
            <Clock className="w-3 h-3 animate-bounce" />
            Needs Review
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
            <MinusCircle className="w-3 h-3" />
            Skipped
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
            <AlertCircle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  const renderAgentCard = (id: AgentId, orderLabel: string) => {
    const agent = agents[id];
    const cfg = agentConfigs[id];
    const Icon = cfg.icon;
    const isRunning = agent.status === 'running';
    const isCompleted = agent.status === 'completed';
    const isFailed = agent.status === 'failed';
    const isWaitingReview = agent.status === 'waiting_review';

    return (
      <div
        key={id}
        onClick={() => onSelectAgent(id)}
        className={`group relative rounded-xl transition-all duration-300 cursor-pointer p-4 border backdrop-blur-sm shadow-md select-none ${
          isDark ? 'bg-slate-900/90' : 'bg-white/95'
        } ${cfg.borderAccent} ${
          isRunning
            ? 'ring-2 ring-blue-500/80 shadow-lg shadow-blue-500/20 scale-[1.02]'
            : isWaitingReview
            ? 'ring-2 ring-amber-500/80 shadow-lg shadow-amber-500/20'
            : isCompleted
            ? 'border-emerald-500/50 shadow-emerald-500/5 hover:shadow-lg'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        {/* Dynamic Running / Processing Energy Aura */}
        {isRunning && (
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-teal-500 via-indigo-500 to-cyan-500 opacity-60 blur-xs animate-pulse -z-10" />
        )}

        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${cfg.bgAccent} ${cfg.color} border border-current/20 shadow-inner`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {orderLabel}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {agent.name}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                {cfg.sub}
              </p>
            </div>
          </div>
          {getStatusBadge(agent.status)}
        </div>

        {/* Task Preview */}
        <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2.5 mb-3 border border-slate-100 dark:border-slate-800/80 font-mono">
          <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider block mb-0.5">
            Current Task
          </span>
          <p className="line-clamp-2 italic font-sans text-slate-700 dark:text-slate-300">
            "{agent.task || 'Awaiting orchestration task assignment...'}"
          </p>
        </div>

        {/* Footer actions inside card */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            <Eye className="w-3.5 h-3.5" />
            Click to view payload & JSON
          </span>

          {isFailed && onRetryAgent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRetryAgent(id);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/40 hover:bg-rose-200 rounded-md transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}

          {isCompleted && (
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Ready
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-5 md:p-6 shadow-xl backdrop-blur-md overflow-hidden">
      {/* Background glowing telemetry grid effect */}
      <div className="absolute inset-0 bg-radial-grid opacity-15 pointer-events-none -z-10" />

      {/* Header of diagram */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Multi-Agent Orchestration Flow Architecture
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Live interactive telemetry showing data pipelines and autonomous handoffs across all 6 specialized agents.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span> 1. Planning
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span> 2. Specialists Parallel
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> 3. Executive Analytics
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> 4. Final Decision
          </span>
        </div>
      </div>

      {/* Multi-Agent Architecture Hierarchy */}
      <div className="relative space-y-8">
        {/* LEVEL 1: Agent 4 Orchestrator (Planning) */}
        <div className="max-w-xl mx-auto relative z-10">
          <div className="text-center mb-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Stage 1 &bull; Orchestrator Planning
            </span>
          </div>
          {renderAgentCard('agent4_plan', '1')}
        </div>

        {/* FLOW ARROW INDICATOR 1: Top to Middle */}
        <div className="relative flex justify-center py-1">
          <div className="w-full max-w-3xl flex items-center justify-center relative">
            <div
              className={`h-9 w-full flex items-center justify-center transition-all duration-500 ${
                activeFlows.fromAgent4ToSpecialists
                  ? 'text-teal-500 dark:text-teal-400 font-semibold'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <div className="w-full flex items-center justify-center relative">
                {/* Horizontal branch line */}
                <div
                  className={`absolute top-0 w-3/4 h-1 rounded-full transition-all duration-500 ${
                    activeFlows.fromAgent4ToSpecialists
                      ? 'bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500 shadow-md shadow-teal-500/50'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
                
                {/* Center Badge */}
                <div
                  className={`relative z-10 px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 border transition-all duration-300 shadow-sm ${
                    activeFlows.fromAgent4ToSpecialists
                      ? 'bg-teal-500 text-white border-teal-400 shadow-teal-500/40 animate-pulse'
                      : isDark
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  <Zap className={`w-3 h-3 ${activeFlows.fromAgent4ToSpecialists ? 'animate-bounce' : ''}`} />
                  <span>Agent 4 delegates tasks & datasets</span>
                  <span className="text-xs">&darr;</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEVEL 2: Middle 4 Specialist Agents (Parallel) */}
        <div className="relative z-10">
          <div className="text-center mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Stage 2 &bull; Parallel Specialist Team Execution
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderAgentCard('agent1', '2a')}
            {renderAgentCard('agent2', '2b')}
            {renderAgentCard('agent3', '2c')}
            {renderAgentCard('agent6', '2d')}
          </div>
        </div>

        {/* FLOW ARROW INDICATOR 2: Middle to Bottom */}
        <div className="relative flex justify-center py-1">
          <div className="w-full max-w-3xl flex items-center justify-center relative">
            <div
              className={`h-9 w-full flex items-center justify-center transition-all duration-500 ${
                activeFlows.fromSpecialistsToAgent5
                  ? 'text-purple-500 dark:text-purple-400 font-semibold'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <div className="w-full flex items-center justify-center relative">
                {/* Horizontal branch line */}
                <div
                  className={`absolute top-0 w-3/4 h-1 rounded-full transition-all duration-500 ${
                    activeFlows.fromSpecialistsToAgent5
                      ? 'bg-gradient-to-r from-teal-400 via-purple-500 to-indigo-500 shadow-md shadow-purple-500/50'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
                
                {/* Center Badge */}
                <div
                  className={`relative z-10 px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 border transition-all duration-300 shadow-sm ${
                    activeFlows.fromSpecialistsToAgent5
                      ? 'bg-purple-600 text-white border-purple-400 shadow-purple-500/40 animate-pulse'
                      : isDark
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  <Zap className={`w-3 h-3 ${activeFlows.fromSpecialistsToAgent5 ? 'animate-bounce' : ''}`} />
                  <span>Aggregated Specialist JSON transmitted</span>
                  <span className="text-xs">&darr;</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEVEL 3: Agent 5 Healthcare Analytics Agent */}
        <div className="max-w-xl mx-auto relative z-10">
          <div className="text-center mb-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Stage 3 &bull; Executive Analytics Synthesis
            </span>
          </div>
          {renderAgentCard('agent5', '3')}
        </div>

        {/* FLOW ARROW INDICATOR 3: Loop from Agent 5 to Agent 4 (Final Decision) */}
        <div className="relative flex justify-center py-1">
          <div className="w-full max-w-3xl flex items-center justify-center relative">
            <div
              className={`h-9 w-full flex items-center justify-center transition-all duration-500 ${
                activeFlows.fromAgent5ToAgent4Final
                  ? 'text-blue-500 dark:text-blue-400 font-semibold'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <div className="w-full flex items-center justify-center relative">
                {/* Looping feedback highlight line */}
                <div
                  className={`absolute top-0 w-3/4 h-1 rounded-full transition-all duration-500 ${
                    activeFlows.fromAgent5ToAgent4Final
                      ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400 shadow-md shadow-blue-500/50'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
                
                {/* Center Badge */}
                <div
                  className={`relative z-10 px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 border transition-all duration-300 shadow-sm ${
                    activeFlows.fromAgent5ToAgent4Final
                      ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/40 animate-pulse'
                      : isDark
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  <Zap className={`w-3 h-3 ${activeFlows.fromAgent5ToAgent4Final ? 'animate-bounce' : ''}`} />
                  <span>Synthesized Insights return to Orchestrator for Final Decisions</span>
                  <span className="text-xs">&darr;</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEVEL 4: Agent 4 Final Decision */}
        <div className="max-w-xl mx-auto relative z-10">
          <div className="text-center mb-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Stage 4 &bull; Final Hospital Management Decision
            </span>
          </div>
          {renderAgentCard('agent4_final', '4')}
        </div>
      </div>
    </div>
  );
};
