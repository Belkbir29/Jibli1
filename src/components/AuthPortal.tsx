import React, { useState } from 'react';
import { UserRole, UserProfile, Language } from '../types';
import { WILAYAS } from '../data/jibliData';
import { translations } from '../utils/translations';

interface AuthPortalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole: UserRole;
  isGuestMode?: boolean;
  onSuccess: (profile: UserProfile) => void;
  language: Language;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({
  isOpen,
  onClose,
  initialRole,
  isGuestMode = false,
  onSuccess,
  language
}) => {
  const [role, setRole] = useState<UserRole>(isGuestMode ? 'customer' : initialRole);
  const t = translations[language];

  // Clean form state without mock data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [wilaya, setWilaya] = useState('16');
  const [address, setAddress] = useState('');
  const [vehicleType, setVehicleType] = useState('moto');
  const [restaurantName, setRestaurantName] = useState('');
  const [cuisineType, setCuisineType] = useState('تقليدي');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!isGuestMode && !email.trim()) return;

    const selectedWilayaObj = WILAYAS.find((w) => w.code === wilaya) || WILAYAS[0];

    const newProfile: UserProfile = {
      id: 'usr_' + Date.now().toString(36),
      name: name.trim(),
      email: isGuestMode ? '' : email.trim(),
      phone: phone.trim() || '0550000000',
      wilaya: selectedWilayaObj.nameAr,
      address: address.trim() || selectedWilayaObj.nameAr,
      role: isGuestMode ? 'customer' : role,
      isGuest: isGuestMode,
      loyaltyPoints: isGuestMode ? 0 : 150,
      avatar: name.trim().charAt(0).toUpperCase()
    };

    onSuccess(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-white dark:bg-[#151D30] rounded-3xl w-full max-w-lg overflow-hidden border border-stone-200/60 dark:border-white/10 shadow-2xl flex flex-col max-h-[92vh] animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-white/5 flex items-center justify-between bg-stone-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5B4A] to-[#FF7A3D] text-white flex items-center justify-center font-black shadow-md">
              <i className={isGuestMode ? 'fa-solid fa-user-clock' : 'fa-solid fa-user-plus'}></i>
            </div>
            <div>
              <h3 className="font-black text-base text-[#0F1729] dark:text-white">
                {isGuestMode
                  ? t.guestInfoTitle
                  : role === 'customer'
                  ? t.loginRegisterTitle
                  : role === 'captain'
                  ? `${t.captainRole} — JIBLI`
                  : `${t.restaurantRole} — JIBLI`}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-bold">
                {isGuestMode
                  ? t.guestInfoSubtitle
                  : role === 'customer'
                  ? (language === 'ar' ? 'سجل حسابك الرسمي للاستفادة من كامل الميزات والخصومات' : language === 'fr' ? 'Inscrivez-vous pour profiter de toutes les réductions' : 'Register your official account to access deals and rewards')
                  : (language === 'ar' ? 'انضم إلى شبكة كباتن وشركاء JIBLI في الجزائر' : 'Rejoignez le réseau JIBLI en Algérie')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-white/10 text-stone-500 hover:text-stone-800 dark:hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Role Selector Tabs (Only shown for official registration, not locked guest mode) */}
        {!isGuestMode && (
          <div className="px-5 pt-3 pb-1 border-b border-stone-100 dark:border-white/5 bg-stone-50/30 dark:bg-white/[0.02]">
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  role === 'customer'
                    ? 'bg-[#FF5B4A] text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-300'
                }`}
              >
                <span>🍽️</span>
                <span>{t.customerRole}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('captain')}
                className={`py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  role === 'captain'
                    ? 'bg-[#FF5B4A] text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-300'
                }`}
              >
                <span>🛵</span>
                <span>{t.captainRole}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('restaurant')}
                className={`py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  role === 'restaurant'
                    ? 'bg-[#FF5B4A] text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-300'
                }`}
              >
                <span>🏪</span>
                <span>{t.restaurantRole}</span>
              </button>
            </div>
          </div>
        )}

        {/* Guest notice banner */}
        {isGuestMode && (
          <div className="mx-5 mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-2">
            <i className="fa-solid fa-circle-info text-sm"></i>
            <span>{t.guestNotice}</span>
          </div>
        )}

        {/* Form Body - Clean and responsive */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto no-scrollbar flex-1">
          <div>
            <label className="block text-xs font-black text-stone-700 dark:text-stone-300 mb-1">
              {t.fullNameLabel}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.fullNamePlaceholder}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-xs font-bold text-[#0F1729] dark:text-white focus:outline-none focus:border-[#FF5B4A]"
            />
          </div>

          {!isGuestMode && (
            <div>
              <label className="block text-xs font-black text-stone-700 dark:text-stone-300 mb-1">
                {t.emailLabel}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-xs font-bold text-[#0F1729] dark:text-white focus:outline-none focus:border-[#FF5B4A]"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-stone-700 dark:text-stone-300 mb-1">
                {t.phoneInputLabel}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phoneInputPlaceholder}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-xs font-bold text-[#0F1729] dark:text-white focus:outline-none focus:border-[#FF5B4A]"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-stone-700 dark:text-stone-300 mb-1">
                {t.wilayaLabel}
              </label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-xs font-bold text-[#0F1729] dark:text-white focus:outline-none"
              >
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code} - {language === 'ar' ? w.nameAr : w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-stone-700 dark:text-stone-300 mb-1">
              {t.deliveryAddressLabel}
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t.deliveryAddressPlaceholder}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-xs font-bold text-[#0F1729] dark:text-white focus:outline-none focus:border-[#FF5B4A]"
            />
          </div>

          {/* Captain-specific inputs (only in non-guest registration) */}
          {!isGuestMode && role === 'captain' && (
            <div>
              <label className="block text-xs font-black text-stone-700 dark:text-stone-300 mb-1">
                {t.vehicleTypeLabel}
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-xs font-bold text-[#0F1729] dark:text-white focus:outline-none"
              >
                <option value="moto">{language === 'ar' ? 'دراجة نارية (Moto Scooter) - أسرع توصيل' : 'Moto / Scooter'}</option>
                <option value="car">{language === 'ar' ? 'سيارة سياحية' : 'Voiture / Car'}</option>
                <option value="bicycle">{language === 'ar' ? 'دراجة هوائية' : 'Vélo / Bicycle'}</option>
              </select>
            </div>
          )}

          {/* Restaurant-specific inputs (only in non-guest registration) */}
          {!isGuestMode && role === 'restaurant' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-stone-700 dark:text-stone-300 mb-1">
                  {t.restaurantNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: مطعم النخيل' : 'Ex: Le Palmier'}
                  className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-xs font-bold text-[#0F1729] dark:text-white focus:outline-none focus:border-[#FF5B4A]"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-stone-700 dark:text-stone-300 mb-1">
                  {t.cuisineTypeLabel}
                </label>
                <select
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-xs font-bold text-[#0F1729] dark:text-white focus:outline-none"
                >
                  <option value="تقليدي">{language === 'ar' ? 'أطباق جزائرية تقليدية' : 'Plats traditionnels'}</option>
                  <option value="سريع">{language === 'ar' ? 'وجبات سريعة وبرغر' : 'Fast-food & Burgers'}</option>
                  <option value="بيتزا">{language === 'ar' ? 'بيتزا ومخبوزات' : 'Pizza & Four'}</option>
                  <option value="حلويات">{language === 'ar' ? 'حلويات ومشروبات' : 'Desserts & Boissons'}</option>
                </select>
              </div>
            </div>
          )}

          {!isGuestMode && (
            <div>
              <label className="block text-xs font-black text-stone-700 dark:text-stone-300 mb-1">
                {t.passwordLabel}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-xs font-bold text-[#0F1729] dark:text-white focus:outline-none focus:border-[#FF5B4A]"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5B4A] to-[#FF7A3D] hover:from-[#E04836] hover:to-[#FF5B4A] text-white font-black text-xs shadow-lg shadow-[#FF5B4A]/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>{isGuestMode ? t.guestSubmitBtn : t.submitRegistration}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
