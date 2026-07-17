import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
import { compressImage } from '../utils/imageCompressor';
import BlueprintBackground from '../components/BlueprintBackground';
import AdminQuickAdd from '../components/AdminQuickAdd';
import { 
  Key, User, Plus, Phone, Car, Image, Check, AlertTriangle, 
  Trash2, QrCode, Download, ExternalLink, LogOut, ArrowLeft, Loader, Edit, Eye
} from 'lucide-react';
import QRCode from 'qrcode';

// Defensive error serializer to capture non-enumerable error properties (prevents {} display)
const serializeError = (err) => {
  if (!err) return 'Bilinməyən xəta';
  if (typeof err === 'string') return err;
  
  if (err.message) return String(err.message);
  if (err.error_description) return String(err.error_description);
  if (err.error) return String(err.error);
  
  try {
    const str = JSON.stringify(err);
    if (str && str !== '{}') return str;
  } catch (e) {}
  
  return String(err);
};

export default function AdminPortal({ navigate }) {
  // Authentication States
  const [identifier, setIdentifier] = useState(''); // Email
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const lastCheckedUserId = useRef(null);
  
  // Dashboard & Management States
  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDriverId, setCurrentDriverId] = useState(null);

  // Form States
  const [fullname, setFullname] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [instagramUsername, setInstagramUsername] = useState('');
  const [emergencyStatus, setEmergencyStatus] = useState('active');
  const [customSlug, setCustomSlug] = useState('');
  const [carPhotoFile, setCarPhotoFile] = useState(null);
  const [carPhotoUrl, setCarPhotoUrl] = useState('');
  
  // Image Compression Stats for UI feedback
  const [compressionStats, setCompressionStats] = useState(null); // { originalSize, compressedSize, ratio }
  
  // QR Code Modal State
  const [selectedDriverForQr, setSelectedDriverForQr] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  // UI status feedback
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // References
  const fileInputRef = useRef(null);

  // 1. Monitor Authentication Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) {
        lastCheckedUserId.current = s.user.id;
        checkAdminRole(s.user.id);
      } else {
        setCheckingRole(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) {
        // Only re-check if user actually changed (prevents loop)
        if (lastCheckedUserId.current !== s.user.id) {
          lastCheckedUserId.current = s.user.id;
          checkAdminRole(s.user.id);
        }
      } else {
        lastCheckedUserId.current = null;
        setIsAdmin(false);
        setCheckingRole(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Drivers once authenticated as admin
  useEffect(() => {
    if (session && isAdmin) {
      fetchDrivers();
    }
  }, [session, isAdmin]);

  // Check Admin Role
  const checkAdminRole = async (userId) => {
    try {
      setCheckingRole(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (data && (data.role === 'admin' || data.role === 'super-admin')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        // If not in DB, sign them out
        await supabase.auth.signOut();
        setAuthError('Giriş rədd edildi: Sizin hesabınız admin siyahısında yoxdur.');
      }
    } catch (err) {
      setAuthError('İstifadəçi rolu yoxlanılarkən xəta: ' + serializeError(err));
    } finally {
      setCheckingRole(false);
    }
  };

  // Sign In with Password
  const handlePasswordSignIn = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return;
    setAuthLoading(true);
    setAuthError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier.trim(),
        password: password.trim()
      });

      if (error) {
        throw new Error(error.message || 'Giriş cəhdi uğursuz oldu.');
      }

      if (data.session) {
        setSession(data.session);
        checkAdminRole(data.session.user.id);
      }
    } catch (err) {
      console.error('Login error:', err);
      setAuthError(serializeError(err));
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setIdentifier('');
    setPassword('');
    setDrivers([]);
  };

  // Fetch all drivers
  const fetchDrivers = async () => {
    setLoadingDrivers(true);
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDrivers(data || []);
    } catch (err) {
      console.error('Sürücülər yüklənərkən xəta:', err);
    } finally {
      setLoadingDrivers(false);
    }
  };

  // Handle Photo selection & compression
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const originalSizeKB = (file.size / 1024).toFixed(1);
      
      // Compress in browser (BÖLÜM 11 / BÖLÜM 4 instructions)
      // Max Width: 800px, Max Height: 600px, Quality: 0.70
      const compressedBlob = await compressImage(file, 800, 600, 0.7);
      const compressedSizeKB = (compressedBlob.size / 1024).toFixed(1);
      const ratio = ((1 - compressedBlob.size / file.size) * 100).toFixed(0);

      // Create compressed File object
      const compressedFile = new File([compressedBlob], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      setCarPhotoFile(compressedFile);
      setCompressionStats({
        original: `${originalSizeKB} KB`,
        compressed: `${compressedSizeKB} KB`,
        ratio: `${ratio}%`
      });
    } catch (err) {
      setFormMessage({ type: 'error', text: 'Şəkil sıxılarkən xəta: ' + err.message });
    }
  };

  // Form Submit (Create or Update Driver)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!fullname || !carPlate || !phoneNumber) {
      setFormMessage({ type: 'error', text: 'Zəhmət olmasa ulduzlu (*) sahələri doldurun.' });
      return;
    }

    setFormLoading(true);
    setFormMessage({ type: '', text: '' });

    try {
      let finalPhotoUrl = carPhotoUrl;

      // 1. Upload compressed photo if a new one is selected
      if (carPhotoFile) {
        // Clean car plate for filename
        const cleanPlate = carPlate.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const fileExt = 'jpg';
        const fileName = `${cleanPlate}-${Date.now()}.${fileExt}`;
        const filePath = `cars/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('car-photos')
          .upload(filePath, carPhotoFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('car-photos')
          .getPublicUrl(filePath);

        finalPhotoUrl = publicUrlData.publicUrl;
      }

      // 2. Prepare payload
      const slugVal = (customSlug || carPlate).toLowerCase().replace(/[^a-z0-9]/g, '') || null;
      const payload = {
        fullname: fullname.trim(),
        car_plate: carPlate.trim().toUpperCase(),
        phone_number: phoneNumber.trim(),
        whatsapp_enabled: whatsappEnabled,
        instagram_username: instagramUsername.trim() || null,
        emergency_status: emergencyStatus,
        custom_slug: slugVal,
        car_photo_url: finalPhotoUrl,
        owner_id: session.user.id // Assign as owner
      };

      if (isEditing && currentDriverId) {
        // Update Driver
        const { error } = await supabase
          .from('drivers')
          .update(payload)
          .eq('id', currentDriverId);

        if (error) throw error;
        setFormMessage({ type: 'success', text: 'Sürücü məlumatları uğurla yeniləndi!' });
      } else {
        // Create Driver
        const { error } = await supabase
          .from('drivers')
          .insert(payload);

        if (error) throw error;
        setFormMessage({ type: 'success', text: 'Yeni sürücü uğurla əlavə edildi!' });
      }

      // Reset form and refresh drivers list
      resetForm();
      fetchDrivers();
    } catch (err) {
      if (err.message?.includes('duplicate key') && err.message?.includes('custom_slug')) {
        setFormMessage({ type: 'error', text: 'Bu fərdi link (slug) artıq istifadə olunub. Başqa bir ad yazın.' });
      } else if (err.message?.includes('duplicate key') && err.message?.includes('car_plate')) {
        setFormMessage({ type: 'error', text: 'Bu nömrə nişanlı avtomobil artıq qeydiyyatdan keçib.' });
      } else {
        setFormMessage({ type: 'error', text: err.message || 'Məlumat saxlanarkən xəta baş verdi.' });
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Edit Driver trigger
  const handleEditDriver = (driver) => {
    setIsEditing(true);
    setCurrentDriverId(driver.id);
    setFullname(driver.fullname);
    setCarPlate(driver.car_plate);
    setPhoneNumber(driver.phone_number);
    setWhatsappEnabled(driver.whatsapp_enabled);
    setInstagramUsername(driver.instagram_username || '');
    setEmergencyStatus(driver.emergency_status);
    setCustomSlug(driver.custom_slug || '');
    setCarPhotoUrl(driver.car_photo_url || '');
    setCarPhotoFile(null);
    setCompressionStats(null);
    setFormMessage({ type: '', text: '' });
  };

  // Delete Driver
  const handleDeleteDriver = async (driverId, carPhotoLink) => {
    if (!window.confirm('Sürücünü silmək istədiyinizdən əminsiniz?')) return;
    
    try {
      // 1. Delete photo from storage if exists
      if (carPhotoLink) {
        try {
          // extract filename from public URL
          const pathSegments = carPhotoLink.split('/');
          const filename = pathSegments[pathSegments.length - 1];
          await supabase.storage
            .from('car-photos')
            .remove([`cars/${filename}`]);
        } catch (err) {
          console.warn('Storage-dən şəkil silinə bilmədi:', err);
        }
      }

      // 2. Delete driver row
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', driverId);

      if (error) throw error;

      fetchDrivers();
      if (isEditing && currentDriverId === driverId) {
        resetForm();
      }
    } catch (err) {
      alert('Sürücü silinərkən xəta: ' + err.message);
    }
  };

  // Generate and display QR Code
  const handleShowQrCode = async (driver) => {
    setSelectedDriverForQr(driver);
    
    // Choose custom slug or UUID for QR URL
    const destinationSlug = driver.custom_slug || driver.id;
    const origin = window.location.origin;
    const qrUrl = `${origin}/${destinationSlug}`;

    try {
      const dataUrl = await QRCode.toDataURL(qrUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0f172a',  // Charcoal Slate
          light: '#ffffff'  // Pure White
        }
      });
      setQrCodeDataUrl(dataUrl);
    } catch (err) {
      console.error('QR kod yaradılarkən xəta:', err);
    }
  };

  // Reset form inputs
  const resetForm = () => {
    setIsEditing(false);
    setCurrentDriverId(null);
    setFullname('');
    setCarPlate('');
    setPhoneNumber('');
    setWhatsappEnabled(true);
    setInstagramUsername('');
    setEmergencyStatus('active');
    setCustomSlug('');
    setCarPhotoUrl('');
    setCarPhotoFile(null);
    setCompressionStats(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render Login Screen if not authenticated
  if (checkingRole && session) {
    // Still checking role — show spinner, NOT the login form
    return (
      <BlueprintBackground>
        <div className="flex flex-col items-center justify-center p-6 bg-white/70 backdrop-blur rounded border border-slate-200 shadow-sm relative">
          <Loader size={30} className="animate-spin text-[#bfa37a] mb-2" />
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Giriş hüququ yoxlanılır...</span>
        </div>
      </BlueprintBackground>
    );
  }

  if (!session || !isAdmin) {
    return (
      <BlueprintBackground>
          <div className="w-full max-w-sm rounded-lg p-6 relative blueprint-card overflow-hidden">
            <div className="blueprint-corner blueprint-corner-tl" />
            <div className="blueprint-corner blueprint-corner-tr" />
            <div className="blueprint-corner blueprint-corner-bl" />
            <div className="blueprint-corner blueprint-corner-br" />

            <div className="text-center mb-6">
              <Key size={36} className="text-[#bfa37a] mx-auto mb-2" />
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider font-mono">
                Admin Portalı
              </h2>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest">Sürücü İdarəetmə Paneli (v1.1)</p>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded font-mono flex items-start gap-2">
                <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSignIn} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                  E-poçt ünvanı
                </label>
                <input
                  type="email"
                  placeholder="admin@qrcar.az"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="input-blueprint text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">Şifrə</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-blueprint text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded btn-gold text-xs flex items-center justify-center gap-2"
              >
                {authLoading && <Loader size={14} className="animate-spin" />}
                <span>Daxil Ol</span>
              </button>
            </form>

            <button 
              onClick={() => navigate('/')} 
              className="mt-6 w-full text-center text-xs font-mono text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 uppercase"
            >
              <ArrowLeft size={12} />
              <span>Skanerə Qayıt</span>
            </button>
          </div>
      </BlueprintBackground>
    );
  }

  // Render Admin Dashboard
  return (
    <div className="blueprint-grid min-h-screen p-4 md:p-8">
      {/* Header Panel */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white/70 backdrop-blur border border-[rgba(191,163,122,0.2)] rounded-lg p-5 relative">
        <div className="blueprint-corner blueprint-corner-tl" />
        <div className="blueprint-corner blueprint-corner-tr" />
        <div className="blueprint-corner blueprint-corner-bl" />
        <div className="blueprint-corner blueprint-corner-br" />

        <div>
          <h1 className="text-xl font-black text-slate-900 font-mono tracking-wider uppercase flex items-center gap-2">
            <span>AVTO QR // ADMİN PORTAL</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono mt-1">İstifadəçi: {session.user.email} (Rol: Admin)</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 py-2 px-4 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs transition-colors"
          >
            <Eye size={14} />
            <span>Skan Səhifəsi</span>
          </button>
          <button 
            onClick={handleSignOut} 
            className="flex items-center gap-2 py-2 px-4 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs transition-colors"
          >
            <LogOut size={14} />
            <span>Çıxış</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Add/Edit Driver Form */}
        <div className="lg:col-span-1">
          <div className="bg-white/70 backdrop-blur border border-[rgba(191,163,122,0.15)] rounded-lg p-6 relative">
            <div className="blueprint-corner blueprint-corner-tl" />
            <div className="blueprint-corner blueprint-corner-tr" />
            <div className="blueprint-corner blueprint-corner-bl" />
            <div className="blueprint-corner blueprint-corner-br" />

            <h3 className="text-sm font-bold text-slate-950 uppercase font-mono tracking-wider border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <Plus size={16} className="text-[#bfa37a]" />
              <span>{isEditing ? 'Sürücü Məlumatlarını Redaktə Et' : 'Yeni Sürücü Əlavə Et'}</span>
            </h3>

            {formMessage.text && (
              <div className={`mb-4 p-3 border text-xs rounded font-mono flex items-start gap-2 ${formMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                {formMessage.type === 'success' ? <Check size={16} className="text-emerald-500 shrink-0" /> : <AlertTriangle size={16} className="text-red-500 shrink-0" />}
                <span>{formMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Adı Soyadı *</label>
                <input
                  type="text"
                  placeholder="Məsələn, Murad Əliyev"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                  className="input-blueprint text-sm"
                />
              </div>

              {/* Car Plate */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Avtomobil Nömrəsi *</label>
                <input
                  type="text"
                  placeholder="Məsələn, 99-AA-999"
                  value={carPlate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCarPlate(val);
                    setCustomSlug(val.toLowerCase().replace(/[^a-z0-9]/g, ''));
                  }}
                  required
                  className="input-blueprint text-sm font-mono uppercase"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Telefon Nömrəsi *</label>
                <input
                  type="text"
                  placeholder="Məsələn, +994501234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="input-blueprint text-sm font-mono"
                />
              </div>

              {/* Custom Slug (Auto-Generated Preview) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                  Keçid Adı (Slug)
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  placeholder="Nömrəyə uyğun olaraq avtomatik formalaşır"
                  value={customSlug}
                  className="input-blueprint text-sm font-mono bg-slate-50/50 cursor-not-allowed opacity-75"
                />
                <span className="text-[9px] text-[#bfa37a] font-mono">
                  Skan edildikdə açılacaq URL: <span className="font-bold">{window.location.origin}/{customSlug || '...'}</span>
                </span>
              </div>

              {/* Instagram Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Instagram Adı (İstəyə bağlı)</label>
                <input
                  type="text"
                  placeholder="Məsələn, murad_aliev"
                  value={instagramUsername}
                  onChange={(e) => setInstagramUsername(e.target.value)}
                  className="input-blueprint text-sm font-mono"
                />
              </div>

              {/* Emergency Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Əlaqə Statusu</label>
                <select
                  value={emergencyStatus}
                  onChange={(e) => setEmergencyStatus(e.target.value)}
                  className="input-blueprint text-sm"
                >
                  <option value="active">Aktiv</option>
                  <option value="urgent">Təcili</option>
                  <option value="inactive">Qeyri-aktiv</option>
                </select>
              </div>

              {/* WhatsApp Enable Switch */}
              <div className="flex items-center gap-2.5 py-1.5">
                <input
                  type="checkbox"
                  id="whatsappEnabled"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#bfa37a] focus:ring-[#bfa37a]"
                />
                <label htmlFor="whatsappEnabled" className="text-xs font-mono font-bold text-slate-600 cursor-pointer">
                  WhatsApp zənginə icazə verilsin
                </label>
              </div>

              {/* Image Upload and Compressor Section */}
              <div className="flex flex-col gap-1.5 border border-slate-100 p-3 rounded bg-slate-50/50">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Image size={12} className="text-[#bfa37a]" />
                  <span>Maşın Şəkli Yüklə</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-3 rounded border border-dashed border-slate-350 hover:bg-slate-100 bg-white text-slate-650 text-xs font-mono transition-colors"
                >
                  Şəkil Seç ({carPhotoFile ? 'Şəkil seçildi' : 'Fayl yoxdur'})
                </button>

                {/* Compression feedback details (BÖLÜM 11 / BÖLÜM 4 instruction) */}
                {compressionStats && (
                  <div className="mt-2 p-2 bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-500 rounded flex flex-col gap-0.5">
                    <span className="font-bold text-[#bfa37a] uppercase">Brauzerdə Sıxılma Nəticəsi:</span>
                    <div>İlkin Ölçü: {compressionStats.original}</div>
                    <div>Sıxılmış Ölçü: {compressionStats.compressed} (Sıxıldı: {compressionStats.ratio})</div>
                  </div>
                )}

                {carPhotoUrl && !carPhotoFile && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={carPhotoUrl} alt="Preview" className="w-12 h-12 object-cover rounded border border-slate-200" />
                    <span className="text-[9px] text-slate-400 font-mono break-all">{carPhotoUrl.substring(0, 40)}...</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2.5 mt-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors font-mono uppercase"
                  >
                    İmtina
                  </button>
                )}
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-3 rounded btn-gold text-xs flex items-center justify-center gap-2"
                >
                  {formLoading && <Loader size={14} className="animate-spin" />}
                  <span>{isEditing ? 'Yadda Saxla' : 'Sürücünü Yarat'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right column: Drivers List */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 backdrop-blur border border-[rgba(191,163,122,0.15)] rounded-lg p-6 relative h-full flex flex-col min-h-[500px]">
            <div className="blueprint-corner blueprint-corner-tl" />
            <div className="blueprint-corner blueprint-corner-tr" />
            <div className="blueprint-corner blueprint-corner-bl" />
            <div className="blueprint-corner blueprint-corner-br" />

            <h3 className="text-sm font-bold text-slate-950 uppercase font-mono tracking-wider border-b border-slate-100 pb-3 mb-4 flex justify-between items-center">
              <span>Sürücü siyahısı ({drivers.length})</span>
              <button 
                onClick={fetchDrivers}
                className="text-[9px] font-mono text-[#bfa37a] hover:underline uppercase tracking-wider"
              >
                Yenilə
              </button>
            </h3>

            {loadingDrivers ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <Loader size={24} className="animate-spin text-[#bfa37a] mb-2" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Siyahı yüklənir...</span>
              </div>
            ) : drivers.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Car size={32} className="stroke-[1] text-[#bfa37a] mb-2 opacity-50" />
                <span className="text-xs font-mono uppercase tracking-wider">Hələ heç bir sürücü qeydiyyatı yoxdur.</span>
              </div>
            ) : (
              <div className="flex-1 overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs font-mono text-slate-600">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase">
                      <th className="py-2.5 px-2">Şəkil</th>
                      <th className="py-2.5 px-2">Sürücü / Nömrə</th>
                      <th className="py-2.5 px-2">Telefon</th>
                      <th className="py-2.5 px-2">Slug</th>
                      <th className="py-2.5 px-2 text-right">Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((driver) => (
                      <tr key={driver.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="py-2.5 px-2">
                          {driver.car_photo_url ? (
                            <img src={driver.car_photo_url} alt="Car" className="w-9 h-9 object-cover rounded border border-slate-200" />
                          ) : (
                            <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                              <Car size={16} />
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="font-bold text-slate-900">{driver.fullname}</div>
                          <div className="text-[10px] text-slate-400 font-mono tracking-wider">{driver.car_plate}</div>
                        </td>
                        <td className="py-2.5 px-2 text-slate-550">{driver.phone_number}</td>
                        <td className="py-2.5 px-2 text-slate-500">
                          {driver.custom_slug ? (
                            <span className="bg-[rgba(191,163,122,0.1)] text-[#bfa37a] border border-[rgba(191,163,122,0.2)] px-1.5 py-0.5 rounded text-[10px]">
                              {driver.custom_slug}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-350">UUID</span>
                          )}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleShowQrCode(driver)}
                              className="p-1.5 rounded border border-slate-200 hover:border-[#bfa37a] hover:bg-white text-slate-550 hover:text-[#bfa37a] transition-all"
                              title="QR Kod Yarat"
                            >
                              <QrCode size={13} />
                            </button>
                            <button
                              onClick={() => handleEditDriver(driver)}
                              className="p-1.5 rounded border border-slate-200 hover:border-blue-300 hover:bg-white text-slate-550 hover:text-blue-600 transition-all"
                              title="Redaktə Et"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteDriver(driver.id, driver.car_photo_url)}
                              className="p-1.5 rounded border border-slate-200 hover:border-red-300 hover:bg-white text-slate-550 hover:text-red-600 transition-all"
                              title="Sil"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal Overlay */}
      {selectedDriverForQr && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 relative w-full max-w-sm border border-[rgba(191,163,122,0.3)] shadow-2xl">
            <div className="blueprint-corner blueprint-corner-tl" />
            <div className="blueprint-corner blueprint-corner-tr" />
            <div className="blueprint-corner blueprint-corner-bl" />
            <div className="blueprint-corner blueprint-corner-br" />

            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-3 mb-4">
              QR Kod // {selectedDriverForQr.car_plate}
            </h3>

            <div className="flex flex-col items-center">
              {qrCodeDataUrl ? (
                <div className="border border-slate-100 p-4 bg-white rounded shadow-inner mb-4">
                  <img src={qrCodeDataUrl} alt="QR Code" className="w-52 h-52 object-contain" />
                </div>
              ) : (
                <div className="w-52 h-52 flex items-center justify-center border border-slate-100 rounded mb-4">
                  <Loader className="animate-spin text-[#bfa37a]" />
                </div>
              )}

              <p className="text-[10px] text-slate-500 font-mono text-center mb-6 leading-relaxed max-w-xs break-all">
                Müştəri üçün keçid URL-i:<br />
                <span className="font-bold text-[#bfa37a]">
                  {window.location.origin}/{selectedDriverForQr.custom_slug || selectedDriverForQr.id}
                </span>
              </p>

              <div className="grid grid-cols-2 gap-3 w-full">
                <a
                  href={qrCodeDataUrl}
                  download={`qrcar-${selectedDriverForQr.car_plate.toLowerCase()}.png`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded btn-gold text-[11px] font-mono"
                >
                  <Download size={13} />
                  <span>YÜKLƏ</span>
                </a>
                <button
                  onClick={() => {
                    const dest = selectedDriverForQr.custom_slug || selectedDriverForQr.id;
                    window.open(`/${dest}`, '_blank');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-mono transition-colors"
                >
                  <ExternalLink size={13} />
                  <span>SINA</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setSelectedDriverForQr(null);
                  setQrCodeDataUrl('');
                }}
                className="mt-6 text-xs font-mono text-slate-400 hover:text-slate-600 hover:underline uppercase tracking-widest"
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Quick Add Panel */}
      <div className="max-w-6xl mx-auto">
        <AdminQuickAdd />
      </div>
    </div>
  );
}
