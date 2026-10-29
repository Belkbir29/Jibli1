import React, { useState } from 'react';
import { OwnerBroadcastMessage, Order, Language } from '../types';
import { translations } from '../utils/translations';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: OwnerBroadcastMessage[];
  orders: Order[];
  onMarkAllAsRead: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  language: Language;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  messages,
  orders,
  onMarkAllAsRead,
  soundEnabled,
  onToggleSound,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'broadcasts' | 'orders'>('broadcasts');
  const t = translations[language];

  if (!isOpen) return null;

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-[#151D30] rounded-3xl w-full max-w-lg overflow-hidden border border-stone-200/60 dark:border-white/10 shadow-2xl flex flex-col max-h-[85vh] animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-white/5 flex items-center justify-between bg-stone-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5B4A]/10 text-[#FF5B4A] flex items-center justify-center font-black">
              <i className="fa-solid fa-bell text-lg"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-[#0F1729] dark:text-white">
                  {t.notificationCenterTitle}
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-[#FF5B4A] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-bold">
                {t.notificationCenterSub}
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

        {/* Quick controls bar */}
        <div className="px-5 py-2.5 bg-stone-100/60 dark:bg-white/[0.03] border-b border-stone-200/40 dark:border-white/5 flex items-center justify-between text-xs">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('broadcasts')}
              className={`px-3 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'broadcasts'
                  ? 'bg-[#FF5B4A] text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-white/10'
              }`}
            >
              <i className="fa-solid fa-bullhorn text-[11px]"></i>
              <span>{t.platformMessages} ({messages.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-[#FF5B4A] text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-white/10'
              }`}
            >
              <i className="fa-solid fa-receipt text-[11px]"></i>
              <span>{t.orderUpdates} ({orders.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  : 'bg-stone-200 dark:bg-white/10 text-stone-400'
              }`}
            >
              <i className={`fa-solid ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'} text-[10px]`}></i>
            </button>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="text-[11px] font-black text-[#FF5B4A] hover:underline cursor-pointer"
              >
                {t.markAllRead}
              </button>
            )}
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 no-scrollbar">
          {activeTab === 'broadcasts' ? (
            messages.length === 0 ? (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <i className="fa-solid fa-envelope-open text-3xl opacity-40"></i>
                <p className="text-xs font-bold">{t.noMessages}</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-2xl border transition ${
                    msg.isRead
                      ? 'bg-stone-50 dark:bg-white/5 border-stone-200/40 dark:border-white/5 opacity-85'
                      : 'bg-[#FFF0EE] dark:bg-[#FF5B4A]/10 border-[#FF5B4A]/30 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF5B4A]"></span>
                      <h4 className="font-black text-xs text-[#0F1729] dark:text-white">{msg.title}</h4>
                    </div>
                    {msg.badge && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white dark:bg-white/10 text-[#FF5B4A] dark:text-[#FFB627] shadow-2xs">
                        {msg.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-stone-600 dark:text-stone-300 leading-relaxed ps-4 mb-2">
                    {msg.content}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold ps-4">
                    <span>
                      <i className="fa-solid fa-user-tie me-1 text-[#FF5B4A]"></i>
                      {msg.author}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              ))
            )
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <i className="fa-solid fa-bag-shopping text-3xl opacity-40"></i>
              <p className="text-xs font-bold">{t.noOrderUpdates}</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs">
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <span className="font-black text-xs text-[#0F1729] dark:text-white">
                      {t.orderNumber.replace('{id}', ord.id)}
                    </span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
                    {ord.status === 'preparing'
                      ? t.orderPreparing
                      : ord.status === 'on_the_way'
                      ? t.captainOnWay
                      : t.orderDelivered}
                  </span>
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-300 font-bold">
                  {ord.items.map((it) => `${it.quantity}x ${it.dish.name}`).join(' ، ')}
                </div>
                <div className="flex items-center justify-between text-[11px] font-black text-stone-400 pt-1 border-t border-stone-100 dark:border-white/5">
                  <span>{ord.restaurantName}</span>
                  <span className="text-[#FF5B4A]">{ord.total} {t.currency}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clean Footer (Broadcast compose button removed completely per user request) */}
        <div className="p-4 border-t border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-white/5 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-200 dark:bg-white/10 hover:bg-stone-300 dark:hover:bg-white/20 text-stone-700 dark:text-white text-xs font-black transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
