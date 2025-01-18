'use client';

interface ExportFormat {
  mimeType: string;
  extension: string;
  transform: (data: any[]) => string;
}

export const exportFormats: Record<string, ExportFormat> = {
  json: {
    mimeType: 'application/json',
    extension: 'json',
    transform: (data) => JSON.stringify(data, null, 2)
  },
  csv: {
    mimeType: 'text/csv',
    extension: 'csv',
    transform: (data) => {
      const headers = ['State', 'Carrier', 'Denied Item', 'Date', 'Rebuttal', 'Code', 'Evidence'];
      const rows = data.map(r => [
        r.state,
        r.carrier,
        r.deniedItem,
        new Date(r.date).toLocaleDateString(),
        r.rebuttalText,
        r.code,
        Array.isArray(r.evidence) ? r.evidence.join('; ') : r.evidence
      ]);
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
  },
  pdf: {
    mimeType: 'application/pdf',
    extension: 'pdf',
    transform: (data) => {
      // This is a placeholder. You'll need to implement actual PDF generation
      // Consider using libraries like jsPDF or pdfmake
      return JSON.stringify(data);
    }
  }
};

export const downloadFile = (content: string, filename: string, format: string) => {
  const blob = new Blob([content], { type: exportFormats[format].mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.${exportFormats[format].extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}; 