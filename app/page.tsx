'use client';

import React, { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scan' | 'healthCard' | 'history' | 'reports'>('dashboard');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'hindi' | 'english'>('all');
  const [scanningState, setScanningState] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [apiResult, setApiResult] = useState<any>(null);
  const [hasIntervention, setHasIntervention] = useState(false);
  const [simulatedCategory, setSimulatedCategory] = useState<'food' | 'appliance' | 'unknown'>('food');

  // Actual Backend API Integration Call
  const handleStartScan = async () => {
    setScanningState('scanning');
    setApiResult(null);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanType: simulatedCategory }),
      });

      const data = await res.json();
      if (data.success) {
        setApiResult(data);
        setScanningState('complete');
      }
    } catch (err) {
      console.error(err);
      setScanningState('idle');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* HEADER / NAVIGATION */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-700 text-white font-bold flex items-center justify-center text-xs tracking-wider">
                LM
              </div>
              <div>
                <div className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">Government of India</div>
                <h1 className="text-sm font-bold tracking-tight text-slate-100">
                  Legal Metrology Product Verification System
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs">
              <span className="inline-flex items-center px-2 py-0.5 border border-emerald-500/40 text-[11px] font-medium bg-emerald-950/60 text-emerald-300">
                ● API Online
              </span>
            </div>
          </div>

          <nav className="flex space-x-1 overflow-x-auto border-t border-slate-800 text-xs font-semibold uppercase tracking-wider">
            {(['dashboard', 'scan', 'healthCard', 'history', 'reports'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab ? 'border-emerald-500 text-emerald-400 bg-slate-800' : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                {tab === 'scan' ? 'Scan Product' : tab === 'healthCard' ? 'Product Health Card' : tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Product Verification Dashboard</h2>
              <p className="text-sm text-slate-600 mt-1">
                AI-assisted verification of packaged commodities and appliances under Legal Metrology regulations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-300 p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Products Scanned</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-2">1,482</div>
              </div>
              <div className="bg-white border border-emerald-300 p-5 shadow-sm border-l-4 border-l-emerald-600">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Compliant</div>
                <div className="text-3xl font-extrabold text-emerald-700 mt-2">1,194</div>
              </div>
              <div className="bg-white border border-red-300 p-5 shadow-sm border-l-4 border-l-red-600">
                <div className="text-xs font-semibold uppercase tracking-wider text-red-800">Non-Compliant</div>
                <div className="text-3xl font-extrabold text-red-700 mt-2">198</div>
              </div>
              <div className="bg-white border border-amber-300 p-5 shadow-sm border-l-4 border-l-amber-500">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-800">Needs Review</div>
                <div className="text-3xl font-extrabold text-amber-700 mt-2">90</div>
              </div>
            </div>
          </div>
        )}

        {/* SCAN PRODUCT */}
        {activeTab === 'scan' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Scan / Upload Product</h2>
              <p className="text-sm text-slate-600 mt-1">
                Connects directly to server-side OCR & AI Inspection API Route.
              </p>
            </div>

            <div className="bg-white border border-slate-300 p-6 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <button onClick={handleStartScan} className="bg-slate-900 text-white py-3 px-4 text-xs font-semibold uppercase tracking-wider">
                  📷 Open Camera
                </button>
                <button onClick={handleStartScan} className="bg-slate-100 text-slate-900 py-3 px-4 text-xs font-semibold uppercase tracking-wider border border-slate-300">
                  🖼 Upload Image
                </button>
                <button onClick={handleStartScan} className="bg-slate-100 text-slate-900 py-3 px-4 text-xs font-semibold uppercase tracking-wider border border-slate-300">
                  🏷 Upload Label
                </button>
                <button onClick={handleStartScan} className="bg-slate-100 text-slate-900 py-3 px-4 text-xs font-semibold uppercase tracking-wider border border-slate-300">
                  ║▌ Scan Barcode
                </button>
              </div>

              {scanningState === 'scanning' && (
                <div className="p-6 bg-slate-900 text-emerald-400 text-center font-mono text-xs border border-slate-800">
                  [CALLING API ROUTE `/api/verify`...] Processing inspection request...
                </div>
              )}

              {scanningState === 'idle' && (
                <div className="border-2 border-dashed border-slate-300 p-12 text-center bg-slate-50 text-xs text-slate-600">
                  Click any option above to trigger server-side verification.
                </div>
              )}

              {scanningState === 'complete' && apiResult && (
                <div className="space-y-6 mt-6 pt-6 border-t border-slate-200 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 uppercase font-semibold block text-[10px]">Product Type</span>
                      <span className="font-bold text-slate-900 mt-0.5 block">{apiResult.analysis.productType}</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 uppercase font-semibold block text-[10px]">Languages</span>
                      <span className="font-bold text-slate-900 mt-0.5 block">{apiResult.analysis.languages.join(' + ')}</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 uppercase font-semibold block text-[10px]">OCR Confidence</span>
                      <span className="font-bold text-emerald-700 mt-0.5 block">{apiResult.analysis.ocrConfidence}</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 uppercase font-semibold block text-[10px]">Result</span>
                      <span className="font-bold text-emerald-800 mt-0.5 block">{apiResult.compliance.status}</span>
                    </div>
                  </div>

                  <div className="border border-slate-300 p-4 bg-white">
                    <h4 className="font-bold uppercase tracking-wider border-b pb-2 mb-3">Extracted Commodity Declarations</h4>
                    <div>Manufacturer: <strong>{apiResult.extractedData.manufacturer}</strong></div>
                    <div className="mt-1">Product Name: <strong>{apiResult.extractedData.productName}</strong></div>
                    <div className="mt-1">MRP: <strong>{apiResult.extractedData.mrp}</strong></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRODUCT HEALTH CARD */}
        {activeTab === 'healthCard' && (
          <div className="bg-white border border-slate-300 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Product Health Card Module</h2>
            <p className="text-xs text-slate-600 mt-1">Simulated Backend Nutritional Response Data</p>
          </div>
        )}

        {/* HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-white border border-slate-300 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Verification History Log</h2>
          </div>
        )}

        {/* REPORTS */}
        {activeTab === 'reports' && (
          <div className="bg-white border border-slate-300 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">System Inspection Reports</h2>
          </div>
        )}

      </main>

      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-16 py-8 text-xs text-center">
        Legal Metrology Product Verification System — Full Stack Next.js App
      </footer>
    </div>
  );
}