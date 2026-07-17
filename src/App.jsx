import React, { useState, useEffect, useMemo } from 'react';
import ScanPage from './pages/ScanPage';
import AdminPortal from './pages/AdminPortal';
import NotFound from './pages/NotFound';
import PremiumSplashScreen from './components/PremiumSplashScreen';
import { supabase } from './utils/supabaseClient';
import { Car, Sparkles, ArrowRight, Phone } from 'lucide-react';

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

    // 1. Home / Welcome Screen (Awesome Skills Inspired Modern Landing Page)
    if (path === '/' || path === '/index.html') {
      return (
        <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans">
          
          {/* Header Navigation */}
          <header className="landing-navbar">
            <div className="landing-container landing-navbar-inner">
              <div className="landing-logo" onClick={() => navigate('/')}>
                <Car className="h-5 w-5" />
                <span>AVTO <span>QR</span></span>
              </div>
              <nav className="landing-nav-links">
                <a href="#features">Necə İşləyir?</a>
              </nav>

            </div>
          </header>

          <main className="landing-container">
            
            {/* Hero Section */}
            <section className="landing-hero">
              {/* Left Side: Copywriting */}
              <div className="hero-content">

                <h1 className="hero-title">
                  QR və NFC ilə <br />
                  <span>Avtomobilinizi Rahat Saxlayın</span>
                </h1>
                <p className="hero-desc">
                  Avtomobilinizin ön şüşəsinə yerləşdirilən unikal QR kod və ya NFC çip sayəsində digər sürücülər nömrənizi görmədən sizinlə WhatsApp və ya zəng vasitəsilə dərhal əlaqə saxlaya bilərlər. Şəxsi məlumatlarınızı qoruyun və təhlükəsiz park edin.
                </p>
                <div className="hero-btns">
                  <a 
                    href="https://wa.me/994518944289?text=Salam%20m%C9%99n%20qeydiyyatdan%20ke%C3%A7m%C9%99k%20ist%C9%99yir%C9%99m" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Qeydiyyatdan Keç
                  </a>

                </div>
              </div>

              {/* Right Side: Concept Cards */}
              <div className="concept-grid">
                <div className="concept-card">
                  <div className="concept-icon">
                    <Sparkles size={16} />
                  </div>
                  <h4>NFC Skan Həlli</h4>
                  <p>Telefonu şüşədəki NFC çipə yaxınlaşdıraraq dərhal əlaqə qurun.</p>
                </div>

                <div className="concept-card">
                  <div className="concept-icon">
                    <Car size={16} />
                  </div>
                  <h4>Dərhal Zəng</h4>
                  <p>Yolu kəsən maşın sahibinə bir toxunuşla birbaşa zəng açın.</p>
                </div>


              </div>
            </section>

            {/* Role Guides */}
            <section id="features" className="role-section" style={{ marginBottom: '60px' }}>
              <div className="role-card">
                <div>
                  <h3>Sürücülər Üçün Necə İşləyir?</h3>
                  <p>
                    Sistemə sürücü profili ilə daxil olun, avtomobil məlumatlarını doldurun. Platformamız sizin üçün avtomatik olaraq unikal QR kod və fərdi slug link yaradacaq. QR kodunuzu şüşəyə yapışdırın və təhlükəsiz park edin.
                  </p>
                </div>
                <a 
                  href="https://wa.me/994518944289?text=Salam%20m%C9%99n%20qeydiyyatdan%20ke%C3%A7m%C9%99k%20ist%C9%99yir%C9%99m"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="role-link"
                >
                  <span>Qeydiyyatdan Keç</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <div className="role-card">
                <div>
                  <h3>Skan Edənlər Üçün Necə İşləyir?</h3>
                  <p>
                    Park edilmiş avtomobil yolu kəsdikdə, kameranız ilə şüşədəki QR kodu skan edin və ya yaxınlaşıb NFC çipini toxundurun. Sürücünün nömrəsini görmədən birbaşa zəng edə və ya WhatsApp ilə xəbərdarlıq edə bilərsiniz.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
      );
    }

    // 2. Direct Call Redirect (QR codes point here for universal compatibility)
    if (path.startsWith('/call/')) {
      const phone = path.substring(6).replace(/[^0-9+]/g, '');
      if (phone) {
        // Immediately redirect to tel: — works on all phones
        window.location.href = `tel:${phone.startsWith('+') ? phone : '+' + phone}`;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'var(--font-family)', gap: '12px' }}>
            <Phone size={32} style={{ color: '#bfa37a' }} />
            <p style={{ fontSize: '14px', color: '#475569' }}>Zəng açılır...</p>
            <a href={`tel:${phone.startsWith('+') ? phone : '+' + phone}`} style={{ fontSize: '13px', color: '#bfa37a', textDecoration: 'underline' }}>
              {phone.startsWith('+') ? phone : '+' + phone}
            </a>
          </div>
        );
      }
    }

    // 3. Admin Portal
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
