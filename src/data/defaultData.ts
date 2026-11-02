import { PatientRecord, DistinctComment } from '../types';

export const DISTINCT_COMMENTS_SEED: Array<{ id: string; text: string }> = [
  {
    id: 'C01',
    text: 'The discharge instructions were printed with dense medical jargon and nobody explained how to taper my medication safely.',
  },
  {
    id: 'C02',
    text: 'I waited over 3 hours past my scheduled appointment time in the waiting room with zero updates from the front desk staff.',
  },
  {
    id: 'C03',
    text: 'The nurse practitioner was extraordinarily kind, listened to all my questions, and made sure I felt comfortable before surgery.',
  },
  {
    id: 'C04',
    text: 'The patient portal kept throwing an error when I tried to pay my bill and download my cardiology lab results.',
  },
  {
    id: 'C05',
    text: 'My elderly mother only speaks Spanish and no interpreter was available during our discharge planning consultation.',
  },
  {
    id: 'C06',
    text: 'I was billed $850 for an out-of-network consult that I was explicitly told would be completely covered by my insurance.',
  },
  {
    id: 'C07',
    text: 'Follow-up telemedicine link was sent 10 minutes after the appointment was supposed to end, causing me to miss work.',
  },
  {
    id: 'C08',
    text: 'Dr. Adams gave thorough explanations of my treatment options and helped me choose the best path for my lifestyle.',
  },
];

export const INITIAL_PATIENT_RECORDS: PatientRecord[] = [
  // C01 records (Discharge / Med safety / Jargon)
  { id: 'REC-101', Patient_ID: 'PT-8942', Patient_Persona: 'Elderly Chronic Care', Age_Group: '75+', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Human Review Required', Comment: DISTINCT_COMMENTS_SEED[0].text, selected: true },
  { id: 'REC-102', Patient_ID: 'PT-8943', Patient_Persona: 'Rural Senior', Age_Group: '65-74', Visit_Type: 'Inpatient', Service_Line: 'Internal Medicine', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Patient Safety Concern', Comment: DISTINCT_COMMENTS_SEED[0].text, selected: true },
  { id: 'REC-103', Patient_ID: 'PT-8944', Patient_Persona: 'Elderly Chronic Care', Age_Group: '75+', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Human Review Required', Comment: DISTINCT_COMMENTS_SEED[0].text, selected: true },
  { id: 'REC-104', Patient_ID: 'PT-8945', Patient_Persona: 'Working Parent', Age_Group: '36-50', Visit_Type: 'Outpatient', Service_Line: 'Orthopedics', Year: 2025, Patient_Satisfaction: 3, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[0].text, selected: true },
  { id: 'REC-105', Patient_ID: 'PT-8946', Patient_Persona: 'Disability Advocate', Age_Group: '51-64', Visit_Type: 'Inpatient', Service_Line: 'Internal Medicine', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 1, Readmission_Risk: 'High', AI_Risk_Flag: 'Human Review Required', Comment: DISTINCT_COMMENTS_SEED[0].text, selected: true },
  { id: 'REC-106', Patient_ID: 'PT-8947', Patient_Persona: 'Elderly Chronic Care', Age_Group: '65-74', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2024, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Patient Safety Concern', Comment: DISTINCT_COMMENTS_SEED[0].text, selected: true },
  { id: 'REC-107', Patient_ID: 'PT-8948', Patient_Persona: 'Self-Pay Patient', Age_Group: '36-50', Visit_Type: 'Outpatient', Service_Line: 'Orthopedics', Year: 2025, Patient_Satisfaction: 3, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[0].text, selected: true },
  { id: 'REC-108', Patient_ID: 'PT-8949', Patient_Persona: 'Rural Senior', Age_Group: '75+', Visit_Type: 'Inpatient', Service_Line: 'Internal Medicine', Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Human Review Required', Comment: DISTINCT_COMMENTS_SEED[0].text, selected: true },

  // C02 records (Wait Time / ED / Front desk)
  { id: 'REC-109', Patient_ID: 'PT-9011', Patient_Persona: 'Working Parent', Age_Group: '36-50', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[1].text, selected: true },
  { id: 'REC-110', Patient_ID: 'PT-9012', Patient_Persona: 'Tech-Savvy Professional', Age_Group: '18-35', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[1].text, selected: true },
  { id: 'REC-111', Patient_ID: 'PT-9013', Patient_Persona: 'Elderly Chronic Care', Age_Group: '65-74', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Patient Safety Concern', Comment: DISTINCT_COMMENTS_SEED[1].text, selected: true },
  { id: 'REC-112', Patient_ID: 'PT-9014', Patient_Persona: 'Self-Pay Patient', Age_Group: '36-50', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[1].text, selected: true },
  { id: 'REC-113', Patient_ID: 'PT-9015', Patient_Persona: 'Working Parent', Age_Group: '18-35', Visit_Type: 'Outpatient', Service_Line: 'Pediatrics', Year: 2025, Patient_Satisfaction: 3, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[1].text, selected: true },
  { id: 'REC-114', Patient_ID: 'PT-9016', Patient_Persona: 'Rural Senior', Age_Group: '75+', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2024, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[1].text, selected: true },
  { id: 'REC-115', Patient_ID: 'PT-9017', Patient_Persona: 'Disability Advocate', Age_Group: '51-64', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[1].text, selected: true },
  { id: 'REC-116', Patient_ID: 'PT-9018', Patient_Persona: 'Tech-Savvy Professional', Age_Group: '36-50', Visit_Type: 'Outpatient', Service_Line: 'Orthopedics', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[1].text, selected: true },

  // C03 records (Positive Nurse & Clinical Care)
  { id: 'REC-117', Patient_ID: 'PT-9101', Patient_Persona: 'Working Parent', Age_Group: '36-50', Visit_Type: 'Surgical', Service_Line: 'Orthopedics', Year: 2025, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[2].text, selected: true },
  { id: 'REC-118', Patient_ID: 'PT-9102', Patient_Persona: 'Elderly Chronic Care', Age_Group: '65-74', Visit_Type: 'Surgical', Service_Line: 'Cardiology', Year: 2026, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[2].text, selected: true },
  { id: 'REC-119', Patient_ID: 'PT-9103', Patient_Persona: 'Tech-Savvy Professional', Age_Group: '18-35', Visit_Type: 'Surgical', Service_Line: 'Oncology', Year: 2026, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[2].text, selected: true },
  { id: 'REC-120', Patient_ID: 'PT-9104', Patient_Persona: 'Rural Senior', Age_Group: '75+', Visit_Type: 'Inpatient', Service_Line: 'Internal Medicine', Year: 2024, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[2].text, selected: true },
  { id: 'REC-121', Patient_ID: 'PT-9105', Patient_Persona: 'Working Parent', Age_Group: '18-35', Visit_Type: 'Surgical', Service_Line: 'Pediatrics', Year: 2025, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[2].text, selected: true },
  { id: 'REC-122', Patient_ID: 'PT-9106', Patient_Persona: 'Self-Pay Patient', Age_Group: '51-64', Visit_Type: 'Surgical', Service_Line: 'Orthopedics', Year: 2025, Patient_Satisfaction: 5, Communication_Rating: 4, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[2].text, selected: true },

  // C04 records (Patient Portal error / Billing & Labs)
  { id: 'REC-123', Patient_ID: 'PT-9201', Patient_Persona: 'Tech-Savvy Professional', Age_Group: '36-50', Visit_Type: 'Outpatient', Service_Line: 'Cardiology', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[3].text, selected: true },
  { id: 'REC-124', Patient_ID: 'PT-9202', Patient_Persona: 'Working Parent', Age_Group: '18-35', Visit_Type: 'Outpatient', Service_Line: 'Cardiology', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 3, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[3].text, selected: true },
  { id: 'REC-125', Patient_ID: 'PT-9203', Patient_Persona: 'Disability Advocate', Age_Group: '51-64', Visit_Type: 'Outpatient', Service_Line: 'Cardiology', Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 1, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[3].text, selected: true },
  { id: 'REC-126', Patient_ID: 'PT-9204', Patient_Persona: 'Self-Pay Patient', Age_Group: '36-50', Visit_Type: 'Outpatient', Service_Line: 'Internal Medicine', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[3].text, selected: true },
  { id: 'REC-127', Patient_ID: 'PT-9205', Patient_Persona: 'Tech-Savvy Professional', Age_Group: '18-35', Visit_Type: 'Outpatient', Service_Line: 'Cardiology', Year: 2024, Patient_Satisfaction: 3, Communication_Rating: 3, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[3].text, selected: true },

  // C05 records (Language Barrier / Interpreter / Equity Concern)
  { id: 'REC-128', Patient_ID: 'PT-9301', Patient_Persona: 'Non-Native English Speaker', Age_Group: '65-74', Visit_Type: 'Inpatient', Service_Line: 'Oncology', Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Bias Review', Comment: DISTINCT_COMMENTS_SEED[4].text, selected: true },
  { id: 'REC-129', Patient_ID: 'PT-9302', Patient_Persona: 'Non-Native English Speaker', Age_Group: '75+', Visit_Type: 'Inpatient', Service_Line: 'Internal Medicine', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Human Review Required', Comment: DISTINCT_COMMENTS_SEED[4].text, selected: true },
  { id: 'REC-130', Patient_ID: 'PT-9303', Patient_Persona: 'Non-Native English Speaker', Age_Group: '51-64', Visit_Type: 'Inpatient', Service_Line: 'Cardiology', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Bias Review', Comment: DISTINCT_COMMENTS_SEED[4].text, selected: true },
  { id: 'REC-131', Patient_ID: 'PT-9304', Patient_Persona: 'Non-Native English Speaker', Age_Group: '36-50', Visit_Type: 'Emergency', Service_Line: 'Emergency Medicine', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'Human Review Required', Comment: DISTINCT_COMMENTS_SEED[4].text, selected: true },
  { id: 'REC-132', Patient_ID: 'PT-9305', Patient_Persona: 'Non-Native English Speaker', Age_Group: '75+', Visit_Type: 'Inpatient', Service_Line: 'Internal Medicine', Year: 2024, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'High', AI_Risk_Flag: 'Bias Review', Comment: DISTINCT_COMMENTS_SEED[4].text, selected: true },

  // C06 records (Billing surprise / Financial stress)
  { id: 'REC-133', Patient_ID: 'PT-9401', Patient_Persona: 'Self-Pay Patient', Age_Group: '36-50', Visit_Type: 'Outpatient', Service_Line: 'Orthopedics', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[5].text, selected: true },
  { id: 'REC-134', Patient_ID: 'PT-9402', Patient_Persona: 'Working Parent', Age_Group: '18-35', Visit_Type: 'Outpatient', Service_Line: 'Pediatrics', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[5].text, selected: true },
  { id: 'REC-135', Patient_ID: 'PT-9403', Patient_Persona: 'Tech-Savvy Professional', Age_Group: '36-50', Visit_Type: 'Outpatient', Service_Line: 'Cardiology', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[5].text, selected: true },
  { id: 'REC-136', Patient_ID: 'PT-9404', Patient_Persona: 'Self-Pay Patient', Age_Group: '51-64', Visit_Type: 'Outpatient', Service_Line: 'Orthopedics', Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[5].text, selected: true },

  // C07 records (Telemedicine delay / Scheduling failure)
  { id: 'REC-137', Patient_ID: 'PT-9501', Patient_Persona: 'Working Parent', Age_Group: '36-50', Visit_Type: 'Telehealth', Service_Line: 'Internal Medicine', Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[6].text, selected: true },
  { id: 'REC-138', Patient_ID: 'PT-9502', Patient_Persona: 'Tech-Savvy Professional', Age_Group: '18-35', Visit_Type: 'Telehealth', Service_Line: 'Internal Medicine', Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[6].text, selected: true },
  { id: 'REC-139', Patient_ID: 'PT-9503', Patient_Persona: 'Rural Senior', Age_Group: '65-74', Visit_Type: 'Telehealth', Service_Line: 'Cardiology', Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: 'Moderate', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[6].text, selected: true },
  { id: 'REC-140', Patient_ID: 'PT-9504', Patient_Persona: 'Working Parent', Age_Group: '18-35', Visit_Type: 'Telehealth', Service_Line: 'Pediatrics', Year: 2024, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[6].text, selected: true },

  // C08 records (Dr Adams treatment options / Exemplary Physician)
  { id: 'REC-141', Patient_ID: 'PT-9601', Patient_Persona: 'Elderly Chronic Care', Age_Group: '65-74', Visit_Type: 'Outpatient', Service_Line: 'Oncology', Year: 2026, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[7].text, selected: true },
  { id: 'REC-142', Patient_ID: 'PT-9602', Patient_Persona: 'Working Parent', Age_Group: '36-50', Visit_Type: 'Outpatient', Service_Line: 'Cardiology', Year: 2025, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[7].text, selected: true },
  { id: 'REC-143', Patient_ID: 'PT-9603', Patient_Persona: 'Tech-Savvy Professional', Age_Group: '18-35', Visit_Type: 'Outpatient', Service_Line: 'Internal Medicine', Year: 2026, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[7].text, selected: true },
  { id: 'REC-144', Patient_ID: 'PT-9604', Patient_Persona: 'Disability Advocate', Age_Group: '51-64', Visit_Type: 'Outpatient', Service_Line: 'Orthopedics', Year: 2025, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[7].text, selected: true },
  { id: 'REC-145', Patient_ID: 'PT-9605', Patient_Persona: 'Rural Senior', Age_Group: '75+', Visit_Type: 'Outpatient', Service_Line: 'Cardiology', Year: 2024, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[7].text, selected: true },
  { id: 'REC-146', Patient_ID: 'PT-9606', Patient_Persona: 'Self-Pay Patient', Age_Group: '36-50', Visit_Type: 'Outpatient', Service_Line: 'Oncology', Year: 2026, Patient_Satisfaction: 5, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: 'Low', AI_Risk_Flag: 'None', Comment: DISTINCT_COMMENTS_SEED[7].text, selected: true },
];

/**
 * Robust CSV parser that correctly handles quoted strings with internal commas and newlines
 */
export function parseCSV(csvText: string): PatientRecord[] {
  const lines: string[] = [];
  let currentLine = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
      currentLine += char;
    } else if (char === '\n' && !insideQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  if (lines.length < 2) return [];

  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let curVal = '';
    let inQuote = false;

    for (let j = 0; j < line.length; j++) {
      const c = line[j];
      if (c === '"') {
        if (inQuote && line[j + 1] === '"') {
          curVal += '"';
          j++;
        } else {
          inQuote = !inQuote;
        }
      } else if (c === ',' && !inQuote) {
        values.push(curVal.trim());
        curVal = '';
      } else {
        curVal += c;
      }
    }
    values.push(curVal.trim());
    return values;
  };

  const header = parseLine(lines[0]).map(h => h.replace(/^["']|["']$/g, '').trim());
  
  const records: PatientRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    if (cols.length === 0 || (cols.length === 1 && !cols[0])) continue;

    const rowObj: any = {};
    header.forEach((h, index) => {
      rowObj[h] = cols[index] !== undefined ? cols[index] : '';
    });

    const record: PatientRecord = {
      id: rowObj.Record_ID || rowObj.id || `REC-${100 + i}`,
      Patient_ID: rowObj.Patient_ID || `PT-${8000 + i}`,
      Patient_Persona: rowObj.Patient_Persona || 'General Patient',
      Age_Group: rowObj.Age_Group || '36-50',
      Visit_Type: rowObj.Visit_Type || 'Outpatient',
      Service_Line: rowObj.Service_Line || 'Internal Medicine',
      Year: parseInt(rowObj.Year, 10) || 2025,
      Patient_Satisfaction: parseFloat(rowObj.Patient_Satisfaction) || 3,
      Communication_Rating: parseFloat(rowObj.Communication_Rating) || 3,
      Followup_Compliance: parseInt(rowObj.Followup_Compliance, 10) === 1 ? 1 : 0,
      Portal_Usage: parseInt(rowObj.Portal_Usage, 10) === 1 ? 1 : 0,
      Readmission_Risk: ['Low', 'Moderate', 'High'].includes(rowObj.Readmission_Risk) ? rowObj.Readmission_Risk : 'Moderate',
      AI_Risk_Flag: rowObj.AI_Risk_Flag || 'None',
      Comment: rowObj.Comment || 'No comment provided.',
      selected: true,
    };
    records.push(record);
  }

  return records;
}

/**
 * Export patient records as CSV format
 */
export function exportRecordsToCSV(records: PatientRecord[]): string {
  const headers = [
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

  const escapeCSV = (val: any) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = records.map(r => [
    escapeCSV(r.id),
    escapeCSV(r.Patient_ID),
    escapeCSV(r.Patient_Persona),
    escapeCSV(r.Age_Group),
    escapeCSV(r.Visit_Type),
    escapeCSV(r.Service_Line),
    r.Year,
    r.Patient_Satisfaction,
    r.Communication_Rating,
    r.Followup_Compliance,
    r.Portal_Usage,
    escapeCSV(r.Readmission_Risk),
    escapeCSV(r.AI_Risk_Flag),
    escapeCSV(r.Comment),
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}
