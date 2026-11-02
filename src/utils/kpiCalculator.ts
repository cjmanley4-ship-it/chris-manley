import { PatientRecord, CalculatedKPIs, DistinctComment } from '../types';

/**
 * Calculates all KPIs and metrics using pure JavaScript
 */
export function calculateKPIs(records: PatientRecord[]): CalculatedKPIs {
  const selectedRecords = records.filter(r => r.selected !== false);
  const totalRecords = selectedRecords.length;

  if (totalRecords === 0) {
    return {
      totalRecords: 0,
      avgSatisfaction: 0,
      avgCommunication: 0,
      followupComplianceRate: 0,
      portalUsageRate: 0,
      serviceLinesCount: 0,
      satisfactionByServiceLine: {},
      satisfactionByYear: {},
      readmissionRiskCounts: {},
      aiRiskFlagCounts: {},
      groupedForMonitoring: {
        byPersona: {},
        byAgeGroup: {},
        byVisitType: {},
        byServiceLine: {},
        byYear: {},
      },
    };
  }

  let sumSat = 0;
  let sumComm = 0;
  let followupCount = 0;
  let portalCount = 0;

  const satisfactionByServiceLine: Record<string, { sum: number; count: number }> = {};
  const satisfactionByYear: Record<string, { sum: number; count: number }> = {};
  const readmissionRiskCounts: Record<string, number> = {};
  const aiRiskFlagCounts: Record<string, number> = {};

  // Helper for grouping
  const groupStats = (keyExtractor: (r: PatientRecord) => string) => {
    const map: Record<string, { sumSat: number; sumComm: number; followup: number; portal: number; count: number }> = {};
    for (const r of selectedRecords) {
      const key = keyExtractor(r);
      if (!map[key]) {
        map[key] = { sumSat: 0, sumComm: 0, followup: 0, portal: 0, count: 0 };
      }
      map[key].sumSat += r.Patient_Satisfaction;
      map[key].sumComm += r.Communication_Rating;
      if (r.Followup_Compliance === 1) map[key].followup += 1;
      if (r.Portal_Usage === 1) map[key].portal += 1;
      map[key].count += 1;
    }

    const formatted: Record<string, { avgSat: number; avgComm: number; followupRate: number; portalRate: number; count: number }> = {};
    for (const [k, v] of Object.entries(map)) {
      formatted[k] = {
        avgSat: Number((v.sumSat / v.count).toFixed(2)),
        avgComm: Number((v.sumComm / v.count).toFixed(2)),
        followupRate: Number(((v.followup / v.count) * 100).toFixed(1)),
        portalRate: Number(((v.portal / v.count) * 100).toFixed(1)),
        count: v.count,
      };
    }
    return formatted;
  };

  for (const r of selectedRecords) {
    sumSat += r.Patient_Satisfaction;
    sumComm += r.Communication_Rating;
    if (r.Followup_Compliance === 1) followupCount++;
    if (r.Portal_Usage === 1) portalCount++;

    // By Service Line
    if (!satisfactionByServiceLine[r.Service_Line]) {
      satisfactionByServiceLine[r.Service_Line] = { sum: 0, count: 0 };
    }
    satisfactionByServiceLine[r.Service_Line].sum += r.Patient_Satisfaction;
    satisfactionByServiceLine[r.Service_Line].count += 1;

    // By Year
    const yearKey = String(r.Year);
    if (!satisfactionByYear[yearKey]) {
      satisfactionByYear[yearKey] = { sum: 0, count: 0 };
    }
    satisfactionByYear[yearKey].sum += r.Patient_Satisfaction;
    satisfactionByYear[yearKey].count += 1;

    // By Readmission Risk
    const rRisk = r.Readmission_Risk || 'Moderate';
    readmissionRiskCounts[rRisk] = (readmissionRiskCounts[rRisk] || 0) + 1;

    // By AI Risk Flag
    const flag = r.AI_Risk_Flag || 'None';
    aiRiskFlagCounts[flag] = (aiRiskFlagCounts[flag] || 0) + 1;
  }

  const finalSatByServiceLine: Record<string, { avg: number; count: number }> = {};
  for (const [sl, val] of Object.entries(satisfactionByServiceLine)) {
    finalSatByServiceLine[sl] = {
      avg: Number((val.sum / val.count).toFixed(2)),
      count: val.count,
    };
  }

  const finalSatByYear: Record<string, { avg: number; count: number }> = {};
  for (const [yr, val] of Object.entries(satisfactionByYear)) {
    finalSatByYear[yr] = {
      avg: Number((val.sum / val.count).toFixed(2)),
      count: val.count,
    };
  }

  return {
    totalRecords,
    avgSatisfaction: Number((sumSat / totalRecords).toFixed(2)),
    avgCommunication: Number((sumComm / totalRecords).toFixed(2)),
    followupComplianceRate: Number(((followupCount / totalRecords) * 100).toFixed(1)),
    portalUsageRate: Number(((portalCount / totalRecords) * 100).toFixed(1)),
    serviceLinesCount: Object.keys(finalSatByServiceLine).length,
    satisfactionByServiceLine: finalSatByServiceLine,
    satisfactionByYear: finalSatByYear,
    readmissionRiskCounts,
    aiRiskFlagCounts,
    groupedForMonitoring: {
      byPersona: groupStats(r => r.Patient_Persona),
      byAgeGroup: groupStats(r => r.Age_Group),
      byVisitType: groupStats(r => r.Visit_Type),
      byServiceLine: groupStats(r => r.Service_Line),
      byYear: groupStats(r => String(r.Year)),
    },
  };
}

/**
 * Extracts distinct comments, counts occurrences, and aggregates ratings & flags
 */
export function extractDistinctComments(records: PatientRecord[]): DistinctComment[] {
  const selectedRecords = records.filter(r => r.selected !== false);
  const commentMap = new Map<string, {
    text: string;
    recordIds: string[];
    sumSat: number;
    sumComm: number;
    riskFlags: Record<string, number>;
  }>();

  let idCounter = 1;
  const textToIdMap = new Map<string, string>();

  for (const r of selectedRecords) {
    const text = (r.Comment || '').trim();
    if (!text) continue;

    if (!commentMap.has(text)) {
      const generatedId = `C${String(idCounter).padStart(2, '0')}`;
      idCounter++;
      textToIdMap.set(text, generatedId);

      commentMap.set(text, {
        text,
        recordIds: [r.id],
        sumSat: r.Patient_Satisfaction,
        sumComm: r.Communication_Rating,
        riskFlags: { [r.AI_Risk_Flag || 'None']: 1 },
      });
    } else {
      const entry = commentMap.get(text)!;
      entry.recordIds.push(r.id);
      entry.sumSat += r.Patient_Satisfaction;
      entry.sumComm += r.Communication_Rating;
      const flag = r.AI_Risk_Flag || 'None';
      entry.riskFlags[flag] = (entry.riskFlags[flag] || 0) + 1;
    }
  }

  const result: DistinctComment[] = [];
  for (const [text, val] of commentMap.entries()) {
    const id = textToIdMap.get(text)!;
    const count = val.recordIds.length;
    result.push({
      id,
      text,
      count,
      recordIds: val.recordIds,
      avgSatisfaction: Number((val.sumSat / count).toFixed(2)),
      avgCommunication: Number((val.sumComm / count).toFixed(2)),
      riskFlags: val.riskFlags,
    });
  }

  // Sort by count descending
  return result.sort((a, b) => b.count - a.count);
}

/**
 * Helper to get available column list
 */
export const AVAILABLE_COLUMNS = [
  'Record_ID',
  'Patient_ID',
  'Patient_Persona',
  'Age_Group',
  'Visit_Type',
  'Service_Line',
  'Year',
  'Patient_Satisfaction',
  'Communication_Rating',
  'Followup_Compliance',
  'Portal_Usage',
  'Readmission_Risk',
  'AI_Risk_Flag',
  'Comment',
];
