
export enum ErasureStatus {
  IDLE = 'IDLE',
  HASHING = 'HASHING',
  WIPING = 'WIPING',
  VERIFYING = 'VERIFYING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface ErasureTask {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  passes: number;
  originalHash: string;
  finalHash: string;
  status: ErasureStatus;
  wipeDate: string;
  standardCompliance: string;
  securityNote?: string;
}

export interface CertificateData extends ErasureTask {
  toolVersion: string;
  authorizedBy: string;
  verificationUrl: string;
  signatureBase64?: string;
}
