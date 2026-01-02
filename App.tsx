
import React, { useState, useEffect } from 'react';
import { Shield, ChevronLeft, Download, Printer, Share2 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ErasureTool from './components/ErasureTool';
import CertificateView from './components/CertificateView';
import { CertificateData } from './types';

enum View {
  DASHBOARD = 'DASHBOARD',
  WIPE_TOOL = 'WIPE_TOOL',
  CERTIFICATE = 'CERTIFICATE'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [history, setHistory] = useState<CertificateData[]>([]);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  // Load history from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('wiper_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  const saveToHistory = (cert: CertificateData) => {
    const exists = history.find(h => h.id === cert.id);
    if (!exists) {
      const updated = [cert, ...history];
      setHistory(updated);
      localStorage.setItem('wiper_history', JSON.stringify(updated));
    }
    setSelectedCert(cert);
    setCurrentView(View.CERTIFICATE);
  };

  const handleDownloadJSON = () => {
    if (!selectedCert) return;
    const blob = new Blob([JSON.stringify(selectedCert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCert.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation - Hidden when printing */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setCurrentView(View.DASHBOARD)}
          >
            <div className="bg-slate-900 p-1.5 rounded-lg text-blue-400 group-hover:rotate-12 transition-transform">
              <Shield size={22} fill="currentColor" fillOpacity={0.2} />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900 uppercase">
              Secure<span className="text-blue-600">Wiper</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {currentView !== View.DASHBOARD && (
              <button 
                onClick={() => setCurrentView(View.DASHBOARD)}
                className="text-sm font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                <ChevronLeft size={16} />
                Exit System
              </button>
            )}
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/30">
                SD
              </div>
              <span className="hidden sm:inline text-sm font-black text-slate-800 tracking-tighter uppercase">Security Director</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow p-4 md:p-8 bg-slate-50">
        {currentView === View.DASHBOARD && (
          <Dashboard 
            onStartWipe={() => setCurrentView(View.WIPE_TOOL)}
            recentCertificates={history}
            onViewCert={(cert) => {
              setSelectedCert(cert);
              setCurrentView(View.CERTIFICATE);
            }}
            onImportCert={saveToHistory}
          />
        )}

        {currentView === View.WIPE_TOOL && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => setCurrentView(View.DASHBOARD)}
              className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors no-print"
            >
              <ChevronLeft size={16} />
              Return to Control Panel
            </button>
            <ErasureTool onComplete={saveToHistory} />
          </div>
        )}

        {currentView === View.CERTIFICATE && selectedCert && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-4xl mx-auto no-print">
              <button 
                onClick={() => setCurrentView(View.DASHBOARD)}
                className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
              >
                <ChevronLeft size={16} />
                Back to Dashboard
              </button>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleDownloadJSON}
                  className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Download size={16} />
                  Download JSON
                </button>
                <button 
                  onClick={handlePrint}
                  className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Printer size={16} />
                  Print / Save as PDF
                </button>
              </div>
            </div>

            <div className="print-area">
              <CertificateView data={selectedCert} />
            </div>
            
            <div className="max-w-4xl mx-auto mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 no-print flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-200 p-2 rounded-lg text-blue-700">
                  <Share2 size={20} />
                </div>
                <div>
                  <p className="font-bold text-blue-900">Verification Link Available</p>
                  <p className="text-xs text-blue-700">Share this JSON for third-party compliance verification.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedCert));
                  window.alert('Certificate JSON data copied to clipboard');
                }}
                className="text-xs font-bold text-blue-700 hover:underline uppercase tracking-widest"
              >
                Copy JSON Data
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
            © 2025 SecureWiper Global Systems • Enterprise Sanitization Engine
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            NIST SP 800-88 Compliant • Forensic Audit Division
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
