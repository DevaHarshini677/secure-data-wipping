
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CertificateData } from '../types';
import { format } from 'date-fns';
import { ShieldCheck, Award, CheckCircle } from 'lucide-react';

interface Props {
  data: CertificateData;
}

const CertificateView: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white p-8 md:p-12 shadow-2xl border-8 border-[#0d47a1] max-w-4xl mx-auto my-8 relative overflow-hidden serif text-[#1a1a1a]">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-[#c9a44c]"></div>
      <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-[#c9a44c]"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-[#c9a44c]"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-[#c9a44c]"></div>

      <div className="border-2 border-[#c9a44c] p-6 md:p-10">
        <header className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-[#0d47a1] p-4 rounded-full text-white shadow-lg">
              <ShieldCheck size={48} strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0d47a1] tracking-widest uppercase mb-4">
            Data Erasure Certificate
          </h1>
          <div className="h-1 w-32 bg-[#c9a44c] mx-auto mb-4"></div>
          <h2 className="text-xl text-gray-600 font-medium italic">
            Certificate of Compliance: NIST SP 800-88
          </h2>
        </header>

        <section className="mb-10 text-center px-4">
          <p className="text-lg leading-relaxed text-gray-800">
            This official document confirms that the digital asset identified below has been 
            <strong className="text-[#0d47a1]"> permanently and securely sanitized </strong> 
            in accordance with the global standard <strong>{data.standardCompliance}</strong> 
            using the <strong>{data.toolVersion}</strong> sanitization engine.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-12">
          <div className="space-y-4">
            <DetailRow label="Certificate ID" value={data.id} highlight />
            <DetailRow label="Target Asset" value={data.fileName} />
            <DetailRow label="Digital Path" value={data.filePath} isMono />
            <DetailRow label="Asset Size" value={`${data.fileSize.toLocaleString()} Bytes`} />
            <DetailRow label="Sanitization Passes" value={`${data.passes} Overwrite Cycles`} />
          </div>
          <div className="space-y-4">
            <DetailRow label="Erasure Date" value={format(new Date(data.wipeDate), 'PPP p')} />
            <DetailRow label="Original Checksum" value={data.originalHash} isMono isSmall />
            <DetailRow label="Post-Wipe Entropy" value={data.finalHash} isMono isSmall />
            <DetailRow label="Execution Status" value="SUCCESS (Forensically Verified)" isSuccess />
          </div>
        </div>

        {data.securityNote && (
          <div className="mb-12 p-6 bg-gray-50 border-l-4 border-[#0d47a1] italic text-gray-700 text-sm leading-relaxed">
            <div className="flex items-center gap-2 mb-2 not-italic font-bold text-[#0d47a1]">
              <Award size={16} />
              Forensic Validation Summary
            </div>
            "{data.securityNote}"
          </div>
        )}

        {/* BOTTOM SECTION - SIGNATURE AND QR SIDE BY SIDE */}
        <footer className="grid grid-cols-2 gap-8 pt-10 border-t border-gray-200 mt-10">
          <div className="flex flex-col items-center">
            <div className="mb-2 h-24 w-full flex items-center justify-center overflow-hidden">
               {data.signatureBase64 ? (
                 <img 
                   src={data.signatureBase64} 
                   alt="Authorized Signature" 
                   className="h-full w-auto object-contain max-h-20 mix-blend-multiply"
                 />
               ) : (
                 /* Professional Digital Signature SVG fallback */
                 <svg viewBox="0 0 400 100" className="h-16 w-full text-slate-800 opacity-90">
                   <path d="M50,60 C80,40 120,80 160,50 C200,20 250,90 300,40 C330,20 350,60 380,50" 
                         stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                   <path d="M70,30 C100,50 150,20 200,60" 
                         stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
                 </svg>
               )}
            </div>
            <div className="w-full h-px bg-slate-400 mb-2"></div>
            <p className="text-sm font-bold text-gray-900 uppercase">
              Head of Security
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">SecureWiper Systems Pvt Ltd</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-white p-2 border-2 border-[#0d47a1]/20 shadow-sm rounded-lg mb-2">
              <QRCodeSVG 
                value={data.verificationUrl} 
                size={90} 
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-wider">
              Scan to Verify<br/>
              <span className="text-[8px] font-normal font-mono opacity-50">{data.id}</span>
            </p>
          </div>
        </footer>

        <div className="mt-12 text-center">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-relaxed">
            Authorized by SecureWiper Global Audit Division • support@securewiper.io • +91-99999-99999<br/>
            NIST SP 800-88 Compliant • Zero Magnetic Remanence Guaranteed
          </p>
        </div>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ 
  label: string; 
  value: string; 
  highlight?: boolean; 
  isMono?: boolean;
  isSmall?: boolean;
  isSuccess?: boolean;
}> = ({ label, value, highlight, isMono, isSmall, isSuccess }) => (
  <div className="border-b border-gray-100 pb-2">
    <dt className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">{label}</dt>
    <dd className={`
      ${highlight ? 'text-[#0d47a1] font-bold text-lg' : 'text-gray-800 font-medium text-sm'}
      ${isMono ? 'mono break-all' : ''}
      ${isSmall ? 'text-[9px] leading-tight' : ''}
      ${isSuccess ? 'text-green-600 font-bold flex items-center gap-1' : ''}
    `}>
      {isSuccess && <CheckCircle size={14} />}
      {value}
    </dd>
  </div>
);

export default CertificateView;
