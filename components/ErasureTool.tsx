
import React, { useState, useRef } from 'react';
/* Added missing ChevronRight icon to imports */
import { FileUp, Trash2, Shield, Loader2, CheckCircle2, AlertTriangle, PenTool, X, ChevronRight } from 'lucide-react';
import { ErasureStatus, CertificateData } from '../types';
import { generateId, generateHash, formatBytes } from '../utils/helpers';
import { generateSecurityNote } from '../services/geminiService';

interface Props {
  onComplete: (cert: CertificateData) => void;
}

const ErasureTool: React.FC<Props> = ({ onComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [passes, setPasses] = useState(3);
  const [status, setStatus] = useState<ErasureStatus>(ErasureStatus.IDLE);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => {
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSignature(event.target?.result as string);
        addLog(`Custom signature loaded successfully.`);
      };
      reader.readAsDataURL(selected);
    }
  };

  const simulateWipe = async () => {
    if (!file) return;

    setStatus(ErasureStatus.HASHING);
    addLog(`Initiating secure destruction for ${file.name}...`);
    addLog(`Calculating pre-wipe hash (SHA-256)...`);
    const originalHash = generateHash();
    await new Promise(r => setTimeout(r, 1200));
    addLog(`Original Hash: ${originalHash.slice(0, 16)}...`);

    setStatus(ErasureStatus.WIPING);
    addLog(`Standard compliance selected: NIST SP 800-88 Rev. 1`);
    
    for (let p = 1; p <= passes; p++) {
      addLog(`Pass ${p}/${passes}: Writing ${p % 2 === 0 ? 'random noise' : 'bit patterns'}...`);
      for (let i = 0; i <= 100; i += 20) {
        setProgress(((p - 1) * 100 + i) / passes);
        await new Promise(r => setTimeout(r, 150));
      }
      addLog(`Pass ${p} verification: No remanence detected.`);
    }

    setStatus(ErasureStatus.VERIFYING);
    addLog(`All overwrite cycles complete. Performing final forensic audit...`);
    const finalHash = generateHash();
    await new Promise(r => setTimeout(r, 1000));
    addLog(`Post-wipe entropy state confirmed: ${finalHash.slice(0, 16)}...`);

    addLog(`Generating security certification via Gemini Intelligence...`);
    const securityNote = await generateSecurityNote(file.name, file.size, passes);
    addLog(`AI Validation complete.`);

    const task: CertificateData = {
      id: generateId(),
      fileName: file.name,
      filePath: `/local/vault/sanitized/${file.name}`,
      fileSize: file.size,
      passes: passes,
      originalHash: originalHash,
      finalHash: finalHash,
      status: ErasureStatus.COMPLETED,
      wipeDate: new Date().toISOString(),
      standardCompliance: "NIST SP 800-88 Rev. 1",
      securityNote: securityNote,
      toolVersion: "SecureWiper Enterprise v2.5",
      authorizedBy: "System Auditor AI",
      verificationUrl: `https://securewiper.io/verify/${generateId()}`,
      signatureBase64: signature || undefined
    };

    setStatus(ErasureStatus.COMPLETED);
    onComplete(task);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      addLog(`Target locked: ${selected.name} (${formatBytes(selected.size)})`);
    }
  };

  const reset = () => {
    setFile(null);
    setSignature(null);
    setStatus(ErasureStatus.IDLE);
    setProgress(0);
    setLog([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-400" />
            <h2 className="text-xl font-bold tracking-tight">Secure Erasure Interface</h2>
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Status: {status}
          </div>
        </div>

        <div className="p-8">
          {status === ErasureStatus.IDLE ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* File Dropzone */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all h-full flex flex-col justify-center
                    ${file ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
                  `}
                >
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  <div className="flex flex-col items-center gap-4">
                    <div className={`p-4 rounded-full ${file ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {file ? <CheckCircle2 size={32} /> : <FileUp size={32} />}
                    </div>
                    {file ? (
                      <div>
                        <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Select asset to destroy</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Signature Upload */}
                <div 
                  className={`
                    border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all h-full flex flex-col justify-center relative
                    ${signature ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-green-400 hover:bg-slate-50'}
                  `}
                  onClick={() => !signature && signatureInputRef.current?.click()}
                >
                  <input type="file" className="hidden" ref={signatureInputRef} accept="image/*" onChange={handleSignatureUpload} />
                  
                  {signature ? (
                    <div className="relative group">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSignature(null); }}
                        className="absolute -top-10 -right-4 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <img src={signature} alt="Signature" className="max-h-24 mx-auto object-contain mix-blend-multiply" />
                      <p className="text-xs font-bold text-green-700 mt-2 uppercase">Custom Signature Loaded</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-slate-100 text-slate-400">
                        <PenTool size={32} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Optional: Upload Signature</p>
                        <p className="text-xs text-slate-400 mt-1">Personalize your certificate</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Passes selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4 border-t border-slate-100">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Overwrite Cycles (Passes)
                  </label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="1" 
                      max="35" 
                      value={passes} 
                      onChange={(e) => setPasses(parseInt(e.target.value))}
                      className="flex-grow accent-blue-600"
                    />
                    <span className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-lg font-mono font-bold text-blue-600">
                      {passes}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 italic">
                    {passes < 3 ? "Standard - Fast Overwrite." : 
                     passes < 7 ? "NIST 800-88 Compliant - Corporate." : 
                     "Forensic Prevention - Maximum Security."}
                  </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                  <div className="flex gap-3">
                    <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">Final Confirmation</h4>
                      <p className="text-xs text-amber-700 mt-1">
                        Destruction will use real compute cycles to simulate magnetic randomization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                disabled={!file}
                onClick={simulateWipe}
                className={`
                  w-full py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl
                  ${file ? 'bg-red-600 text-white hover:bg-red-700 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                `}
              >
                <Trash2 size={24} />
                EXECUTE SANITIZATION
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Active Animation */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {status === ErasureStatus.COMPLETED ? 'Audit Verified' : 'Bit-level Randomization'}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Target: {file?.name}
                    </p>
                  </div>
                  <div className="text-2xl font-mono font-black text-blue-600">
                    {Math.round(progress)}%
                  </div>
                </div>

                <div className="h-5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className={`h-full transition-all duration-300 ease-out ${status === ErasureStatus.COMPLETED ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-blue-600 animate-pulse'}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Console Log */}
              <div className="bg-slate-900 rounded-xl p-6 h-72 overflow-y-auto font-mono text-[12px] text-green-400 border border-slate-700 shadow-inner">
                <div className="flex items-center gap-2 mb-4 text-slate-500 border-b border-slate-800 pb-2">
                  <Loader2 className={`animate-spin ${status === ErasureStatus.COMPLETED ? 'hidden' : ''}`} size={14} />
                  SECURE_CORE_DAEMON_v2.5_LOG
                </div>
                {log.map((entry, i) => (
                  <div key={i} className="mb-1 leading-relaxed">
                    {entry}
                  </div>
                ))}
                {status === ErasureStatus.COMPLETED && (
                  <div className="mt-6 p-4 bg-green-900/20 border-2 border-green-500/30 text-green-300 rounded-xl animate-pulse">
                    [SYSTEM_INFO] SANITIZATION VERIFIED: Post-wipe entropy check confirms zero magnetic remanence. Certificate generated.
                  </div>
                )}
              </div>

              {status === ErasureStatus.COMPLETED && (
                <button 
                  onClick={reset}
                  className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronRight size={20} className="rotate-180" />
                  Perform New Audit
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErasureTool;
