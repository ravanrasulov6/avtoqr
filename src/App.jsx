import React, { useState, useEffect } from 'react';
import ScanPage from './pages/ScanPage';
import AdminPortal from './pages/AdminPortal';
import NotFound from './pages/NotFound';
import PremiumSplashScreen from './components/PremiumSplashScreen';
import { Eye, ShieldCheck, ArrowRight } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Synchronize route pathname changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, '', to);
    setCurrentPath(to);
  };

  const renderPage = () => {
    // Normalize path by removing trailing slash
    const path = currentPath.replace(/\/$/, '') || '/';

    // 1. Home / Welcome Screen
    if (path === '/' || path === '/index.html') {
      return (
        <div className="blueprint-grid min-h-screen flex flex-col items-center justify-center p-6 text-center relative">
          {/* Layout frame corners */}
          <div className="absolute inset-6 border border-dashed border-[rgba(191,163,122,0.18)] pointer-events-none rounded" />
          <div className="blueprint-corner blueprint-corner-tl" style={{ top: '23px', left: '23px' }} />
          <div className="blueprint-corner blueprint-corner-tr" style={{ top: '23px', right: '23px' }} />
          <div className="blueprint-corner blueprint-corner-bl" style={{ bottom: '23px', left: '23px' }} />
          <div className="blueprint-corner blueprint-corner-br" style={{ bottom: '23px', right: '23px' }} />

          <div className="max-w-md w-full bg-white/70 backdrop-blur border border-[rgba(191,163,122,0.2)] rounded-lg p-8 shadow-sm relative">
            <div className="w-12 h-12 rounded bg-[rgba(191,163,122,0.1)] flex items-center justify-center text-[#bfa37a] mx-auto mb-4">
              <ShieldCheck size={26} />
            </div>

             <h1 className="text-2xl font-extrabold text-slate-900 tracking-wider font-mono uppercase mb-2">
              AVTO QR
            </h1>
            <p className="text-xs text-[#bfa37a] font-mono tracking-widest uppercase mb-6">
              Sürətli Əlaqə & Bildiriş Sistemi
            </p>

            <p className="text-slate-650 text-xs md:text-sm font-sans mb-8 leading-relaxed">
              Bu tətbiq avtomobil ön şüşəsinə yerləşdirilən QR kod vasitəsilə sürücü ilə zəng və ya WhatsApp vasitəsilə 
              anonim şəkildə sürətli əlaqə qurmağı təmin edir.
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate('/admin')} 
                className="w-full py-3 rounded btn-gold text-xs font-mono uppercase flex items-center justify-center gap-1.5"
              >
                <span>Admin Portalına Keç</span>
                <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-center gap-4 text-[9px] font-mono text-slate-400 uppercase tracking-widest">
              <span>SİSTEM: 1.0</span>
              <span>•</span>
              <span>VİTE + REACT</span>
              <span>•</span>
              <span>SUPABASE</span>
            </div>
          </div>
        </div>
      );
    }

    // 2. Admin Portal
    if (path === '/admin') {
      return <AdminPortal navigate={navigate} />;
    }

    // 3. Scan profiles (Any other route is evaluated as a custom slug or uuid)
    let slug = path.substring(1); // remove leading slash
    if (slug) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      if (!isUuid) {
        slug = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
      }
      return <ScanPage slug={slug} navigate={navigate} />;
    }

    return <NotFound navigate={navigate} />;
  };

  return (
    <>
      {showSplash && <PremiumSplashScreen onComplete={() => setShowSplash(false)} />}
      {!showSplash && renderPage()}
    </>
  );
}
