
export function generateId(): string {
  const dateStr = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 8);
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `SWC-${dateStr}-${randomStr}`;
}

export function generateHash(): string {
  return Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
