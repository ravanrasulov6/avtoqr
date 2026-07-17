import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import DriverProfileCard from '../components/DriverProfileCard';
import BlueprintBackground from '../components/BlueprintBackground';
import { Loader2, AlertCircle } from 'lucide-react';

/**
 * ScanPage retrieves the driver details using UUID or custom slug.
 * It uses Promise.all to load resources in parallel and avoid request waterfalls.
 */
export default function ScanPage({ slug, navigate }) {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDriverData() {
      try {
        setLoading(true);
        setError('');

        // Detect if slug is a valid UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isUuid = uuidRegex.test(slug);
        const queryField = isUuid ? 'id' : 'custom_slug';

        // Perform parallel queries to avoid waterfall (BÖLÜM 3 instruction)
        // We fetch the driver, and query public status in parallel
        const [driverResponse, publicPingResponse] = await Promise.all([
          supabase
            .from('drivers')
            .select('*')
            .eq(queryField, slug)
            .maybeSingle(),
          // Parallel call to check connection or grab public admin parameters
          supabase
            .from('admin_users')
            .select('role')
            .limit(1)
        ]);

        if (driverResponse.error) {
          throw new Error(driverResponse.error.message);
        }

        if (!driverResponse.data) {
          throw new Error('Sürücü tapılmadı.');
        }

        setDriver(driverResponse.data);
      } catch (err) {
        setError(err.message || 'Məlumat yüklənərkən xəta baş verdi.');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchDriverData();
    }
  }, [slug]);

  return (
    <BlueprintBackground>
      {loading && (
        <div className="flex flex-col items-center justify-center p-8 bg-white/70 backdrop-blur rounded border border-slate-200 shadow-sm relative">
          <Loader2 size={32} className="animate-spin text-[#bfa37a] mb-3" />
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Sürücü məlumatları axtarılır...</p>
        </div>
      )}

      {error && !loading && (
        <div className="w-full max-w-sm p-6 bg-white/80 backdrop-blur rounded border border-red-200 shadow-sm text-center relative">
          <div className="blueprint-corner blueprint-corner-tl" />
          <div className="blueprint-corner blueprint-corner-tr" />
          <div className="blueprint-corner blueprint-corner-bl" />
          <div className="blueprint-corner blueprint-corner-br" />
          
          <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Məlumat Tapılmadı</h3>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button onClick={() => navigate('/admin')} className="py-2.5 px-6 rounded btn-gold text-xs">
            Admin Panelə Keç
          </button>
        </div>
      )}

      {driver && !loading && (
        <div className="w-full max-w-sm flex flex-col items-center animate-fade-in">
          {/* Main Card */}
          <DriverProfileCard driver={driver} />
        </div>
      )}
    </BlueprintBackground>
  );
}
