import React, { useState } from 'react';
import { AgentState, AgentId } from '../types';
import { 
  X, 
  Copy, 
  Check, 
  Code, 
  FileText, 
  RefreshCw, 
  Database, 
  Bot, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AgentInspectorModalProps {
  agent: AgentState | null;
  onClose: () => void;
  onRetryAgent?: (id: AgentId) => void;
  onUpdateTask?: (id: AgentId, newTask: string) => void;
  canEditTask?: boolean;
  isDark: boolean;
}

export const AgentInspectorModal: React.FC<AgentInspectorModalProps> = ({
  agent,
  onClose,
  onRetryAgent,
  onUpdateTask,
  canEditTask = false,
  isDark,
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'json' | 'input'>('card');
  const [copied, setCopied] = useState(false);
  const [taskDraft, setTaskDraft] = useState('');
  const [isEditingTask, setIsEditingTask] = useState(false);

  React.useEffect(() => {
    if (agent) {
      setTaskDraft(agent.task);
      setIsEditingTask(false);
    }
  }, [agent]);

  if (!agent) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonString = agent.result ? JSON.stringify(agent.result, null, 2) : 'No result generated yet.';
  const inputString = agent.inputPayload ? JSON.stringify(agent.inputPayload, null, 2) : 'No input payload recorded.';

  const handleSaveTask = () => {
    if (onUpdateTask) {
      onUpdateTask(agent.id, taskDraft);
      setIsEditingTask(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">
                  {agent.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {agent.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {agent.shortRole}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRetryAgent && agent.status !== 'running' && (
              <button
                onClick={() => onRetryAgent(agent.id)}
                className="px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/80 hover:bg-teal-200 dark:hover:bg-teal-900/60 rounded-lg flex items-center gap-1.5 transition-colors border border-teal-200 dark:border-teal-800"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Re-run Agent
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Task Bar */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/60 flex items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
              Assigned Task
            </span>
            {isEditingTask ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={taskDraft}
                  onChange={(e) => setTaskDraft(e.target.value)}
                  className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-teal-500 dark:border-teal-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
                <button
                  onClick={handleSaveTask}
                  className="px-3 py-1.5 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingTask(false)}
                  className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 italic">
                "{agent.task || 'No task specifically assigned yet.'}"
              </p>
            )}
          </div>
          {canEditTask && !isEditingTask && (
            <button
              onClick={() => setIsEditingTask(true)}
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold"
            >
              Edit Task
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('card')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'card'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Easy-to-Read Card
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'json'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Raw JSON Output
            </button>
            <button
              onClick={() => setActiveTab('input')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'input'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Received Input Payload
            </button>
          </div>

          <div className="pb-2">
            <button
              onClick={() => copyToClipboard(activeTab === 'input' ? inputString : jsonString)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'card' && (
            <div className="space-y-4">
              {!agent.result ? (
                <div className="text-center py-12 text-slate-400">
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-30 animate-pulse" />
                  <p className="text-sm font-medium">No results generated yet.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Execute the workflow to view structured insights from this agent.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Agent 4 Planning */}
                  {agent.id === 'agent4_plan' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block mb-1">
                          Manager Need Restatement (Goal)
                        </span>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {agent.result.goal || 'Goal defined'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Specialist Task Assignments
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {agent.result.agents?.map((ag: any, idx: number) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border text-xs ${
                                ag.run
                                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-900 dark:text-slate-100">
                                  {ag.agent}
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    ag.run
                                      ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  {ag.run ? 'To Run' : 'Skipped'}
                                </span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 mb-1">
                                <strong>Task:</strong> {ag.task}
                              </p>
                              {ag.reason && (
                                <p className="text-slate-500 dark:text-slate-400 italic">
                                  <strong>Reason:</strong> {ag.reason}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Agent 1 Feedback Insight */}
                  {agent.id === 'agent1' && (
                    <div className="space-y-4">
                      {agent.result.summary && (
                        <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200">
                          <strong>Feedback Summary:</strong> {agent.result.summary}
                        </div>
                      )}
                      <div className="space-y-3">
                        {agent.result.comments?.map((c: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs space-y-2"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                              <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                                Comment #{c.id}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full font-bold bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
                                  {c.theme}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full font-bold ${
                                    c.sentiment === 'Positive'
                                      ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                                      : c.sentiment === 'Negative'
                                      ? 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
                                      : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                                  }`}
                                >
                                  {c.sentiment}
                                </span>
                              </div>
                            </div>
                            <p><strong>Reasoning:</strong> {c.reasoning}</p>
                            <p><strong>Operational Issue:</strong> {c.operational_issue}</p>
                            {c.risk_or_bias_concern && (
                              <p className="text-amber-700 dark:text-amber-400 font-medium">
                                <strong>Risk / Bias:</strong> {c.risk_or_bias_concern}
                              </p>
                            )}
                            <p className="text-teal-700 dark:text-teal-300">
                              <strong>Recommended Action:</strong> {c.recommended_action}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Agent 2 Experience Monitoring */}
                  {agent.id === 'agent2' && (
                    <div className="space-y-4 text-xs">
                      {agent.result.recommendation && (
                        <div className="p-3.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800">
                          <span className="font-bold text-cyan-800 dark:text-cyan-300 uppercase block mb-1">
                            Managerial Recommendation
                          </span>
                          <p className="text-slate-800 dark:text-slate-200 font-medium">
                            {agent.result.recommendation}
                          </p>
                        </div>
                      )}

                      <div>
                        <span className="font-bold text-slate-500 uppercase block mb-2">Identified Patterns</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {agent.result.patterns?.map((p: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                              <p className="font-bold text-slate-900 dark:text-slate-100">{p.pattern}</p>
                              <p className="text-slate-500 dark:text-slate-400 mt-1">{p.evidence}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-500 uppercase block mb-2">Equity & Accessibility Concerns</span>
                        <div className="space-y-2">
                          {agent.result.equity_concerns?.map((ec: any, idx: number) => (
                            <div key={idx} className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
                              <span className="font-bold text-amber-800 dark:text-amber-300">{ec.group}: </span>
                              <span className="text-slate-800 dark:text-slate-200">{ec.concern}</span>
                              <span className="text-slate-500 dark:text-slate-400 block text-[11px] mt-0.5">Evidence: {ec.evidence}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {agent.result.risk && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
                          {Object.entries(agent.result.risk).map(([k, v]: any) => (
                            <div key={k} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-center">
                              <span className="text-[10px] uppercase text-slate-500 block">{k.replace('_', ' ')}</span>
                              <span className={`font-bold ${v === 'High' ? 'text-rose-600' : v === 'Moderate' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {v}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Agent 3 Complaint Triage */}
                  {agent.id === 'agent3' && (
                    <div className="space-y-4 text-xs">
                      {agent.result.summary && (
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                          <strong>Triage Summary:</strong> {agent.result.summary}
                        </div>
                      )}

                      <div className="space-y-3">
                        {agent.result.complaints?.map((c: any, idx: number) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border text-xs space-y-2 ${
                              c.human_review_required
                                ? 'border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold">Complaint #{c.id}</span>
                                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 font-bold">
                                  {c.primary_category}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full font-bold ${
                                  c.severity_level >= 3 ? 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200' : 'bg-slate-200 dark:bg-slate-700'
                                }`}>
                                  Level {c.severity_level}
                                </span>
                                {c.human_review_required && (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold animate-pulse">
                                    Human Review Required
                                  </span>
                                )}
                              </div>
                            </div>
                            <p><strong>Route To:</strong> <span className="font-bold text-teal-600 dark:text-teal-400">{c.route_to}</span></p>
                            <p><strong>Severity Reasoning:</strong> {c.severity_reasoning}</p>
                            {c.human_review_required && (
                              <p className="text-rose-700 dark:text-rose-300 font-semibold">
                                <strong>Human Review Reason:</strong> {c.human_review_reason}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Agent 6 Communication Quality */}
                  {agent.id === 'agent6' && (
                    <div className="space-y-4 text-xs">
                      {agent.result.improved_patient_message && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/30 border border-rose-300 dark:border-rose-800 shadow-sm">
                          <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider block mb-1">
                            Rewritten Compassionate Patient Message (6th Grade Reading Level)
                          </span>
                          <p className="text-sm italic font-serif text-slate-800 dark:text-slate-100">
                            "{agent.result.improved_patient_message}"
                          </p>
                        </div>
                      )}

                      {agent.result.executive_summary && (
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <span className="font-bold text-slate-500 uppercase block text-[10px]">Overall Quality</span>
                            <p className="text-slate-800 dark:text-slate-200">{agent.result.executive_summary.overall_quality}</p>
                          </div>
                          <div>
                            <span className="font-bold text-slate-500 uppercase block text-[10px]">Highest Risk</span>
                            <p className="text-rose-600 dark:text-rose-400 font-bold">{agent.result.executive_summary.highest_risk}</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        {agent.result.evaluations?.map((ev: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                            <div className="flex items-center justify-between font-bold">
                              <span>Evaluation #{ev.id} &bull; {ev.purpose}</span>
                              <span className="text-rose-600 dark:text-rose-400">Risk: {ev.risk}</span>
                            </div>
                            <div className="grid grid-cols-5 gap-1 py-1 text-center font-mono text-[11px] bg-slate-100 dark:bg-slate-800 rounded">
                              <div>Clarity: {ev.scores?.clarity}</div>
                              <div>Complete: {ev.scores?.completeness}</div>
                              <div>Empathy: {ev.scores?.empathy}</div>
                              <div>Patient-Cent: {ev.scores?.patient_centeredness}</div>
                              <div>Actionable: {ev.scores?.actionability}</div>
                            </div>
                            <p className="text-slate-500 text-[11px]">{ev.purpose_rationale}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Agent 5 Analytics */}
                  {agent.id === 'agent5' && (
                    <div className="space-y-4 text-xs">
                      {agent.result.headline && (
                        <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase block mb-1">
                            Executive Overview Headline
                          </span>
                          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                            {agent.result.headline}
                          </h4>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                          <span className="font-bold text-purple-600 dark:text-purple-400 uppercase block mb-2">
                            Top 5 Organizational Priorities
                          </span>
                          <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300">
                            {agent.result.top_priorities?.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                          <span className="font-bold text-teal-600 dark:text-teal-400 uppercase block mb-2">
                            Quick Wins (Within 3 Months)
                          </span>
                          <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300">
                            {agent.result.quick_wins?.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {agent.result.hidden_problems && agent.result.hidden_problems.length > 0 && (
                        <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
                          <span className="font-bold text-amber-800 dark:text-amber-300 uppercase block mb-2">
                            Hidden Organizational Bottlenecks
                          </span>
                          <div className="space-y-2">
                            {agent.result.hidden_problems.map((hp: any, i: number) => (
                              <div key={i} className="text-slate-800 dark:text-slate-200">
                                <strong>&bull; {hp.problem}:</strong> {hp.evidence}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Agent 4 Final Decision */}
                  {agent.id === 'agent4_final' && (
                    <div className="space-y-4 text-xs">
                      {agent.result.top_alert && (
                        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded font-bold uppercase text-[10px] bg-rose-600 text-white">
                              Priority: {agent.result.priority || 'High'}
                            </span>
                            <span className="font-bold text-rose-800 dark:text-rose-300">
                              Top Management Alert
                            </span>
                          </div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {agent.result.top_alert}
                          </p>
                          <p className="text-slate-600 dark:text-slate-400 mt-1 italic">
                            Reason: {agent.result.priority_reason}
                          </p>
                        </div>
                      )}

                      <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                        <span className="font-bold text-blue-700 dark:text-blue-300 uppercase block mb-1">
                          Manager's Question Answer
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                          {agent.result.answer}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-500 uppercase block mb-2">
                          Recommended Management Actions
                        </span>
                        <div className="space-y-2">
                          {agent.result.recommended_actions?.map((act: any, i: number) => (
                            <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4">
                              <div>
                                <p className="font-bold text-slate-900 dark:text-slate-100">{act.action}</p>
                                <p className="text-slate-500 text-[11px] mt-0.5">Assigned Owner: <strong>{act.owner}</strong></p>
                              </div>
                              <span className="px-2 py-1 rounded bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-bold whitespace-nowrap text-[11px]">
                                {act.timeframe}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'json' && (
            <pre className="text-xs font-mono p-4 rounded-xl bg-slate-950 text-emerald-400 overflow-x-auto leading-relaxed border border-slate-800">
              {jsonString}
            </pre>
          )}

          {activeTab === 'input' && (
            <pre className="text-xs font-mono p-4 rounded-xl bg-slate-950 text-cyan-300 overflow-x-auto leading-relaxed border border-slate-800">
              {inputString}
            </pre>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <span className="text-xs text-slate-500">
            Agent Output Status: <strong>{agent.status}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
