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

    // 1. Home / Welcome Screen (Luxury Light Landing Page)
    if (path === '/' || path === '/index.html') {
      return (
        <div className="blueprint-grid min-h-screen text-slate-900 flex flex-col pt-24 pb-16 px-4 md:px-8 relative overflow-x-hidden">
          {/* Background Decorative Grid Lines (Architectural Grid Overlay) */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-[rgba(191,163,122,0.15)]"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[rgba(191,163,122,0.15)]"></div>
            <div className="absolute top-0 bottom-0 left-3/4 w-[1px] bg-[rgba(191,163,122,0.15)]"></div>
          </div>

          {/* Navigation Bar */}
          <nav className="border-b border-[rgba(191,163,122,0.15)] bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-40 py-4 px-6 md:px-12 flex justify-between items-center">
            <div className="flex items-center gap-2 font-mono font-black text-slate-900 text-lg tracking-wider">
              <span className="text-[#bfa37a]">AVTO</span>
              <span>QR</span>
            </div>
            <div className="hidden md:flex gap-8 text-[10px] font-mono uppercase text-slate-650 tracking-wider">
              <a href="#features" className="hover:text-[#bfa37a] transition-colors">Üstünlüklər</a>
              <a href="#how-it-works" className="hover:text-[#bfa37a] transition-colors">Necə İşləyir?</a>
            </div>
            <button 
              onClick={() => navigate('/admin')} 
              className="py-2 px-5 border border-[#bfa37a] hover:bg-[#bfa37a]/10 text-[#bfa37a] font-mono text-[10px] uppercase tracking-wider rounded transition-all"
            >
              Giriş
            </button>
          </nav>

          {/* Hero Content Container */}
          <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center gap-12 z-10 my-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side: Slogan, Description & Stats */}
              <div className="flex flex-col items-start text-left">
                <span className="text-[#bfa37a] text-xs font-mono font-bold tracking-[0.3em] uppercase mb-3">
                  Yeni Nəsil Parking Həlləri
                </span>
                <h1 className="text-3xl md:text-5xl font-black font-sans leading-tight tracking-wide mb-6 text-slate-900">
                  QR və NFC ilə <br/>
                  <span className="text-[#bfa37a]">Avtomobilinizi Rahat Saxlayın</span>
                </h1>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
                  Avtomobilinizin ön şüşəsinə yerləşdirilən unikal QR kod və ya NFC çip sayəsində digər sürücülər nömrənizi görmədən sizinlə WhatsApp və ya zəng vasitəsilə dərhal əlaqə saxlaya bilərlər. Şəxsi məlumatlarınızı qoruyun və təhlükəsiz park edin.
                </p>
                
                <div className="flex gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => navigate('/admin')} 
                    className="py-3.5 px-8 rounded btn-gold text-xs font-mono uppercase tracking-wider flex-1 sm:flex-initial"
                  >
                    Sürücü Girişi
                  </button>
                  <a 
                    href="#features" 
                    className="py-3.5 px-8 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-mono uppercase tracking-wider text-center flex-1 sm:flex-initial transition-colors"
                  >
                    Üstünlüklər
                  </a>
                </div>

                {/* Stats block */}
                <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-slate-200 w-full">
                  <div>
                    <h3 className="text-2xl font-black font-mono text-[#bfa37a]">10,000+</h3>
                    <p className="text-[9px] text-slate-450 font-mono uppercase tracking-widest mt-1">Aktiv Sürücü</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-mono text-[#bfa37a]">100%</h3>
                    <p className="text-[9px] text-slate-450 font-mono uppercase tracking-widest mt-1">Anonimlik</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-mono text-[#bfa37a]">0 SANİYƏ</h3>
                    <p className="text-[9px] text-slate-450 font-mono uppercase tracking-widest mt-1">Dərhal Əlaqə</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Interactive Mockup Card */}
              <div className="hidden lg:flex justify-center items-center relative">
                {/* Glowing gold back light */}
                <div className="absolute w-72 h-72 rounded-full bg-[#bfa37a]/10 blur-[80px]" />
                
                <div className="w-full max-w-sm p-6 bg-white/90 backdrop-blur-md border border-[rgba(191,163,122,0.25)] rounded-xl relative shadow-xl">
                  {/* Decorative drafting corners */}
                  <div className="blueprint-corner blueprint-corner-tl" />
                  <div className="blueprint-corner blueprint-corner-tr" />
                  <div className="blueprint-corner blueprint-corner-bl" />
                  <div className="blueprint-corner blueprint-corner-br" />

                  {/* Sample car frame inside mockup */}
                  <div className="w-full h-36 rounded border border-slate-100 bg-slate-50 relative overflow-hidden mb-5">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4">
                      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#bfa37a" strokeWidth="1.5" className="mb-2 opacity-60">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <path d="M9 17h6" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#bfa37a]">AVTOMOBİL MƏLUMATI</span>
                    </div>
                  </div>

                  {/* Azerbaijani License Plate Component inside mockup */}
                  <div className="mb-5 flex justify-center">
                    <div className="az-plate-container border-slate-900 shadow-sm">
                      <div className="az-plate-flag-sec">
                        <div className="az-plate-flag">
                          <svg viewBox="0 0 240 120" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="240" height="40" fill="#00b5e2" />
                            <rect y="40" width="240" height="40" fill="#ef3340" />
                            <rect y="80" width="240" height="40" fill="#50b848" />
                            <circle cx="112" cy="60" r="12" fill="#ffffff" />
                            <circle cx="115.5" cy="60" r="10.2" fill="#ef3340" />
                            <g transform="translate(129, 60)">
                              <rect x="-4.5" y="-4.5" width="9" height="9" fill="#ffffff" />
                              <rect x="-4.5" y="-4.5" width="9" height="9" fill="#ffffff" transform="rotate(45)" />
                            </g>
                          </svg>
                        </div>
                        <span className="az-plate-az-box">AZ</span>
                      </div>
                      <div className="az-plate-number-sec text-slate-900">
                        <span>99</span>
                        <span style={{ width: '12px' }}></span>
                        <span>EP</span>
                        <span style={{ width: '12px' }}></span>
                        <span>223</span>
                      </div>
                    </div>
                  </div>

                  {/* Simulated driver name */}
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Rəvan Rəsulov</h3>
                    <p className="text-[9px] text-[#bfa37a] font-mono tracking-widest uppercase mb-4">Sürücü Profili</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="py-2.5 px-3 rounded border border-[rgba(191,163,122,0.3)] bg-white text-[10px] font-mono text-slate-800 flex items-center justify-center gap-1.5 hover:bg-[rgba(191,163,122,0.06)] hover:border-[#bfa37a] transition-all">
                        <span>📞 Zəng Et</span>
                      </div>
                      <div className="py-2.5 px-3 rounded bg-[#bfa37a] text-[10px] font-mono text-white flex items-center justify-center gap-1.5 shadow-sm">
                        <span>💬 WhatsApp</span>
                      </div>
                    </div>
                    
                    <div className="py-1.5 px-3 rounded border border-pink-200 bg-pink-50/50 text-[9px] font-mono text-pink-600 inline-block">
                      📸 @instagram_hesabi
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid Section */}
            <div id="features" className="mt-16 pt-16 border-t border-slate-200">
              <h2 className="text-xl font-bold font-sans text-[#bfa37a] uppercase tracking-wider text-center mb-8">
                Sistemin Üstünlükləri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 border border-slate-100 p-6 rounded-lg relative shadow-sm">
                  <div className="text-[#bfa37a] mb-4 text-sm font-mono tracking-widest">01 / NFC DƏSTƏYİ</div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Toxun və Əlaqə Saxla</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Telefonu avtomobildəki NFC etiketə yaxınlaşdırmaqla və ya QR kodu skan etməklə dərhal əlaqə qura bilərsiniz.
                  </p>
                </div>
                
                <div className="bg-white/80 border border-slate-100 p-6 rounded-lg relative shadow-sm">
                  <div className="text-[#bfa37a] mb-4 text-sm font-mono tracking-widest">02 / ŞƏXSİ DATA</div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Gizlilik və Təhlükəsizlik</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Telefon nömrəniz heç vaxt digər şəxslərə göstərilmir. Skan edən sürücü yalnız maskalanmış nömrə ilə əlaqə qurur.
                  </p>
                </div>

                <div className="bg-white/80 border border-slate-100 p-6 rounded-lg relative shadow-sm">
                  <div className="text-[#bfa37a] mb-4 text-sm font-mono tracking-widest">03 / AĞILLI PANEL</div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Admin İdarəetmə Paneli</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sürücüləri, avtomobilləri, fərdi keçid linklərini və QR kodları vahid və sürətli idarəetmə panelindən idarə edin.
                  </p>
                </div>
              </div>
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
