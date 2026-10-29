/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  UserRole,
  Dish,
  CartItem,
  Order,
  OwnerBroadcastMessage,
  Language
} from './types';
import {
  DISHES,
  CATEGORIES,
  FILTER_PILLS,
  WILAYAS,
  INITIAL_OWNER_MESSAGES
} from './data/jibliData';
import { soundEffects } from './utils/soundEffects';
import { TrackingMap } from './components/TrackingMap';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { AuthPortal } from './components/AuthPortal';
import { translations } from './utils/translations';

export default function App() {
  // App state
  const [hasEnteredApp, setHasEnteredApp] = useState<boolean>(true);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [language, setLanguage] = useState<Language>('ar');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jibli_theme');
      if (saved) return saved === 'dark';
    }
    return true;
  });

  // Active translation dictionary
  const t = useMemo(() => translations[language], [language]);

  // Sync HTML lang and dir attributes dynamically whenever language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Active user profile - starts clean without mock data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'usr_default',
    name: '',
    email: '',
    phone: '',
    wilaya: 'الجزائر العاصمة',
    address: '',
    role: 'customer',
    isGuest: false,
    loyaltyPoints: 150,
    avatar: 'J'
  });

  // Selected Wilaya
  const [selectedWilaya, setSelectedWilaya] = useState<string>('الجزائر العاصمة');
  const [isWilayaModalOpen, setIsWilayaModalOpen] = useState<boolean>(false);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'orders' | 'rewards' | 'profile'>('home');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFilterPill, setSelectedFilterPill] = useState<string>('الكل');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authRoleTarget, setAuthRoleTarget] = useState<UserRole>('customer');
  const [authIsGuestMode, setAuthIsGuestMode] = useState<boolean>(false);
  const [selectedDishDetail, setSelectedDishDetail] = useState<Dish | null>(null);
  const [showLiveTrackingModal, setShowLiveTrackingModal] = useState<boolean>(false);

  // Messages & Notifications
  const [ownerMessages, setOwnerMessages] = useState<OwnerBroadcastMessage[]>(INITIAL_OWNER_MESSAGES);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Slider State (Hero carousel)
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      try {
        localStorage.setItem('jibli_theme', 'dark');
      } catch {
        // ignore
      }
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      try {
        localStorage.setItem('jibli_theme', 'light');
      } catch {
        // ignore
      }
    }
  }, [isDarkMode]);

  // Toast helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Auto slide effect (Hero carousel)
  useEffect(() => {
    if (showWelcome || activeTab !== 'home') return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, [showWelcome, activeTab]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return DISHES.filter((dish) => {
      if (selectedCategory !== 'all' && dish.category !== selectedCategory) {
        return false;
      }
      if (selectedFilterPill !== 'الكل') {
        if (selectedFilterPill === 'عروض وتخفيضات' && !dish.isSpecialOffer) return false;
        if (selectedFilterPill === 'الأعلى تقييماً' && dish.rating < 4.8) return false;
        if (selectedFilterPill === 'أطباق تقليدية' && dish.category !== 'تقليدي') return false;
        if (selectedFilterPill === 'سريع وسندويشات' && dish.category !== 'سريع' && dish.category !== 'بيتزا') return false;
        if (selectedFilterPill === 'صحي ولايت' && dish.category !== 'صحي') return false;
        if (selectedFilterPill === 'حلال 100%' && dish.filterTag !== 'حلال 100%' && dish.category !== 'تقليدي') return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = dish.name.toLowerCase().includes(q);
        const matchEn = dish.nameEn?.toLowerCase().includes(q) || false;
        const matchFr = dish.nameFr?.toLowerCase().includes(q) || false;
        const matchDesc = dish.description.toLowerCase().includes(q);
        const matchRest = dish.restaurantName.toLowerCase().includes(q);
        return matchName || matchEn || matchFr || matchDesc || matchRest;
      }
      return true;
    });
  }, [selectedCategory, selectedFilterPill, searchQuery]);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    const wilayaObj = WILAYAS.find((w) => w.nameAr === selectedWilaya || w.name === selectedWilaya);
    return wilayaObj ? wilayaObj.deliveryFee : 200;
  }, [selectedWilaya]);

  const discountAmount = useMemo(() => {
    if (appliedPromo === 'JIBLI50') {
      return Math.min(Math.round(cartSubtotal * 0.5), 600);
    }
    return 0;
  }, [appliedPromo, cartSubtotal]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal + deliveryFee - discountAmount);
  }, [cartSubtotal, deliveryFee, discountAmount]);

  const cartTotalCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Add to cart
  const handleAddToCart = (dish: Dish) => {
    soundEffects.playAddToCart(soundEnabled);
    setCart((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
    const dishTitle = language === 'ar' ? dish.name : language === 'fr' ? (dish.nameFr || dish.name) : (dish.nameEn || dish.name);
    showToast(t.addedToCart.replace('{dish}', dishTitle));
  };

  // Modify cart item quantity
  const handleUpdateQuantity = (dishId: string, delta: number) => {
    soundEffects.playClick(soundEnabled);
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  // Apply promo code
  const handleApplyPromo = () => {
    soundEffects.playClick(soundEnabled);
    if (!promoCode.trim()) return;
    if (promoCode.trim().toUpperCase() === 'JIBLI50') {
      setAppliedPromo('JIBLI50');
      showToast(language === 'ar' ? '🎉 تم تطبيق كود JIBLI50 بنجاح! خصم 50% حتى 600 دج' : '🎉 Code JIBLI50 appliqué avec succès !');
    } else {
      showToast(language === 'ar' ? '❌ الكود المدخل غير صالح أو انتهت صلاحيته' : '❌ Code promo invalide');
    }
  };

  // Place Order
  const handleCheckout = () => {
    if (cart.length === 0) return;
    soundEffects.playOrderSuccess(soundEnabled);

    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const newOrder: Order = {
      id: 'DZ' + Math.floor(100000 + Math.random() * 900000),
      customerName: userProfile.name || (language === 'ar' ? 'العميل الكريم' : 'Client JIBLI'),
      customerPhone: userProfile.phone || '0550000000',
      deliveryAddress: userProfile.address || selectedWilaya,
      wilaya: selectedWilaya,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      discount: discountAmount,
      total: cartTotal,
      status: 'preparing',
      createdAt: language === 'ar' ? 'الآن' : 'Maintenant',
      etaMinutes: 20,
      captainName: 'أمين بلحاج',
      captainPhone: '0554128990',
      captainRating: 4.9,
      restaurantName: cart[0]?.dish.restaurantName || 'دار الضيافة العاصمة',
      paymentMethod: 'cash'
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCart([]);
    setIsCartOpen(false);
    showToast(language === 'ar' ? `تم تأكيد الطلب #${newOrder.id} بنجاح! الكابتن في الطريق إليك 🛵` : `Commande #${newOrder.id} confirmée avec succès !`);

    // Notification update
    const orderAlertMsg: OwnerBroadcastMessage = {
      id: 'ord-' + newOrder.id,
      title: language === 'ar' ? `✅ تم تأكيد طلبك رقم #${newOrder.id}` : `✅ Commande confirmée #${newOrder.id}`,
      content: language === 'ar' 
        ? `يقوم مطعم "${newOrder.restaurantName}" بتحضير وجبتك، وسيتولى الكابتن أمين التوصيل إلى ${newOrder.wilaya}.`
        : `Le restaurant prépare vos plats, le livreur arrive bientôt à ${newOrder.wilaya}.`,
      type: 'system',
      timestamp: language === 'ar' ? 'الآن' : 'Maintenant',
      isRead: false,
      author: 'JIBLI'
    };
    setOwnerMessages((prev) => [orderAlertMsg, ...prev]);
  };

  // Confirm receipt of order and remove active banner immediately per user instruction
  const handleConfirmReceipt = () => {
    if (!activeOrder) return;
    soundEffects.playOrderSuccess(soundEnabled);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }

    // Update order status in orders history to delivered
    setOrders((prev) =>
      prev.map((o) => (o.id === activeOrder.id ? { ...o, status: 'delivered' } : o))
    );

    // REMOVE THE ACTIVE ORDER BANNER IMMEDIATELY FROM HOME VIEW
    setActiveOrder(null);
    setShowLiveTrackingModal(false);

    showToast(t.receiptConfirmedToast);
  };

  // Hero slider swipe drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    if (Math.abs(diff) < 160) {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const isRtl = language === 'ar';
    if (dragOffset > 50) {
      setActiveSlide((prev) => (isRtl ? (prev > 0 ? prev - 1 : 2) : (prev < 2 ? prev + 1 : 0)));
    } else if (dragOffset < -50) {
      setActiveSlide((prev) => (isRtl ? (prev < 2 ? prev + 1 : 0) : (prev > 0 ? prev - 1 : 2)));
    }
    setDragOffset(0);
  };

  // Open Auth modal for role
  const handleOpenAuth = (role: UserRole, isGuest = false) => {
    soundEffects.playClick(soundEnabled);
    setAuthRoleTarget(role);
    setAuthIsGuestMode(isGuest);
    setIsAuthOpen(true);
  };

  // Profile update from AuthPortal
  const handleAuthSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentRole(profile.role);
    setSelectedWilaya(profile.wilaya);
    setShowWelcome(false);
    setHasEnteredApp(true);
    soundEffects.playNotification(soundEnabled);
    showToast(language === 'ar' ? `مرحباً بك يا ${profile.name}! تم تسجيل الدخول بنجاح ✨` : `Bienvenue ${profile.name} ! Connexion réussie ✨`);
  };

  return (
    <div className="min-h-screen text-[#0F1729] dark:text-[#F0F2F7] transition-colors duration-200 bg-[#F7F8FC] dark:bg-[#0A0E1A] flex flex-col font-sans select-none overscroll-x-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 inset-x-0 mx-auto z-55 max-w-md px-4 pointer-events-none animate-slideDown">
          <div className="bg-[#0F1729] dark:bg-white text-white dark:text-[#0F1729] px-4 py-3 rounded-2xl shadow-2xl border border-white/20 dark:border-black/20 flex items-center justify-between text-xs font-black">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-[#FF5B4A]"></i>
              <span>{toastMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* WELCOME / FIRST PAGE OVERLAY (GUEST / BROWSER MODE REMOVED COMPLETELY PER USER REQUEST) */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 bg-mesh flex flex-col justify-between p-6 md:p-12 text-white overflow-y-auto animate-fadeIn overscroll-x-none">
          <div className="absolute top-10 end-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
          <div className="absolute bottom-10 start-10 w-80 h-80 bg-[#FFB627]/20 rounded-full blur-3xl animate-float pointer-events-none"></div>

          {/* Top Bar on Welcome: Clean without language or sound */}
          <div className="relative flex items-center justify-between max-w-7xl mx-auto w-full z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white text-[#FF5B4A] flex items-center justify-center font-black shadow-2xl text-2xl animate-float">
                <i className="fa-solid fa-utensils"></i>
              </div>
              <div>
                <span className="font-black text-2xl md:text-3xl tracking-tight">
                  {t.appName}
                </span>
                <p className="text-xs text-white/80 font-bold">{t.appSlogan}</p>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative max-w-4xl mx-auto text-center space-y-6 py-6 z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xl border border-white/25 px-4 py-2 rounded-full text-xs font-black shadow-lg">
              <i className="fa-solid fa-bolt text-[#FFB627]"></i>
              <span>{language === 'ar' ? 'أكثر من 500 مطعم في 58 ولاية جزائرية' : 'Plus de 500 restaurants dans 58 wilayas'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight">
              {language === 'ar' ? (
                <>
                  اطلب <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB627] to-[#FF5B4A]">طعامك المفضل</span>
                  <br />
                  واستمتع بتجربة فاخرة في الجزائر
                </>
              ) : language === 'fr' ? (
                <>
                  Commandez <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB627] to-[#FF5B4A]">vos plats favoris</span>
                  <br />
                  avec livraison ultra-rapide en Algérie
                </>
              ) : (
                <>
                  Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB627] to-[#FF5B4A]">Your Favorite Meals</span>
                  <br />
                  with Fast Express Delivery in Algeria
                </>
              )}
            </h1>

            {/* Role Cards Selection */}
            <div className="pt-4 max-w-xl mx-auto w-full space-y-3">
              <div className="text-center">
                <h3 className="text-xs sm:text-sm font-black text-amber-300">
                  {language === 'ar' ? 'حدد صفتك للدخول في المنصة:' : 'Choisissez votre espace pour continuer :'}
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 pt-1">
                {/* Customer */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentRole('customer');
                    soundEffects.playClick(soundEnabled);
                  }}
                  className={`p-3.5 sm:p-4 rounded-3xl text-center transition cursor-pointer flex flex-col items-center justify-between border ${
                    currentRole === 'customer'
                      ? 'bg-white text-[#0F1729] shadow-2xl scale-102 border-white'
                      : 'glass text-white border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-black shadow-md ${
                      currentRole === 'customer' ? 'bg-[#FF5B4A] text-white' : 'bg-white/20 text-white'
                    }`}
                  >
                    🍽️
                  </div>
                  <div className="mt-2 text-xs sm:text-sm font-black">{t.customerRole}</div>
                </button>

                {/* Captain */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentRole('captain');
                    soundEffects.playClick(soundEnabled);
                  }}
                  className={`p-3.5 sm:p-4 rounded-3xl text-center transition cursor-pointer flex flex-col items-center justify-between border ${
                    currentRole === 'captain'
                      ? 'bg-white text-[#0F1729] shadow-2xl scale-102 border-white'
                      : 'glass text-white border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-black shadow-md ${
                      currentRole === 'captain' ? 'bg-[#FF5B4A] text-white' : 'bg-white/20 text-white'
                    }`}
                  >
                    🛵
                  </div>
                  <div className="mt-2 text-xs sm:text-sm font-black">{t.captainRole}</div>
                </button>

                {/* Restaurant */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentRole('restaurant');
                    soundEffects.playClick(soundEnabled);
                  }}
                  className={`p-3.5 sm:p-4 rounded-3xl text-center transition cursor-pointer flex flex-col items-center justify-between border ${
                    currentRole === 'restaurant'
                      ? 'bg-white text-[#0F1729] shadow-2xl scale-102 border-white'
                      : 'glass text-white border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-black shadow-md ${
                      currentRole === 'restaurant' ? 'bg-[#FF5B4A] text-white' : 'bg-white/20 text-white'
                    }`}
                  >
                    🏪
                  </div>
                  <div className="mt-2 text-xs sm:text-sm font-black">{t.restaurantRole}</div>
                </button>
              </div>

              {/* Action Buttons: Customer gets both Email Registration and Guest Browsing (with details entry) */}
              <div className="pt-3 space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenAuth(currentRole, false)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF5B4A] via-[#FF7A3D] to-[#FFB627] hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-envelope"></i>
                  <span>
                    {language === 'ar' ? 'التسجيل أو الدخول عبر البريد الإلكتروني' : language === 'fr' ? 'Connexion / Inscription par e-mail' : 'Register or Login with Email'}
                  </span>
                </button>

                {currentRole === 'customer' ? (
                  <button
                    type="button"
                    onClick={() => handleOpenAuth('customer', true)}
                    className="w-full py-3 px-6 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-black text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-user-clock"></i>
                    <span>{t.browseAsGuest}</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-2xl bg-white/10 text-stone-300 text-[11px] font-bold text-center border border-white/15">
                    {language === 'ar'
                      ? `🔒 للعمل كـ ${currentRole === 'captain' ? 'كابتن توصيل' : 'صاحب مطعم شريك'}، يجب التسجيل الرسمي بالبريد الإلكتروني للتحقق من الهوية والوثائق.`
                      : '🔒 Compte officiel requis pour les livreurs et partenaires restaurants.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative border-t border-white/15 pt-4 flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto w-full text-xs text-white/70 font-bold z-10">
            <div>© 2026 {t.appName} 🇩🇿</div>
            <div className="flex items-center gap-4">
              <span>500+ {language === 'ar' ? 'مطعم' : 'restaurants'}</span>
              <span>4.9 ⭐</span>
            </div>
          </div>
        </div>
      )}

      {/* HEADER: SOUND AND LANGUAGE ARE IN SIDEBAR PER USER REQUEST */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0F1729]/90 backdrop-blur-2xl border-b border-stone-200/60 dark:border-white/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* Right section: Sidebar toggle & Wilaya Selector */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick(soundEnabled);
                setIsSidebarOpen(true);
              }}
              className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-[#F7F8FC] dark:bg-[#1F2A44] hover:bg-[#FFF0EE] flex items-center justify-center text-[#0F1729] dark:text-white transition cursor-pointer"
              title={t.sidebarTitle}
            >
              <i className="fa-solid fa-bars-staggered"></i>
            </button>

            {/* Wilaya Picker */}
            <button
              type="button"
              onClick={() => setIsWilayaModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-[#F7F8FC] dark:hover:bg-[#1F2A44] transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FFF0EE] text-[#FF5B4A] flex items-center justify-center">
                <i className="fa-solid fa-location-dot text-xs"></i>
              </div>
              <div className="text-start">
                <div className="text-[10px] font-bold text-stone-400">{t.deliveryTo}</div>
                <div className="text-xs font-black text-[#0F1729] dark:text-white flex items-center gap-1">
                  <span>{selectedWilaya}</span>
                  <i className="fa-solid fa-chevron-down text-[8px] text-stone-400"></i>
                </div>
              </div>
            </button>
          </div>

          {/* Center: Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-premium-gradient text-white flex items-center justify-center font-black shadow-lg shadow-[#FF5B4A]/25 animate-iconFloat group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-utensils text-sm group-hover:rotate-12 transition-transform duration-300"></i>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg md:text-xl text-[#0F1729] dark:text-white leading-none tracking-tight">
                {t.appName}
              </span>
              <span className="text-[9px] font-bold text-[#FFB627] hidden sm:block">
                {t.appSlogan}
              </span>
            </div>
          </div>

          {/* Left section: Role Badge, Dark Mode, Notification Bell, Cart */}
          <div className="flex items-center gap-2 md:gap-2.5">
            {/* Active Role Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#F7F8FC] dark:bg-[#1F2A44] border border-stone-200/50 dark:border-white/5 text-xs font-black text-stone-700 dark:text-stone-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#FF5B4A]"></span>
              <span>
                {currentRole === 'customer'
                  ? t.customerInterface
                  : currentRole === 'captain'
                  ? t.captainInterface
                  : t.restaurantInterface}
              </span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick(soundEnabled);
                setIsDarkMode((prev) => {
                  const next = !prev;
                  showToast(
                    next
                      ? (language === 'ar' ? 'تم تفعيل الوضع الليلي 🌙' : language === 'fr' ? 'Mode sombre activé 🌙' : 'Dark mode enabled 🌙')
                      : (language === 'ar' ? 'تم تفعيل الوضع النهاري ☀️' : language === 'fr' ? 'Mode clair activé ☀️' : 'Light mode enabled ☀️')
                  );
                  return next;
                });
              }}
              className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-[#F7F8FC] dark:bg-[#1F2A44] hover:bg-[#FFF0EE] dark:hover:bg-white/10 flex items-center justify-center text-[#0F1729] dark:text-white transition cursor-pointer shadow-2xs"
              title={isDarkMode ? t.lightMode : t.darkMode}
              aria-label={isDarkMode ? t.lightMode : t.darkMode}
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun text-[#FFB627]' : 'fa-moon text-stone-700'}`}></i>
            </button>

            {/* Notifications Bell */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playNotification(soundEnabled);
                setIsNotificationOpen(true);
              }}
              className="relative w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-[#F7F8FC] dark:bg-[#1F2A44] hover:bg-[#FFF0EE] dark:hover:bg-white/10 text-[#0F1729] dark:text-white flex items-center justify-center transition cursor-pointer group shadow-2xs"
              title={t.notificationsTitle}
            >
              <i className="fa-solid fa-bell text-sm transition-transform duration-300 text-[#FF5B4A] animate-bellRing"></i>
              {ownerMessages.some((m) => !m.isRead) && (
                <span className="absolute -top-1 -end-1 bg-gradient-to-tr from-[#FF5B4A] to-[#FF8A3D] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-md animate-badgeBounce ring-2 ring-white dark:ring-[#0F1729]">
                  {ownerMessages.filter((m) => !m.isRead).length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            {currentRole === 'customer' && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick(soundEnabled);
                  setIsCartOpen(true);
                }}
                className="relative w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-premium-gradient text-white flex items-center justify-center transition cursor-pointer shadow-md hover:scale-105 active:scale-95"
                title={t.cartTitle}
              >
                <i className="fa-solid fa-bag-shopping"></i>
                {cartTotalCount > 0 && (
                  <span className="absolute -top-1 -end-1 bg-[#0F1729] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black ring-2 ring-white dark:ring-[#0F1729]">
                    {cartTotalCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile summary chip */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 ps-1 pe-3 py-1 bg-stone-100 dark:bg-[#1F2A44] hover:bg-stone-200 dark:hover:bg-white/10 rounded-2xl transition cursor-pointer border border-stone-200/50 dark:border-white/5"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                  {userProfile.avatar || 'J'}
                </div>
                <div className="text-start">
                  <div className="text-xs font-black text-[#0F1729] dark:text-white leading-tight">
                    {userProfile.name || (language === 'ar' ? 'حسابي' : 'Mon compte')}
                  </div>
                  <div className="text-[9px] font-bold text-amber-600 dark:text-amber-400">
                    {userProfile.email ? t.verifiedAccount : t.guestBadge}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* SIDEBAR DRAWER (CONTAINS SOUND & LANGUAGE SETTINGS) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex animate-fadeIn overscroll-x-none">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          <div
            className="relative w-80 md:w-96 bg-white dark:bg-[#111827] h-full shadow-2xl flex flex-col justify-between z-10 border-e border-stone-200/60 dark:border-white/10 overflow-y-auto no-scrollbar animate-slideDown"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-stone-100 dark:border-white/5 flex items-center justify-between bg-stone-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-premium-gradient text-white flex items-center justify-center font-black shadow-md">
                  <i className="fa-solid fa-utensils text-sm"></i>
                </div>
                <div>
                  <h3 className="font-black text-base text-[#0F1729] dark:text-white">{t.sidebarTitle}</h3>
                  <p className="text-[10px] font-bold text-stone-400">{t.sidebarSubtitle}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-white/10 text-stone-500 hover:text-stone-800 dark:hover:text-white flex items-center justify-center cursor-pointer transition"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-6 flex-1">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5B4A] to-[#FFB627] text-white flex items-center justify-center font-black text-lg shadow-md">
                    {userProfile.avatar || 'J'}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[#0F1729] dark:text-white">
                      {userProfile.name || (language === 'ar' ? 'مستخدم JIBLI' : 'Utilisateur JIBLI')}
                    </h4>
                    <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
                      {userProfile.email || (language === 'ar' ? 'تسجيل بالبريد' : 'Compte e-mail')}
                    </p>
                    <span className="text-[10px] text-amber-500 font-black">
                      ⭐ {userProfile.loyaltyPoints} {language === 'ar' ? 'نقطة ولاء' : 'pts'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SOUND & LANGUAGE SETTINGS IN SIDEBAR */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black text-[#FF5B4A] uppercase tracking-wider">
                  <i className="fa-solid fa-sliders"></i>
                  <span>{t.settingsTitle}</span>
                </div>

                {/* 1) Sound Settings Card */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                        soundEnabled ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-stone-200 dark:bg-white/10 text-stone-400'
                      }`}>
                        <i className={`fa-solid ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#0F1729] dark:text-white">{t.soundEffects}</div>
                        <div className="text-[10px] font-bold text-stone-400">{t.soundDesc}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const next = !soundEnabled;
                        setSoundEnabled(next);
                        if (next) soundEffects.playClick(true);
                      }}
                      className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                        soundEnabled ? 'bg-[#FF5B4A] justify-end' : 'bg-stone-300 dark:bg-white/20 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-stone-200/40 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
                      {soundEnabled ? t.soundStatusActive : t.soundStatusMuted}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playNotification(true);
                        showToast(t.soundTestAlert);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-stone-200/70 dark:bg-white/10 hover:bg-stone-300 text-[11px] font-black text-stone-700 dark:text-stone-200 transition cursor-pointer flex items-center gap-1"
                    >
                      <i className="fa-solid fa-play text-[9px]"></i>
                      <span>{t.soundTest}</span>
                    </button>
                  </div>
                </div>

                {/* 2) Language Picker Card */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 space-y-3">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center text-sm">
                      <i className="fa-solid fa-globe"></i>
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#0F1729] dark:text-white">{t.appLanguage}</div>
                      <div className="text-[10px] font-bold text-stone-400">{t.appLanguageDesc}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('ar');
                        soundEffects.playClick(soundEnabled);
                        showToast('تم ضبط لغة التطبيق: العربية 🇩🇿');
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer flex flex-col items-center gap-1 border ${
                        language === 'ar'
                          ? 'bg-[#FF5B4A] text-white border-[#FF5B4A] shadow-xs'
                          : 'bg-white dark:bg-white/5 border-stone-200/60 dark:border-white/10 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span className="text-base">🇩🇿</span>
                      <span>العربية</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('fr');
                        soundEffects.playClick(soundEnabled);
                        showToast('Langue changée : Français 🇫🇷');
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer flex flex-col items-center gap-1 border ${
                        language === 'fr'
                          ? 'bg-[#FF5B4A] text-white border-[#FF5B4A] shadow-xs'
                          : 'bg-white dark:bg-white/5 border-stone-200/60 dark:border-white/10 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span className="text-base">🇫🇷</span>
                      <span>Français</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('en');
                        soundEffects.playClick(soundEnabled);
                        showToast('Language changed: English 🇬🇧');
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer flex flex-col items-center gap-1 border ${
                        language === 'en'
                          ? 'bg-[#FF5B4A] text-white border-[#FF5B4A] shadow-xs'
                          : 'bg-white dark:bg-white/5 border-stone-200/60 dark:border-white/10 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span className="text-base">🇬🇧</span>
                      <span>English</span>
                    </button>
                  </div>
                </div>

                {/* 3) Day/Night Mode Switcher Card */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 space-y-3">
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center text-sm">
                      <i className={`fa-solid ${isDarkMode ? 'fa-moon text-indigo-400' : 'fa-sun text-amber-500'}`}></i>
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#0F1729] dark:text-white">{t.themeTitle}</div>
                      <div className="text-[10px] font-bold text-stone-400">{t.themeDesc}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isDarkMode) return;
                        setIsDarkMode(false);
                        soundEffects.playClick(soundEnabled);
                        showToast(language === 'ar' ? 'تم تفعيل الوضع النهاري ☀️' : language === 'fr' ? 'Mode clair activé ☀️' : 'Light mode enabled ☀️');
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 border ${
                        !isDarkMode
                          ? 'bg-[#FF5B4A] text-white border-[#FF5B4A] shadow-xs'
                          : 'bg-white dark:bg-white/5 border-stone-200/60 dark:border-white/10 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <i className="fa-solid fa-sun text-amber-400"></i>
                      <span>{t.lightMode}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (isDarkMode) return;
                        setIsDarkMode(true);
                        soundEffects.playClick(soundEnabled);
                        showToast(language === 'ar' ? 'تم تفعيل الوضع الليلي 🌙' : language === 'fr' ? 'Mode sombre activé 🌙' : 'Dark mode enabled 🌙');
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 border ${
                        isDarkMode
                          ? 'bg-[#FF5B4A] text-white border-[#FF5B4A] shadow-xs'
                          : 'bg-white dark:bg-white/5 border-stone-200/60 dark:border-white/10 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <i className="fa-solid fa-moon text-indigo-400"></i>
                      <span>{t.darkMode}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Links inside Sidebar */}
              <div className="space-y-1">
                <div className="text-xs font-black text-stone-400 mb-2">{t.quickNav}</div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('home');
                    setIsSidebarOpen(false);
                  }}
                  className="w-full p-3 rounded-2xl hover:bg-stone-100 dark:hover:bg-white/5 text-start flex items-center justify-between text-xs font-black text-[#0F1729] dark:text-white transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-house text-[#FF5B4A]"></i>
                    <span>{t.home}</span>
                  </div>
                  <i className="fa-solid fa-chevron-left text-[10px] text-stone-400"></i>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('orders');
                    setIsSidebarOpen(false);
                  }}
                  className="w-full p-3 rounded-2xl hover:bg-stone-100 dark:hover:bg-white/5 text-start flex items-center justify-between text-xs font-black text-[#0F1729] dark:text-white transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-receipt text-amber-500"></i>
                    <span>{t.orders}</span>
                  </div>
                  {activeOrder && (
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      1
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('rewards');
                    setIsSidebarOpen(false);
                  }}
                  className="w-full p-3 rounded-2xl hover:bg-stone-100 dark:hover:bg-white/5 text-start flex items-center justify-between text-xs font-black text-[#0F1729] dark:text-white transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-gift text-purple-500"></i>
                    <span>{t.rewards}</span>
                  </div>
                  <i className="fa-solid fa-chevron-left text-[10px] text-stone-400"></i>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationOpen(true);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full p-3 rounded-2xl hover:bg-stone-100 dark:hover:bg-white/5 text-start flex items-center justify-between text-xs font-black text-[#0F1729] dark:text-white transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-bell text-[#FF5B4A]"></i>
                    <span>{t.notificationsTitle}</span>
                  </div>
                  <span className="bg-[#FF5B4A] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {ownerMessages.length}
                  </span>
                </button>
              </div>

              {/* Role Switch */}
              <div className="pt-2 border-t border-stone-200/50 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setShowWelcome(true);
                    setIsSidebarOpen(false);
                    soundEffects.playClick(soundEnabled);
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <i className="fa-solid fa-repeat"></i>
                  <span>{t.switchRole}</span>
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-white/[0.02] text-center text-[10px] font-bold text-stone-400">
              {t.appVersion}
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEW */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* ACTIVE LIVE TRACKING BANNER (REMOVED IMMEDIATELY WHEN CONFIRMING RECEIPT) */}
        {activeOrder && (
          <div className="animate-slideDown">
            <div className="bg-gradient-to-r from-[#FF5B4A] via-[#FF7A3D] to-[#FFB627] p-0.5 rounded-3xl shadow-xl">
              <div className="bg-white dark:bg-[#151D30] rounded-[22px] p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5B4A] to-[#FF7A3D] text-white flex items-center justify-center text-xl shadow-md animate-bounce">
                    <i className="fa-solid fa-motorcycle"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm md:text-base text-[#0F1729] dark:text-white">
                        {t.activeOrderTitle} (#{activeOrder.id})
                      </span>
                      <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        {activeOrder.status === 'preparing' ? t.orderPreparing : t.captainOnWay}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-0.5">
                      {t.captainEtaBanner
                        .replace('{captain}', activeOrder.captainName)
                        .replace('{eta}', activeOrder.etaMinutes.toString())
                        .replace('{wilaya}', activeOrder.wilaya)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLiveTrackingModal(!showLiveTrackingModal)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5B4A] to-[#FF7A3D] hover:from-[#E04836] hover:to-[#FF5B4A] text-white text-xs font-black shadow-md transition cursor-pointer flex items-center gap-2"
                  >
                    <i className="fa-solid fa-map-location-dot"></i>
                    <span>{showLiveTrackingModal ? t.hideMap : t.trackLiveMap}</span>
                  </button>

                  {/* Confirm Receipt: removes the banner from UI immediately per user instruction */}
                  <button
                    type="button"
                    onClick={handleConfirmReceipt}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition cursor-pointer flex items-center gap-1.5"
                    title={t.confirmReceipt}
                  >
                    <i className="fa-solid fa-circle-check"></i>
                    <span>{t.confirmReceipt}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Map Drawer */}
            {showLiveTrackingModal && (
              <div className="mt-4 animate-scaleIn">
                <TrackingMap
                  order={activeOrder}
                  onClose={() => setShowLiveTrackingModal(false)}
                  language={language}
                />
              </div>
            )}
          </div>
        )}

        {/* CUSTOMER PORTAL */}
        {currentRole === 'customer' && (
          <>
            {activeTab === 'home' && (
              <>
                {/* Hero Slider */}
                <div className="relative rounded-3xl overflow-hidden shadow-xl h-48 sm:h-64 md:h-76 select-none touch-pan-y overscroll-x-none">
                  <div
                    className="flex h-full transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(calc(${activeSlide * (language === 'ar' ? 100 : -100)}% + ${dragOffset}px))`,
                      width: '300%'
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Slide 1 */}
                    <div className="w-1/3 h-full relative flex items-center px-6 sm:px-12 md:px-16 bg-gradient-to-l from-[#FF5B4A] via-[#E04836] to-[#C73E2E]">
                      <div className="relative z-10 space-y-2 sm:space-y-3 max-w-xl text-white">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                          <i className="fa-solid fa-fire text-[#FFB627]"></i>
                          <span>{t.slide1Badge}</span>
                        </div>
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight whitespace-pre-line">
                          {t.slide1Title}
                        </h2>
                        <p className="text-xs sm:text-sm text-white/90 font-bold hidden sm:block">
                          {t.slide1Desc}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setAppliedPromo('JIBLI50');
                            showToast(language === 'ar' ? '🎉 تم تفعيل الكود الترويجي JIBLI50 تلقائياً في السلة!' : 'Code JIBLI50 activé !');
                          }}
                          className="mt-1 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-white text-[#FF5B4A] text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
                        >
                          {t.slide1Btn}
                        </button>
                      </div>
                      <div className="absolute end-4 md:end-12 inset-y-0 flex items-center opacity-30 sm:opacity-90 pointer-events-none">
                        <i className="fa-solid fa-bowl-rice text-8xl md:text-9xl text-white/40"></i>
                      </div>
                    </div>

                    {/* Slide 2 */}
                    <div className="w-1/3 h-full relative flex items-center px-6 sm:px-12 md:px-16 bg-gradient-to-l from-[#FF7A3D] via-[#E0642E] to-[#B84E1F]">
                      <div className="relative z-10 space-y-2 sm:space-y-3 max-w-xl text-white">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                          <i className="fa-solid fa-star text-amber-300"></i>
                          <span>{t.slide2Badge}</span>
                        </div>
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight whitespace-pre-line">
                          {t.slide2Title}
                        </h2>
                        <p className="text-xs sm:text-sm text-white/90 font-bold hidden sm:block">
                          {t.slide2Desc}
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory('تقليدي')}
                          className="mt-1 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-white text-[#FF7A3D] text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
                        >
                          {t.slide2Btn}
                        </button>
                      </div>
                      <div className="absolute end-4 md:end-12 inset-y-0 flex items-center opacity-30 sm:opacity-90 pointer-events-none">
                        <i className="fa-solid fa-utensils text-8xl md:text-9xl text-white/40"></i>
                      </div>
                    </div>

                    {/* Slide 3 */}
                    <div className="w-1/3 h-full relative flex items-center px-6 sm:px-12 md:px-16 bg-gradient-to-l from-emerald-600 via-teal-700 to-emerald-900">
                      <div className="relative z-10 space-y-2 sm:space-y-3 max-w-xl text-white">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                          <i className="fa-solid fa-stopwatch text-amber-300"></i>
                          <span>{t.slide3Badge}</span>
                        </div>
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight whitespace-pre-line">
                          {t.slide3Title}
                        </h2>
                        <p className="text-xs sm:text-sm text-white/90 font-bold hidden sm:block">
                          {t.slide3Desc}
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedFilterPill('عروض وتخفيضات')}
                          className="mt-1 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-white text-emerald-700 text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
                        >
                          {t.slide3Btn}
                        </button>
                      </div>
                      <div className="absolute end-4 md:end-12 inset-y-0 flex items-center opacity-30 sm:opacity-90 pointer-events-none">
                        <i className="fa-solid fa-motorcycle text-8xl md:text-9xl text-white/40"></i>
                      </div>
                    </div>
                  </div>

                  {/* Slider Dots */}
                  <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 z-20">
                    {[0, 1, 2].map((idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activeSlide === idx ? 'w-7 bg-white shadow-md' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>

                {/* Loyalty Bar */}
                <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#FF5B4A]/10 to-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md">
                      <i className="fa-solid fa-gift"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-[#0F1729] dark:text-white">
                        {t.loyaltyBarTitle}
                      </h4>
                      <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
                        {t.loyaltyBarDesc.replace('{points}', userProfile.loyaltyPoints.toString())}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('rewards')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-xs transition cursor-pointer self-start sm:self-auto"
                  >
                    {t.viewRewards}
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute start-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full ps-11 pe-4 py-3.5 rounded-2xl bg-white dark:bg-[#151D30] border border-stone-200/70 dark:border-white/10 text-xs sm:text-sm font-bold text-[#0F1729] dark:text-white shadow-sm focus:outline-none focus:border-[#FF5B4A]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute end-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <i className="fa-solid fa-circle-xmark"></i>
                    </button>
                  )}
                </div>

                {/* Quick Categories */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-base sm:text-lg text-[#0F1729] dark:text-white">
                      {t.quickCategories}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className="text-xs font-bold text-[#FF5B4A] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{t.viewAll}</span>
                      <i className="fa-solid fa-arrow-left text-[10px]"></i>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      const catName = language === 'ar' ? cat.nameAr : language === 'fr' ? cat.nameFr : cat.nameEn;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            soundEffects.playClick(soundEnabled);
                            setSelectedCategory(cat.id);
                          }}
                          className="flex flex-col items-center gap-2 min-w-[76px] cursor-pointer group"
                        >
                          <div
                            className={`w-16 h-16 md:w-18 md:h-18 rounded-3xl shadow-sm flex items-center justify-center transition-all duration-300 card-lift group-hover:scale-105 ${
                              isSelected
                                ? 'bg-gradient-to-tr from-[#FF5B4A] to-[#FF8A3D] text-white scale-105 shadow-md shadow-[#FF5B4A]/30 ring-2 ring-[#FF5B4A]'
                                : 'bg-[#FFF0EE] text-[#FF5B4A] dark:bg-[#1F2A44] dark:text-[#FFB627] group-hover:bg-[#FF5B4A] group-hover:text-white'
                            }`}
                          >
                            <i className={`fa-solid ${cat.icon} text-xl transition-transform duration-300 group-hover:animate-iconWiggle`}></i>
                          </div>
                          <span
                            className={`text-xs font-black transition ${
                              isSelected ? 'text-[#FF5B4A]' : 'text-[#0F1729] dark:text-white group-hover:text-[#FF5B4A]'
                            }`}
                          >
                            {catName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {FILTER_PILLS.map((pill) => {
                    const isSelected = selectedFilterPill === pill.id;
                    const pillName = language === 'ar' ? pill.nameAr : language === 'fr' ? pill.nameFr : pill.nameEn;
                    return (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => {
                          soundEffects.playClick(soundEnabled);
                          setSelectedFilterPill(pill.id);
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition cursor-pointer border ${
                          isSelected
                            ? 'bg-[#0F1729] dark:bg-white text-white dark:text-[#0F1729] border-transparent shadow-xs'
                            : 'bg-white dark:bg-[#151D30] text-stone-600 dark:text-stone-300 border-stone-200/60 dark:border-white/10 hover:border-[#FF5B4A]'
                        }`}
                      >
                        {pillName}
                      </button>
                    );
                  })}
                </div>

                {/* Dishes Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-lg text-[#0F1729] dark:text-white">
                        {t.suggestedForYou}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-bold">
                        {t.availableDishes.replace('{count}', filteredDishes.length.toString())}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredDishes.map((dish) => {
                      const dishTitle = language === 'ar' ? dish.name : language === 'fr' ? (dish.nameFr || dish.name) : (dish.nameEn || dish.name);
                      const dishDesc = language === 'ar' ? dish.description : language === 'fr' ? (dish.descriptionFr || dish.description) : (dish.descriptionEn || dish.description);
                      return (
                        <div
                          key={dish.id}
                          className="bg-white dark:bg-[#151D30] rounded-3xl overflow-hidden shadow-sm border border-stone-200/60 dark:border-white/5 card-lift flex flex-col justify-between group"
                        >
                          <div
                            className="relative h-44 bg-stone-100 dark:bg-stone-800 img-zoom cursor-pointer"
                            onClick={() => setSelectedDishDetail(dish)}
                          >
                            <img
                              src={dish.image}
                              alt={dishTitle}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

                            {dish.isSpecialOffer && (
                              <span className="absolute top-3 start-3 bg-gradient-to-r from-[#FF5B4A] to-[#E04836] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                                <i className="fa-solid fa-fire text-[9px]"></i>
                                {t.specialOffer}
                              </span>
                            )}

                            <span className="absolute top-3 end-3 bg-white/95 dark:bg-[#0F1729]/95 backdrop-blur text-[#0F1729] dark:text-white text-[10px] font-black px-2 py-1 rounded-full shadow flex items-center gap-1">
                              <i className="fa-solid fa-clock text-[#FF5B4A] text-[9px]"></i>
                              {dish.prepTime}
                            </span>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <h4
                                  onClick={() => setSelectedDishDetail(dish)}
                                  className="font-black text-sm text-[#0F1729] dark:text-white group-hover:text-[#FF5B4A] transition cursor-pointer"
                                >
                                  {dishTitle}
                                </h4>
                                <div className="flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-500/10 dark:bg-amber-400/10 px-2 py-0.5 rounded-lg">
                                  <i className="fa-solid fa-star text-[10px]"></i>
                                  <span>{dish.rating}</span>
                                </div>
                              </div>

                              <p className="text-xs text-stone-500 dark:text-stone-300 font-semibold line-clamp-2 mb-3">
                                {dishDesc}
                              </p>
                            </div>

                            <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-white/5">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] text-stone-500 dark:text-stone-300 font-bold flex items-center gap-1">
                                  <i className="fa-solid fa-store text-[10px] text-[#FF5B4A]"></i>
                                  <span>{dish.restaurantName}</span>
                                </span>

                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-black text-base text-[#FF5B4A]">
                                    {dish.price} {t.currency}
                                  </span>
                                  {dish.originalPrice && (
                                    <span className="text-xs text-stone-400 line-through">
                                      {dish.originalPrice} {t.currency}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAddToCart(dish)}
                                className="w-full py-2.5 rounded-2xl bg-[#FFF0EE] dark:bg-[#1F2A44] hover:bg-[#FF5B4A] text-[#FF5B4A] hover:text-white dark:text-[#FFB627] dark:hover:text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs group-hover:bg-[#FF5B4A] group-hover:text-white"
                              >
                                <i className="fa-solid fa-plus text-xs"></i>
                                <span>{t.addToCart}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-black text-xl text-[#0F1729] dark:text-white">{t.ordersHistoryTitle}</h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-bold">
                    {t.ordersHistorySubtitle}
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#151D30] border border-stone-200/60 dark:border-white/5 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-white/5 mx-auto flex items-center justify-center text-stone-400 text-2xl">
                      <i className="fa-solid fa-box-open"></i>
                    </div>
                    <h3 className="font-black text-sm text-[#0F1729] dark:text-white">{t.noOrdersYet}</h3>
                    <p className="text-xs text-stone-500 font-bold">{t.noOrdersSub}</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('home')}
                      className="px-5 py-2.5 rounded-xl bg-[#FF5B4A] text-white text-xs font-black shadow-md transition cursor-pointer"
                    >
                      {t.browseMenu}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white dark:bg-[#151D30] rounded-3xl p-5 border border-stone-200/60 dark:border-white/5 shadow-sm space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-white/5 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
                              <i className="fa-solid fa-receipt"></i>
                            </div>
                            <div>
                              <h4 className="font-black text-sm text-[#0F1729] dark:text-white">
                                {t.orderNumber.replace('{id}', ord.id)}
                              </h4>
                              <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
                                {ord.restaurantName} • {ord.createdAt}
                              </p>
                            </div>
                          </div>

                          <span className={`text-xs font-black px-3 py-1 rounded-full ${
                            ord.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
                          }`}>
                            {ord.status === 'preparing'
                              ? t.orderPreparing
                              : ord.status === 'on_the_way'
                              ? t.captainOnWay
                              : t.orderDelivered}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {ord.items.map((it, idx) => {
                            const itemTitle = language === 'ar' ? it.dish.name : language === 'fr' ? (it.dish.nameFr || it.dish.name) : (it.dish.nameEn || it.dish.name);
                            return (
                              <div key={idx} className="flex items-center justify-between text-xs font-bold">
                                <span>
                                  {it.quantity}x {itemTitle}
                                </span>
                                <span className="text-stone-500 dark:text-stone-400">
                                  {it.dish.price * it.quantity} {t.currency}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-white/5 text-xs font-black">
                          <div>
                            {t.finalTotal} <span className="text-[#FF5B4A] text-sm">{ord.total} {t.currency}</span>
                          </div>
                          {ord.status !== 'delivered' && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveOrder(ord);
                                setShowLiveTrackingModal(true);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF5B4A] to-[#FF7A3D] text-white text-xs font-black shadow-xs cursor-pointer"
                            >
                              {t.trackOnMap}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REWARDS TAB */}
            {activeTab === 'rewards' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-l from-amber-500 to-[#FF5B4A] rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full uppercase">
                      {t.rewardsProgramTitle}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black">
                      {t.pointsBalance.replace('{points}', userProfile.loyaltyPoints.toString())}
                    </h2>
                    <p className="text-xs text-white/90 font-bold max-w-lg">
                      {t.rewardsProgramDesc}
                    </p>
                  </div>
                  <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl shadow-md">
                    🎁
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-[#151D30] rounded-3xl p-5 border border-stone-200/60 dark:border-white/5 space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
                      <i className="fa-solid fa-motorcycle"></i>
                    </div>
                    <h4 className="font-black text-sm text-[#0F1729] dark:text-white">{t.freeDeliveryReward}</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-bold">{t.cost80Points}</p>
                    <button
                      type="button"
                      disabled={userProfile.loyaltyPoints < 80}
                      onClick={() => {
                        if (userProfile.loyaltyPoints >= 80) {
                          setUserProfile((p) => ({ ...p, loyaltyPoints: p.loyaltyPoints - 80 }));
                          showToast(language === 'ar' ? '🎉 تم استبدال 80 نقطة بتوصيل مجاني لطلبك القادم!' : '80 points échangés !');
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white text-xs font-black shadow-xs transition cursor-pointer"
                    >
                      {t.redeemNow}
                    </button>
                  </div>

                  <div className="bg-white dark:bg-[#151D30] rounded-3xl p-5 border border-stone-200/60 dark:border-white/5 space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FF5B4A]/10 text-[#FF5B4A] flex items-center justify-center font-black">
                      <i className="fa-solid fa-tag"></i>
                    </div>
                    <h4 className="font-black text-sm text-[#0F1729] dark:text-white">{t.discount500Reward}</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-bold">{t.cost150Points}</p>
                    <button
                      type="button"
                      disabled={userProfile.loyaltyPoints < 150}
                      onClick={() => {
                        if (userProfile.loyaltyPoints >= 150) {
                          setUserProfile((p) => ({ ...p, loyaltyPoints: p.loyaltyPoints - 150 }));
                          showToast(language === 'ar' ? '🎉 تم استبدال 150 نقطة بقسيمة 500 دج!' : '150 points échangés !');
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#FF5B4A] hover:bg-[#E04836] disabled:opacity-40 text-white text-xs font-black shadow-xs transition cursor-pointer"
                    >
                      {t.redeemNow}
                    </button>
                  </div>

                  <div className="bg-white dark:bg-[#151D30] rounded-3xl p-5 border border-stone-200/60 dark:border-white/5 space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-black">
                      <i className="fa-solid fa-burger"></i>
                    </div>
                    <h4 className="font-black text-sm text-[#0F1729] dark:text-white">{t.freeBurgerReward}</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-bold">{t.cost300Points}</p>
                    <button
                      type="button"
                      disabled={userProfile.loyaltyPoints < 300}
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-black shadow-xs transition cursor-pointer"
                    >
                      {t.redeemNow}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white dark:bg-[#151D30] rounded-3xl p-6 border border-stone-200/60 dark:border-white/5 shadow-sm space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF5B4A] to-[#FFB627] text-white flex items-center justify-center font-black text-2xl shadow-md">
                      {userProfile.avatar || 'J'}
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-[#0F1729] dark:text-white">
                        {userProfile.name || (language === 'ar' ? 'حساب الزبون' : 'Profil')}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-bold">
                        {userProfile.email || 'jibli.client@app.dz'}
                      </p>
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {t.wilayaLabel}: {userProfile.wilaya}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-white/5 text-xs font-bold">
                    <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-white/5">
                      <span className="text-stone-400">{t.phoneLabel}</span>
                      <span className="text-[#0F1729] dark:text-white">{userProfile.phone || '0550000000'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-stone-100 dark:border-white/5">
                      <span className="text-stone-400">{t.addressLabel}</span>
                      <span className="text-[#0F1729] dark:text-white">{userProfile.address || selectedWilaya}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-stone-400">{t.pointsLabel}</span>
                      <span className="text-[#FF5B4A] font-black">{userProfile.loyaltyPoints} {t.currency}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenAuth('customer')}
                      className="w-full py-3 rounded-2xl bg-[#FF5B4A] text-white text-xs font-black shadow-md cursor-pointer transition"
                    >
                      {t.editAccount}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* CAPTAIN VIEW */}
        {currentRole === 'captain' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full uppercase">
                  {t.captainRole}
                </span>
                <h2 className="text-2xl md:text-3xl font-black mt-2">
                  {language === 'ar' ? 'أرباح اليوم: 4,800 دج' : 'Gains du jour : 4,800 DA'}
                </h2>
                <p className="text-xs text-white/90 font-bold mt-1">
                  {language === 'ar' ? '8 مشاوير توصيل مكتملة اليوم • تقييم 4.9 ⭐' : '8 livraisons terminées aujourd’hui • Note 4.9 ⭐'}
                </p>
              </div>
              <div>
                <span className="text-xs font-black bg-white text-emerald-700 px-4 py-2 rounded-2xl shadow-md">
                  🟢 {language === 'ar' ? 'متاح لاستقبال الطلبات' : 'Disponible'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* RESTAURANT PARTNER VIEW */}
        {currentRole === 'restaurant' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-600 to-[#FF5B4A] rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full uppercase">
                  {t.restaurantRole}
                </span>
                <h2 className="text-2xl md:text-3xl font-black mt-2">
                  {language === 'ar' ? 'مطعم دار الضيافة العاصمة' : 'Restaurant Dar Diafa'}
                </h2>
                <p className="text-xs text-white/90 font-bold mt-1">
                  {language === 'ar' ? '14 طلباً مكتمل اليوم • دخل المطعم: 28,400 دج' : '14 commandes traitées • Revenus: 28,400 DA'}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM NAVIGATION (MOBILE) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0F1729]/95 backdrop-blur-xl border-t border-stone-200/60 dark:border-white/5 md:hidden">
        <div className="grid grid-cols-5 h-16 items-center px-2">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
              activeTab === 'home' ? 'text-[#FF5B4A]' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <i className="fa-solid fa-house text-base"></i>
            <span className="text-[10px] font-black">{t.home}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('home');
              setSelectedCategory('all');
            }}
            className={`flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
              activeTab === 'explore' ? 'text-[#FF5B4A]' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <i className="fa-solid fa-compass text-base"></i>
            <span className="text-[10px] font-black">{t.explore}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`relative flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
              activeTab === 'orders' ? 'text-[#FF5B4A]' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <i className="fa-solid fa-receipt text-base"></i>
            <span className="text-[10px] font-black">{t.orders}</span>
            {activeOrder && (
              <span className="absolute top-1 end-4 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
              activeTab === 'rewards' ? 'text-[#FF5B4A]' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <i className="fa-solid fa-gift text-base"></i>
            <span className="text-[10px] font-black">{t.rewards}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
              activeTab === 'profile' ? 'text-[#FF5B4A]' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <i className="fa-solid fa-user text-base"></i>
            <span className="text-[10px] font-black">{t.profile}</span>
          </button>
        </div>
      </nav>

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn overscroll-x-none">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div
            className="relative w-full max-w-md bg-white dark:bg-[#111827] h-full shadow-2xl flex flex-col justify-between z-10 p-5 overflow-y-auto no-scrollbar animate-slideDown"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-premium-gradient text-white flex items-center justify-center">
                  <i className="fa-solid fa-bag-shopping"></i>
                </div>
                <div>
                  <h3 className="font-black text-base text-[#0F1729] dark:text-white">{t.cartDrawerTitle}</h3>
                  <p className="text-[10px] text-stone-400 font-bold">
                    {t.dishesCount.replace('{count}', cartTotalCount.toString())}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-white/10 text-stone-500 hover:text-stone-800 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <div className="py-4 space-y-3 flex-1 overflow-y-auto no-scrollbar">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-stone-400 space-y-3">
                  <i className="fa-solid fa-basket-shopping text-4xl opacity-40"></i>
                  <p className="text-xs font-bold">{t.cartEmpty}</p>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#FF5B4A] text-white text-xs font-black cursor-pointer"
                  >
                    {t.addSomeFood}
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const itemTitle = language === 'ar' ? item.dish.name : language === 'fr' ? (item.dish.nameFr || item.dish.name) : (item.dish.nameEn || item.dish.name);
                  return (
                    <div
                      key={item.dish.id}
                      className="p-3.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 flex items-center justify-between gap-3"
                    >
                      <img
                        src={item.dish.image}
                        alt={itemTitle}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-black text-xs text-[#0F1729] dark:text-white">{itemTitle}</h4>
                        <span className="text-xs font-black text-[#FF5B4A]">{item.dish.price} {t.currency}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white dark:bg-[#1F2A44] px-2 py-1 rounded-xl shadow-2xs border border-stone-200/40 dark:border-white/5">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.dish.id, -1)}
                          className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-white/10 text-xs font-black flex items-center justify-center hover:bg-[#FF5B4A] hover:text-white transition cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-black px-1">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.dish.id, 1)}
                          className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-white/10 text-xs font-black flex items-center justify-center hover:bg-[#FF5B4A] hover:text-white transition cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-stone-100 dark:border-white/5 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder={t.promoPlaceholder}
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 text-xs font-bold text-[#0F1729] dark:text-white uppercase focus:outline-none focus:border-[#FF5B4A]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 rounded-xl bg-[#0F1729] dark:bg-white text-white dark:text-[#0F1729] text-xs font-black transition cursor-pointer"
                  >
                    {t.applyPromo}
                  </button>
                </div>

                <div className="space-y-1.5 text-xs font-bold text-stone-500 dark:text-stone-400">
                  <div className="flex justify-between">
                    <span>{t.itemsSubtotal}</span>
                    <span>{cartSubtotal} {t.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.deliveryFee.replace('{wilaya}', selectedWilaya)}</span>
                    <span>{deliveryFee} {t.currency}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-500 font-black">
                      <span>{t.promoDiscount}</span>
                      <span>-{discountAmount} {t.currency}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-[#0F1729] dark:text-white pt-2 border-t border-stone-100 dark:border-white/5">
                    <span>{t.finalTotal}</span>
                    <span className="text-[#FF5B4A]">{cartTotal} {t.currency}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5B4A] via-[#FF7A3D] to-[#FFB627] text-white font-black text-xs sm:text-sm shadow-xl hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-check"></i>
                  <span>{t.checkoutBtn.replace('{total}', cartTotal.toString())}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DISH DETAIL MODAL */}
      {selectedDishDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white dark:bg-[#151D30] rounded-3xl w-full max-w-lg overflow-hidden border border-stone-200/60 dark:border-white/10 shadow-2xl flex flex-col animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 bg-stone-100 dark:bg-stone-800">
              <img
                src={selectedDishDetail.image}
                alt={selectedDishDetail.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedDishDetail(null)}
                className="absolute top-4 end-4 w-9 h-9 rounded-full bg-black/50 text-white backdrop-blur flex items-center justify-center cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-black text-lg text-[#0F1729] dark:text-white">
                    {language === 'ar' ? selectedDishDetail.name : language === 'fr' ? (selectedDishDetail.nameFr || selectedDishDetail.name) : (selectedDishDetail.nameEn || selectedDishDetail.name)}
                  </h3>
                  <span className="font-black text-lg text-[#FF5B4A]">{selectedDishDetail.price} {t.currency}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500 font-bold mb-3">
                  <span>
                    <i className="fa-solid fa-store text-[#FF5B4A] me-1"></i>
                    {selectedDishDetail.restaurantName}
                  </span>
                  <span>•</span>
                  <span>⭐ {selectedDishDetail.rating}</span>
                  <span>•</span>
                  <span>⏱️ {selectedDishDetail.prepTime}</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 font-bold leading-relaxed">
                  {language === 'ar' ? selectedDishDetail.description : language === 'fr' ? (selectedDishDetail.descriptionFr || selectedDishDetail.description) : (selectedDishDetail.descriptionEn || selectedDishDetail.description)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleAddToCart(selectedDishDetail);
                  setSelectedDishDetail(null);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5B4A] to-[#FF7A3D] text-white text-xs font-black shadow-lg cursor-pointer transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-bag-shopping"></i>
                <span>{t.addToCart} ({selectedDishDetail.price} {t.currency})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WILAYA SELECTOR MODAL */}
      {isWilayaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white dark:bg-[#151D30] rounded-3xl w-full max-w-md overflow-hidden border border-stone-200/60 dark:border-white/10 shadow-2xl flex flex-col max-h-[80vh] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-stone-100 dark:border-white/5 flex items-center justify-between">
              <h3 className="font-black text-sm text-[#0F1729] dark:text-white">{t.deliveryTo}</h3>
              <button
                type="button"
                onClick={() => setIsWilayaModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-white/10 text-stone-500 flex items-center justify-center cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>
            <div className="p-3 overflow-y-auto no-scrollbar space-y-1">
              {WILAYAS.map((w) => (
                <button
                  key={w.code}
                  type="button"
                  onClick={() => {
                    const chosen = language === 'ar' ? w.nameAr : w.name;
                    setSelectedWilaya(chosen);
                    setIsWilayaModalOpen(false);
                    soundEffects.playClick(soundEnabled);
                    showToast(`${t.deliveryTo}: ${chosen} (${w.deliveryFee} ${t.currency})`);
                  }}
                  className={`w-full p-3 rounded-2xl text-start flex items-center justify-between text-xs font-black transition cursor-pointer ${
                    (selectedWilaya === w.nameAr || selectedWilaya === w.name)
                      ? 'bg-[#FF5B4A] text-white shadow-xs'
                      : 'hover:bg-stone-100 dark:hover:bg-white/5 text-[#0F1729] dark:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center text-[11px]">
                      {w.code}
                    </span>
                    <span>{language === 'ar' ? `${w.nameAr} (${w.name})` : `${w.name} (${w.nameAr})`}</span>
                  </div>
                  <span className="text-[11px] opacity-80">{w.deliveryFee} {t.currency}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION CENTER (NO BROADCAST SENDER PER USER INSTRUCTION) */}
      <NotificationCenterModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        messages={ownerMessages}
        orders={orders}
        onMarkAllAsRead={() => {
          setOwnerMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
          showToast(t.markAllRead);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        language={language}
      />

      {/* AUTH PORTAL MODAL */}
      <AuthPortal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialRole={authRoleTarget}
        isGuestMode={authIsGuestMode}
        onSuccess={handleAuthSuccess}
        language={language}
      />

    </div>
  );
}
