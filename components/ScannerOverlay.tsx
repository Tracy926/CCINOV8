
import React, { useEffect, useRef, useState } from 'react';

interface ScannerOverlayProps {
  onClose: () => void;
  onScan: (result: string) => void;
}

const ScannerOverlay: React.FC<ScannerOverlayProps> = ({ onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }, 
          audio: false 
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Could not access camera. Please check permissions.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simulate a scan after 3 seconds
  useEffect(() => {
    if (stream) {
      const timer = setTimeout(() => {
        onScan("MOCK_QR_PAYMENT_123");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [stream, onScan]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fadeIn">
      <div className="relative flex-1 overflow-hidden flex items-center justify-center">
        {error ? (
          <div className="p-10 text-center space-y-4">
            <i className="fa-solid fa-camera-slash text-5xl text-slate-600"></i>
            <p className="text-white font-bold">{error}</p>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-white/20 text-white rounded-full font-bold"
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            
            {/* Scanner Frame */}
            <div className="relative w-64 h-64 z-10 border-2 border-indigo-500/50 rounded-3xl flex items-center justify-center">
              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl"></div>
              
              {/* Laser line animation */}
              <div className="absolute inset-x-4 h-0.5 bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)] animate-[scanLine_2s_ease-in-out_infinite]"></div>
            </div>
            
            <div className="absolute bottom-16 inset-x-0 text-center z-10">
              <p className="text-white/80 text-sm font-black tracking-widest uppercase animate-pulse">Scanning QR / Barcode...</p>
            </div>
          </>
        )}
      </div>

      <div className="bg-slate-900/90 backdrop-blur-md p-6 flex items-center justify-between">
        <button 
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white text-xl active:scale-90 transition-transform"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="flex gap-4">
           <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform">
            <i className="fa-solid fa-bolt"></i>
          </button>
          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform">
            <i className="fa-solid fa-image"></i>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
};

export default ScannerOverlay;
