import React, { useState, useEffect, useMemo } from 'react';
import ScanPage from './pages/ScanPage';
import AdminPortal from './pages/AdminPortal';
import NotFound from './pages/NotFound';
import PremiumSplashScreen from './components/PremiumSplashScreen';
import { supabase } from './utils/supabaseClient';
import { Search, Info, Car, Shield, Link2, Sparkles, Filter, AlertTriangle, ArrowRight, Phone, Download, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // QR Generator states
  const [qrPhone, setQrPhone] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [qrError, setQrError] = useState('');
  const [qrLoading, setQrLoading] = useState(false);
  const [qrActiveTab, setQrActiveTab] = useState('site'); // 'site' or 'number'

  // "Sayta Əlavə Et" states
  const [sitePhone, setSitePhone] = useState('');
  const [siteName, setSiteName] = useState('');
  const [sitePlate, setSitePlate] = useState('');
  const [siteLoading, setSiteLoading] = useState(false);
  const [siteMsg, setSiteMsg] = useState(null); // { type: 'success'|'error', text, slug? }



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

            {/* Admin Panel — Əlavə Et */}
            <section id="qr-generator" className="qr-generator-section">
              <div className="qr-generator-header">
                <QrCode size={28} style={{ color: '#bfa37a' }} />
                <h2>Nömrə Əlavə Et</h2>
                <p>Telefon nömrəsini daxil edin — sayta əlavə edin və ya birbaşa zəng QR kodu yaradın.</p>
              </div>

              {/* Tab Switcher */}
              <div className="qr-generator-body">
                <div className="qr-tabs">
                  <button
                    className={`qr-tab ${qrActiveTab === 'site' ? 'active' : ''}`}
                    onClick={() => { setQrActiveTab('site'); setQrError(''); setSiteMsg(null); }}
                  >
                    Sayta Əlavə Et
                  </button>
                  <button
                    className={`qr-tab ${qrActiveTab === 'number' ? 'active' : ''}`}
                    onClick={() => { setQrActiveTab('number'); setQrError(''); setSiteMsg(null); }}
                  >
                    Nömrə QR Yarat
                  </button>
                </div>

                {/* Tab 1: Sayta Əlavə Et */}
                {qrActiveTab === 'site' && (
                  <div className="qr-tab-content">
                    <div className="qr-field">
                      <label className="qr-label">Ad və Soyad</label>
                      <input
                        type="text"
                        placeholder="Məs: Rəvan Rəsulov"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="qr-text-input"
                      />
                    </div>
                    <div className="qr-field">
                      <label className="qr-label">Maşın Nömrəsi</label>
                      <input
                        type="text"
                        placeholder="Məs: 99EP223"
                        value={sitePlate}
                        onChange={(e) => setSitePlate(e.target.value.toUpperCase())}
                        className="qr-text-input"
                        maxLength={10}
                      />
                    </div>
                    <div className="qr-field">
                      <label className="qr-label">Telefon Nömrəsi</label>
                      <div className="qr-input-wrapper">
                        <span className="qr-input-prefix">+994</span>
                        <input
                          type="tel"
                          placeholder="50 123 45 67"
                          value={sitePhone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.length <= 9) setSitePhone(val);
                          }}
                          className="qr-phone-input"
                          maxLength={9}
                        />
                      </div>
                    </div>
                    <button
                      className="btn-primary qr-generate-btn"
                      disabled={siteLoading}
                      onClick={async () => {
                        const cleaned = sitePhone.replace(/\s/g, '');
                        if (!siteName.trim()) { setSiteMsg({ type: 'error', text: 'Ad və soyad daxil edin.' }); return; }
                        if (!sitePlate.trim()) { setSiteMsg({ type: 'error', text: 'Maşın nömrəsini daxil edin.' }); return; }
                        if (cleaned.length < 9) { setSiteMsg({ type: 'error', text: 'Nömrə 9 rəqəmdən ibarət olmalıdır.' }); return; }
                        setSiteLoading(true);
                        setSiteMsg(null);
                        try {
                          const slug = sitePlate.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
                          const payload = {
                            fullname: siteName.trim(),
                            phone_number: `+994${cleaned}`,
                            car_plate: sitePlate.trim().toUpperCase(),
                            custom_slug: slug,
                            whatsapp_enabled: true,
                            emergency_status: false,
                          };
                          const { error } = await supabase.from('drivers').insert(payload);
                          if (error) throw error;
                          setSiteMsg({ type: 'success', text: 'Uğurla sayta əlavə edildi!', slug });
                          setSiteName('');
                          setSitePlate('');
                          setSitePhone('');
                        } catch (err) {
                          setSiteMsg({ type: 'error', text: err.message || 'Xəta baş verdi.' });
                        } finally {
                          setSiteLoading(false);
                        }
                      }}
                    >
                      {siteLoading ? 'Əlavə edilir...' : 'Sayta Əlavə Et'}
                    </button>

                    {siteMsg && (
                      <div className={`qr-msg ${siteMsg.type}`}>
                        <p>{siteMsg.text}</p>
                        {siteMsg.slug && (
                          <a
                            href={`/${siteMsg.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="qr-msg-link"
                          >
                            avtoqr.vercel.app/{siteMsg.slug} →
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Nömrə QR Yarat */}
                {qrActiveTab === 'number' && (
                  <div className="qr-tab-content">
                    <div className="qr-field">
                      <label className="qr-label">Telefon Nömrəsi</label>
                      <div className="qr-input-wrapper">
                        <span className="qr-input-prefix">+994</span>
                        <input
                          type="tel"
                          placeholder="50 123 45 67"
                          value={qrPhone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.length <= 9) {
                              setQrPhone(val);
                              setQrError('');
                            }
                          }}
                          className="qr-phone-input"
                          maxLength={9}
                        />
                      </div>
                    </div>
                    <button
                      className="btn-primary qr-generate-btn"
                      disabled={qrLoading}
                      onClick={async () => {
                        const cleaned = qrPhone.replace(/\s/g, '');
                        if (cleaned.length < 9) {
                          setQrError('Nömrə 9 rəqəmdən ibarət olmalıdır (məs: 501234567)');
                          return;
                        }
                        setQrLoading(true);
                        setQrError('');
                        try {
                          const telUri = `tel:+994${cleaned}`;
                          const url = await QRCode.toDataURL(telUri, {
                            width: 400,
                            margin: 2,
                            color: { dark: '#0f172a', light: '#ffffff' },
                            errorCorrectionLevel: 'H'
                          });
                          setQrDataUrl(url);
                        } catch (err) {
                          setQrError('QR kod yaradılarkən xəta baş verdi.');
                        } finally {
                          setQrLoading(false);
                        }
                      }}
                    >
                      {qrLoading ? 'Yaradılır...' : 'QR Yarat'}
                    </button>

                    {qrError && <p className="qr-error-msg">{qrError}</p>}

                    {qrDataUrl && (
                      <div className="qr-result">
                        <div className="qr-result-card">
                          <img src={qrDataUrl} alt="QR Kod" className="qr-result-img" />
                          <p className="qr-result-phone">
                            <Phone size={14} />
                            <span>+994 {qrPhone.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4')}</span>
                          </p>
                          <p className="qr-result-hint">Bu QR kodu skan edən şəxs birbaşa bu nömrəyə zəng edəcək.</p>
                          <a
                            href={qrDataUrl}
                            download={`avtoqr-${qrPhone}.png`}
                            className="btn-primary qr-download-btn"
                          >
                            <Download size={14} />
                            <span>PNG Olaraq Yüklə</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
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
