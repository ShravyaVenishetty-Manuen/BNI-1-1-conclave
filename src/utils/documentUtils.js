/**
 * Utility helper to open or download uploaded agenda documents cleanly.
 * Converts base64 Data URLs into Blob URLs so PDF readers and browsers
 * open and download valid binary files without corrupting them.
 */
export function downloadOrViewAgendaDocument(agendaDoc) {
  if (!agendaDoc) return;

  const fileName = agendaDoc.name || 'conclave_agenda.pdf';

  // 1. Direct physical server static URL on backend port 3000
  if (agendaDoc.url && agendaDoc.url.startsWith('/uploads')) {
    const backendUrl = `http://localhost:3000${agendaDoc.url}`;
    const win = window.open(backendUrl, '_blank');
    if (!win) {
      const a = document.createElement('a');
      a.href = backendUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    return;
  }

  // 2. Convert base64 dataUrl to binary Blob URL for clean PDF viewer rendering
  if (agendaDoc.dataUrl && agendaDoc.dataUrl.includes(';base64,')) {
    try {
      const parts = agendaDoc.dataUrl.split(';base64,');
      const mime = parts[0].replace('data:', '') || agendaDoc.type || 'application/pdf';
      const base64Str = parts[1];
      const binaryStr = window.atob(base64Str);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mime });
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
      return;
    } catch (e) {
      console.warn("Blob conversion failed, using fallback:", e);
    }
  }

  // 3. Fallback direct URL handling
  const fileUrl = agendaDoc.url || agendaDoc.dataUrl || '';
  if (fileUrl) {
    window.open(fileUrl, '_blank');
  }
}
