import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  PatientRecord, 
  CalculatedKPIs, 
  DistinctComment, 
  AgentState, 
  AgentId, 
  WorkflowMode, 
  WorkflowStep,
  Agent4PlanResult,
  Agent1Result,
  Agent2Result,
  Agent3Result,
  Agent6Result,
  Agent5Result,
  Agent4FinalResult
} from './types';
import { INITIAL_PATIENT_RECORDS } from './data/defaultData';
import { calculateKPIs, extractDistinctComments, AVAILABLE_COLUMNS } from './utils/kpiCalculator';
import { 
  AGENT_PROMPTS, 
  prepareAgent4PlanInput, 
  prepareAgent1Input, 
  prepareAgent2Input, 
  prepareAgent3Input, 
  prepareAgent6Input, 
  prepareAgent5Input, 
  prepareAgent4FinalInput 
} from './prompts/agentPrompts';
import { callAgentLLM } from './utils/api';
import { Header } from './components/Header';
import { AgentDiagram } from './components/AgentDiagram';
import { WorkflowControls } from './components/WorkflowControls';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { AgentInspectorModal } from './components/AgentInspectorModal';
import { DataTableModal } from './components/DataTableModal';

const DEFAULT_AGENTS: Record<AgentId, AgentState> = {
  agent4_plan: {
    id: 'agent4_plan',
    name: 'Agent 4: Orchestrator (Planning)',
    shortRole: 'Lead Orchestrator (Job 1: Planning & Delegation)',
    stepNumber: 1,
    status: 'pending',
    task: 'Read manager question, review available data columns and KPIs, assign specialist tasks.',
    inputPayload: null,
    result: null,
    runEnabled: true,
  },
  agent1: {
    id: 'agent1',
    name: 'Agent 1: Patient Feedback Insight',
    shortRole: 'Patient Comment Themes, Sentiment & Operational Bottlenecks',
    stepNumber: 2,
    status: 'pending',
    task: 'Analyze patient comments for themes, sentiment, operational issues, and risk flags.',
    inputPayload: null,
    result: null,
    runEnabled: true,
  },
  agent2: {
    id: 'agent2',
    name: 'Agent 2: Experience Monitoring',
    shortRole: 'Demographic Trends, Equity Disparities & Operational Risk',
    stepNumber: 2,
    status: 'pending',
    task: 'Identify patterns across personas, age groups, service lines, and equity concerns.',
    inputPayload: null,
    result: null,
    runEnabled: true,
  },
  agent3: {
    id: 'agent3',
    name: 'Agent 3: Complaint Triage Assistant',
    shortRole: 'Severity L1-L4 Triage, Routing & Human Review Detection',
    stepNumber: 2,
    status: 'pending',
    task: 'Classify complaint categories, assign severity level 1-4, route to teams, and flag human review.',
    inputPayload: null,
    result: null,
    runEnabled: true,
  },
  agent6: {
    id: 'agent6',
    name: 'Agent 6: Healthcare Communication Evaluator',
    shortRole: 'Communication Quality Scoring & Rewriting Patient Messages',
    stepNumber: 2,
    status: 'pending',
    task: 'Evaluate clarity/empathy scores and rewrite patient communication to 6th grade reading level.',
    inputPayload: null,
    result: null,
    runEnabled: true,
  },
  agent5: {
    id: 'agent5',
    name: 'Agent 5: Healthcare Analytics Agent',
    shortRole: 'Executive Dashboard Synthesis & Hidden Bottleneck Detection',
    stepNumber: 3,
    status: 'pending',
    task: 'Synthesize specialist agent outputs into C-suite priorities, quick wins, and AI monitoring.',
    inputPayload: null,
    result: null,
    runEnabled: true,
  },
  agent4_final: {
    id: 'agent4_final',
    name: 'Agent 4: Decision Support (Final)',
    shortRole: 'Lead Orchestrator (Job 2: Final Decisions & Actions)',
    stepNumber: 4,
    status: 'pending',
    task: 'Issue top alert, formulate 2-3 management actions, and finalize human review list.',
    inputPayload: null,
    result: null,
    runEnabled: true,
  },
};

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Data state
  const [records, setRecords] = useState<PatientRecord[]>(INITIAL_PATIENT_RECORDS);
  const [managerQuestion, setManagerQuestion] = useState<string>(
    'What should management fix first to improve patient experience, and which cases need human review?'
  );

  // Workflow states
  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>('step_by_step');
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [waitingForReview, setWaitingForReview] = useState<boolean>(false);
  const [agents, setAgents] = useState<Record<AgentId, AgentState>>(DEFAULT_AGENTS);

  // Flow animation arrows state
  const [activeFlows, setActiveFlows] = useState({
    fromAgent4ToSpecialists: false,
    fromSpecialistsToAgent5: false,
    fromAgent5ToAgent4Final: false,
  });

  // Modal inspection & data table states
  const [inspectingAgentId, setInspectingAgentId] = useState<AgentId | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);

  // Calculated numbers via pure JavaScript
  const kpis = useMemo(() => calculateKPIs(records), [records]);
  const distinctComments = useMemo(() => extractDistinctComments(records), [records]);

  // Update specific agent helper
  const updateAgentState = useCallback((id: AgentId, updates: Partial<AgentState>) => {
    setAgents(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...updates,
      },
    }));
  }, []);

  // Step 1: Execute Orchestrator Planning (Agent 4)
  const executeStep1Planning = async () => {
    setIsProcessing(true);
    setCurrentStep(1);
    updateAgentState('agent4_plan', { status: 'running', error: undefined });

    const inputData = prepareAgent4PlanInput(managerQuestion, AVAILABLE_COLUMNS, kpis);
    updateAgentState('agent4_plan', { inputPayload: inputData });

    try {
      const result: Agent4PlanResult = await callAgentLLM(
        AGENT_PROMPTS.AGENT_4_PLANNING,
        inputData,
        'Agent 4: Orchestrator (Planning)'
      );

      // Apply task assignments to specialist agents
      setAgents(prev => {
        const next = { ...prev };
        next.agent4_plan = {
          ...next.agent4_plan,
          status: 'completed',
          result,
        };

        // Match specialist tasks if returned
        if (result.agents && Array.isArray(result.agents)) {
          result.agents.forEach(item => {
            const agentKey = item.agent.toLowerCase().includes('1') ? 'agent1' :
                             item.agent.toLowerCase().includes('2') ? 'agent2' :
                             item.agent.toLowerCase().includes('3') ? 'agent3' :
                             item.agent.toLowerCase().includes('6') ? 'agent6' : null;
            if (agentKey && next[agentKey as AgentId]) {
              next[agentKey as AgentId] = {
                ...next[agentKey as AgentId],
                runEnabled: item.run !== false,
                task: item.task || next[agentKey as AgentId].task,
                status: item.run !== false ? 'pending' : 'skipped',
              };
            }
          });
        }

        return next;
      });

      // Animate flowing arrows from Agent 4 to Specialists
      setActiveFlows(prev => ({ ...prev, fromAgent4ToSpecialists: true }));

      setIsProcessing(false);

      if (workflowMode === 'step_by_step') {
        setWaitingForReview(true);
      } else {
        // Auto run: continue directly to step 2
        executeStep2Specialists();
      }
    } catch (err: any) {
      updateAgentState('agent4_plan', { 
        status: 'failed', 
        error: err.message || 'Agent 4 Planning execution failed' 
      });
      setIsProcessing(false);
    }
  };

  // Step 2: Execute Parallel Specialists (Agents 1, 2, 3, 6)
  const executeStep2Specialists = async () => {
    setIsProcessing(true);
    setWaitingForReview(false);
    setCurrentStep(2);

    const specialistKeys: AgentId[] = ['agent1', 'agent2', 'agent3', 'agent6'];
    const activeSpecialists = specialistKeys.filter(
      k => agents[k].runEnabled && agents[k].status !== 'completed'
    );

    // Set active ones to running
    activeSpecialists.forEach(id => {
      updateAgentState(id, { status: 'running', error: undefined });
    });

    const tasks = activeSpecialists.map(async (id) => {
      try {
        if (id === 'agent1') {
          const input = prepareAgent1Input(distinctComments);
          updateAgentState('agent1', { inputPayload: input });
          const res: Agent1Result = await callAgentLLM(
            AGENT_PROMPTS.AGENT_1_FEEDBACK,
            input,
            'Agent 1: Feedback Insight'
          );
          updateAgentState('agent1', { status: 'completed', result: res });
        } else if (id === 'agent2') {
          const input = prepareAgent2Input(kpis);
          updateAgentState('agent2', { inputPayload: input });
          const res: Agent2Result = await callAgentLLM(
            AGENT_PROMPTS.AGENT_2_MONITORING,
            input,
            'Agent 2: Experience Monitoring'
          );
          updateAgentState('agent2', { status: 'completed', result: res });
        } else if (id === 'agent3') {
          const input = prepareAgent3Input(distinctComments);
          updateAgentState('agent3', { inputPayload: input });
          const res: Agent3Result = await callAgentLLM(
            AGENT_PROMPTS.AGENT_3_TRIAGE,
            input,
            'Agent 3: Complaint Triage'
          );
          updateAgentState('agent3', { status: 'completed', result: res });
        } else if (id === 'agent6') {
          const input = prepareAgent6Input(distinctComments);
          updateAgentState('agent6', { inputPayload: input });
          const res: Agent6Result = await callAgentLLM(
            AGENT_PROMPTS.AGENT_6_COMMUNICATION,
            input,
            'Agent 6: Communication Quality'
          );
          updateAgentState('agent6', { status: 'completed', result: res });
        }
      } catch (err: any) {
        updateAgentState(id, { 
          status: 'failed', 
          error: err.message || `Failed to run ${id}` 
        });
      }
    });

    await Promise.allSettled(tasks);

    // Light up flow arrow from Specialists to Agent 5
    setActiveFlows(prev => ({ ...prev, fromSpecialistsToAgent5: true }));
    setIsProcessing(false);

    if (workflowMode === 'step_by_step') {
      setWaitingForReview(true);
    } else {
      executeStep3Analytics();
    }
  };

  // Step 3: Execute Healthcare Analytics (Agent 5)
  const executeStep3Analytics = async () => {
    setIsProcessing(true);
    setWaitingForReview(false);
    setCurrentStep(3);
    updateAgentState('agent5', { status: 'running', error: undefined });

    const input = prepareAgent5Input(kpis, {
      agent1: agents.agent1.result,
      agent2: agents.agent2.result,
      agent3: agents.agent3.result,
      agent6: agents.agent6.result,
    });
    updateAgentState('agent5', { inputPayload: input });

    try {
      const res: Agent5Result = await callAgentLLM(
        AGENT_PROMPTS.AGENT_5_ANALYTICS,
        input,
        'Agent 5: Healthcare Analytics'
      );

      updateAgentState('agent5', { status: 'completed', result: res });
      
      // Light up loop-back arrow from Agent 5 to Agent 4 Final
      setActiveFlows(prev => ({ ...prev, fromAgent5ToAgent4Final: true }));
      setIsProcessing(false);

      if (workflowMode === 'step_by_step') {
        setWaitingForReview(true);
      } else {
        executeStep4FinalDecision();
      }
    } catch (err: any) {
      updateAgentState('agent5', { 
        status: 'failed', 
        error: err.message || 'Agent 5 Analytics execution failed' 
      });
      setIsProcessing(false);
    }
  };

  // Step 4: Execute Hospital Manager Decision Support (Agent 4 Final)
  const executeStep4FinalDecision = async () => {
    setIsProcessing(true);
    setWaitingForReview(false);
    setCurrentStep(4);
    updateAgentState('agent4_final', { status: 'running', error: undefined });

    // Collate human review cases from Agent 3
    const humanReviewList = (agents.agent3.result?.complaints || [])
      .filter((c: any) => c.human_review_required || c.severity_level >= 3)
      .map((c: any) => ({
        id: c.id,
        category: c.primary_category,
        severity: c.severity_level,
        reason: c.human_review_reason || c.severity_reasoning,
        route_to: c.route_to,
      }));

    const input = prepareAgent4FinalInput(
      managerQuestion,
      agents.agent4_plan.result,
      agents.agent5.result,
      kpis,
      humanReviewList
    );
    updateAgentState('agent4_final', { inputPayload: input });

    try {
      const res: Agent4FinalResult = await callAgentLLM(
        AGENT_PROMPTS.AGENT_4_FINAL,
        input,
        'Agent 4: Decision Support (Final)'
      );

      updateAgentState('agent4_final', { status: 'completed', result: res });
      setIsProcessing(false);
    } catch (err: any) {
      updateAgentState('agent4_final', { 
        status: 'failed', 
        error: err.message || 'Agent 4 Final Decision failed' 
      });
      setIsProcessing(false);
    }
  };

  // Step progression handler for Step-by-Step Review Mode
  const handleApproveAndContinue = () => {
    if (currentStep === 1) {
      executeStep2Specialists();
    } else if (currentStep === 2) {
      executeStep3Analytics();
    } else if (currentStep === 3) {
      executeStep4FinalDecision();
    }
  };

  // Retry an individual agent if failed or requested
  const handleRetryAgent = async (agentId: AgentId) => {
    if (agentId === 'agent4_plan') {
      await executeStep1Planning();
    } else if (agentId === 'agent5') {
      await executeStep3Analytics();
    } else if (agentId === 'agent4_final') {
      await executeStep4FinalDecision();
    } else {
      // Individual specialist retry
      updateAgentState(agentId, { status: 'running', error: undefined });
      try {
        if (agentId === 'agent1') {
          const input = prepareAgent1Input(distinctComments);
          updateAgentState('agent1', { inputPayload: input });
          const res = await callAgentLLM(AGENT_PROMPTS.AGENT_1_FEEDBACK, input, 'Agent 1');
          updateAgentState('agent1', { status: 'completed', result: res });
        } else if (agentId === 'agent2') {
          const input = prepareAgent2Input(kpis);
          updateAgentState('agent2', { inputPayload: input });
          const res = await callAgentLLM(AGENT_PROMPTS.AGENT_2_MONITORING, input, 'Agent 2');
          updateAgentState('agent2', { status: 'completed', result: res });
        } else if (agentId === 'agent3') {
          const input = prepareAgent3Input(distinctComments);
          updateAgentState('agent3', { inputPayload: input });
          const res = await callAgentLLM(AGENT_PROMPTS.AGENT_3_TRIAGE, input, 'Agent 3');
          updateAgentState('agent3', { status: 'completed', result: res });
        } else if (agentId === 'agent6') {
          const input = prepareAgent6Input(distinctComments);
          updateAgentState('agent6', { inputPayload: input });
          const res = await callAgentLLM(AGENT_PROMPTS.AGENT_6_COMMUNICATION, input, 'Agent 6');
          updateAgentState('agent6', { status: 'completed', result: res });
        }
      } catch (err: any) {
        updateAgentState(agentId, { status: 'failed', error: err.message });
      }
    }
  };

  // Reset entire workflow state
  const handleResetWorkflow = () => {
    setCurrentStep(0);
    setIsProcessing(false);
    setWaitingForReview(false);
    setActiveFlows({
      fromAgent4ToSpecialists: false,
      fromSpecialistsToAgent5: false,
      fromAgent5ToAgent4Final: false,
    });
    setAgents(DEFAULT_AGENTS);
  };

  const handleToggleAgentRun = (id: AgentId) => {
    setAgents(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        runEnabled: !prev[id].runEnabled,
        status: !prev[id].runEnabled ? 'pending' : 'skipped',
      },
    }));
  };

  const handleUpdateAgentTask = (id: AgentId, newTask: string) => {
    updateAgentState(id, { task: newTask });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navigation & App Bar */}
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        recordCount={records.length}
        distinctCount={distinctComments.length}
        currentStep={currentStep}
        isProcessing={isProcessing}
      />

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Section 1: Workflow Controls & Mode Configuration */}
        <section>
          <WorkflowControls
            mode={workflowMode}
            onModeChange={setWorkflowMode}
            currentStep={currentStep}
            isProcessing={isProcessing}
            waitingForReview={waitingForReview}
            onStartWorkflow={executeStep1Planning}
            onApproveAndContinue={handleApproveAndContinue}
            onResetWorkflow={handleResetWorkflow}
            managerQuestion={managerQuestion}
            onQuestionChange={setManagerQuestion}
            agents={agents}
            onToggleAgentRun={handleToggleAgentRun}
            onOpenInspector={(id) => setInspectingAgentId(id)}
            isDark={isDark}
          />
        </section>

        {/* Section 2: Interactive Dynamic Agent Flow Diagram */}
        <section>
          <AgentDiagram
            agents={agents}
            currentStep={currentStep}
            activeFlows={activeFlows}
            onSelectAgent={(id) => setInspectingAgentId(id)}
            onRetryAgent={handleRetryAgent}
            isDark={isDark}
          />
        </section>

        {/* Section 3: Executive Intelligence Dashboard */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                Executive Healthcare Intelligence Dashboard
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unified insights combining JavaScript mathematical aggregations and 6-agent AI evaluations.
              </p>
            </div>
          </div>

          <ExecutiveDashboard
            kpis={kpis}
            agent4Final={agents.agent4_final.result}
            agent1Result={agents.agent1.result}
            agent2Result={agents.agent2.result}
            agent3Result={agents.agent3.result}
            agent5Result={agents.agent5.result}
            agent6Result={agents.agent6.result}
            distinctComments={distinctComments}
            isDark={isDark}
          />
        </section>
      </main>

      {/* Agent Inspector Modal */}
      <AgentInspectorModal
        agent={inspectingAgentId ? agents[inspectingAgentId] : null}
        onClose={() => setInspectingAgentId(null)}
        onRetryAgent={handleRetryAgent}
        onUpdateTask={handleUpdateAgentTask}
        canEditTask={currentStep === 1 && waitingForReview}
        isDark={isDark}
      />

      {/* Dataset & CSV Upload Modal */}
      <DataTableModal
        records={records}
        onRecordsChange={setRecords}
        distinctComments={distinctComments}
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}
