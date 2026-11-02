import React, { useState } from 'react';
import { 
  CalculatedKPIs, 
  Agent1Result, 
  Agent2Result, 
  Agent3Result, 
  Agent4FinalResult, 
  Agent5Result, 
  Agent6Result,
  DistinctComment
} from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  ShieldAlert, 
  MessageSquare, 
  Award, 
  Building2, 
  Sparkles, 
  Clock, 
  Send, 
  Copy, 
  Check, 
  FileText, 
  Search,
  ExternalLink,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';

interface ExecutiveDashboardProps {
  kpis: CalculatedKPIs;
  agent4Final: Agent4FinalResult | null;
  agent1Result: Agent1Result | null;
  agent2Result: Agent2Result | null;
  agent3Result: Agent3Result | null;
  agent5Result: Agent5Result | null;
  agent6Result: Agent6Result | null;
  distinctComments: DistinctComment[];
  isDark: boolean;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  kpis,
  agent4Final,
  agent1Result,
  agent2Result,
  agent3Result,
  agent5Result,
  agent6Result,
  distinctComments,
  isDark,
}) => {
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [reviewSearch, setReviewSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'human_review' | 'analytics' | 'communication'>('overview');

  const copyPatientMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  // Find cases requiring human review from Agent 3 or dataset
  const humanReviewComplaints = (agent3Result?.complaints || []).filter(c => c.human_review_required || c.severity_level >= 3);

  // Fallback to distinct comments with flags if agent 3 hasn't run yet
  const displayReviewCases = humanReviewComplaints.length > 0 
    ? humanReviewComplaints.map(c => {
        const commentObj = distinctComments.find(dc => dc.id === c.id);
        return {
          id: c.id,
          text: commentObj?.text || 'Patient feedback recorded',
          count: commentObj?.count || 1,
          severity: c.severity_level,
          reason: c.human_review_reason || c.severity_reasoning,
          routeTo: c.route_to || 'Risk Management',
          category: c.primary_category,
          risks: c.risks?.map(r => r.risk).join(', ') || 'Patient Safety / Equity Risk',
        };
      })
    : distinctComments
        .filter(c => Object.keys(c.riskFlags).some(f => f !== 'None'))
        .map(c => ({
          id: c.id,
          text: c.text,
          count: c.count,
          severity: 3,
          reason: `Flagged with ${Object.keys(c.riskFlags).filter(f => f !== 'None').join(', ')}`,
          routeTo: 'Nursing Leadership & Quality Team',
          category: 'Clinical Care / Safety',
          risks: 'Pending Agent 3 Triage',
        }));

  const filteredReviewCases = displayReviewCases.filter(c => 
    c.text.toLowerCase().includes(reviewSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(reviewSearch.toLowerCase()) ||
    c.routeTo.toLowerCase().includes(reviewSearch.toLowerCase())
  );

  // Compute theme distribution from Agent 1
  const themeCounts: Record<string, number> = {};
  if (agent1Result?.comments) {
    agent1Result.comments.forEach(c => {
      const theme = c.theme || 'General';
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });
  }

  // Compute severity counts from Agent 3
  const severityCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  if (agent3Result?.complaints) {
    agent3Result.complaints.forEach(c => {
      const lvl = c.severity_level || 1;
      severityCounts[lvl] = (severityCounts[lvl] || 0) + 1;
    });
  }

  return (
    <div className="w-full space-y-6">
      {/* 1. TOP ALERT: Agent 4 Top Management Alert */}
      {agent4Final?.top_alert ? (
        <div className="relative overflow-hidden rounded-2xl border-2 border-rose-500/40 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10 dark:from-rose-950/40 dark:via-amber-950/20 dark:to-indigo-950/30 p-5 md:p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase bg-rose-600 text-white shadow-sm flex items-center gap-1.5 animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {agent4Final.priority || 'HIGH'} PRIORITY ALERT
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800/70 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  Produced by Agent 4: Orchestrator
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                {agent4Final.top_alert}
              </h2>
              {agent4Final.priority_reason && (
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <strong>Managerial Rationale:</strong> {agent4Final.priority_reason}
                </p>
              )}
            </div>

            {agent4Final.answer && (
              <div className="md:max-w-md w-full p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700 shadow-sm text-xs space-y-1">
                <span className="font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block text-[10px]">
                  Direct Manager Answer
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {agent4Final.answer}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center bg-slate-50/50 dark:bg-slate-900/30">
          <Sparkles className="w-8 h-8 mx-auto text-teal-500 opacity-50 mb-2 animate-bounce" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Executive Intelligence System Ready
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto mt-1">
            Launch the workflow above to activate all 6 AI agents, synthesize insights, and render the comprehensive executive decision dashboard.
          </p>
        </div>
      )}

      {/* 2. KPI CARDS (Calculated in Pure JavaScript) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Satisfaction */}
        <div className="rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-gradient-to-br from-teal-500/5 to-teal-500/10 dark:from-teal-950/20 dark:to-teal-900/30 p-5 shadow-lg backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              Avg Patient Satisfaction
            </span>
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-50">
              {kpis.avgSatisfaction.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/ 5.00</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-teal-500/20">
            <span>Calculated from {kpis.totalRecords} records</span>
            <span className="text-teal-600 dark:text-teal-400 font-bold">In JavaScript</span>
          </div>
        </div>

        {/* KPI 2: Communication Rating */}
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-500/5 to-blue-500/10 dark:from-blue-950/20 dark:to-blue-900/30 p-5 shadow-lg backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
              Avg Communication
            </span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-50">
              {kpis.avgCommunication.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/ 5.00</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-blue-500/20">
            <span>Staff clarity & empathy score</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">In JavaScript</span>
          </div>
        </div>

        {/* KPI 3: Follow-up Compliance Rate */}
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-500/5 to-indigo-500/10 dark:from-indigo-950/20 dark:to-indigo-900/30 p-5 shadow-lg backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
              Follow-up Compliance
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-50">
              {kpis.followupComplianceRate}%
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">completed</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-indigo-500/20">
            <span>Portal Usage: {kpis.portalUsageRate}%</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">In JavaScript</span>
          </div>
        </div>

        {/* KPI 4: Human-Review Cases */}
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-gradient-to-br from-rose-500/5 to-rose-500/10 dark:from-rose-950/20 dark:to-rose-900/30 p-5 shadow-lg backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
              Cases Needing Human Review
            </span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
              {displayReviewCases.length}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">flagged records</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-rose-500/20">
            <span>Safety & equity checkpoints</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">Agent 3 Triage</span>
          </div>
        </div>
      </div>

      {/* 3. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Satisfaction by Service Line */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Satisfaction by Service Line
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              JS Aggregated
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {Object.entries(kpis.satisfactionByServiceLine).map(([serviceLine, data]) => {
              const percentage = Math.min(100, Math.max(10, (data.avg / 5) * 100));
              const isLow = data.avg < 3.0;
              const isHigh = data.avg >= 4.0;
              return (
                <div key={serviceLine} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {serviceLine}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {data.avg.toFixed(2)} / 5.0 ({data.count} pts)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isLow
                          ? 'bg-rose-500'
                          : isHigh
                          ? 'bg-emerald-500'
                          : 'bg-teal-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Main Comment Themes from Agent 1 */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Primary Feedback Themes
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              Agent 1 Feedback
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {Object.keys(themeCounts).length > 0 ? (
              Object.entries(themeCounts).map(([theme, count]) => {
                const total = Object.values(themeCounts).reduce((a, b) => a + b, 0);
                const percent = Math.round((count / total) * 100);
                return (
                  <div key={theme} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {theme}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {count} clusters ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                Execute Agent 1 to classify patient feedback themes.
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Severity Levels Breakdown from Agent 3 */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Complaint Severity Triage
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              Agent 3 Triage
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {[
              { lvl: 4, name: 'Level 4 – Critical (Immediate Safety/Legal)', color: 'bg-rose-600', text: 'text-rose-600' },
              { lvl: 3, name: 'Level 3 – High (Medication / Harm / Equity)', color: 'bg-orange-500', text: 'text-orange-500' },
              { lvl: 2, name: 'Level 2 – Moderate (Repeated Failures)', color: 'bg-amber-500', text: 'text-amber-500' },
              { lvl: 1, name: 'Level 1 – Low (Minor Inconvenience)', color: 'bg-emerald-500', text: 'text-emerald-500' },
            ].map(tier => {
              const count = severityCounts[tier.lvl] || 0;
              const total = Object.values(severityCounts).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={tier.lvl} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${tier.color}`} />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {tier.name}
                    </span>
                  </div>
                  <span className={`font-black ${tier.text}`}>
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. AGENT 6 REWRITTEN PATIENT MESSAGE (Compassionate Healthcare Communication) */}
      {agent6Result?.improved_patient_message && (
        <div className="rounded-2xl border-2 border-rose-300/80 dark:border-rose-900/60 bg-gradient-to-br from-rose-50/70 via-white to-pink-50/50 dark:from-rose-950/30 dark:via-slate-900 dark:to-pink-950/20 p-5 md:p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-rose-200 dark:border-rose-900/60">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Patient-Centered Communication Rewriter
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Targeted solution written by Agent 6 for the highest-risk communication breakdown (6th grade reading level).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Agent 6 Communication Quality
              </span>
              <button
                onClick={() => copyPatientMessage(agent6Result.improved_patient_message)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMessage ? 'Copied' : 'Copy Message'}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-rose-200 dark:border-rose-900/60 shadow-inner">
            <p className="text-sm md:text-base font-medium italic text-slate-900 dark:text-slate-100 leading-relaxed font-serif">
              "{agent6Result.improved_patient_message}"
            </p>
          </div>

          {agent6Result.executive_summary?.most_important_improvement && (
            <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <strong className="text-rose-600 dark:text-rose-400">Key Improvement Recommendation:</strong>
              <span>{agent6Result.executive_summary.most_important_improvement}</span>
            </div>
          )}
        </div>
      )}

      {/* 5. TABLE OF CASES THAT NEED HUMAN REVIEW */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 md:p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Cases Requiring Human Oversight & Clinical Triage
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Identified by Agent 3 & AI Risk Detection protocols for clinical harm, legal, or equity review.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              Produced by Agent 3: Complaint Triage
            </span>
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={reviewSearch}
                onChange={(e) => setReviewSearch(e.target.value)}
                placeholder="Search triage cases..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 uppercase font-bold text-[11px]">
              <tr>
                <th className="p-3">Case ID</th>
                <th className="p-3">Patient Feedback Description</th>
                <th className="p-3">Records</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Identified Risks</th>
                <th className="p-3">Route To</th>
                <th className="p-3">Action Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredReviewCases.length > 0 ? (
                filteredReviewCases.map((c, i) => (
                  <tr 
                    key={c.id || i}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3 font-mono font-bold text-teal-600 dark:text-teal-400 whitespace-nowrap">
                      {c.id}
                    </td>
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200 max-w-sm">
                      {c.text}
                    </td>
                    <td className="p-3 font-bold whitespace-nowrap">
                      {c.count} pts
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        c.severity >= 3
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      }`}>
                        Level {c.severity}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs">
                      {c.risks}
                    </td>
                    <td className="p-3 font-bold text-teal-700 dark:text-teal-400 whitespace-nowrap">
                      {c.routeTo}
                    </td>
                    <td className="p-3 text-slate-500 dark:text-slate-400 text-[11px]">
                      {c.reason}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">
                    No matching human review cases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. AGENT 5 EXECUTIVE ANALYTICS TABS (Top Priorities, Quick Wins, Long-Term AI Opportunities) */}
      {agent5Result && (
        <div className="rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-br from-purple-500/5 to-purple-500/10 dark:from-purple-950/20 dark:to-purple-900/30 p-5 md:p-6 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-purple-200 dark:border-purple-900/60">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  C-Suite Executive Analytics & AI Risk Monitoring
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Multi-agent synthesis generated by Agent 5 for senior leadership and hospital executives.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              Produced by Agent 5: Healthcare Analytics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Column 1: Top 5 Priorities */}
            <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block">
                Top Organizational Priorities
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {agent5Result.top_priorities?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Quick Wins */}
            <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                Quick Wins (Within 3 Months)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {agent5Result.quick_wins?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Long-term AI Opportunities */}
            <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 block">
                Long-Term AI Opportunities (6-12 Mo)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {agent5Result.long_term_ai_opportunities?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 7. BOTTOM: AGENT 4 MANAGEMENT RECOMMENDATIONS */}
      <div className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/60 to-white dark:from-indigo-950/20 dark:to-slate-900 p-5 md:p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-indigo-200 dark:border-indigo-900/60">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Actionable Hospital Manager Recommendations
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Specific managerial interventions formulated by the Orchestrator with assigned owners and execution timeframes.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            Produced by Agent 4: Decision Support
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {agent4Final?.recommended_actions?.map((rec, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-indigo-100 dark:border-indigo-900/80 shadow-md flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                    {rec.timeframe}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {rec.action}
                </h4>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Accountable Owner:</span>
                <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{rec.owner}</strong>
              </div>
            </div>
          )) || (
            <div className="col-span-3 text-center py-6 text-xs text-slate-400">
              Run the workflow to generate Agent 4's official management recommendations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
