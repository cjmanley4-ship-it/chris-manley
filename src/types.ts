export interface PatientRecord {
  id: string;
  Patient_ID: string;
  Patient_Persona: string;
  Age_Group: string;
  Visit_Type: string;
  Service_Line: string;
  Year: number;
  Patient_Satisfaction: number;
  Communication_Rating: number;
  Followup_Compliance: number; // 0 or 1
  Portal_Usage: number; // 0 or 1
  Readmission_Risk: 'Low' | 'Moderate' | 'High';
  AI_Risk_Flag: string;
  Comment: string;
  selected?: boolean;
}

export interface DistinctComment {
  id: string;
  text: string;
  count: number;
  recordIds: string[];
  avgSatisfaction: number;
  avgCommunication: number;
  riskFlags: Record<string, number>;
}

export interface CalculatedKPIs {
  totalRecords: number;
  avgSatisfaction: number;
  avgCommunication: number;
  followupComplianceRate: number; // e.g., 78.4%
  portalUsageRate: number; // e.g., 62.1%
  serviceLinesCount: number;
  satisfactionByServiceLine: Record<string, { avg: number; count: number }>;
  satisfactionByYear: Record<string, { avg: number; count: number }>;
  readmissionRiskCounts: Record<string, number>;
  aiRiskFlagCounts: Record<string, number>;
  groupedForMonitoring: {
    byPersona: Record<string, { avgSat: number; avgComm: number; followupRate: number; portalRate: number; count: number }>;
    byAgeGroup: Record<string, { avgSat: number; avgComm: number; followupRate: number; portalRate: number; count: number }>;
    byVisitType: Record<string, { avgSat: number; avgComm: number; followupRate: number; portalRate: number; count: number }>;
    byServiceLine: Record<string, { avgSat: number; avgComm: number; followupRate: number; portalRate: number; count: number }>;
    byYear: Record<string, { avgSat: number; avgComm: number; followupRate: number; portalRate: number; count: number }>;
  };
}

export type AgentId = 'agent4_plan' | 'agent1' | 'agent2' | 'agent3' | 'agent6' | 'agent5' | 'agent4_final';

export type AgentStatus = 'pending' | 'running' | 'waiting_review' | 'completed' | 'skipped' | 'failed';

export type WorkflowMode = 'auto' | 'step_by_step';

export type WorkflowStep = 0 | 1 | 2 | 3 | 4; // 0: Idle, 1: Planning, 2: Specialists, 3: Analytics, 4: Final Decision

// Agent 4 (Planning)
export interface Agent4PlanItem {
  agent: string; // 'Agent 1' | 'Agent 2' | 'Agent 3' | 'Agent 6'
  run: boolean;
  task: string;
  reason: string;
}

export interface Agent4PlanResult {
  goal: string;
  agents: Agent4PlanItem[];
}

// Agent 1 (Feedback Insight)
export interface Agent1CommentResult {
  id: string;
  theme: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
  reasoning: string;
  operational_issue: string;
  risk_or_bias_concern: string;
  recommended_action: string;
}

export interface Agent1Result {
  comments: Agent1CommentResult[];
  summary: string;
}

// Agent 2 (Monitoring)
export interface Agent2Pattern {
  pattern: string;
  evidence: string;
}

export interface Agent2EquityConcern {
  group: string;
  concern: string;
  evidence: string;
}

export interface Agent2RiskAssessment {
  patient_safety: string;
  reputational: string;
  compliance: string;
  equity: string;
}

export interface Agent2Result {
  patterns: Agent2Pattern[];
  operational_issues: string[];
  equity_concerns: Agent2EquityConcern[];
  risk: Agent2RiskAssessment;
  recommendation: string;
  additional_information_needed?: string;
}

// Agent 3 (Complaint Triage)
export interface Agent3Complaint {
  id: string;
  primary_category: string;
  secondary_categories: string[];
  severity_level: number; // 1, 2, 3, 4
  severity_reasoning: string;
  risks: Array<{ risk: string; why: string }>;
  route_to: string;
  human_review_required: boolean;
  human_review_reason: string;
}

export interface Agent3Result {
  complaints: Agent3Complaint[];
  summary: string;
}

// Agent 6 (Communication Quality)
export interface Agent6Score {
  clarity: string;
  completeness: string;
  empathy: string;
  patient_centeredness: string;
  actionability: string;
}

export interface Agent6Evaluation {
  id: string;
  purpose: string;
  purpose_rationale: string;
  scores: Agent6Score;
  health_literacy_concern: string;
  risk: string;
  risk_reason: string;
  improvements: string[];
}

export interface Agent6ExecutiveSummary {
  overall_quality: string;
  major_strengths: string;
  major_weaknesses: string;
  highest_risk: string;
  most_important_improvement: string;
}

export interface Agent6Result {
  evaluations: Agent6Evaluation[];
  improved_patient_message: string;
  executive_summary: Agent6ExecutiveSummary;
}

// Agent 5 (Healthcare Analytics)
export interface Agent5HiddenProblem {
  problem: string;
  evidence: string;
}

export interface Agent5Result {
  headline: string;
  satisfaction_insights: string[];
  top_themes: string[];
  hidden_problems: Agent5HiddenProblem[];
  ai_risk_monitoring: {
    hallucination_trap: string[];
    bias_related: string[];
    human_review: string[];
  };
  top_priorities: string[];
  quick_wins: string[];
  long_term_ai_opportunities: string[];
  additional_information_needed?: string;
}

// Agent 4 (Final Decision)
export interface Agent4RecommendedAction {
  action: string;
  owner: string;
  timeframe: string;
}

export interface Agent4HumanReviewItem {
  item: string;
  reason: string;
}

export interface Agent4FinalResult {
  top_alert: string;
  answer: string;
  priority: 'Low' | 'Medium' | 'High';
  priority_reason: string;
  recommended_actions: Agent4RecommendedAction[];
  human_review: Agent4HumanReviewItem[];
}

export interface AgentState {
  id: AgentId;
  name: string;
  shortRole: string;
  stepNumber: number;
  status: AgentStatus;
  task: string;
  inputPayload: any;
  result: any;
  error?: string;
  runEnabled: boolean;
}
