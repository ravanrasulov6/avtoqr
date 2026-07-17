import React, { useState } from 'react';
import { Phone, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { generateWhatsAppLink, maskPhoneNumber } from '../utils/whatsappHelper';

// Helper to parse standard AZ license plates into city, series, and number parts
const parseCarPlate = (plate) => {
  if (!plate) return { city: '10', series: 'XX', number: '000' };
  
  // Clean all spacing/dashes
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // Look for standard AZ formats: e.g. 10XU888 or 99EP223 (2 digits, 1 or 2 letters, 3 digits)
  const match = clean.match(/^([0-9]{2})([A-Z]{1,2})([0-9]{3})$/);
  if (match) {
    return { city: match[1], series: match[2], number: match[3] };
  }
  
  // Fallback
  return {
    city: clean.substring(0, 2) || '10',
    series: clean.substring(2, 4) || 'XX',
    number: clean.substring(4) || '000'
  };
};

/**
 * DriverProfileCard renders a mobile-optimized driver profile card.
 * It contains zəng, WhatsApp, and Instagram links.
 */
export default function DriverProfileCard({ driver }) {
  const [phoneMasked, setPhoneMasked] = useState(true);
  const waLink = generateWhatsAppLink(driver.phone_number, driver.car_plate);
  const { city, series, number } = parseCarPlate(driver.car_plate);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'urgent':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 rounded">
            Təcili Əlaqə
          </span>
        );
      case 'inactive':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200 rounded">
            Qeyri-aktiv
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 rounded">
            Aktiv Əlaqə
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-sm rounded-lg p-6 relative blueprint-card overflow-hidden">
      {/* Blueprint Corner Details */}
      <div className="blueprint-corner blueprint-corner-tl" />
      <div className="blueprint-corner blueprint-corner-tr" />
      <div className="blueprint-corner blueprint-corner-bl" />
      <div className="blueprint-corner blueprint-corner-br" />

      {/* Decorative Blueprint Line Markings */}
      <div className="absolute top-0 left-1/2 w-[1px] h-3 bg-[rgba(191,163,122,0.3)]" />
      <div className="absolute bottom-0 left-1/2 w-[1px] h-3 bg-[rgba(191,163,122,0.3)]" />
      <div className="absolute left-0 top-1/2 w-3 h-[1px] bg-[rgba(191,163,122,0.3)]" />
      <div className="absolute right-0 top-1/2 w-3 h-[1px] bg-[rgba(191,163,122,0.3)]" />

      {/* Main Container */}
      <div className="flex flex-col items-center text-center">
        {/* Car Image Frame */}
        <div className="w-full h-48 rounded border border-[rgba(191,163,122,0.2)] bg-slate-50 relative overflow-hidden mb-6 shadow-inner">
          {driver.car_photo_url ? (
            <img 
              src={driver.car_photo_url} 
              alt={`${driver.car_plate} car`} 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : (
            /* Sleek luxury car outline graphic */
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 p-4">
              <svg viewBox="0 0 200 80" className="w-40 h-auto stroke-[#bfa37a] stroke-[1] fill-none opacity-40 mb-2">
                <path d="M 20,55 C 20,55 25,43 38,40 C 50,37 68,36 78,32 C 92,27 105,15 125,15 C 145,15 170,18 182,32 C 190,35 195,43 195,55 L 180,55 C 170,55 170,45 155,45 C 140,45 140,55 125,55 L 90,55 C 75,55 75,45 60,45 C 45,45 45,55 30,55 Z" />
                <circle cx="60" cy="55" r="10" />
                <circle cx="155" cy="55" r="10" />
              </svg>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Şəkil yüklənməyib</span>
            </div>
          )}
        </div>

        {/* Azerbaijani License Plate Component */}
        <div className="mb-6 flex justify-center">
          <div className="az-plate-container">
            {/* AZ Flag Portion */}
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
            {/* Plate Number (formatted with clean spaces) */}
            <div className="az-plate-number-sec">
              <span>{city}</span>
              <span style={{ width: '12px' }}></span>
              <span>{series}</span>
              <span style={{ width: '12px' }}></span>
              <span>{number}</span>
            </div>
          </div>
        </div>

        {/* Driver Details */}
        <h2 className="text-xl font-bold text-slate-900 font-sans tracking-wide mb-1">
          {driver.fullname}
        </h2>
        
        {/* Masked / Unmasked Phone Number */}
        <div className="flex items-center gap-2 mb-6 text-slate-600 font-mono text-sm">
          <span>{phoneMasked ? maskPhoneNumber(driver.phone_number) : driver.phone_number}</span>
          <button 
            onClick={() => setPhoneMasked(!phoneMasked)}
            className="p-1 hover:text-[#bfa37a] text-slate-400 transition-colors"
            title={phoneMasked ? "Nömrəni göstər" : "Nömrəni gizlət"}
          >
            {phoneMasked ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {/* Quick Contact Action Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full mb-6">
          {/* Call Button */}
          <a 
            href={`tel:${driver.phone_number.replace(/\s+/g, '')}`} 
            className="flex items-center justify-center gap-2 py-3 px-4 rounded border border-[rgba(191,163,122,0.3)] bg-white text-slate-800 font-semibold text-sm hover:bg-[rgba(191,163,122,0.06)] hover:border-[#bfa37a] transition-all"
          >
            <Phone size={16} className="text-[#bfa37a]" />
            <span>Zəng Et</span>
          </a>

          {/* WhatsApp Button */}
          {driver.whatsapp_enabled && waLink ? (
            <a 
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded btn-gold text-sm"
            >
              <MessageSquare size={16} />
              <span>WhatsApp</span>
            </a>
          ) : (
            <button 
              disabled 
              className="flex items-center justify-center gap-2 py-3 px-4 rounded border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed text-sm"
            >
              <MessageSquare size={16} />
              <span>WhatsApp</span>
            </button>
          )}
        </div>

        {/* Social / Instagram */}
        {driver.instagram_username && (
          <a
            href={`https://instagram.com/${driver.instagram_username.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 mb-6 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs transition-colors"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600 inline-block shrink-0">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span>@{driver.instagram_username.replace('@', '')}</span>
          </a>
        )}

      </div>
    </div>
  );
}
