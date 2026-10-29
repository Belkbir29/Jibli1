import React, { useEffect, useState } from 'react';
import { Order, Language } from '../types';
import { translations } from '../utils/translations';

interface TrackingMapProps {
  order: Order;
  onClose?: () => void;
  language: Language;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({ order, onClose, language }) => {
  const [progress, setProgress] = useState(38); // percentage along the route
  const [eta, setEta] = useState(order.etaMinutes || 18);
  const [distanceKm, setDistanceKm] = useState(2.6);
  const t = translations[language];

  // Dynamic live movement simulation: continuous, fluid progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        const step = 0.5 + Math.random() * 0.4;
        const next = prev + step;
        
        // Calculate remaining distance
        const remainingFraction = (100 - next) / 100;
        const nextDist = Math.max(0.1, Number((2.6 * remainingFraction).toFixed(1)));
        setDistanceKm(nextDist);

        // Calculate remaining ETA
        const nextEta = Math.max(1, Math.round(18 * remainingFraction));
        setEta(nextEta);

        return next;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // Determine current active milestone
  const currentMilestone = progress < 30 ? 0 : progress < 70 ? 1 : progress < 92 ? 2 : 3;

  return (
    <div className="bg-white dark:bg-[#151D30] rounded-3xl p-5 border border-stone-200/60 dark:border-white/10 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5B4A] to-amber-500 text-white flex items-center justify-center font-black shadow-md">
              <i className="fa-solid fa-motorcycle text-lg"></i>
            </div>
            <span className="absolute -top-1 -end-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#151D30] animate-ping"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-[#0F1729] dark:text-white">
                {t.liveCaptainTracking}
              </span>
              <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {t.liveBadge}
              </span>
            </div>
            <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
              {t.orderRef.replace('{id}', order.id)} • {order.restaurantName}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-white/10 text-stone-500 hover:text-stone-800 dark:hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        )}
      </div>

      {/* Visual Live Route Map with Smooth Movement */}
      <div className="relative h-56 md:h-64 bg-[#0B132B] rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between p-4 select-none">
        {/* Stylized Map Grid & Street Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#FF5B4A_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A]/90 via-transparent to-[#0A0E1A]/40 pointer-events-none"></div>

        {/* Floating Street Badges */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-black text-white/70">
          <span className="bg-black/40 backdrop-blur px-2.5 py-1 rounded-lg border border-white/10">
            📍 مسار مباشر: {order.restaurantName} ➔ {order.deliveryAddress}
          </span>
          <span className="bg-emerald-500/20 text-emerald-400 backdrop-blur px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            إشارة GPS قوية
          </span>
        </div>

        {/* Curved animated route track */}
        <div className="relative w-full my-auto px-4">
          {/* Background track line */}
          <div className="relative w-full h-3 bg-stone-800/90 rounded-full overflow-hidden border border-white/10">
            {/* Glowing moving gradient fill */}
            <div
              className="h-full bg-gradient-to-r from-[#FF5B4A] via-[#FFB627] to-emerald-400 transition-all duration-1000 shadow-[0_0_12px_rgba(255,91,74,0.8)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Restaurant Origin Node (Start) */}
          <div className="absolute -top-7 start-2 flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5B4A] text-white flex items-center justify-center shadow-lg shadow-[#FF5B4A]/50 ring-2 ring-white/20">
              <i className="fa-solid fa-store text-sm"></i>
            </div>
            <span className="text-[10px] font-black text-white mt-1.5 bg-black/75 backdrop-blur px-2 py-0.5 rounded-md whitespace-nowrap shadow">
              {order.restaurantName}
            </span>
          </div>

          {/* Active Captain Node (Moving in real time) */}
          <div
            className="absolute -top-8 transition-all duration-1000 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none"
            style={{ left: `${progress}%` }}
          >
            {/* Radar glow wave */}
            <div className="absolute inset-0 -m-2 rounded-2xl bg-[#FFB627]/30 animate-ping"></div>

            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-[#FF5B4A] to-[#FF7A3D] text-white flex items-center justify-center shadow-2xl shadow-amber-500/60 ring-2 ring-white">
              <i className="fa-solid fa-motorcycle text-base animate-bounce"></i>
            </div>
            <div className="text-[10px] font-black text-amber-200 mt-1 bg-black/90 backdrop-blur px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-lg border border-amber-400/30 flex items-center gap-1">
              <span>{order.captainName}</span>
              <span className="text-white/70">({eta} د)</span>
            </div>
          </div>

          {/* Customer Destination Node (End) */}
          <div className="absolute -top-7 end-2 flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/50 ring-2 ring-white/20">
              <i className="fa-solid fa-location-dot text-sm"></i>
            </div>
            <span className="text-[10px] font-black text-white mt-1.5 bg-black/75 backdrop-blur px-2 py-0.5 rounded-md whitespace-nowrap shadow">
              {order.customerName || 'موقعك'} ({order.wilaya})
            </span>
          </div>
        </div>

        {/* Live Metrics Overlay (ETA + Distance) */}
        <div className="relative z-10 flex items-center justify-between bg-black/65 backdrop-blur-md rounded-xl p-3 border border-white/10 text-white text-xs">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-clock text-[#FFB627] text-sm"></i>
            <span>{t.etaLabel} <strong className="text-[#FFB627] font-black text-sm">{eta} دقيقة</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-route text-emerald-400 text-sm"></i>
            <span>{t.remainingDistance} <strong className="text-emerald-400 font-black text-sm">{distanceKm} كم</strong></span>
          </div>
        </div>
      </div>

      {/* 4-Step Interactive Progress Stepper */}
      <div className="grid grid-cols-4 gap-2 pt-1 text-center">
        {[
          { label: t.stepPreparing, icon: 'fa-fire-burner' },
          { label: t.stepPickedUp, icon: 'fa-box-check' },
          { label: t.stepApproaching, icon: 'fa-motorcycle' },
          { label: t.stepArrived, icon: 'fa-house-flag' }
        ].map((st, idx) => {
          const isDone = idx <= currentMilestone;
          const isCurrent = idx === currentMilestone;
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-[#FFF0EE] dark:bg-[#FF5B4A]/15 border-[#FF5B4A] shadow-xs'
                  : isDone
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-stone-50 dark:bg-white/5 border-stone-200/50 dark:border-white/5 opacity-50'
              }`}
            >
              <div
                className={`w-7 h-7 mx-auto rounded-xl flex items-center justify-center text-xs mb-1.5 ${
                  isCurrent
                    ? 'bg-[#FF5B4A] text-white animate-bounce'
                    : isDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-stone-200 dark:bg-white/10 text-stone-400'
                }`}
              >
                <i className={`fa-solid ${st.icon}`}></i>
              </div>
              <div
                className={`text-[10px] font-black leading-tight ${
                  isCurrent
                    ? 'text-[#FF5B4A]'
                    : isDone
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-stone-400'
                }`}
              >
                {st.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Captain Profile & Direct Contact Call/WhatsApp */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/50 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF5B4A] to-[#FFB627] text-white flex items-center justify-center font-black text-base shadow-md">
            {order.captainName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-black text-xs text-[#0F1729] dark:text-white">{order.captainName}</h4>
              <span className="text-[10px] text-amber-500 font-black flex items-center gap-0.5">
                <i className="fa-solid fa-star text-[9px]"></i>
                {order.captainRating}
              </span>
            </div>
            <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
              {t.captainVerified}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${order.captainPhone}`}
            className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1.5 text-xs font-black transition shadow-sm cursor-pointer"
            title={t.callCaptain}
          >
            <i className="fa-solid fa-phone text-xs"></i>
            <span className="hidden sm:inline">{t.callCaptain}</span>
          </a>
          <a
            href={`https://wa.me/213${order.captainPhone.replace(/^0/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 text-xs font-black transition shadow-sm cursor-pointer"
            title={t.whatsappCaptain}
          >
            <i className="fa-brands fa-whatsapp text-sm"></i>
            <span className="hidden sm:inline">{t.whatsappCaptain}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
