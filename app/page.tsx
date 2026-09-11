'use client';

import React, { useState, useRef } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scan' | 'healthCard' | 'history' | 'reports'>('dashboard');
  const [scanningState, setScanningState] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [apiResult, setApiResult] = useState<any>(null);
  const [hasIntervention, setHasIntervention] = useState(false);
  const [simulatedCategory, setSimulatedCategory] = useState<'food' | 'appliance' | 'unknown'>('food');

  // Camera & Image States
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Open Device Camera
  const startCamera = async () => {
    setCapturedImage(null);
    setCameraActive(true);
    setScanningState('idle');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access denied or unavailable. Please check permissions or upload an image.');
      setCameraActive(false);
    }
  };

  // 2. Capture Photo from Camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);

        // Stop Camera Stream after capture
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        setCameraActive(false);
      }
    }
  };

  // 3. Handle Local File/Label Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setCameraActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // 4. Trigger Backend API Inspection
  const handleAnalyzeProduct = async () => {
    if (!capturedImage) {
      alert('Please open camera or upload an image first!');
      return;
    }

    setScanningState('scanning');
    setApiResult(null);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanType: simulatedCategory, image: capturedImage }),
      });

      const data = await res.json();
      if (data.success) {
        setApiResult(data);
        setScanningState('complete');
      }
    } catch (err) {
      console.error(err);
      alert('API Verification Failed');
      setScanningState('idle');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Hidden Canvas & File Input */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

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
                ● Live Camera API
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

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* DASHBOARD TAB */}
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

        {/* SCAN PRODUCT TAB */}
        {activeTab === 'scan' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Scan / Upload Product</h2>
              <p className="text-sm text-slate-600 mt-1">
                Supports real-time camera capture, packaging label uploads, and AI commodity verification.
              </p>
            </div>

            <div className="bg-white border border-slate-300 p-6 shadow-sm">
              
              {/* Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                <button
                  onClick={startCamera}
                  className="bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 text-xs font-semibold uppercase tracking-wider border border-slate-800 text-center"
                >
                  📷 Open Live Camera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 py-3 px-4 text-xs font-semibold uppercase tracking-wider border border-slate-300 text-center"
                >
                  🖼 Upload Photo / Label
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 py-3 px-4 text-xs font-semibold uppercase tracking-wider border border-slate-300 text-center col-span-2 sm:col-span-1"
                >
                  ║▌ Barcode Upload
                </button>
              </div>

              {/* LIVE CAMERA FEED AREA */}
              {cameraActive && (
                <div className="mb-6 p-4 bg-slate-900 border border-slate-800 text-center space-y-3">
                  <div className="text-xs text-emerald-400 font-mono">[CAMERA FEED ACTIVE] Align product label within frame</div>
                  <video ref={videoRef} autoPlay playsInline className="max-h-72 mx-auto border border-slate-700 bg-black" />
                  <button
                    onClick={capturePhoto}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5"
                  >
                    📸 Click / Capture Snapshot
                  </button>
                </div>
              )}

              {/* CAPTURED / UPLOADED IMAGE PREVIEW */}
              {capturedImage && (
                <div className="mb-6 p-4 bg-slate-50 border border-slate-300 text-center space-y-3">
                  <div className="text-xs font-bold text-slate-700">Selected Product Frame Preview</div>
                  <img src={capturedImage} alt="Captured product" className="max-h-64 mx-auto border border-slate-300 shadow-sm" />
                  
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleAnalyzeProduct}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wide px-6 py-2.5 shadow"
                    >
                      🔍 Run AI Inspection API
                    </button>
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs uppercase px-4 py-2.5"
                    >
                      Clear Image
                    </button>
                  </div>
                </div>
              )}

              {/* IDLE PLACEHOLDER */}
              {!cameraActive && !capturedImage && scanningState === 'idle' && (
                <div className="border-2 border-dashed border-slate-300 p-12 text-center bg-slate-50">
                  <div className="text-sm font-semibold text-slate-700">Click "Open Live Camera" or "Upload Photo" above</div>
                  <div className="text-xs text-slate-500 mt-1">Take a photo of any packaged commodity label to perform Legal Metrology checks.</div>
                </div>
              )}

              {/* SCANNING IN PROGRESS BANNER */}
              {scanningState === 'scanning' && (
                <div className="p-6 bg-slate-900 text-emerald-400 text-center font-mono text-xs border border-slate-800">
                  [CALLING SERVER API `/api/verify`...] Extracting OCR declarations & verifying standards...
                </div>
              )}

              {/* API RESULT DISPLAY */}
              {scanningState === 'complete' && apiResult && (
                <div className="space-y-6 mt-6 pt-6 border-t border-slate-200 text-xs">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">
                      AI Product Inspection Analysis
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-3 bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 uppercase font-semibold block text-[10px]">Product Type</span>
                        <span className="font-bold text-slate-900 mt-0.5 block">{apiResult.analysis.productType}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 uppercase font-semibold block text-[10px]">Shape Detection</span>
                        <span className="font-bold text-slate-900 mt-0.5 block">{apiResult.analysis.shapeDetected}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 uppercase font-semibold block text-[10px]">Languages Detected</span>
                        <span className="font-bold text-slate-900 mt-0.5 block">{apiResult.analysis.languages.join(' + ')}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 uppercase font-semibold block text-[10px]">OCR Confidence</span>
                        <span className="font-bold text-emerald-700 mt-0.5 block">{apiResult.analysis.ocrConfidence}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-slate-300 p-5 bg-white">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2 mb-3">
                        Extracted Commodity Declarations
                      </h4>
                      <table className="w-full text-xs text-left">
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-2 text-slate-500 font-medium">Manufacturer / Packer:</td>
                            <td className="py-2 font-semibold text-slate-900">{apiResult.extractedData.manufacturer}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-slate-500 font-medium">Product Name:</td>
                            <td className="py-2 font-semibold text-slate-900">{apiResult.extractedData.productName}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-slate-500 font-medium">Net Quantity:</td>
                            <td className="py-2 font-semibold text-slate-900">{apiResult.extractedData.netQuantity}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-slate-500 font-medium">MRP:</td>
                            <td className="py-2 font-semibold text-slate-900">{apiResult.extractedData.mrp}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-slate-500 font-medium">Country of Origin:</td>
                            <td className="py-2 font-semibold text-slate-900">{apiResult.extractedData.countryOfOrigin}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="border border-emerald-300 p-5 bg-emerald-50/30">
                      <div className="flex items-center justify-between border-b border-emerald-200 pb-2 mb-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                          Verification Result
                        </h4>
                        <span className="px-2 py-0.5 text-xs font-bold bg-emerald-700 text-white uppercase tracking-wider">
                          {apiResult.compliance.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        {apiResult.compliance.checklist.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center text-emerald-900 font-medium">
                            <span className="mr-2 font-bold text-emerald-700">✓</span> {item.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* HEALTH CARD TAB */}
        {activeTab === 'healthCard' && (
          <div className="bg-white border border-slate-300 p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Product Health Card Module</h2>
            <p className="text-xs text-slate-600">Nutritional analysis generated from scanned package labels.</p>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="bg-white border border-slate-300 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Verification History Log</h2>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="bg-white border border-slate-300 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Inspection Reports</h2>
          </div>
        )}

      </main>

      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-16 py-8 text-xs text-center">
        Legal Metrology Product Verification System — Interactive Live Camera & Image AI Inspection
      </footer>
    </div>
  );
}