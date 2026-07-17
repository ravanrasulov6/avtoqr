import React, { useState } from 'react';
import { Phone, Download, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { supabase } from '../utils/supabaseClient';

/**
 * AdminQuickAdd — Admin-only panel with two tabs:
 * 1. "Sayta Əlavə Et" — saves driver to DB with name, plate, phone
 * 2. "Nömrə QR Yarat" — generates a direct tel: QR code
 */
export default function AdminQuickAdd() {
  const [activeTab, setActiveTab] = useState('site');

  // Tab 1: Sayta Əlavə Et
  const [siteName, setSiteName] = useState('');
  const [sitePlate, setSitePlate] = useState('');
  const [sitePhone, setSitePhone] = useState('');
  const [siteLoading, setSiteLoading] = useState(false);
  const [siteMsg, setSiteMsg] = useState(null);

  // Tab 2: Nömrə QR Yarat
  const [qrPhone, setQrPhone] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [qrError, setQrError] = useState('');
  const [qrLoading, setQrLoading] = useState(false);

  const handleAddToSite = async () => {
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
  };

  const handleGenerateQR = async () => {
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
  };

  return (
    <section className="qr-generator-section" style={{ border: 'none', marginTop: '40px', paddingTop: '40px' }}>
      <div className="qr-generator-header">
        <QrCode size={28} style={{ color: '#bfa37a' }} />
        <h2>Nömrə Əlavə Et</h2>
        <p>Telefon nömrəsini daxil edin — sayta əlavə edin və ya birbaşa zəng QR kodu yaradın.</p>
      </div>

      <div className="qr-generator-body">
        <div className="qr-tabs">
          <button
            className={`qr-tab ${activeTab === 'site' ? 'active' : ''}`}
            onClick={() => { setActiveTab('site'); setQrError(''); setSiteMsg(null); }}
          >
            Sayta Əlavə Et
          </button>
          <button
            className={`qr-tab ${activeTab === 'number' ? 'active' : ''}`}
            onClick={() => { setActiveTab('number'); setQrError(''); setSiteMsg(null); }}
          >
            Nömrə QR Yarat
          </button>
        </div>

        {/* Tab 1: Sayta Əlavə Et */}
        {activeTab === 'site' && (
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
              onClick={handleAddToSite}
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
        {activeTab === 'number' && (
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
              onClick={handleGenerateQR}
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
  );
}
