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

    // 1. Home / Welcome Screen (Modern Minimalist Landing Page)
    if (path === '/' || path === '/index.html') {
      return (
        <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans">
          
          {/* Navigation Bar */}
          <nav className="border-b border-slate-100 bg-white/90 backdrop-blur-md fixed top-0 left-0 right-0 z-40 py-4 px-6 md:px-12 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2 font-sans font-black text-slate-900 text-lg tracking-wide">
              <span className="text-[#bfa37a]">AVTO</span>
              <span>QR</span>
            </div>
            <div className="hidden md:flex gap-8 text-xs font-medium text-slate-650">
              <a href="#features" className="hover:text-[#bfa37a] transition-colors">Üstünlüklər</a>
            </div>
            <button 
              onClick={() => navigate('/admin')} 
              className="py-2.5 px-6 bg-[#bfa37a] hover:bg-[#ad9168] text-white font-medium text-xs rounded-md shadow-sm transition-all"
            >
              Giriş Portalına Keç
            </button>
          </nav>

          {/* Hero Section */}
          <main className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center px-6 pt-32 pb-16 z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Side: Copywriting */}
              <div className="flex flex-col items-start text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#bfa37a]/10 text-[#bfa37a] text-[11px] font-semibold tracking-wide uppercase mb-6">
                  <span>✨ Yeni nəsil təhlükəsiz parking</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold font-sans leading-tight tracking-tight text-slate-900 mb-6">
                  QR və NFC ilə <br/>
                  <span className="text-[#bfa37a]">Avtomobilinizi Rahat Saxlayın</span>
                </h1>
                <p className="text-slate-600 text-base leading-relaxed mb-8 max-w-lg">
                  Avtomobilinizin ön şüşəsinə yerləşdirilən unikal QR kod və ya NFC çip sayəsində digər sürücülər nömrənizi görmədən sizinlə WhatsApp və ya zəng vasitəsilə dərhal əlaqə saxlaya bilərlər. Şəxsi məlumatlarınızı qoruyun və təhlükəsiz park edin.
                </p>
                
                <div className="flex gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => navigate('/admin')} 
                    className="py-3 px-8 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm shadow-md transition-colors"
                  >
                    Sürücü Girişi
                  </button>
                  <a 
                    href="#features" 
                    className="py-3 px-8 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm shadow-sm transition-colors text-center"
                  >
                    Üstünlüklər
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-slate-100 w-full">
                  <div>
                    <h3 className="text-3xl font-bold font-sans text-slate-900">10,000+</h3>
                    <p className="text-xs text-slate-500 mt-1">Aktiv İstifadəçi</p>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold font-sans text-slate-900">100%</h3>
                    <p className="text-xs text-slate-500 mt-1">Anonimlik</p>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold font-sans text-slate-900">0 saniyə</h3>
                    <p className="text-xs text-slate-500 mt-1">Gecikmə</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Clean Mockup Card */}
              <div className="flex justify-center items-center relative">
                {/* Subtle soft decorative background blur */}
                <div className="absolute w-80 h-80 rounded-full bg-[#bfa37a]/5 blur-[100px]" />
                
                <div className="w-full max-w-sm p-6 bg-white border border-slate-100 rounded-2xl relative shadow-xl">
                  {/* Car image frame inside mockup */}
                  <div className="w-full h-40 rounded-xl bg-slate-50 border border-slate-100 relative overflow-hidden mb-5 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#bfa37a" strokeWidth="1.5" className="opacity-60">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <path d="M9 17h6" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
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

                  {/* Simulated driver profile */}
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Rəvan Rəsulov</h3>
                    <p className="text-xs text-[#bfa37a] font-semibold mb-4">Maşın Sahibi</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="py-2.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-all">
                        <span>📞 Zəng Et</span>
                      </div>
                      <div className="py-2.5 px-3 rounded-lg bg-[#bfa37a] hover:bg-[#ad9168] text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-sm transition-all">
                        <span>💬 WhatsApp</span>
                      </div>
                    </div>
                    
                    <div className="py-1.5 px-4 rounded-full border border-pink-100 bg-pink-50/50 text-[10px] font-semibold text-pink-600 inline-block">
                      📸 @rrasulovravan
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div id="features" className="mt-20 pt-16 border-t border-slate-100">
              <div className="text-center max-w-xl mx-auto mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Sistemin Əsas Üstünlükləri</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Avto QR sürücülər üçün gündəlik həyatı asanlaşdırmaq və təhlükəsiz park etməyi təmin etmək üçün yaradılmışdır.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white border border-slate-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#bfa37a]/10 text-[#bfa37a] flex items-center justify-center font-bold text-sm mb-5">01</div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">Toxun və Əlaqə Saxla (NFC)</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Telefonunuzu maşındakı NFC etiketə yaxınlaşdırmaqla və ya QR kodu sadəcə skan etməklə dərhal əlaqə qurulur.
                  </p>
                </div>
                
                <div className="bg-white border border-slate-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#bfa37a]/10 text-[#bfa37a] flex items-center justify-center font-bold text-sm mb-5">02</div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">Gizlilik və Anonimlik</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Telefon nömrəniz heç vaxt açıq şəkildə göstərilmir. Digər sürücülər yalnız maskalanmış nömrə ilə əlaqə qura bilər.
                  </p>
                </div>

                <div className="bg-white border border-slate-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#bfa37a]/10 text-[#bfa37a] flex items-center justify-center font-bold text-sm mb-5">03</div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">Sürətli Sürücü Paneli</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Bütün avtomobilləri, fərdi keçid linklərini və QR kodlarınızı vahid admin portalından idarə edin.
                  </p>
                </div>
              </div>
            </div>
          </main>
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
