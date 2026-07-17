import React, { useState } from 'react';
import { Phone, Download, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

/**
 * AdminQuickAdd — Admin-only panel for generating direct tel: QR codes.
 */
export default function AdminQuickAdd() {
  const [qrPhone, setQrPhone] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [qrError, setQrError] = useState('');
  const [qrLoading, setQrLoading] = useState(false);

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
        <h2>Nömrə QR Yarat</h2>
        <p>Telefon nömrəsini daxil edin — QR kod birbaşa zəngə yönləndirəcək.</p>
      </div>

      <div className="qr-generator-body">
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
      </div>
    </section>
  );
}
