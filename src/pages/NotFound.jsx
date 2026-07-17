import React from 'react';
import BlueprintBackground from '../components/BlueprintBackground';
import { FileQuestion } from 'lucide-react';

/**
 * NotFound component renders a stylized 404 page.
 */
export default function NotFound({ navigate }) {
  return (
    <BlueprintBackground>
      <div className="w-full max-w-sm p-8 bg-white/80 backdrop-blur rounded border border-slate-200 shadow-sm text-center relative">
        <div className="blueprint-corner blueprint-corner-tl" />
        <div className="blueprint-corner blueprint-corner-tr" />
        <div className="blueprint-corner blueprint-corner-bl" />
        <div className="blueprint-corner blueprint-corner-br" />
        
        <FileQuestion size={40} className="text-[#bfa37a] mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">404 // Səhifə Tapılmadı</h3>
        <p className="text-xs text-slate-500 mb-6 font-mono leading-relaxed">
          AXTARDINIZ: {window.location.pathname}<br />
          STATUS: SECTOR_NOT_FOUND
        </p>
        <button onClick={() => navigate('/')} className="w-full py-2.5 rounded btn-gold text-xs">
          Ana Səhifəyə Qayıt
        </button>
      </div>
    </BlueprintBackground>
  );
}
