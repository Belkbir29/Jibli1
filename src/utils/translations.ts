import { Language } from '../types';

export interface Translations {
  appName: string;
  appSlogan: string;
  deliveryTo: string;
  algiers: string;
  sidebarTitle: string;
  sidebarSubtitle: string;
  settingsTitle: string;
  soundEffects: string;
  soundDesc: string;
  soundStatusActive: string;
  soundStatusMuted: string;
  soundTest: string;
  soundTestAlert: string;
  appLanguage: string;
  appLanguageDesc: string;
  themeTitle: string;
  themeDesc: string;
  lightMode: string;
  darkMode: string;
  quickNav: string;
  home: string;
  explore: string;
  orders: string;
  rewards: string;
  profile: string;
  switchRole: string;
  appVersion: string;
  
  // Header
  customerInterface: string;
  captainInterface: string;
  restaurantInterface: string;
  notificationsTitle: string;
  cartTitle: string;
  guestBadge: string;
  verifiedAccount: string;

  // Active Order Banner
  activeOrderTitle: string;
  orderPreparing: string;
  captainOnWay: string;
  orderDelivered: string;
  captainEtaBanner: string;
  trackLiveMap: string;
  hideMap: string;
  confirmReceipt: string;
  receiptConfirmedToast: string;

  // Hero Slider
  slide1Badge: string;
  slide1Title: string;
  slide1Desc: string;
  slide1Btn: string;
  slide2Badge: string;
  slide2Title: string;
  slide2Desc: string;
  slide2Btn: string;
  slide3Badge: string;
  slide3Title: string;
  slide3Desc: string;
  slide3Btn: string;

  // Loyalty bar
  loyaltyBarTitle: string;
  loyaltyBarDesc: string;
  viewRewards: string;

  // Search & Categories
  searchPlaceholder: string;
  quickCategories: string;
  viewAll: string;
  suggestedForYou: string;
  availableDishes: string;
  addToCart: string;
  specialOffer: string;
  
  // Cart
  cartDrawerTitle: string;
  dishesCount: string;
  cartEmpty: string;
  addSomeFood: string;
  promoPlaceholder: string;
  applyPromo: string;
  itemsSubtotal: string;
  deliveryFee: string;
  promoDiscount: string;
  finalTotal: string;
  checkoutBtn: string;
  addedToCart: string;

  // Orders Tab
  ordersHistoryTitle: string;
  ordersHistorySubtitle: string;
  noOrdersYet: string;
  noOrdersSub: string;
  browseMenu: string;
  orderNumber: string;
  trackOnMap: string;

  // Rewards Tab
  rewardsProgramTitle: string;
  pointsBalance: string;
  rewardsProgramDesc: string;
  freeDeliveryReward: string;
  cost80Points: string;
  redeemNow: string;
  discount500Reward: string;
  cost150Points: string;
  freeBurgerReward: string;
  cost300Points: string;

  // Profile Tab
  profileTitle: string;
  phoneLabel: string;
  addressLabel: string;
  pointsLabel: string;
  editAccount: string;

  // Auth & Roles
  loginRegisterTitle: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneInputLabel: string;
  phoneInputPlaceholder: string;
  wilayaLabel: string;
  deliveryAddressLabel: string;
  deliveryAddressPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submitRegistration: string;
  cancel: string;
  close: string;
  vehicleTypeLabel: string;
  restaurantNameLabel: string;
  cuisineTypeLabel: string;
  customerRole: string;
  captainRole: string;
  restaurantRole: string;
  browseAsGuest: string;
  guestInfoTitle: string;
  guestInfoSubtitle: string;
  guestSubmitBtn: string;
  guestNotice: string;

  // Notifications
  notificationCenterTitle: string;
  notificationCenterSub: string;
  platformMessages: string;
  orderUpdates: string;
  markAllRead: string;
  noMessages: string;
  noOrderUpdates: string;

  // Tracking map
  liveCaptainTracking: string;
  liveBadge: string;
  orderRef: string;
  etaLabel: string;
  remainingDistance: string;
  captainVerified: string;
  callCaptain: string;
  whatsappCaptain: string;
  stepPreparing: string;
  stepPickedUp: string;
  stepApproaching: string;
  stepArrived: string;
  currency: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    appName: 'JIBLI جبلي',
    appSlogan: 'التوصيل الأسرع في الجزائر',
    deliveryTo: 'توصيل إلى',
    algiers: 'الجزائر العاصمة',
    sidebarTitle: 'قائمة JIBLI جبلي',
    sidebarSubtitle: 'إعدادات الصوت، اللغة والخدمات',
    settingsTitle: 'إعدادات الصوت واللغة',
    soundEffects: 'المؤثرات الصوتية',
    soundDesc: 'أصوات الإشعارات، السلة والطلبات',
    soundStatusActive: 'مفعلة 🔔',
    soundStatusMuted: 'مكتومة 🔇',
    soundTest: 'تجربة الصوت',
    soundTestAlert: '🔔 صوت الإشعار التجريبي يعمل بنجاح!',
    appLanguage: 'لغة التطبيق',
    appLanguageDesc: 'اختر لغة العرض المفضلة لديك',
    themeTitle: 'مظهر التطبيق',
    themeDesc: 'التبديل بين الوضع الليلي والنهاري',
    lightMode: 'نهاري ☀️',
    darkMode: 'ليلي 🌙',
    quickNav: 'التنقل السريع',
    home: 'الرئيسية',
    explore: 'استكشف',
    orders: 'طلباتي',
    rewards: 'مكافآت',
    profile: 'حسابي',
    switchRole: 'تبديل الصفة / شاشة الحسابات',
    appVersion: 'JIBLI جبلي الجزائر • الإصدار الاحترافي v2.5',

    customerInterface: '🍽️ واجهة الزبون',
    captainInterface: '🛵 واجهة الكابتن',
    restaurantInterface: '🏪 واجهة المطعم',
    notificationsTitle: 'صندوق الإشعارات',
    cartTitle: 'سلة المشتريات',
    guestBadge: 'حساب غير مسجل',
    verifiedAccount: 'حساب رسمي موثق ✨',

    activeOrderTitle: 'طلبك قيد التوصيل الآن',
    orderPreparing: 'المطعم يحضر وجبتك 🍳',
    captainOnWay: 'الكابتن في الطريق 🛵',
    orderDelivered: 'تم التسليم بنجاح ✅',
    captainEtaBanner: 'الكابتن {captain} على بعد {eta} دقيقة من عنوانك ({wilaya})',
    trackLiveMap: 'تتبع الكابتن المباشر على الخريطة',
    hideMap: 'إخفاء الخريطة',
    confirmReceipt: 'تأكيد الاستلام',
    receiptConfirmedToast: '🎉 تم تأكيد استلام طلبك بنجاح! بالصحة والعافية.',

    slide1Badge: 'عرض اليوم الخاص',
    slide1Title: 'خصم 50% كود JIBLI50\nعلى أطباق العائلة',
    slide1Desc: 'اطلب الآن واستفد من توصيل مجاني لكل ربوع الجزائر',
    slide1Btn: 'تطبيق الكود فوراً',
    slide2Badge: 'أصالة ونكهة جزائرية',
    slide2Title: 'الكسكس والرشتة التقليدية\nعلى أصولها',
    slide2Desc: 'أشهى الوصفات العائلية من أشهر مطابخ الجزائر',
    slide2Btn: 'تصفح الأطباق التقليدية',
    slide3Badge: 'سرعة خيالية',
    slide3Title: 'أقل من 20 دقيقة\nحتى باب دارك',
    slide3Desc: 'كباتن محترفون وتتبع لحظي مباشر على الخريطة',
    slide3Btn: 'الأسرع في التوصيل',

    loyaltyBarTitle: 'برنامج ولاء JIBLI جبلي',
    loyaltyBarDesc: 'لديك {points} نقطة — استبدلها بوجبة أو توصيل مجاني! 🎁',
    viewRewards: 'عرض المكافآت',

    searchPlaceholder: 'ابحث عن أطباق، مطاعم، شاورما، كسكس، برغر، رشتة...',
    quickCategories: 'التصنيفات السريعة',
    viewAll: 'عرض الكل',
    suggestedForYou: 'أطباق مقترحة لك',
    availableDishes: '{count} وجبة متاحة للتوصيل الفوري',
    addToCart: 'إضافة إلى السلة',
    specialOffer: 'عرض خاص',

    cartDrawerTitle: 'سلة الطلبات',
    dishesCount: '{count} أطباق محددة',
    cartEmpty: 'سلتك فارغة حالياً',
    addSomeFood: 'أضف بعض الأطباق الشهية 🍲',
    promoPlaceholder: 'كود الخصم (جرب JIBLI50)',
    applyPromo: 'تطبيق',
    itemsSubtotal: 'مجموع الأطباق:',
    deliveryFee: 'رسوم التوصيل ({wilaya}):',
    promoDiscount: 'خصم الكود الترويجي (JIBLI50):',
    finalTotal: 'المجموع النهائي:',
    checkoutBtn: 'تأكيد الطلب الآن ({total} دج)',
    addedToCart: 'تمت إضافة "{dish}" إلى السلة 🛍️',

    ordersHistoryTitle: 'سجل طلباتي',
    ordersHistorySubtitle: 'متابعة حالات التوصيل الحالية وسجل الطلبات السابقة',
    noOrdersYet: 'لا توجد طلبات سابقة',
    noOrdersSub: 'تصفح قائمتنا اللذيذة وابدأ طلبك الأول الآن!',
    browseMenu: 'تصفح الأطباق',
    orderNumber: 'طلب رقم #{id}',
    trackOnMap: 'تتبع على الخريطة',

    rewardsProgramTitle: 'برنامج المكافآت الحصري',
    pointsBalance: 'رصيد نقاطك: {points} نقطة',
    rewardsProgramDesc: 'اجمع نقاطاً مع كل طلب من JIBLI واستبدلها بخصومات حصرية ووجبات مجانية وتوصيل مجاني.',
    freeDeliveryReward: 'توصيل مجاني لطلبك القادم',
    cost80Points: 'تكلفة الاستبدال: 80 نقطة',
    redeemNow: 'استبدال الآن',
    discount500Reward: 'قسيمة خصم 500 دج',
    cost150Points: 'تكلفة الاستبدال: 150 نقطة',
    freeBurgerReward: 'وجبة برغر عائلية مجانية',
    cost300Points: 'تكلفة الاستبدال: 300 نقطة',

    profileTitle: 'الملف الشخصي',
    phoneLabel: 'رقم الهاتف:',
    addressLabel: 'العنوان:',
    pointsLabel: 'نقاط الولاء:',
    editAccount: 'تعديل بيانات الحساب بالبريد الإلكتروني',

    loginRegisterTitle: 'إنشاء حساب رسمي بالبريد الإلكتروني',
    fullNameLabel: 'الاسم الكامل',
    fullNamePlaceholder: 'اكتب اسمك الكامل...',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'example@gmail.com',
    phoneInputLabel: 'رقم الهاتف (الجزائر 🇩🇿)',
    phoneInputPlaceholder: '05 / 06 / 07 ...',
    wilayaLabel: 'الولاية',
    deliveryAddressLabel: 'عنوان التوصيل الدقيق',
    deliveryAddressPlaceholder: 'مثال: حي 5 جويلية، عمارة 12، باب الزوار',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    submitRegistration: 'تسجيل الحساب والدخول إلى JIBLI',
    cancel: 'إلغاء',
    close: 'إغلاق',
    vehicleTypeLabel: 'وسيلة التوصيل',
    restaurantNameLabel: 'اسم المطعم',
    cuisineTypeLabel: 'نوع المطبخ',
    customerRole: 'زبون (عميل)',
    captainRole: 'كابتن توصيل',
    restaurantRole: 'صاحب مطعم',
    browseAsGuest: 'التصفح كضيف (مع إدخال معلومات التوصيل)',
    guestInfoTitle: 'التصفح كضيف (إدخال معلومات التوصيل)',
    guestInfoSubtitle: 'أدخل اسمك ورقم هاتفك وعنوانك للطلب والتوصيل السريع بدون بريد',
    guestSubmitBtn: 'حفظ المعلومات وبدء التصفح والطلب',
    guestNotice: '🔒 وضع الضيف متاح حصرياً للزبائن لتسجيل معلومات التوصيل الفورية.',

    notificationCenterTitle: 'مركز الإشعارات وتحديثات المنصة',
    notificationCenterSub: 'إشعارات الإدارة الرسمية وتحديثات الطلبات الفورية',
    platformMessages: 'رسائل المنصة',
    orderUpdates: 'تحديثات الطلبات',
    markAllRead: 'تحديد الكل كمقروء',
    noMessages: 'لا توجد رسائل جديدة حالياً',
    noOrderUpdates: 'لا توجد تحديثات طلبات حالياً',

    liveCaptainTracking: 'تتبع كابتن التوصيل المباشر',
    liveBadge: 'مباشر',
    orderRef: 'رقم الطلب #{id}',
    etaLabel: 'الوقت المقدر للوصول:',
    remainingDistance: 'المسافة المتبقية:',
    captainVerified: 'كابتن JIBLI معتمد • دراجة نارية سريعة',
    callCaptain: 'اتصال هاتفي',
    whatsappCaptain: 'مراسلة واتساب',
    stepPreparing: 'تحضير الطلب في المطعم',
    stepPickedUp: 'الكابتن استلم الطلب وهو في الطريق',
    stepApproaching: 'الكابتن يقترب من موقعك',
    stepArrived: 'وصل الكابتن إلى باب دارك',
    currency: 'دج'
  },
  fr: {
    appName: 'JIBLI',
    appSlogan: 'Livraison express en Algérie',
    deliveryTo: 'Livrer à',
    algiers: 'Alger',
    sidebarTitle: 'Menu JIBLI',
    sidebarSubtitle: 'Paramètres audio, langue et services',
    settingsTitle: 'Son et Langue',
    soundEffects: 'Effets sonores',
    soundDesc: 'Alertes pour commandes, panier et notifications',
    soundStatusActive: 'Activé 🔔',
    soundStatusMuted: 'Désactivé 🔇',
    soundTest: 'Tester le son',
    soundTestAlert: '🔔 Le son de test fonctionne parfaitement !',
    appLanguage: 'Langue de l’application',
    appLanguageDesc: 'Choisissez votre langue d’affichage',
    themeTitle: 'Thème de l’application',
    themeDesc: 'Basculer entre le mode clair et sombre',
    lightMode: 'Clair ☀️',
    darkMode: 'Sombre 🌙',
    quickNav: 'Navigation rapide',
    home: 'Accueil',
    explore: 'Explorer',
    orders: 'Commandes',
    rewards: 'Récompenses',
    profile: 'Mon profil',
    switchRole: 'Changer de rôle / Comptes',
    appVersion: 'JIBLI Algérie • Version Pro v2.5',

    customerInterface: '🍽️ Espace Client',
    captainInterface: '🛵 Espace Livreur',
    restaurantInterface: '🏪 Espace Restaurant',
    notificationsTitle: 'Notifications',
    cartTitle: 'Mon Panier',
    guestBadge: 'Compte non vérifié',
    verifiedAccount: 'Compte Officiel Vérifié ✨',

    activeOrderTitle: 'Votre commande est en cours de livraison',
    orderPreparing: 'Le restaurant prépare vos plats 🍳',
    captainOnWay: 'Livreur en route 🛵',
    orderDelivered: 'Livré avec succès ✅',
    captainEtaBanner: 'Le coursier {captain} est à {eta} min de votre adresse ({wilaya})',
    trackLiveMap: 'Suivre le livreur en direct sur la carte',
    hideMap: 'Masquer la carte',
    confirmReceipt: 'Confirmer la réception',
    receiptConfirmedToast: '🎉 Réception confirmée avec succès ! Bon appétit.',

    slide1Badge: 'Offre Spéciale du Jour',
    slide1Title: '50% de réduction code JIBLI50\nsur les plats familiaux',
    slide1Desc: 'Commandez maintenant et profitez de la livraison gratuite partout en Algérie',
    slide1Btn: 'Appliquer le code',
    slide2Badge: 'Saveurs et Tradition',
    slide2Title: 'Couscous & Rechta\nauthentiques algériens',
    slide2Desc: 'Les meilleures recettes traditionnelles des grands chefs algériens',
    slide2Btn: 'Voir les plats traditionnels',
    slide3Badge: 'Vitesse Éclair',
    slide3Title: 'En moins de 20 minutes\nà votre porte',
    slide3Desc: 'Livreurs professionnels et suivi GPS en direct',
    slide3Btn: 'Livraison ultra-rapide',

    loyaltyBarTitle: 'Programme de fidélité JIBLI',
    loyaltyBarDesc: 'Vous avez {points} points — Échangez-les contre un repas ou livraison offerte ! 🎁',
    viewRewards: 'Voir les récompenses',

    searchPlaceholder: 'Rechercher un plat, restaurant, couscous, burger, pizza...',
    quickCategories: 'Catégories rapides',
    viewAll: 'Voir tout',
    suggestedForYou: 'Recommandé pour vous',
    availableDishes: '{count} plats disponibles en livraison immédiate',
    addToCart: 'Ajouter au panier',
    specialOffer: 'Offre promo',

    cartDrawerTitle: 'Votre Panier',
    dishesCount: '{count} articles sélectionnés',
    cartEmpty: 'Votre panier est vide',
    addSomeFood: 'Découvrez notre délicieux menu 🍲',
    promoPlaceholder: 'Code promo (ex: JIBLI50)',
    applyPromo: 'Appliquer',
    itemsSubtotal: 'Sous-total des plats :',
    deliveryFee: 'Frais de livraison ({wilaya}) :',
    promoDiscount: 'Remise code promo (JIBLI50) :',
    finalTotal: 'Total à payer :',
    checkoutBtn: 'Confirmer la commande ({total} DA)',
    addedToCart: '"{dish}" ajouté au panier 🛍️',

    ordersHistoryTitle: 'Historique de mes commandes',
    ordersHistorySubtitle: 'Suivez vos livraisons actives et l’historique de vos commandes',
    noOrdersYet: 'Aucune commande précédente',
    noOrdersSub: 'Parcourez notre carte et passez votre première commande dès maintenant !',
    browseMenu: 'Voir le menu',
    orderNumber: 'Commande #{id}',
    trackOnMap: 'Suivre sur la carte',

    rewardsProgramTitle: 'Programme Fidélité Privilège',
    pointsBalance: 'Solde de points : {points} pts',
    rewardsProgramDesc: 'Gagnez des points à chaque commande JIBLI et échangez-les contre des réductions et repas offerts.',
    freeDeliveryReward: 'Livraison offerte sur votre prochaine commande',
    cost80Points: 'Coût : 80 points',
    redeemNow: 'Échanger',
    discount500Reward: 'Bon de réduction de 500 DA',
    cost150Points: 'Coût : 150 points',
    freeBurgerReward: 'Menu burger familial offert',
    cost300Points: 'Coût : 300 points',

    profileTitle: 'Mon Profil',
    phoneLabel: 'Téléphone :',
    addressLabel: 'Adresse :',
    pointsLabel: 'Points Fidélité :',
    editAccount: 'Modifier les informations du compte',

    loginRegisterTitle: 'Créer un compte par e-mail',
    fullNameLabel: 'Nom complet',
    fullNamePlaceholder: 'Entrez votre nom et prénom...',
    emailLabel: 'Adresse e-mail',
    emailPlaceholder: 'exemple@gmail.com',
    phoneInputLabel: 'Numéro de téléphone (Algérie 🇩🇿)',
    phoneInputPlaceholder: '05 / 06 / 07 ...',
    wilayaLabel: 'Wilaya',
    deliveryAddressLabel: 'Adresse de livraison précise',
    deliveryAddressPlaceholder: 'Ex: Cité 5 Juillet, Bâtiment 12, Bab Ezzouar',
    passwordLabel: 'Mot de passe',
    passwordPlaceholder: '••••••••',
    submitRegistration: 'Créer le compte et accéder à JIBLI',
    cancel: 'Annuler',
    close: 'Fermer',
    vehicleTypeLabel: 'Véhicule de livraison',
    restaurantNameLabel: 'Nom du restaurant',
    cuisineTypeLabel: 'Spécialité culinaire',
    customerRole: 'Client',
    captainRole: 'Livreur (Captain)',
    restaurantRole: 'Partenaire Restaurant',
    browseAsGuest: 'Naviguer en invité (avec vos coordonnées)',
    guestInfoTitle: 'Naviguer en invité (coordonnées de livraison)',
    guestInfoSubtitle: 'Entrez votre nom, téléphone et adresse pour commander rapidement sans mot de passe',
    guestSubmitBtn: 'Enregistrer et accéder à JIBLI',
    guestNotice: '🔒 Le mode invité est réservé aux clients pour saisir leurs coordonnées de livraison.',

    notificationCenterTitle: 'Centre de Notifications',
    notificationCenterSub: 'Messages de la direction et suivi direct des commandes',
    platformMessages: 'Messages Officiels',
    orderUpdates: 'Statut Commandes',
    markAllRead: 'Tout marquer comme lu',
    noMessages: 'Aucun nouveau message',
    noOrderUpdates: 'Aucune mise à jour de commande',

    liveCaptainTracking: 'Suivi GPS du Livreur en Direct',
    liveBadge: 'EN DIRECT',
    orderRef: 'Commande #{id}',
    etaLabel: 'Temps estimé d’arrivée :',
    remainingDistance: 'Distance restante :',
    captainVerified: 'Livreur JIBLI certifié • Scooter rapide',
    callCaptain: 'Appeler',
    whatsappCaptain: 'WhatsApp',
    stepPreparing: 'Préparation en cuisine',
    stepPickedUp: 'Commande récupérée par le livreur',
    stepApproaching: 'Le livreur approche de votre position',
    stepArrived: 'Le livreur est arrivé devant chez vous',
    currency: 'DA'
  },
  en: {
    appName: 'JIBLI',
    appSlogan: 'Fastest delivery in Algeria',
    deliveryTo: 'Deliver to',
    algiers: 'Algiers',
    sidebarTitle: 'JIBLI Menu',
    sidebarSubtitle: 'Audio, language and platform settings',
    settingsTitle: 'Audio & Language Settings',
    soundEffects: 'Sound Effects',
    soundDesc: 'Alerts for orders, cart additions and notifications',
    soundStatusActive: 'Active 🔔',
    soundStatusMuted: 'Muted 🔇',
    soundTest: 'Test Sound',
    soundTestAlert: '🔔 Test notification chime played successfully!',
    appLanguage: 'App Language',
    appLanguageDesc: 'Select your preferred display language',
    themeTitle: 'App Theme',
    themeDesc: 'Switch between Light and Dark mode',
    lightMode: 'Light ☀️',
    darkMode: 'Dark 🌙',
    quickNav: 'Quick Navigation',
    home: 'Home',
    explore: 'Explore',
    orders: 'Orders',
    rewards: 'Rewards',
    profile: 'Profile',
    switchRole: 'Switch Role / Accounts',
    appVersion: 'JIBLI Algeria • Professional Edition v2.5',

    customerInterface: '🍽️ Customer Portal',
    captainInterface: '🛵 Captain Portal',
    restaurantInterface: '🏪 Restaurant Partner',
    notificationsTitle: 'Notifications Inbox',
    cartTitle: 'Shopping Cart',
    guestBadge: 'Unverified Account',
    verifiedAccount: 'Official Verified Account ✨',

    activeOrderTitle: 'Your order is on the way!',
    orderPreparing: 'Restaurant is cooking your meal 🍳',
    captainOnWay: 'Captain on the road 🛵',
    orderDelivered: 'Delivered successfully ✅',
    captainEtaBanner: 'Captain {captain} is {eta} mins away from your location ({wilaya})',
    trackLiveMap: 'Track Captain live on the map',
    hideMap: 'Hide Map',
    confirmReceipt: 'Confirm Delivery',
    receiptConfirmedToast: '🎉 Order delivery confirmed successfully! Enjoy your meal.',

    slide1Badge: 'Today’s Special Deal',
    slide1Title: '50% Off Code JIBLI50\non Family Platter Dishes',
    slide1Desc: 'Order now and enjoy free delivery across all Algerian Wilayas',
    slide1Btn: 'Apply Code Now',
    slide2Badge: 'Authentic Algerian Taste',
    slide2Title: 'Royal Couscous & Rechta\nCooked to Perfection',
    slide2Desc: 'Traditional homemade dishes from top Algerian culinary masters',
    slide2Btn: 'Browse Traditional Food',
    slide3Badge: 'Ultra Fast Speed',
    slide3Title: 'In Under 20 Minutes\nRight to Your Doorstep',
    slide3Desc: 'Certified delivery captains with real-time live GPS tracking',
    slide3Btn: 'Fastest Delivery',

    loyaltyBarTitle: 'JIBLI Loyalty Rewards',
    loyaltyBarDesc: 'You have {points} points — Redeem for a free meal or free delivery! 🎁',
    viewRewards: 'View Rewards',

    searchPlaceholder: 'Search dishes, restaurants, couscous, burgers, shawarma...',
    quickCategories: 'Quick Categories',
    viewAll: 'View All',
    suggestedForYou: 'Suggested For You',
    availableDishes: '{count} meals available for instant delivery',
    addToCart: 'Add to Cart',
    specialOffer: 'Special Offer',

    cartDrawerTitle: 'Your Cart',
    dishesCount: '{count} items selected',
    cartEmpty: 'Your cart is currently empty',
    addSomeFood: 'Add delicious meals from our menu 🍲',
    promoPlaceholder: 'Promo code (e.g. JIBLI50)',
    applyPromo: 'Apply',
    itemsSubtotal: 'Dishes Subtotal:',
    deliveryFee: 'Delivery Fee ({wilaya}):',
    promoDiscount: 'Promo Discount (JIBLI50):',
    finalTotal: 'Total Amount:',
    checkoutBtn: 'Place Order Now ({total} DA)',
    addedToCart: 'Added "{dish}" to cart 🛍️',

    ordersHistoryTitle: 'My Orders History',
    ordersHistorySubtitle: 'Track your ongoing deliveries and past order receipts',
    noOrdersYet: 'No previous orders yet',
    noOrdersSub: 'Explore our delicious menu and place your first order now!',
    browseMenu: 'Browse Dishes',
    orderNumber: 'Order #{id}',
    trackOnMap: 'Track on Map',

    rewardsProgramTitle: 'Exclusive Rewards Club',
    pointsBalance: 'Your Points: {points} pts',
    rewardsProgramDesc: 'Earn points on every JIBLI order and redeem them for free food and zero-cost deliveries.',
    freeDeliveryReward: 'Free delivery on your next order',
    cost80Points: 'Cost: 80 points',
    redeemNow: 'Redeem Now',
    discount500Reward: '500 DA Discount Voucher',
    cost150Points: 'Cost: 150 points',
    freeBurgerReward: 'Free Family Burger Combo',
    cost300Points: 'Cost: 300 points',

    profileTitle: 'My Account',
    phoneLabel: 'Phone Number:',
    addressLabel: 'Address:',
    pointsLabel: 'Loyalty Points:',
    editAccount: 'Update Account Information',

    loginRegisterTitle: 'Register with Official Email',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Enter your full name...',
    emailLabel: 'Email Address',
    emailPlaceholder: 'example@gmail.com',
    phoneInputLabel: 'Phone Number (Algeria 🇩🇿)',
    phoneInputPlaceholder: '05 / 06 / 07 ...',
    wilayaLabel: 'Wilaya',
    deliveryAddressLabel: 'Precise Delivery Address',
    deliveryAddressPlaceholder: 'e.g. Cité 5 Juillet, Building 12, Bab Ezzouar',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    submitRegistration: 'Complete Registration & Access JIBLI',
    cancel: 'Cancel',
    close: 'Close',
    vehicleTypeLabel: 'Delivery Vehicle',
    restaurantNameLabel: 'Restaurant Name',
    cuisineTypeLabel: 'Cuisine Type',
    customerRole: 'Customer',
    captainRole: 'Delivery Captain',
    restaurantRole: 'Restaurant Partner',
    browseAsGuest: 'Browse as Guest (with delivery details)',
    guestInfoTitle: 'Browse as Guest (Delivery Information)',
    guestInfoSubtitle: 'Enter your name, phone number, and address to order quickly without password',
    guestSubmitBtn: 'Save Details & Start Browsing JIBLI',
    guestNotice: '🔒 Guest mode is exclusively available for customers to enter delivery details directly.',

    notificationCenterTitle: 'Notifications & Updates',
    notificationCenterSub: 'Official announcements and live order tracking updates',
    platformMessages: 'Platform Messages',
    orderUpdates: 'Order Status',
    markAllRead: 'Mark all as read',
    noMessages: 'No new messages right now',
    noOrderUpdates: 'No active order updates',

    liveCaptainTracking: 'Live Delivery Captain GPS',
    liveBadge: 'LIVE GPS',
    orderRef: 'Order #{id}',
    etaLabel: 'Estimated Arrival Time:',
    remainingDistance: 'Remaining Distance:',
    captainVerified: 'Certified JIBLI Captain • Express Motorcycle',
    callCaptain: 'Call Captain',
    whatsappCaptain: 'WhatsApp',
    stepPreparing: 'Meal being prepared at restaurant',
    stepPickedUp: 'Captain picked up and is on route',
    stepApproaching: 'Captain is approaching your street',
    stepArrived: 'Captain arrived at your door',
    currency: 'DA'
  }
};
