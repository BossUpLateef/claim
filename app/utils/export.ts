import type { RebuttalData } from '../types/feedback';
import { formatDate, isValidDate } from './date';

export type ExportFormat = 'csv' | 'json' | 'txt';

export const exportRebuttals = (
  rebuttals: RebuttalData[],
  format: ExportFormat = 'csv',
  filename?: string
) => {
  const timestamp = formatDate(new Date());
  const defaultFilename = `rebuttals_${timestamp.replace(/[^0-9a-zA-Z]/g, '_')}`;

  const processedData = rebuttals.map(r => ({
    Date: isValidDate(r.date) ? formatDate(r.date) : 'N/A',
    State: r.state || 'N/A',
    Carrier: r.carrier || 'N/A',
    'Denied Item': r.deniedItem || 'N/A',
    'Carrier Reason': r.carrierReason || 'N/A',
    'Rebuttal Text': r.rebuttalText || 'N/A',
    'Supporting Evidence': Array.isArray(r.evidence) ? r.evidence.join('; ') : 'N/A',
    Status: r.successful ? 'Successful' : 'Pending'
  }));

  try {
    switch (format) {
      case 'csv':
        exportCSV(processedData, filename || `${defaultFilename}.csv`);
        break;
      case 'json':
        exportJSON(rebuttals, filename || `${defaultFilename}.json`);
        break;
      case 'txt':
        exportTXT(rebuttals, filename || `${defaultFilename}.txt`);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Failed to export data. Please try again.');
  }
};

const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportCSV = (data: Record<string, any>[], filename: string) => {
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const cell = row[header]?.toString() || '';
          return `"${cell.replace(/"/g, '""')}"`;
        })
        .join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

const exportJSON = (data: RebuttalData[], filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

const exportTXT = (data: RebuttalData[], filename: string) => {
  const textContent = data.map(r => `
=== Rebuttal Record ===
Date: ${new Date(r.date).toLocaleDateString()}
State: ${r.state}
Carrier: ${r.carrier}
Denied Item: ${r.deniedItem}
Carrier Reason: ${r.carrierReason}

REBUTTAL TEXT:
${r.rebuttalText}

SUPPORTING EVIDENCE:
${r.evidence.map((e, i) => `${i + 1}. ${e}`).join('\n')}

Status: ${r.successful ? 'Successful' : 'Pending'}
====================
`).join('\n\n');

  downloadFile(textContent, filename, 'text/plain;charset=utf-8');
}; 