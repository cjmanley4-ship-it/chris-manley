import React, { useState, useRef } from 'react';
import { PatientRecord, DistinctComment } from '../types';
import { parseCSV, exportRecordsToCSV, INITIAL_PATIENT_RECORDS } from '../data/defaultData';
import { 
  X, 
  Upload, 
  Download, 
  RotateCcw, 
  Search, 
  CheckSquare, 
  Square, 
  Filter, 
  Layers, 
  FileSpreadsheet,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DataTableModalProps {
  records: PatientRecord[];
  onRecordsChange: (records: PatientRecord[]) => void;
  distinctComments: DistinctComment[];
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const DataTableModal: React.FC<DataTableModalProps> = ({
  records,
  onRecordsChange,
  distinctComments,
  isOpen,
  onClose,
  isDark,
}) => {
  const [activeTab, setActiveTab] = useState<'records' | 'distinct'>('records');
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceLineFilter, setServiceLineFilter] = useState('ALL');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setUploadError('Uploaded CSV file had no parseable patient records.');
          return;
        }
        onRecordsChange(parsed);
        setUploadError(null);
      } catch (err: any) {
        setUploadError('Failed to parse CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExportCSV = () => {
    const csv = exportRecordsToCSV(records);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hospital_patient_experience_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleSelectAll = (select: boolean) => {
    const updated = records.map(r => ({ ...r, selected: select }));
    onRecordsChange(updated);
  };

  const handleToggleRow = (id: string) => {
    const updated = records.map(r => r.id === id ? { ...r, selected: !r.selected } : r);
    onRecordsChange(updated);
  };

  const handleResetToDefault = () => {
    onRecordsChange(INITIAL_PATIENT_RECORDS.map(r => ({ ...r, selected: true })));
    setUploadError(null);
  };

  // Filtered rows
  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.Patient_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.Patient_Persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.Comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.Service_Line.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSL = serviceLineFilter === 'ALL' || r.Service_Line === serviceLineFilter;
    return matchesSearch && matchesSL;
  });

  const selectedCount = records.filter(r => r.selected !== false).length;
  const uniqueServiceLines = Array.from(new Set(records.map(r => r.Service_Line)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                Hospital Patient Experience Dataset
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedCount} of {records.length} records selected &bull; Aggregated into {distinctComments.length} distinct comment clusters
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload CSV
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={handleResetToDefault}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Benchmark
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/50 border-b border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Tab Selector & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('records')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'records'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Individual Patient Records ({records.length})
            </button>
            <button
              onClick={() => setActiveTab('distinct')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'distinct'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Distinct Comment Clusters ({distinctComments.length})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search records or comments..."
                className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500 w-48 sm:w-60"
              />
            </div>

            {activeTab === 'records' && (
              <select
                value={serviceLineFilter}
                onChange={(e) => setServiceLineFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="ALL">All Service Lines</option>
                {uniqueServiceLines.map(sl => (
                  <option key={sl} value={sl}>{sl}</option>
                ))}
              </select>
            )}

            {activeTab === 'records' && (
              <div className="flex items-center gap-1 border-l border-slate-300 dark:border-slate-700 pl-2">
                <button
                  onClick={() => handleToggleSelectAll(true)}
                  className="px-2 py-1 text-[11px] font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950 rounded"
                >
                  Select All
                </button>
                <button
                  onClick={() => handleToggleSelectAll(false)}
                  className="px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                >
                  Deselect All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'records' ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase font-bold text-[11px] sticky top-0 z-10">
                  <tr>
                    <th className="p-2.5 text-center w-10">
                      <input
                        type="checkbox"
                        checked={selectedCount === records.length && records.length > 0}
                        onChange={(e) => handleToggleSelectAll(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                    </th>
                    <th className="p-2.5">Record ID</th>
                    <th className="p-2.5">Persona</th>
                    <th className="p-2.5">Age</th>
                    <th className="p-2.5">Visit Type</th>
                    <th className="p-2.5">Service Line</th>
                    <th className="p-2.5">Year</th>
                    <th className="p-2.5 text-center">Satisfaction</th>
                    <th className="p-2.5 text-center">Comm Rating</th>
                    <th className="p-2.5 text-center">Follow-up</th>
                    <th className="p-2.5 text-center">Portal</th>
                    <th className="p-2.5">Readmission Risk</th>
                    <th className="p-2.5">AI Risk Flag</th>
                    <th className="p-2.5 min-w-[260px]">Patient Comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRecords.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => handleToggleRow(r.id)}
                      className={`cursor-pointer transition-colors ${
                        r.selected !== false
                          ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          : 'opacity-40 bg-slate-50 dark:bg-slate-900/40'
                      }`}
                    >
                      <td className="p-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={r.selected !== false}
                          onChange={() => handleToggleRow(r.id)}
                          className="rounded text-teal-600 focus:ring-teal-500"
                        />
                      </td>
                      <td className="p-2.5 font-mono font-bold whitespace-nowrap text-teal-600 dark:text-teal-400">
                        {r.id}
                      </td>
                      <td className="p-2.5 whitespace-nowrap font-medium">{r.Patient_Persona}</td>
                      <td className="p-2.5 whitespace-nowrap">{r.Age_Group}</td>
                      <td className="p-2.5 whitespace-nowrap">{r.Visit_Type}</td>
                      <td className="p-2.5 whitespace-nowrap font-semibold">{r.Service_Line}</td>
                      <td className="p-2.5 whitespace-nowrap">{r.Year}</td>
                      <td className="p-2.5 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded-full ${
                          r.Patient_Satisfaction >= 4 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          r.Patient_Satisfaction <= 2 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {r.Patient_Satisfaction} / 5
                        </span>
                      </td>
                      <td className="p-2.5 text-center font-bold">
                        {r.Communication_Rating} / 5
                      </td>
                      <td className="p-2.5 text-center font-bold">
                        {r.Followup_Compliance === 1 ? 'Yes' : 'No'}
                      </td>
                      <td className="p-2.5 text-center font-bold">
                        {r.Portal_Usage === 1 ? 'Yes' : 'No'}
                      </td>
                      <td className="p-2.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          r.Readmission_Risk === 'High' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                          r.Readmission_Risk === 'Moderate' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {r.Readmission_Risk}
                        </span>
                      </td>
                      <td className="p-2.5 whitespace-nowrap">
                        {r.AI_Risk_Flag !== 'None' ? (
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                            {r.AI_Risk_Flag}
                          </span>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="p-2.5 text-slate-700 dark:text-slate-300 line-clamp-2">
                        {r.Comment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200">
                <strong>Multi-Agent Deduplication Strategy:</strong> The dataset contains recurring feedback comments. Each distinct comment is passed to agents exactly once with its aggregate record count and linked record IDs. The results are mapped back to all records in code.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {distinctComments.map((dc) => (
                  <div
                    key={dc.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-teal-600 dark:text-teal-400">
                        {dc.id} &bull; {dc.count} Linked Records
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold">
                        Avg Sat: {dc.avgSatisfaction} / 5
                      </span>
                    </div>

                    <p className="text-xs font-serif italic text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      "{dc.text}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>Avg Comm: <strong>{dc.avgCommunication}</strong></span>
                      <div className="flex items-center gap-1">
                        {Object.entries(dc.riskFlags).map(([flag, cnt]) => (
                          <span key={flag} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                            {flag}: {cnt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <span className="text-xs text-slate-500">
            Selected Records: <strong>{selectedCount}</strong> / {records.length}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm"
          >
            Apply & Close Data Manager
          </button>
        </div>
      </div>
    </div>
  );
};
