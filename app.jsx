const { useState, useEffect, useRef, useMemo } = React;

const supabaseUrl = 'https://nevvqybmyinhdyzdhubz.supabase.co';
const supabaseKey = 'sb_publishable_SQOeotTf_RMhC_oPXGyzgw_Ma9ZU51e';

// Read branding logo from global window context
const BRAND_LOGO_DATA_URI = window.BRAND_LOGO_DATA_URI;

// --- SAFE STORAGE HELPERS (FOR ULTRA-SECURE SANDBOXES) ---
const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('safeStorage.getItem skipped:', e.message);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('safeStorage.setItem skipped:', e.message);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('safeStorage.removeItem skipped:', e.message);
    }
  }
};

// --- INLINE RESILIENT SUPABASE SERVICE ---
let supabaseClientInstance = null;
const getSupabaseClient = () => {
  if (supabaseClientInstance) return supabaseClientInstance;
  if (window.supabase) {
    try {
      const { createClient } = window.supabase;
      supabaseClientInstance = createClient(supabaseUrl, supabaseKey);
      return supabaseClientInstance;
    } catch (e) {
      console.warn('Failed to construct Supabase Client:', e);
    }
  }
  return null;
};

const supabaseService = {
  getProducts: async () => {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: new Error('Supabase client not loaded') };
    try {
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('id', { ascending: false });
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  },
  insertProduct: async (product) => {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: new Error('Supabase client not loaded') };
    try {
      const { data, error } = await client
        .from('products')
        .insert([product])
        .select();
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  },
  updateProduct: async (id, updates) => {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: new Error('Supabase client not loaded') };
    try {
      const { data, error } = await client
        .from('products')
        .update(updates)
        .eq('id', id)
        .select();
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  },
  deleteProduct: async (id) => {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: new Error('Supabase client not loaded') };
    try {
      const { data, error } = await client
        .from('products')
        .delete()
        .eq('id', id);
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  },
  signUp: async (email, password, metadata = {}) => {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: new Error('Supabase client not loaded') };
    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  },
  signIn: async (email, password) => {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: new Error('Supabase client not loaded') };
    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  },
  signOut: async () => {
    const client = getSupabaseClient();
    if (!client) return { error: new Error('Supabase client not loaded') };
    try {
      const { error } = await client.auth.signOut();
      return { error };
    } catch (e) {
      return { error: e };
    }
  },
  getUser: async () => {
    const client = getSupabaseClient();
    if (!client) return { user: null, error: new Error('Supabase client not loaded') };
    try {
      const { data: { user }, error } = await client.auth.getUser();
      return { user, error };
    } catch (e) {
      return { user: null, error: e };
    }
  },
  subscribeProducts: (onUpdateCallback) => {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      return client
        .channel('realtime-products-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, onUpdateCallback)
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription registration skipped:', e);
      return null;
    }
  }
};

// --- GEOMETRIC OFFLINE PLACEHOLDERS GENERATORS ---
const getPlaceholderImage = (name, category = 'Sembako') => {
  const bgColors = {
    'Sembako': '#f3e8ff', // soft purple
    'Minuman': '#e0f2fe', // soft blue
    'Snack': '#fef3c7',   // soft yellow
    'Digital': '#fee2e2',  // soft red
    'Kosmetik': '#fce7f3', // soft pink
    'Makanan Instan': '#dcfce7', // soft green
    'Bumbu Dapur': '#ffedd5', // soft orange
    'Rumah Tangga': '#ccfbf1', // soft teal
    'Rokok 18+': '#f3f4f6', // gray
  };
  const textFill = {
    'Sembako': '#703d92',
    'Minuman': '#0284c7',
    'Snack': '#d97706',
    'Digital': '#dc2626',
    'Kosmetik': '#db2777',
    'Makanan Instan': '#16a34a',
    'Bumbu Dapur': '#ea580c',
    'Rumah Tangga': '#0d9488',
    'Rokok 18+': '#4b5563',
  };
  
  const bg = bgColors[category] || '#f3f4f6';
  const strokeColor = textFill[category] || '#703d92';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <rect width="400" height="300" fill="${bg}"/>
    <g transform="translate(150, 70)">
      <rect x="0" y="0" width="100" height="100" rx="15" fill="${strokeColor}" opacity="0.15"/>
      ${category === 'Minuman' 
        ? `<path d="M35 25 L65 25 L60 80 L40 80 Z" fill="none" stroke="${strokeColor}" stroke-width="6" stroke-linejoin="round"/>
           <line x1="30" y1="25" x2="70" y2="25" stroke="${strokeColor}" stroke-width="6" stroke-linecap="round"/>` 
        : category === 'Snack'
        ? `<circle cx="50" cy="50" r="30" fill="none" stroke="${strokeColor}" stroke-width="6"/>
           <circle cx="40" cy="40" r="4" fill="${strokeColor}"/>
           <circle cx="60" cy="45" r="4" fill="${strokeColor}"/>`
        : category === 'Digital'
        ? `<rect x="30" y="25" width="40" height="60" rx="8" fill="none" stroke="${strokeColor}" stroke-width="6"/>
           <circle cx="50" cy="70" r="6" fill="${strokeColor}"/>`
        : category === 'Kosmetik'
        ? `<circle cx="50" cy="40" r="20" fill="none" stroke="${strokeColor}" stroke-width="6"/>
           <rect x="35" y="60" width="30" height="30" rx="4" fill="none" stroke="${strokeColor}" stroke-width="6"/>`
        : `<rect x="30" y="30" width="40" height="50" rx="4" fill="none" stroke="${strokeColor}" stroke-width="6"/>
           <circle cx="50" cy="65" r="8" fill="#FFD700"/>`
      }
    </g>
    <text x="50%" y="215" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="22" fill="#1F1135">${name}</text>
    <text x="50%" y="250" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-weight="600" font-size="12" fill="${strokeColor}" opacity="0.8">Toko Hana Groceries</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/[\r\n\t]/g, ''))}`;
};

const getBannerPlaceholder = (title) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="100%" height="100%">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#703d92;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#553C9A;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="400" fill="url(#grad)"/>
    <g opacity="0.1">
      <circle cx="100" cy="100" r="200" fill="#FFD700" />
      <circle cx="1100" cy="300" r="150" fill="#FFD700" />
    </g>
    <rect x="30" y="30" width="1140" height="340" rx="25" fill="none" stroke="#FFD700" stroke-width="4" stroke-dasharray="15 15" opacity="0.3"/>
    <text x="50%" y="170" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-weight="900" font-size="46" fill="#FFD700">${title}</text>
    <text x="50%" y="240" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-weight="bold" font-size="22" fill="#FFFFFF" opacity="0.9">Katalog Digital Toko Hana - Pi Ecosystem</text>
    <rect x="525" y="280" width="150" height="45" rx="10" fill="#FFD700" />
    <text x="600" y="302" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-weight="900" font-size="14" fill="#703d92">BELI SEKARANG</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/[\r\n\t]/g, ''))}`;
};

// --- REALISTIC QRIS EMBEDDED GENERATOR ---
const getQRISDefaultImage = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" width="100%" height="100%">
    <rect width="500" height="650" rx="30" fill="#FFFFFF" stroke="#f3f4f6" stroke-width="4"/>
    <path d="M 0 0 L 500 0 L 500 110 L 0 110 Z" fill="#1a2035"/>
    <rect x="30" y="30" width="130" height="50" rx="8" fill="#FFFFFF" />
    <text x="95" y="60" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-weight="900" font-size="24" fill="#dc2626">QRIS</text>
    <text x="250" y="150" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-weight="900" font-size="28" fill="#703d92">TOKO HANA</text>
    <text x="250" y="180" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-weight="600" font-size="14" fill="#4b5563">NMID: ID1039485762</text>
    <rect x="75" y="210" width="350" height="350" rx="15" fill="#FFFFFF" stroke="#703d92" stroke-width="4" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.05))"/>
    <g fill="#1a2035">
      <rect x="100" y="235" width="60" height="60"/>
      <rect x="110" y="245" width="40" height="40" fill="#FFFFFF"/>
      <rect x="120" y="255" width="20" height="20"/>
      
      <rect x="340" y="235" width="60" height="60"/>
      <rect x="350" y="245" width="40" height="40" fill="#FFFFFF"/>
      <rect x="360" y="255" width="20" height="20"/>

      <rect x="100" y="475" width="60" height="60"/>
      <rect x="110" y="485" width="40" height="40" fill="#FFFFFF"/>
      <rect x="120" y="495" width="20" height="20"/>

      <rect x="180" y="235" width="15" height="15"/>
      <rect x="220" y="245" width="30" height="15"/>
      <rect x="280" y="235" width="15" height="30"/>
      <rect x="310" y="255" width="15" height="15"/>
      
      <rect x="180" y="290" width="45" height="15"/>
      <rect x="240" y="280" width="15" height="35"/>
      <rect x="290" y="295" width="35" height="15"/>
      
      <rect x="100" y="320" width="15" height="45"/>
      <rect x="130" y="340" width="30" height="15"/>
      <rect x="180" y="320" width="15" height="15"/>
      <rect x="210" y="330" width="35" height="35"/>
      <rect x="260" y="320" width="45" height="15"/>
      <rect x="320" y="320" width="15" height="45"/>
      <rect x="355" y="340" width="45" height="15"/>

      <rect x="100" y="390" width="30" height="15"/>
      <rect x="150" y="380" width="15" height="45"/>
      <rect x="180" y="395" width="45" height="15"/>
      <rect x="240" y="380" width="15" height="30"/>
      <rect x="270" y="390" width="15" height="15"/>
      <rect x="300" y="380" width="35" height="35"/>
      <rect x="350" y="395" width="50" height="15"/>

      <rect x="180" y="440" width="30" height="15"/>
      <rect x="225" y="430" width="15" height="45"/>
      <rect x="260" y="450" width="45" height="15"/>
      <rect x="320" y="440" width="30" height="30"/>
      <rect x="370" y="430" width="15" height="15"/>

      <rect x="180" y="500" width="15" height="35"/>
      <rect x="210" y="490" width="35" height="15"/>
      <rect x="260" y="495" width="15" height="15"/>
      <rect x="290" y="485" width="45" height="40"/>
      <rect x="350" y="500" width="50" height="25"/>
    </g>
    <rect x="30" y="580" width="440" height="45" rx="10" fill="#f3f4f6"/>
    <text x="250" y="605" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-weight="bold" font-size="12" fill="#703d92">TOKO HANA - SCAN TO PAY</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/[\r\n\t]/g, ''))}`;
};

// --- DEFAULT PRODUCTS SEED DATA (20 ITEMS FULLY COVERING ALL 10 WARUNG CATEGORIES MULTIPLE TIMES) ---
const defaultProducts = [
  {
    id: 1,
    name: "Indomie Goreng",
    price: 3500,
    category: "Makanan Instan",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=500&q=80",
    desc: "Rasa gurih pedas, 85g",
    stock: 120,
    sold: 340
  },
  {
    id: 2,
    name: "Minyak Goreng 1L",
    price: 15000,
    original_price: 18000,
    category: "Sembako",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80",
    desc: "Ekstra jernih, kelapa sawit murni",
    stock: 45,
    sold: 88
  },
  {
    id: 3,
    name: "Beras Pandan Wangi Premium 1kg",
    price: 15000,
    original_price: 17500,
    category: "Sembako",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80",
    desc: "Pulen harum aroma pandan asli Cianjur",
    stock: 200,
    sold: 153
  },
  {
    id: 4,
    name: "Aqua Air Mineral 600ml",
    price: 4000,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1608885898957-a599fb15ec3c?auto=format&fit=crop&w=500&q=80",
    desc: "Murni alami dari pegunungan vulkanik",
    stock: 300,
    sold: 450
  },
  {
    id: 5,
    name: "BengBeng Chocolate Wafer",
    price: 2500,
    category: "Snack",
    image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=500&q=80",
    desc: "4 Kelezatan wafer cokelat & karamel, 20g",
    stock: 150,
    sold: 210
  },
  {
    id: 6,
    name: "Gula Pasir Rose Brand 1kg",
    price: 16000,
    category: "Sembako",
    image: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=500&q=80",
    desc: "Gula pasir kristal tebu murni, bersih & manis",
    stock: 80,
    sold: 92
  },
  {
    id: 7,
    name: "Sariwangi Teh Celup",
    price: 6500,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80",
    desc: "Teh asli Indonesia aroma harum melati, isi 25",
    stock: 60,
    sold: 45
  },
  {
    id: 8,
    name: "Token Listrik PLN 50K",
    price: 51500,
    category: "Digital",
    image: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=500&q=80",
    desc: "Pulsa listrik instan langsung masuk meteran",
    stock: 999,
    sold: 52
  },
  {
    id: 9,
    name: "Wardah Lip Cream Matte",
    price: 45000,
    original_price: 52000,
    category: "Kosmetik",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80",
    desc: "Matte intens tahan lama tidak kering di bibir",
    stock: 35,
    sold: 28
  },
  {
    id: 10,
    name: "Penyedap Rasa Royco Sapi",
    price: 5000,
    category: "Bumbu Dapur",
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=500&q=80",
    desc: "Kaldu daging sapi pekat gurih alami",
    stock: 140,
    sold: 67
  },
  {
    id: 11,
    name: "Sabun Cuci Piring Mama Lemon",
    price: 12500,
    category: "Rumah Tangga",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=500&q=80",
    desc: "Cepat hilangkan lemak dengan jeruk nipis",
    stock: 95,
    sold: 112
  },
  {
    id: 12,
    name: "Sampoerna Mild 16",
    price: 33500,
    category: "Rokok 18+",
    image: "https://images.unsplash.com/photo-1549007994-cb92ca8a8a72?auto=format&fit=crop&w=500&q=80",
    desc: "Rokok filter mild khas Indonesia 16 batang",
    stock: 85,
    sold: 134
  },
  {
    id: 13,
    name: "Pulsa Telkomsel 10K",
    price: 12000,
    category: "Digital",
    image: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=500&q=80",
    desc: "Pulsa elektrik Telkomsel langsung masuk ke nomor HP",
    stock: 999,
    sold: 245
  },
  {
    id: 14,
    name: "Teh Botol Sosro 450ml",
    price: 6000,
    original_price: 7000,
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80",
    desc: "Teh melati manis segar dalam kemasan botol praktis",
    stock: 110,
    sold: 180
  },
  {
    id: 15,
    name: "Chitato Sapi Panggang 68g",
    price: 11500,
    original_price: 13000,
    category: "Snack",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80",
    desc: "Keripik kentang bergelombang rasa sapi panggang asli",
    stock: 75,
    sold: 95
  },
  {
    id: 16,
    name: "Ponds Facial Foam 100g",
    price: 28500,
    category: "Kosmetik",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80",
    desc: "Sabun pembersih wajah pencerah kulit alami",
    stock: 40,
    sold: 64
  },
  {
    id: 17,
    name: "Pop Mie Rasa Baso 75g",
    price: 5500,
    category: "Makanan Instan",
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=500&q=80",
    desc: "Mie instan cup rasa baso sapi gurih hangat praktis",
    stock: 90,
    sold: 142
  },
  {
    id: 18,
    name: "Kecap Manis Bango 135ml",
    price: 10500,
    category: "Bumbu Dapur",
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=500&q=80",
    desc: "Kecap manis dari kedelai hitam mallika pilihan",
    stock: 85,
    sold: 115
  },
  {
    id: 19,
    name: "Rinso Anti Noda Deterjen 700g",
    price: 24500,
    original_price: 28000,
    category: "Rumah Tangga",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=500&q=80",
    desc: "Deterjen bubuk hilangkan noda bandel sekali cuci",
    stock: 60,
    sold: 88
  },
  {
    id: 20,
    name: "Gudang Garam Filter 16",
    price: 31000,
    category: "Rokok 18+",
    image: "https://images.unsplash.com/photo-1549007994-cb92ca8a8a72?auto=format&fit=crop&w=500&q=80",
    desc: "Rokok kretek filter legendaris rasa mantap",
    stock: 70,
    sold: 124
  }
];

const defaultBanners = [
  {
    id: 1,
    title: "Snack Favorit Keluarga",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=1200&h=400&q=80",
    productId: 5
  },
  {
    id: 2,
    title: "Minyak Goreng Murah Sembako Hemat",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&h=400&q=80",
    productId: 2
  },
  {
    id: 3,
    title: "Beras Wangi Pulen Pilihan Keluarga",
    image: "https://images.unsplash.com/photo-1526367790999-0150706af5d7?auto=format&fit=crop&w=1200&h=400&q=80",
    productId: 3
  }
];

// --- INITIAL 10 WARUNG CATEGORIES ---
const defaultCategories = [
  { name: 'Semua', icon: 'LayoutGrid' },
  { name: 'Digital', icon: 'Smartphone' },
  { name: 'Sembako', icon: 'ShoppingBag' },
  { name: 'Minuman', icon: 'GlassWater' },
  { name: 'Snack', icon: 'Cookie' },
  { name: 'Kosmetik', icon: 'Sparkles' },
  { name: 'Makanan Instan', icon: 'Soup' },
  { name: 'Bumbu Dapur', icon: 'ChefHat' },
  { name: 'Rumah Tangga', icon: 'Home' },
  { name: 'Rokok 18+', icon: 'Cigarette' }
];

// --- SEED SEPARATE LOCALSTORAGE CLIENTS & ORDERS FOR HIGH-FIDELITY ADMIN DASHBOARD ---
const defaultCustomers = [
  { id: 1, name: "Budi Santoso", phone: "081234567890", address: "Jl. Anggrek No. 12, Jakarta", total_spending: 245000, join_date: "2026-05-12" },
  { id: 2, name: "Ani Wijaya", phone: "082345678901", address: "Jl. Melati No. 5, Bandung", total_spending: 189000, join_date: "2026-06-01" },
  { id: 3, name: "Candra Hermawan", phone: "083456789012", address: "Jl. Kenanga No. 8, Surabaya", total_spending: 95000, join_date: "2026-06-25" }
];

const defaultOrders = [
  {
    id: "HNA-102938",
    customer_name: "Budi Santoso",
    phone: "081234567890",
    address: "Jl. Anggrek No. 12, Jakarta",
    items: [
      { product_name: "Beras Pandan Wangi Premium 1kg", quantity: 5, price: 15000 },
      { product_name: "Minyak Goreng Bimoli 1L", quantity: 2, price: 18500 }
    ],
    subtotal: 112000,
    delivery_fee: 5000,
    total: 117000,
    payment_method: "Transfer QRIS",
    status: "Selesai",
    date: "2026-06-30",
    kurir: "J&T Express",
    resi: "JT102938475ID"
  },
  {
    id: "HNA-102939",
    customer_name: "Ani Wijaya",
    phone: "082345678901",
    address: "Jl. Melati No. 5, Bandung",
    items: [
      { product_name: "Wardah Lip Cream Matte", quantity: 1, price: 45000 },
      { product_name: "Indomie Goreng Special", quantity: 5, price: 3500 }
    ],
    subtotal: 62500,
    delivery_fee: 0,
    total: 62500,
    payment_method: "COD",
    status: "Diproses",
    date: "2026-06-29",
    kurir: "",
    resi: ""
  },
  {
    id: "HNA-102940",
    customer_name: "Candra Hermawan",
    phone: "083456789012",
    address: "Jl. Kenanga No. 8, Surabaya",
    items: [
      { product_name: "Gula Pasir Rose Brand 1kg", quantity: 3, price: 16000 }
    ],
    subtotal: 48000,
    delivery_fee: 5000,
    total: 53000,
    payment_method: "Transfer Bank",
    status: "Baru",
    date: "2026-06-30",
    kurir: "",
    resi: ""
  }
];

// --- PURE REACT LUCIDE COMPONENT ---
const LucideIcon = ({ name, className = '', size = 24, strokeWidth = 2, ...props }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.lucide) {
      setReady(true);
    } else {
      const checkInterval = setInterval(() => {
        if (window.lucide) {
          setReady(true);
          clearInterval(checkInterval);
        }
      }, 50);
      return () => clearInterval(checkInterval);
    }
  }, []);

  if (!ready || !window.lucide || !window.lucide.icons) {
    return <span className={`inline-block ${className}`} style={{ width: size, height: size }} />;
  }

  let targetName = name;
  if (name === 'Soap') targetName = 'Sparkles';
  if (name === 'Noodle') targetName = 'Soup'; 

  const pascalName = targetName.replace(/(^\w|-\w)/g, (m) => m.replace('-', '').toUpperCase());
  const iconNode = window.lucide.icons[pascalName] || window.lucide.icons[targetName];

  if (!iconNode) {
    console.warn(`Icon "${name}" / "${pascalName}" not found in window.lucide.icons`);
    return <span className={`inline-block ${className}`} style={{ width: size, height: size }} />;
  }

  const renderNode = (node, index) => {
    const [tag, attrs, children] = node;
    const reactAttrs = {};
    for (const [key, value] of Object.entries(attrs || {})) {
      const camelKey = key === 'class' ? 'className' : key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      reactAttrs[camelKey] = value;
    }
    reactAttrs.key = index;

    const childElements = children && children.length > 0
      ? children.map((child, idx) => renderNode(child, idx))
      : null;

    return React.createElement(tag, reactAttrs, childElements);
  };

  const svgAttrs = {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: `lucide lucide-${name.toLowerCase()} ${className}`,
    ...props
  };

  return React.createElement(
    "svg",
    svgAttrs,
    iconNode.map((node, idx) => renderNode(node, idx))
  );
};

// --- MAIN APP COMPONENT ---

// --- V3.7 GLOBAL TRANSLATION DICTIONARY ---
const translations = {
  id: {
    searchPlaceholder: "Cari di Toko Hana...",
    listening: "Mendengarkan suara...",
    tabHome: "Home",
    tabPromo: "Promo",
    tabCart: "Keranjang",
    tabAdmin: "Admin",
    tabProfile: "Profil",
    banner1Title: "Diskon Sembako s/d 50%!",
    banner1Desc: "Belanja hemat kebutuhan harian keluarga Anda.",
    banner2Title: "Produk Rumah Tangga Lengkap",
    banner2Desc: "Dari deterjen hingga bumbu dapur lengkap.",
    banner3Title: "Layanan Produk Digital Instan",
    banner3Desc: "Beli pulsa, kuota, dan token listrik 24 jam.",
    catAll: "Semua",
    catDigital: "Digital",
    catSembako: "Sembako",
    catMinuman: "Minuman",
    catSnack: "Snack",
    catKosmetik: "Kosmetik",
    catInstant: "Makanan Instan",
    catSpices: "Bumbu Dapur",
    catHousehold: "Rumah Tangga",
    catCigarettes: "Rokok 18+",
    stockLabel: "Stok",
    soldLabel: "Terjual",
    addCartBtn: "Tambahkan ke Keranjang",
    detailProduct: "Detail Produk",
    categoryLabel: "Kategori",
    searchNotFound: "Produk tidak ditemukan. Coba pencarian lain!",
    cartTitle: "Keranjang Belanja",
    cartEmpty: "Keranjang masih kosong.",
    startShopping: "Pilih produk dari warung untuk belanja.",
    totalLabel: "Total Belanja",
    checkoutBtn: "Bayar Sekarang (QRIS)",
    formRecipientHeader: "Isi Data Penerima",
    formName: "Nama Penerima",
    formPhone: "No. WhatsApp (Aktif)",
    formAddress: "Alamat Pengiriman Lengkap",
    proceedPayment: "Lanjutkan ke Pembayaran",
    qrisHeader: "Metode Pembayaran QRIS",
    qrisDesc: "Pindai memakai m-Banking / e-Wallet Anda untuk menyelesaikan pembayaran.",
    donePaymentBtn: "Selesai Pembayaran",
    authTitle: "Masuk / Daftar Akun",
    loginCustomer: "Masuk Pelanggan",
    registerCustomer: "Daftar Baru",
    loginAdmin: "Masuk Admin",
    fullName: "Nama Lengkap",
    emailLabel: "Alamat Email",
    phoneLabel: "No. WhatsApp",
    addressLabel: "Alamat Lengkap",
    passwordLabel: "Password",
    loginBtn: "Masuk Sekarang",
    registerBtn: "Daftar Pelanggan",
    welcomeBack: "Selamat datang kembali",
    logoutSuccess: "Berhasil keluar dari akun.",
    editProfileBtn: "Ubah Profil",
    saveProfileBtn: "Simpan Perubahan",
    myPurchaseHistory: "Riwayat Belanja Saya",
    orderStatusUnpaid: "Belum Bayar",
    orderStatusPacking: "Sedang Dikemas",
    orderStatusShipped: "Dikirim",
    orderStatusCompleted: "Selesai",
    trackingNum: "No. Resi",
    courierLabel: "Kurir",
    logoutBtn: "Keluar Akun",
    adminTitle: "Backoffice Toko Hana",
    backofficeSubtitle: "Sistem Manajemen Warung Digital & Keuangan",
    menuProducts: "Manajemen Produk",
    menuCustomers: "Manajemen Pelanggan",
    menuOrders: "Manajemen Orderan",
    menuShipping: "Manajemen Pengiriman",
    menuFinance: "Keuangan",
    menuCategories: "Kategori",
    menuBranding: "Branding"
  },
  en: {
    searchPlaceholder: "Search in Toko Hana...",
    listening: "Listening for voice...",
    tabHome: "Home",
    tabPromo: "Promo",
    tabCart: "Cart",
    tabAdmin: "Admin",
    tabProfile: "Profile",
    banner1Title: "Up to 50% Off Groceries!",
    banner1Desc: "Save more on your family's daily essential needs.",
    banner2Title: "Complete Household Supplies",
    banner2Desc: "From washing detergents to complete cooking spices.",
    banner3Title: "24/7 Instant Digital Products",
    banner3Desc: "Buy phone credits, data packages, & electricity tokens.",
    catAll: "All",
    catDigital: "Digital",
    catSembako: "Groceries",
    catMinuman: "Beverages",
    catSnack: "Snacks",
    catKosmetik: "Cosmetics",
    catInstant: "Instant Food",
    catSpices: "Spices",
    catHousehold: "Household",
    catCigarettes: "Cigarettes 18+",
    stockLabel: "Stock",
    soldLabel: "Sold",
    addCartBtn: "Add to Cart",
    detailProduct: "Product Detail",
    categoryLabel: "Category",
    searchNotFound: "Product not found. Try another search!",
    cartTitle: "Shopping Cart",
    cartEmpty: "Your cart is empty.",
    startShopping: "Select products from the store to buy.",
    totalLabel: "Total Amount",
    checkoutBtn: "Pay Now (QRIS)",
    formRecipientHeader: "Recipient Information",
    formName: "Recipient Name",
    formPhone: "WhatsApp Number (Active)",
    formAddress: "Full Delivery Address",
    proceedPayment: "Proceed to Payment",
    qrisHeader: "QRIS Payment Method",
    qrisDesc: "Scan using your m-Banking / e-Wallet to complete the payment.",
    donePaymentBtn: "Payment Completed",
    authTitle: "Login / Register Account",
    loginCustomer: "Customer Login",
    registerCustomer: "New Register",
    loginAdmin: "Admin Login",
    fullName: "Full Name",
    emailLabel: "Email Address",
    phoneLabel: "WhatsApp Number",
    addressLabel: "Full Address",
    passwordLabel: "Password",
    loginBtn: "Login Now",
    registerBtn: "Register Customer",
    welcomeBack: "Welcome back",
    logoutSuccess: "Logged out successfully.",
    editProfileBtn: "Edit Profile",
    saveProfileBtn: "Save Changes",
    myPurchaseHistory: "My Purchase History",
    orderStatusUnpaid: "Unpaid",
    orderStatusPacking: "Packing",
    orderStatusShipped: "Shipped",
    orderStatusCompleted: "Completed",
    trackingNum: "Tracking Number",
    courierLabel: "Courier",
    logoutBtn: "Logout Account",
    adminTitle: "Toko Hana Backoffice",
    backofficeSubtitle: "Digital Stall & Financial Management System",
    menuProducts: "Product Management",
    menuCustomers: "Customer Management",
    menuOrders: "Order Management",
    menuShipping: "Shipping Management",
    menuFinance: "Financials",
    menuCategories: "Categories",
    menuBranding: "Branding"
  }
};

function App() {
  const [currentTab, setCurrentTab] = useState('Home'); // Home, Promo, Qris, Cart, Profil, AdminPage
  const [lang, setLang] = useState(() => {
    return safeStorage.getItem('toko_hana_lang') || 'id';
  });

  const [merchantWaNumber, setMerchantWaNumber] = useState(() => {
    return safeStorage.getItem('toko_hana_wa_number') || '628122792099';
  });

  const [piExchangeRate, setPiExchangeRate] = useState(() => {
    return parseFloat(safeStorage.getItem('toko_hana_pi_rate')) || 2000000;
  });

  

  useEffect(() => {
    safeStorage.setItem('toko_hana_lang', lang);
  }, [lang]);
  const t = (key) => {
    return translations[lang][key] || translations['id'][key] || key;
  };

  const convertRpToPi = (rp) => rp / piExchangeRate;
  const formatPi = (rp) => {
    const piVal = rp / piExchangeRate;
    return piVal.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 }) + ' π';
  };


  const translateCategory = (catName) => {
    const catKeyMap = {
      'Semua': 'catAll',
      'Digital': 'catDigital',
      'Sembako': 'catSembako',
      'Minuman': 'catMinuman',
      'Snack': 'catSnack',
      'Kosmetik': 'catKosmetik',
      'Makanan Instan': 'catInstant',
      'Bumbu Dapur': 'catSpices',
      'Rumah Tangga': 'catHousehold',
      'Rokok 18+': 'catCigarettes'
    };
    return t(catKeyMap[catName] || catName);
  };
  

  
  // States with robust Try-Catch JSON Parsing
  const [products, setProducts] = useState(() => {
    try {
      const local = safeStorage.getItem('toko_hana_products');
      const localAdded = JSON.parse(safeStorage.getItem('toko_hana_local_products') || '[]');
      const initial = local ? JSON.parse(local) : defaultProducts;
      // Merge lists and prevent duplicates based on ID
      const merged = [...localAdded, ...initial.filter(p => !localAdded.some(lp => lp.id === p.id))];
      return merged;
    } catch (e) {
      console.warn('Failed to parse products, falling back to default seeds:', e);
      return defaultProducts;
    }
  });

  const [loading, setLoading] = useState(true);

  const [banners, setBanners] = useState(() => {
    try {
      const local = safeStorage.getItem('toko_hana_banners');
      if (local) return JSON.parse(local);
    } catch (e) {
      console.warn('Failed to parse banners:', e);
    }
    safeStorage.setItem('toko_hana_banners', JSON.stringify(defaultBanners));
    return defaultBanners;
  });

  const [cart, setCart] = useState(() => {
    try {
      const local = safeStorage.getItem('toko_hana_cart');
      return local ? JSON.parse(local) : [];
    } catch (e) {
      console.warn('Failed to parse cart:', e);
      return [];
    }
  });

  const [adminLoggedIn, setAdminLoggedIn] = useState(() => {
    return safeStorage.getItem('toko_hana_admin') === 'true';
  });

  // --- V3.5 EDITABLE CATEGORIES ---
  const [categories, setCategories] = useState(() => {
    try {
      const local = safeStorage.getItem('toko_hana_categories');
      return local ? JSON.parse(local) : defaultCategories;
    } catch (e) {
      console.warn('Failed to parse categories:', e);
      return defaultCategories;
    }
  });

  // --- V3.5 BACKOFFICE TABLES ---
  const [customers, setCustomers] = useState(() => {
    try {
      const local = safeStorage.getItem('toko_hana_customers');
      return local ? JSON.parse(local) : defaultCustomers;
    } catch (e) {
      console.warn('Failed to parse customers:', e);
      return defaultCustomers;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const local = safeStorage.getItem('toko_hana_orders');
      return local ? JSON.parse(local) : defaultOrders;
    } catch (e) {
      console.warn('Failed to parse orders:', e);
      return defaultOrders;
    }
  });

  // --- V3.5 REGISTERED ACTIVE USER SESSION ---
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const local = safeStorage.getItem('toko_hana_active_user');
      return local ? JSON.parse(local) : null;
    } catch (e) {
      console.warn('Failed to parse active user:', e);
      return null;
    }
  });

  // UI / Interactive States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Automatic Cinematic Banner Carousel Rotation
  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Smooth transition every 5 seconds
    return () => clearInterval(timer);
  }, [banners]);

  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  
  // Category Sheet Bottom Sheet
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  // QRIS Image View Modal
  const [showQrisModal, setShowQrisModal] = useState(false);

  // Active sub tab inside Auth Screen (MASUK vs DAFTAR)
  const [authActiveTab, setAuthActiveTab] = useState('login'); // login | register

  // Auth Inputs
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authAddress, setAuthAddress] = useState('');

  // Custom header pattern URL state
  const [headerPatternUrl, setHeaderPatternUrl] = useState(() => {
    return safeStorage.getItem('toko_hana_header_pattern') || '';
  });

  // Custom QRIS Image URL State
  const [qrisImageUrl, setQrisImageUrl] = useState(() => {
    return safeStorage.getItem('toko_hana_qris_image') || '';
  });

  // Admin Panel Internal Navigation & Form States
  const [adminActiveSubMenu, setAdminActiveSubMenu] = useState('produk'); // produk, kategori, pelanggan, orderan, pengiriman, keuangan, branding
  const [editingProduct, setEditingProduct] = useState(null); // null means adding a new product
  const [editingBanner, setEditingBanner] = useState(null); // null means adding a new banner
  const [bannerForm, setBannerForm] = useState({ title: '', image: '', productId: '' });
  const [editingCategory, setEditingCategory] = useState(null); // null means adding a new category

  // Product Form Fields
  const [prodForm, setProdForm] = useState({ name: '', price: '', original_price: '', category: 'Sembako', image: '', desc: '', stock: '50', sold: '0' });
  // Category Form Fields
  const [catForm, setCatForm] = useState({ name: '', icon: 'Package' });
  // Shipping Form Fields
  const [selectedOrderToShip, setSelectedOrderToShip] = useState(null);
  const [shipForm, setShipForm] = useState({ kurir: 'J&T Express', resi: '' });
    const mainScrollRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Voice recognition search state
  const [voiceSearching, setVoiceSearching] = useState(false);

  // --- WATCH AND SYNC URL HASH ROUTE ---
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/admin' || hash === '#admin') {
        if (adminLoggedIn) {
          setCurrentTab('AdminPage');
        } else {
          setCurrentTab('Profil');
          setAuthActiveTab('login');
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [adminLoggedIn]);

  // --- SUPABASE DATA FETCHING & REALTIME ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabaseService.getProducts();
      if (data && data.length > 0) {
        const mapped = data.map(item => {
          let catName = 'Sembako';
          if (item.category_id === 2) catName = 'Minuman';
          else if (item.category_id === 3) catName = 'Snack';
          else if (item.category_id === 4) catName = 'Digital';
          else if (item.category_id === 5) catName = 'Kosmetik';
          else if (item.category_id === 6) catName = 'Makanan Instan';
          else if (item.category_id === 7) catName = 'Bumbu Dapur';
          else if (item.category_id === 8) catName = 'Rumah Tangga';
          else if (item.category_id === 9) catName = 'Rokok 18+';

          return {
            id: item.id,
            name: item.name,
            price: item.price,
            original_price: item.original_price || null,
            category: catName,
            image: item.image_url,
            desc: item.desc || `${item.name} premium berkualitas dari Toko Hana.`,
            stock: item.stock || 50,
            sold: item.sold || 0
          };
        });

        // Merge Supabase products with locally added products (persists locally added items on reload!)
        const localAdded = JSON.parse(safeStorage.getItem('toko_hana_local_products') || '[]');
        const merged = [...localAdded, ...mapped.filter(p => !localAdded.some(lp => lp.id === p.id))];

        setProducts(merged);
        safeStorage.setItem('toko_hana_products', JSON.stringify(merged));
      } else if (error) {
        console.warn('Supabase fetch failed, utilizing safeStorage cache:', error.message);
      }
      setLoading(false);
    };

    fetchProducts();

    const channel = supabaseService.subscribeProducts((payload) => {
      console.log('Realtime update detected in products table!');
      fetchProducts();
    });

    const checkUser = async () => {
      // Sync login state with Supabase Auth
      const { user } = await supabaseService.getUser();
      if (user) {
        console.log('Active Supabase authenticated session found for:', user.email);
        if (user.email === 'admin_70666@web-library.net') {
          setAdminLoggedIn(true);
          safeStorage.setItem('toko_hana_admin', 'true');
          const adminSession = { email: user.email, name: 'Hana Admin', role: 'admin' };
          setCurrentUser(adminSession);
          safeStorage.setItem('toko_hana_active_user', JSON.stringify(adminSession));
        } else {
          // It's a Customer
          const custSession = {
            email: user.email,
            name: user.user_metadata?.name || 'Pelanggan Setia',
            phone: user.user_metadata?.phone || '-',
            address: user.user_metadata?.address || '-',
            role: 'customer'
          };
          setCurrentUser(custSession);
          safeStorage.setItem('toko_hana_active_user', JSON.stringify(custSession));
        }
      }
    };
    checkUser();

    return () => {
      if (channel && window.supabase) {
        const { createClient } = window.supabase;
        const client = createClient(supabaseUrl, supabaseKey);
        client.removeChannel(channel);
      }
    };
  }, []);

  // Sync backoffice states to localStorage
  useEffect(() => {
    safeStorage.setItem('toko_hana_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    safeStorage.setItem('toko_hana_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    safeStorage.setItem('toko_hana_orders', JSON.stringify(orders));
  }, [orders]);

  // Sync current active user session
  useEffect(() => {
    if (currentUser) {
      safeStorage.setItem('toko_hana_active_user', JSON.stringify(currentUser));
    } else {
      safeStorage.removeItem('toko_hana_active_user');
    }
  }, [currentUser]);

  // Filter products by Tab and category
  const filteredProducts = useMemo(() => {
    let list = products;
    if (currentTab === 'Promo') {
      list = products.filter(p => p.original_price && p.original_price > p.price);
    }
    return list.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'Semua' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory, currentTab]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2500);
  };

  const handleAddToCart = (product, qty = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prevCart, { product, quantity: qty }];
    });
    showToast(`🛒 ${product.name} dimasukkan ke keranjang!`);
  };

  const handleUpdateCartQty = (productId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (productId) => {
    const item = cart.find(i => i.product.id === productId);
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    if (item) showToast(`🗑️ ${item.product.name} dihapus dari keranjang.`);
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const deliveryFee = cartSubtotal >= 50000 ? 0 : (cartSubtotal > 0 ? 5000 : 0);
  const cartTotal = cartSubtotal + deliveryFee;

  // Checkout WhatsApp Form Handler
  const handleCheckoutWhatsApp = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    const form = e.target;
    const buyerName = form.elements.buyerName.value.trim() || 'Pelanggan Toko Hana';
    const buyerPhone = form.elements.buyerPhone.value.trim() || '-';
    const buyerAddress = form.elements.buyerAddress.value.trim() || 'Alamat Toko';
    const paymentMethod = form.elements.paymentMethod.value;

    const newOrderId = "HNA-" + Math.floor(Math.random() * 900000 + 100000);
    const orderItems = cart.map(item => ({
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    }));

    const newOrder = {
      id: newOrderId,
      customer_name: buyerName,
      phone: buyerPhone,
      address: buyerAddress,
      items: orderItems,
      subtotal: cartSubtotal,
      delivery_fee: deliveryFee,
      total: cartTotal,
      payment_method: paymentMethod,
      status: "Baru",
      date: new Date().toISOString().split('T')[0],
      kurir: "",
      resi: ""
    };

    // Update customers rekap list
    setCustomers(prevCustomers => {
      const existing = prevCustomers.find(c => c.name.toLowerCase() === buyerName.toLowerCase());
      if (existing) {
        return prevCustomers.map(c => 
          c.name.toLowerCase() === buyerName.toLowerCase()
            ? { ...c, total_spending: c.total_spending + cartTotal, phone: buyerPhone, address: buyerAddress }
            : c
        );
      } else {
        const nextId = prevCustomers.length > 0 ? Math.max(...prevCustomers.map(c => c.id)) + 1 : 1;
        return [...prevCustomers, {
          id: nextId,
          name: buyerName,
          phone: buyerPhone,
          address: buyerAddress,
          total_spending: cartTotal,
          join_date: new Date().toISOString().split('T')[0]
        }];
      }
    });

    setOrders(prevOrders => [newOrder, ...prevOrders]);

    let message = `*Halo Toko Hana, saya mau pesan (Event Solo Host Pi Network):*\n`;
    message += `------------------------------------------\n`;
    cart.forEach((item, idx) => {
      const itemTotal = item.product.price * item.quantity;
      const itemPi = convertRpToPi(itemTotal);
      message += `${idx + 1}. *${item.product.name}* (x${item.quantity}) = Rp ${itemTotal.toLocaleString('id-ID')} (${itemPi.toFixed(4)} π)\n`;
    });
    message += `------------------------------------------\n`;
    message += `*Subtotal:* Rp ${cartSubtotal.toLocaleString('id-ID')} (${(convertRpToPi(cartSubtotal)).toFixed(4)} π)\n`;
    message += `*Ongkir:* ${deliveryFee === 0 ? 'Gratis (Promo Pi)' : `Rp ${deliveryFee.toLocaleString('id-ID')} (${(convertRpToPi(deliveryFee)).toFixed(4)} π)`}\n`;
    message += `*Total Pembayaran:* *Rp ${cartTotal.toLocaleString('id-ID')}* (*${(convertRpToPi(cartTotal)).toFixed(4)} π*)\n\n`;
    message += `*--- DATA PENGIRIMAN ---*\n`;
    message += `👤 *Nama:* ${buyerName}\n`;
    message += `📞 *WA/Telp:* ${buyerPhone}\n`;
    message += `📍 *Alamat:* ${buyerAddress}\n`;
    message += `💳 *Metode:* ${paymentMethod}\n\n`;
    message += `Mohon segera diproses ya, terima kasih! ✨`;

    setCart([]);
    const waUrl = `https://wa.me/${merchantWaNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  // Web Speech API Voice Search
  const triggerVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Peramban Anda tidak mendukung Pencarian Suara (Web Speech API). Coba gunakan Google Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    setVoiceSearching(true);
    showToast('🎤 Silakan bicara sekarang...');
    recognition.start();
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setVoiceSearching(false);
      showToast(`🎤 Berhasil mendeteksi: "${transcript}"`);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setVoiceSearching(false);
      showToast('⚠️ Gagal mengenali suara.');
    };

    recognition.onend = () => {
      setVoiceSearching(false);
    };
  };

  // --- SMART UNIFIED LOGIN ROUTER ---
  // Identifies whether logged-in entity is Admin (Backoffice redirect) or Customer (Dashboard redirect)
  const handleUnifiedLogin = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      alert('Mohon isi email dan password!');
      return;
    }

    // 1. ADMIN CHECK
    if (authEmail === 'admin_70666@web-library.net' && authPassword === 'hana123') {
      setAdminLoggedIn(true);
      safeStorage.setItem('toko_hana_admin', 'true');
      const adminSession = { email: authEmail, name: 'Hana Admin', role: 'admin' };
      setCurrentUser(adminSession);
      
      showToast('🔐 Menghubungkan ke Supabase Auth...');
      // Sync with Supabase Auth
      await supabaseService.signIn(authEmail, authPassword);
      
      showToast('⚡ Selamat Datang Admin Toko Hana!');
      setCurrentTab('AdminPage');
      window.location.hash = '#/admin';
      
      // Clear inputs
      setAuthEmail('');
      setAuthPassword('');
      return;
    }

    // 2. CUSTOMER CHECK (Look in local customers first for frictionless testing)
    const existingCustomer = customers.find(c => c.phone === authEmail || c.name.toLowerCase() === authEmail.toLowerCase() || (c.phone && authEmail.includes(c.phone)));
    
    // Attempt standard Supabase Sign-In
    showToast('🔐 Memverifikasi akun pelanggan...');
    const { data, error } = await supabaseService.signIn(authEmail, authPassword);
    
    if (data && data.user) {
      // Supabase user confirmed
      const custSession = {
        email: authEmail,
        name: data.user.user_metadata?.name || 'Pelanggan Setia',
        phone: data.user.user_metadata?.phone || '081234567890',
        address: data.user.user_metadata?.address || 'Jakarta, Indonesia',
        role: 'customer'
      };
      setCurrentUser(custSession);
      showToast(`✨ Selamat Datang Kembali, ${custSession.name}!`);
      setCurrentTab('Home');
    } else {
      // Local Storage mock authentication (to make sandbox fully operable offline!)
      const matchedLocal = customers.find(c => c.phone === authPassword || authEmail.toLowerCase().includes(c.name.toLowerCase().split(' ')[0]));
      if (matchedLocal) {
        const custSession = {
          email: authEmail,
          name: matchedLocal.name,
          phone: matchedLocal.phone,
          address: matchedLocal.address,
          role: 'customer'
        };
        setCurrentUser(custSession);
        showToast(`✨ Selamat Datang Kembali, ${custSession.name}! (Mode Lokal)`);
        setCurrentTab('Home');
      } else {
        // Auto register them as new customer if offline & not found for maximum comfort!
        const guestSession = {
          email: authEmail,
          name: authEmail.split('@')[0],
          phone: '08123456789',
          address: 'Alamat Toko Hana',
          role: 'customer'
        };
        setCurrentUser(guestSession);
        showToast(`✨ Akun Baru Terbuat! Selamat Datang, ${guestSession.name}!`);
        setCurrentTab('Home');
      }
    }

    setAuthEmail('');
    setAuthPassword('');
  };

  // --- CUSTOMER SIGN-UP FORM ---
  const handleCustomerSignUp = async (e) => {
    e.preventDefault();
    if (!authEmail || !authPassword || !authName || !authPhone || !authAddress) {
      alert('Mohon isi seluruh bidang registrasi wajib!');
      return;
    }

    showToast('📝 Mendaftarkan akun ke Supabase...');
    const metadata = { name: authName, phone: authPhone, address: authAddress };
    
    // Register on Supabase Auth
    const { data, error } = await supabaseService.signUp(authEmail, authPassword, metadata);

    const newCustomerId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    const newCustomerLocal = {
      id: newCustomerId,
      name: authName,
      phone: authPhone,
      address: authAddress,
      total_spending: 0,
      join_date: new Date().toISOString().split('T')[0]
    };

    // Save profile locally
    setCustomers(prev => [...prev, newCustomerLocal]);

    if (error) {
      console.warn('Supabase Auth sign-up error, falling back locally:', error.message);
      // Fallback: log them in immediately as a local customer!
      const localSession = {
        email: authEmail,
        name: authName,
        phone: authPhone,
        address: authAddress,
        role: 'customer'
      };
      setCurrentUser(localSession);
      showToast(`✨ Registrasi Berhasil! Selamat Datang, ${authName}! (Sesi Lokal)`);
    } else {
      showToast(`✨ Akun Supabase Berhasil Terbuat! Selamat Datang, ${authName}!`);
      
      // Real-time Sync to public.customers table in your Supabase Database!
      const client = getSupabaseClient();
      if (client) {
        client.from('customers').insert([{
          email: authEmail,
          name: authName,
          phone: authPhone,
          address: authAddress,
          total_spending: 0
        }]).then(({ error: dbErr }) => {
          if (dbErr) console.warn('Failed to sync to public.customers table:', dbErr.message);
          else console.log('Successfully synced new customer profile to database.');
        });
      }

      const activeSession = {
        email: authEmail,
        name: authName,
        phone: authPhone,
        address: authAddress,
        role: 'customer'
      };
      setCurrentUser(activeSession);
    }

    // Reset inputs
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setAuthPhone('');
    setAuthAddress('');
    setAuthActiveTab('login');
  };

  // --- UNIFIED PROFILE LOGOUT ---
  const handleLogout = async () => {
    setAdminLoggedIn(false);
    safeStorage.setItem('toko_hana_admin', 'false');
    setAdminActiveSubMenu(null);
    setCurrentUser(null);
    await supabaseService.signOut();
    setCurrentTab('Home');
    window.location.hash = '#';
    showToast('🔓 Keluar dari sesi dengan aman.');
  };

  // Save Customer Edited Profile Details
  const handleUpdateCustomerProfile = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const updatedName = e.target.elements.profileName.value.trim();
    const updatedPhone = e.target.elements.profilePhone.value.trim();
    const updatedAddress = e.target.elements.profileAddress.value.trim();

    const updatedSession = {
      ...currentUser,
      name: updatedName,
      phone: updatedPhone,
      address: updatedAddress
    };

    setCurrentUser(updatedSession);
    
    // Also update in customers rekap list
    setCustomers(prev => prev.map(c => 
      c.phone === currentUser.phone || c.name === currentUser.name
        ? { ...c, name: updatedName, phone: updatedPhone, address: updatedAddress }
        : c
    ));

    showToast('💾 Profil berhasil diperbarui!');
  };

  // CRUD - Kelola Produk (Supabase Connected)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price || !prodForm.image) {
      alert('Mohon isi semua data wajib');
      return;
    }

    const priceNum = parseInt(prodForm.price) || 0;
    const originalPriceNum = prodForm.original_price ? parseInt(prodForm.original_price) : null;
    const stockNum = parseInt(prodForm.stock) || 0;
    const soldNum = parseInt(prodForm.sold) || 0;
    
    const categoryMap = {
      'Sembako': 1, 'Minuman': 2, 'Snack': 3, 'Digital': 4, 'Kosmetik': 5,
      'Makanan Instan': 6, 'Bumbu Dapur': 7, 'Rumah Tangga': 8, 'Rokok 18+': 9
    };
    const catId = categoryMap[prodForm.category] || 1;

    if (editingProduct) {
      const updatesDb = {
        name: prodForm.name,
        price: priceNum,
        original_price: originalPriceNum,
        image_url: prodForm.image,
        category_id: catId,
        desc: prodForm.desc,
        stock: stockNum,
        sold: soldNum
      };

      const { data, error } = await supabaseService.updateProduct(editingProduct.id, updatesDb);
      
      if (error) {
        console.warn('Supabase UPDATE error, falling back locally:', error.message);
        
        // Update in locally saved products cache
        const localAdded = JSON.parse(safeStorage.getItem('toko_hana_local_products') || '[]');
        const updatedLocal = localAdded.map(lp => 
          lp.id === editingProduct.id 
            ? { ...lp, name: prodForm.name, price: priceNum, original_price: originalPriceNum, category: prodForm.category, image: prodForm.image, desc: prodForm.desc, stock: stockNum, sold: soldNum }
            : lp
        );
        if (!localAdded.some(lp => lp.id === editingProduct.id)) {
          updatedLocal.unshift({
            id: editingProduct.id,
            name: prodForm.name,
            price: priceNum,
            original_price: originalPriceNum,
            category: prodForm.category,
            image: prodForm.image,
            desc: prodForm.desc,
            stock: stockNum,
            sold: soldNum
          });
        }
        safeStorage.setItem('toko_hana_local_products', JSON.stringify(updatedLocal));

        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id 
            ? { ...p, name: prodForm.name, price: priceNum, original_price: originalPriceNum, category: prodForm.category, image: prodForm.image, desc: prodForm.desc, stock: stockNum, sold: soldNum }
            : p
        ));
        showToast(`⚠️ Diperbarui secara lokal.`);
      } else {
        showToast(`✏️ Berhasil disimpan di Supabase!`);
      }
    } else {
      const newProductDb = {
        name: prodForm.name,
        price: priceNum,
        original_price: originalPriceNum,
        image_url: prodForm.image,
        category_id: catId,
        desc: prodForm.desc,
        stock: stockNum,
        sold: soldNum
      };

      const { data, error } = await supabaseService.insertProduct(newProductDb);
      
      if (error) {
        console.warn('Supabase INSERT error, falling back locally:', error.message);
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProductLocal = {
          id: newId,
          name: prodForm.name,
          price: priceNum,
          original_price: originalPriceNum,
          category: prodForm.category,
          image: prodForm.image,
          desc: prodForm.desc || `${prodForm.name} berkualitas dari Toko Hana.`,
          stock: stockNum,
          sold: soldNum
        };
        
        // Save to local added cache to prevent losing it on browser reload
        const localAdded = JSON.parse(safeStorage.getItem('toko_hana_local_products') || '[]');
        localAdded.unshift(newProductLocal);
        safeStorage.setItem('toko_hana_local_products', JSON.stringify(localAdded));

        setProducts(prev => [newProductLocal, ...prev]);
        showToast(`⚠️ RLS Aktif. Produk "${prodForm.name}" disimpan di browser.`);
      } else {
        showToast(`✨ Berhasil disimpan di Supabase!`);
        if (data && data[0]) {
          const inserted = data[0];
          const newProductLocal = {
            id: inserted.id,
            name: inserted.name,
            price: inserted.price,
            original_price: inserted.original_price,
            category: prodForm.category,
            image: inserted.image_url,
            desc: prodForm.desc,
            stock: inserted.stock,
            sold: inserted.sold
          };
          setProducts(prev => [newProductLocal, ...prev]);
        }
      }
    }

    setProdForm({ name: '', price: '', original_price: '', category: 'Sembako', image: '', desc: '', stock: '50', sold: '0' });
    setEditingProduct(null);
  };

  const handleEditProductClick = (p) => {
    setEditingProduct(p);
    setProdForm({
      name: p.name,
      price: p.price.toString(),
      original_price: p.original_price ? p.original_price.toString() : '',
      category: p.category,
      image: p.image,
      desc: p.desc || '',
      stock: p.stock.toString(),
      sold: p.sold.toString()
    });
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      const { error } = await supabaseService.deleteProduct(id);
      
      // Delete from local added cache
      const localAdded = JSON.parse(safeStorage.getItem('toko_hana_local_products') || '[]');
      const filteredLocal = localAdded.filter(lp => lp.id !== id);
      safeStorage.setItem('toko_hana_local_products', JSON.stringify(filteredLocal));

      if (error) {
        console.warn('Supabase DELETE error, falling back locally:', error.message);
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('⚠️ Dihapus secara lokal.');
      } else {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('🗑️ Berhasil dihapus dari Supabase.');
      }
      setBanners(prev => prev.map(b => b.productId === id ? { ...b, productId: '' } : b));
    }
  };

  // CRUD - Kelola Kategori
  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!catForm.name || !catForm.icon) {
      alert('Mohon isi semua data kategori');
      return;
    }

    if (editingCategory) {
      setCategories(prev => prev.map(c => 
        c.name === editingCategory.name 
          ? { ...c, name: catForm.name, icon: catForm.icon }
          : c
      ));
      showToast(`✏️ Kategori "${catForm.name}" berhasil diubah!`);
    } else {
      setCategories(prev => [...prev, { name: catForm.name, icon: catForm.icon }]);
      showToast(`✨ Kategori "${catForm.name}" berhasil ditambahkan!`);
    }

    setCatForm({ name: '', icon: 'Package' });
    setEditingCategory(null);
  };

  const handleEditCategoryClick = (c) => {
    setEditingCategory(c);
    setCatForm({ name: c.name, icon: c.icon });
  };

  const handleDeleteCategory = (catName) => {
    if (catName === 'Semua') {
      alert('Kategori "Semua" adalah bawaan sistem dan tidak bisa dihapus!');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus kategori "${catName}"?`)) {
      setCategories(prev => prev.filter(c => c.name !== catName));
      showToast('🗑️ Kategori berhasil dihapus.');
    }
  };

  const handleMoveCategory = (index, direction) => {
    const newCategories = [...categories];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newCategories.length) return;
    
    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;
    
    setCategories(newCategories);
  };

  const handleShipOrder = (e) => {
    e.preventDefault();
    if (!selectedOrderToShip) return;

    setOrders(prevOrders => prevOrders.map(o => 
      o.id === selectedOrderToShip.id 
        ? { ...o, status: 'Selesai', kurir: shipForm.kurir, resi: shipForm.resi }
        : o
    ));

    showToast(`📦 Order ${selectedOrderToShip.id} dikirim via ${shipForm.kurir}!`);
    setSelectedOrderToShip(null);
    setShipForm({ kurir: 'J&T Express', resi: '' });
  };

  const handleSaveHeaderPattern = (e) => {
    e.preventDefault();
    const urlInput = e.target.elements.headerPattern.value.trim();
    setHeaderPatternUrl(urlInput);
    safeStorage.setItem('toko_hana_header_pattern', urlInput);
    showToast('🖼️ Pattern Header diperbarui!');
  };

  const handleSaveQrisImage = (e) => {
    e.preventDefault();
    const qrisInput = e.target.elements.qrisImage.value.trim();
    setQrisImageUrl(qrisInput);
    safeStorage.setItem('toko_hana_qris_image', qrisInput);
    showToast('💳 Gambar QRIS Merchant diperbarui!');
  };

  const handleSaveWaNumber = (e) => {
    e.preventDefault();
    const input = e.target.elements.waNumber.value.trim();
    const cleaned = input.replace(/[^0-9]/g, '');
    setMerchantWaNumber(cleaned);
    safeStorage.setItem('toko_hana_wa_number', cleaned);
    showToast(lang === 'id' ? '📞 Nomor WhatsApp Merchant diperbarui!' : '📞 Merchant WhatsApp number updated!');
  };

  const handleSavePiRate = (e) => {
    e.preventDefault();
    const val = parseFloat(e.target.elements.piRate.value.trim());
    if (val > 0) {
      setPiExchangeRate(val);
      safeStorage.setItem('toko_hana_pi_rate', val.toString());
      showToast(lang === 'id' ? '🪙 Nilai tukar Koin Pi diperbarui!' : '🪙 Pi Network exchange rate updated!');
    }
  };

  const handleMainScroll = (e) => {
    const { scrollTop } = e.target;
    // Show back to top button when scrolled down more than 150px (highly responsive!)
    setShowBackToTop(scrollTop > 150);
  };

  const scrollToTop = () => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (!bannerForm.title || !bannerForm.image) {
      alert('Mohon lengkapi data Banner');
      return;
    }
    const linkedProdId = bannerForm.productId ? parseInt(bannerForm.productId) : '';
    if (editingBanner) {
      setBanners(prev => prev.map(b => 
        b.id === editingBanner.id 
          ? { ...b, title: bannerForm.title, image: bannerForm.image, productId: linkedProdId }
          : b
      ));
      showToast(`✏️ Banner diperbarui!`);
    } else {
      const newId = banners.length > 0 ? Math.max(...banners.map(b => b.id)) + 1 : 1;
      const newBanner = {
        id: newId,
        title: bannerForm.title,
        image: bannerForm.image,
        productId: linkedProdId
      };
      setBanners(prev => [...prev, newBanner]);
      showToast(`✨ Banner ditambahkan!`);
    }
    setBannerForm({ title: '', image: '', productId: '' });
    setEditingBanner(null);
  };

  const handleEditBannerClick = (b) => {
    setEditingBanner(b);
    setBannerForm({
      title: b.title,
      image: b.image,
      productId: b.productId ? b.productId.toString() : ''
    });
  };

  const handleDeleteBanner = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus banner ini?')) {
      setBanners(prev => prev.filter(b => b.id !== id));
      showToast('🗑️ Banner berhasil dihapus.');
    }
  };

  const fillWithRandomUnsplash = (type) => {
    const foodImages = [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1549007994-cb92ca8a8a72?auto=format&fit=crop&w=500&q=80"
    ];
    const randomImage = foodImages[Math.floor(Math.random() * foodImages.length)];
    if (type === 'product') {
      setProdForm(prev => ({ ...prev, image: randomImage }));
    } else if (type === 'banner') {
      setBannerForm(prev => ({ ...prev, image: randomImage }));
    }
  };

  const handlePromoBannerClick = (productId) => {
    if (!productId) return;
    const targetProd = products.find(p => p.id === productId);
    if (targetProd) {
      setSelectedProductDetail(targetProd);
    } else {
      showToast("⚠️ Hubungan produk tidak ditemukan!");
    }
  };

  // Safe Stats and Turnover computation with complete fallbacks for older localStorage versions
  const financeRecap = useMemo(() => {
    try {
      const completedOrders = (orders || []).filter(o => o && o.status === 'Selesai');
      const todayStr = new Date().toISOString().split('T')[0];
      
      const last7Days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push(d.toISOString().split('T')[0]);
      }

      const omzetHariIni = completedOrders
        .filter(o => o && o.date === todayStr)
        .reduce((sum, o) => sum + (o.total || 0), 0);

      const omzetMingguan = completedOrders
        .filter(o => o && last7Days.includes(o.date || ''))
        .reduce((sum, o) => sum + (o.total || 0), 0);

      return {
        omzetHariIni,
        omzetMingguan,
        totalTransactions: completedOrders.length
      };
    } catch (e) {
      console.warn('Failed to compute financeRecap, falling back to zeros:', e);
      return { omzetHariIni: 0, omzetMingguan: 0, totalTransactions: 0 };
    }
  }, [orders]);

  const totalCartItems = useMemo(() => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cart]);

  // Scans for Customer's specific orders list (For real-time shipment tracker!)
  const customerOrdersList = useMemo(() => {
    if (!currentUser || currentUser.role !== 'customer') return [];
    return (orders || []).filter(o => o && (o.customer_name?.toLowerCase() === currentUser.name?.toLowerCase() || o.phone === currentUser.phone));
  }, [orders, currentUser]);

  return (
    <div className="flex-1 flex flex-col relative pb-16 bg-white min-h-screen">
      
      {/* 1. GUEST SHOP INTERFACE */}
      {currentTab !== 'AdminPage' ? (
        <div className="flex-1 flex flex-col">
          
          {/* --- STICKY COMBINED WRAPPER (SHOPEE STYLE) --- */}
          <div className="sticky top-0 z-50 bg-[#703d92] flex flex-col w-full shadow-md">
            
            {/* --- FULL BLEED STICKY HEADER --- */}
            <header 
              className="relative text-white px-4 pb-4 pt-[calc(env(safe-area-inset-top,20px)+12px)] shadow-md overflow-hidden bg-[#703d92]"
              style={{
                backgroundImage: headerPatternUrl ? `url(${headerPatternUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {headerPatternUrl && <div className="absolute inset-0 bg-[#703d92]/80 z-0" />}

              {/* V3.5 HEADER LAYOUT */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                {/* Search Bar on the Left */}
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder={t('searchPlaceholder')} 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (currentTab !== 'Home' && currentTab !== 'Promo') setCurrentTab('Home');
                    }}
                    className="w-full bg-white text-gray-800 placeholder-gray-400 pl-10 pr-9 py-2.5 rounded-full text-xs border-[3px] border-[#FFD700] focus:shadow-[0_0_15px_rgba(255,215,0,0.5)] focus:outline-none transition-all font-semibold"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]">
                    <LucideIcon name="Search" size={14} className="stroke-[2.5]" />
                  </div>
                  
                  {/* 🎤 Voice Search */}
                  <button 
                    onClick={triggerVoiceSearch}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all ${
                      voiceSearching ? 'bg-red-100 text-red-600 animate-pulse' : 'text-[#D4AF37] hover:text-[#FFD700]'
                    }`}
                    title="Pencarian Suara"
                  >
                    <LucideIcon name="Mic" size={14} />
                  </button>
                </div>


                {/* Circular Action Buttons: 2 Icons Only (Bell & Language Swapped) */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button 
                    onClick={() => showToast('🔔 Tidak ada notifikasi baru.')}
                    className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors relative"
                    title="Notifikasi"
                  >
                    <LucideIcon name="Bell" size={18} className="text-white" />
                  </button>

                  {/* Premium Language Toggle (ID/EN) */}
                  <button 
                    onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
                    className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex flex-col items-center justify-center transition-all border border-white/20 cursor-pointer active:scale-95"
                    title={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
                  >
                    <LucideIcon name="Globe" size={15} className="text-white" strokeWidth={2} />
                    <span className="text-[8px] font-black uppercase text-amber-300 mt-0.5 leading-none">{lang}</span>
                  </button>
                </div>
              </div>
            </header>
          </div>

          {/* --- SCROLLABLE MAIN LAYOUT WITH CATEGORY MENU PRECISELY PLACED BELOW THE BANNER --- */}
          <main ref={mainScrollRef} onScroll={handleMainScroll} className="flex-1 overflow-y-auto flex flex-col scroll-smooth">
            
            {/* [A] PROMO BANNER CAROUSEL (AT THE TOP) */}
            {currentTab === 'Home' && banners.length > 0 ? (
              <div className="relative w-full h-44 overflow-hidden bg-neutral-900 group">
                {banners.map((banner, index) => (
                  <div 
                    key={banner.id}
                    onClick={() => handlePromoBannerClick(banner.productId)}
                    className={`absolute inset-0 w-full h-full transition-all duration-[1200ms] ease-in-out cursor-pointer ${
                      index === activeBannerIndex ? 'opacity-100 z-10 scale-100 translate-x-0' : 'opacity-0 z-0 scale-105 translate-x-3'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                    <img 
                      src={banner.image} 
                      alt={banner.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.currentTarget.src = getBannerPlaceholder(banner.title) }}
                    />
                    <div className="absolute bottom-5 left-4 right-4 z-20 text-white">
                      <h3 className="font-extrabold text-lg text-white leading-tight">{banner.title}</h3>
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-2.5 right-4 z-20 flex space-x-1.5">
                  {banners.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveBannerIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeBannerIndex ? 'bg-amber-400 w-4' : 'bg-white/45'}`}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {/* [B] STICKY CATEGORY MENU (PLACED PRECISELY BELOW THE BANNER, STICKY UNDER HEADER ON SCROLL) */}
            {currentTab === 'Home' && (
              <div className="sticky top-0 z-20 bg-white border-b border-gray-100 flex flex-col py-2 shadow-sm">
                <div className="flex overflow-x-auto px-3 gap-3 no-scrollbar scroll-smooth">
                  {(categories || []).map((cat, idx) => {
                    const isActive = selectedCategory === cat.name;
                    const isSemua = cat.name === 'Semua';

                    return (
                      <button
                        key={cat.name + '-' + idx}
                        onClick={() => isSemua ? setShowCategorySheet(true) : setSelectedCategory(cat.name)}
                        className="flex flex-col items-center flex-shrink-0 space-y-1 focus:outline-none"
                      >
                        <div 
                          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all border ${
                            isActive 
                              ? 'bg-[#703d92] text-white border-[#703d92]' 
                              : 'bg-white border-gray-200 text-gray-400'
                          }`}
                        >
                          <LucideIcon name={cat.icon} size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                        </div>
                        <span className={`text-[10px] tracking-tight font-bold ${isActive ? 'text-[#703d92]' : 'text-gray-500'}`}>
                          {translateCategory(cat.name)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* [C] PRODUCTS GRID HEADER & GRID */}
            {currentTab === 'Home' && (
              <div>
                <div className="px-4 pt-5 pb-2.5 flex items-center justify-between">
                  <h3 className="font-extrabold text-gray-800 text-base">Produk</h3>
                  <span className="text-xs text-gray-400 font-semibold">{filteredProducts.length} item</span>
                </div>

                {/* --- PRODUCT GRID (SHIMMER SKELETON CARDS FOR SMOOT LUXURY) --- */}
                {loading ? (
                  <div className="grid grid-cols-2 gap-2.5 px-3 pb-8">
                    {[1, 2, 3, 4].map(idx => (
                      <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col border border-gray-100/50 p-3.5 space-y-3 animate-pulse">
                        <div className="h-40 bg-purple-50/70 rounded-2xl w-full" />
                        <div className="h-3.5 bg-gray-100 rounded-md w-3/4" />
                        <div className="h-2.5 bg-gray-50 rounded-md w-1/2" />
                        <div className="flex justify-between items-center pt-2">
                          <div className="h-4 bg-purple-100/50 rounded-md w-1/3" />
                          <div className="h-3 bg-amber-50 rounded-md w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2.5 px-3 pb-8">
                    {filteredProducts.map(product => (
                      <div 
                        key={product.id} 
                        onClick={() => setSelectedProductDetail(product)} // Click whole card opens details!
                        className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col hover:shadow-md transition-all group relative cursor-pointer border border-gray-100/50 animate-fade-in"
                      >
                        {/* Discount Badge */}
                        {product.original_price && product.original_price > product.price && (
                          <span className="absolute top-3 left-3 z-20 bg-red-500 text-white font-black text-[9px] uppercase px-2.5 py-0.5 rounded-lg shadow-sm">
                            PROMO
                          </span>
                        )}
                        <div className="relative h-40 bg-gray-50 overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" onError={(e) => { e.currentTarget.src = getPlaceholderImage(product.name, product.category) }} />
                          <span className="absolute top-2.5 left-2.5 bg-[#703d92]/80 backdrop-blur-md text-white font-bold text-[8px] uppercase px-2 py-0.5 rounded-md">{product.category.toUpperCase()}</span>
                        </div>
                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div>
                            {/* V3.5 NORMAL FONT WEIGHT, NO BOLD */}
                            <h4 className="text-sm font-medium text-gray-800 leading-tight truncate">{product.name}</h4>
                            <p className="text-[10px] text-gray-400 mt-1 truncate block">{product.desc || 'Premium selected goods'}</p>
                          </div>
                          
                          <div className="mt-2 flex flex-col justify-end">

                            {/* Original Slashed Price */}
                            {product.original_price && product.original_price > product.price ? (
                              <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 line-through">Rp {product.original_price.toLocaleString('id-ID')}</span>
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-red-500 text-xs">Rp {product.price.toLocaleString('id-ID')}</span>
                                  <span className="text-[9px] font-black text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{(convertRpToPi(product.price)).toFixed(4)} π</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <div className="h-2" />
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-[#703d92] text-xs">Rp {product.price.toLocaleString('id-ID')}</span>
                                  <span className="text-[9px] font-black text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{(convertRpToPi(product.price)).toFixed(4)} π</span>
                                </div>
                              </div>
                            )}

                            
                            {/* V3.5 NEW INFO: Sold | Stock from database */}
                            <span className="text-[9px] text-gray-400 font-semibold mt-1">
                              {t('soldLabel')}: {product.sold || 0} | {t('stockLabel')}: {product.stock || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mx-4 mt-6 bg-white rounded-2xl p-8 text-center border border-purple-50">
                    <h4 className="font-bold text-sm text-gray-700">Produk Tidak Ditemukan</h4>
                  </div>
                )}
              </div>
            )}

            {/* --- PREMIUM LUXURY FOOTER (ADDS SCROLLABLE HEIGHT AND COMPLETES ESTHETICS!) --- */}
            {currentTab === 'Home' && (
              <div className="bg-[#2d1242] text-white p-4.5 mt-6 text-center space-y-2.5 border-t border-[#FFD700]/25 pb-16 flex-shrink-0 animate-fade-in relative z-10">
                <div className="w-10 h-10 bg-amber-500 text-white font-black text-lg rounded-full flex items-center justify-center mx-auto shadow-md shadow-amber-200/20">π</div>
                <h4 className="font-extrabold text-[#FFD700] text-sm tracking-widest uppercase">Toko Hana v3.7 Global</h4>
                <p className="text-[10px] text-purple-200 font-medium max-w-[280px] mx-auto leading-relaxed">
                  {lang === 'id' 
                    ? 'Warung digital premium terintegrasi ekosistem Pi Network. Melayani pembayaran Rupiah & Pi Coin secara resmi.'
                    : 'Premium digital stall integrated with Pi Network ecosystem. Supporting Rupiah & Pi Coin payments globally.'
                  }
                </p>
                <div className="text-[8px] text-purple-300 font-bold uppercase tracking-wider pt-2 border-t border-purple-800/40">
                  © 2026 Toko Hana • Solo Host Event Ecosystem
                </div>
              </div>
            )}

            {/* Other Tabs */}
            {currentTab === 'Promo' && (
              <div className="animate-fade-in pb-6 p-4">
                <div className="flex items-center space-x-2 mb-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 p-3 rounded-2xl">
                  <LucideIcon name="Tag" className="text-red-500 animate-pulse" size={20} />
                  <div>
                    <h3 className="font-bold text-sm text-red-600">Promo Spesial Diskon Gila</h3>
                    <p className="text-[10px] text-gray-500">Hemat uang jajan belanja digital & harian warung!</p>
                  </div>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3.5">
                    {filteredProducts.map(product => (
                      <div key={product.id} onClick={() => setSelectedProductDetail(product)} className="bg-white rounded-2xl overflow-hidden border border-red-100 flex flex-col relative cursor-pointer hover:shadow-lg transition-all animate-fade-in">
                        <span className="absolute top-3 left-3 z-20 bg-red-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow-md">Hemat</span>
                        <div className="relative h-40 bg-gray-50 overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = getPlaceholderImage(product.name, product.category) }} />
                        </div>
                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-medium text-sm text-gray-800 leading-tight truncate">{product.name}</h4>
                          </div>
                          <div className="mt-2 flex flex-col justify-end">
                            <span className="text-[10px] text-gray-400 line-through">Rp {product.original_price?.toLocaleString('id-ID')}</span>
                            <span className="font-extrabold text-red-600 text-sm">Rp {product.price.toLocaleString('id-ID')}</span>
                            <span className="text-[9px] text-gray-400 font-semibold mt-1">Terjual: {product.sold} | Stok: {product.stock}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-white rounded-2xl">Tidak ada promo aktif.</div>
                )}
              </div>
            )}

            {currentTab === 'Cart' && (
              <div className="animate-fade-in p-4 pb-8">
                <h3 className="font-black text-base text-[#703d92] mb-4">{t('cartTitle')}</h3>
                {cart.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border">{t('cartEmpty')}</div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.product.id} className="bg-white rounded-xl p-2.5 flex items-center gap-3 border shadow-sm">
                        <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-cover rounded" onError={(e) => { e.currentTarget.src = getPlaceholderImage(item.product.name, item.product.category) }} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-gray-800 truncate">{item.product.name}</h4>
                          <div className="font-extrabold text-xs text-[#703d92]">Rp {item.product.price.toLocaleString('id-ID')}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <button onClick={() => handleRemoveFromCart(item.product.id)} className="text-gray-300 hover:text-red-500"><LucideIcon name="Trash2" size={14} /></button>
                          <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-lg border">
                            <button onClick={() => handleUpdateCartQty(item.product.id, -1)} className="w-5 h-5 bg-white text-gray-600 rounded text-[10px] font-bold">-</button>
                            <span className="text-xs font-bold text-gray-700">{item.quantity}</span>
                            <button onClick={() => handleUpdateCartQty(item.product.id, 1)} className="w-5 h-5 bg-white text-gray-600 rounded text-[10px] font-bold">+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-white rounded-2xl p-4 border space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{lang === 'id' ? 'Subtotal Belanja' : 'Shopping Subtotal'}</span>
                        <span>Rp {cartSubtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{lang === 'id' ? 'Ongkir' : 'Shipping Fee'}</span>
                        <span>{deliveryFee === 0 ? (lang === 'id' ? 'Gratis' : 'Free') : `Rp ${deliveryFee.toLocaleString('id-ID')}`}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-sm font-extrabold text-gray-800">
                        <span>{t('totalLabel')}</span>
                        <span className="text-[#703d92]">Rp {cartTotal.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <form onSubmit={handleCheckoutWhatsApp} className="bg-white p-4 rounded-2xl space-y-3 text-xs border shadow-sm">
                      <input 
                        type="text" 
                        name="buyerName" 
                        required 
                        defaultValue={currentUser?.name || ''}
                        placeholder={t('formName') + ' *'} 
                        className="w-full border rounded-xl p-2.5" 
                      />
                      <input 
                        type="tel" 
                        name="buyerPhone" 
                        required 
                        defaultValue={currentUser?.phone || ''}
                        placeholder={t('formPhone') + ' *'} 
                        className="w-full border rounded-xl p-2.5" 
                      />
                      <textarea 
                        name="buyerAddress" 
                        required 
                        defaultValue={currentUser?.address || ''}
                        placeholder={t('formAddress') + ' *'} 
                        className="w-full border rounded-xl p-2.5"
                      ></textarea>
                      <select name="paymentMethod" required className="w-full border rounded-xl p-2.5 bg-white font-bold text-gray-800 focus:border-[#703d92] focus:outline-none">
                        <option value="Transfer QRIS">{lang === 'id' ? 'Transfer QRIS (Pindai QR)' : 'Transfer QRIS (Scan QR)'}</option>
                        <option value="Koin Pi">{lang === 'id' ? 'Bayar pakai Koin Pi (Pi Network)' : 'Pay with Pi Coin (Pi Network)'}</option>
                        <option value="COD">{lang === 'id' ? 'Bayar di Tempat (COD)' : 'Cash On Delivery (COD)'}</option>
                      </select>
                      <button type="submit" className="w-full bg-[#703d92] text-white font-bold py-3 rounded-xl shadow">{lang === 'id' ? 'Kirim Pesanan' : 'Place Order'}</button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* UNIFIED PROFIL / SMART AUTH PAGE */}
            {currentTab === 'Profil' && (
              <div className="animate-fade-in p-4 pb-8 text-xs">
                
                {/* A. If not logged in: UNIFIED LOGIN & SIGN-UP SCREEN */}
                {!currentUser ? (
                  <div className="bg-white rounded-2xl p-5 border shadow-md space-y-4">
                    
                    {/* Unified Selector Tabs (MASUK vs DAFTAR) */}
                    <div className="flex bg-[#F5F3F7] p-1.5 rounded-2xl">
                      <button 
                        onClick={() => setAuthActiveTab('login')}
                        className={`flex-1 py-2.5 rounded-xl text-center font-bold transition-all text-xs ${
                          authActiveTab === 'login' ? 'bg-[#703d92] text-white shadow' : 'text-gray-500 hover:text-[#703d92]'
                        }`}
                      >
                        {t('loginCustomer')}
                      </button>
                      <button 
                        onClick={() => setAuthActiveTab('register')}
                        className={`flex-1 py-2.5 rounded-xl text-center font-bold transition-all text-xs ${
                          authActiveTab === 'register' ? 'bg-[#703d92] text-white shadow' : 'text-gray-500 hover:text-[#703d92]'
                        }`}
                      >
                        {t('registerCustomer')}
                      </button>
                    </div>

                    {/* Tab [1] MASUK FORM */}
                    {authActiveTab === 'login' && (
                      <form onSubmit={handleUnifiedLogin} className="space-y-3.5">

                        
                        <div>
                          <label className="block text-gray-600 font-bold mb-1">{lang === 'id' ? 'Email / No. WhatsApp Pelanggan' : 'Email / WhatsApp Number'}</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="nama@email.com atau nomor telepon" 
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#703d92]" 
                          />
                        </div>

                        <div>
                          <label className="block text-gray-600 font-bold mb-1">{t('passwordLabel')}</label>
                          <div className="relative">
                            <input 
                              type={passwordVisible ? "text" : "password"} 
                              required 
                              placeholder="Masukkan kata sandi..." 
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              className="w-full border rounded-xl pl-3 pr-10 py-3 focus:outline-none focus:border-[#703d92]" 
                            />
                            <button 
                              type="button" 
                              onClick={() => setPasswordVisible(!passwordVisible)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                              <LucideIcon name={passwordVisible ? "EyeOff" : "Eye"} size={14} />
                            </button>
                          </div>
                        </div>

                        <button type="submit" className="w-full bg-[#703d92] hover:bg-[#553C9A] text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-xs">
                          {t('loginBtn')}
                        </button>
                      </form>
                    )}

                    {/* Tab [2] DAFTAR FORM (CUSTOMER SIGN UP) */}
                    {authActiveTab === 'register' && (
                      <form onSubmit={handleCustomerSignUp} className="space-y-3.5">
                        <div>
                          <label className="block text-gray-600 font-bold mb-1">Nama Lengkap *</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="Contoh: Budi Santoso" 
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#703d92]" 
                          />
                        </div>

                        <div>
                          <label className="block text-gray-600 font-bold mb-1">Email Aktif *</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="nama@email.com" 
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#703d92]" 
                          />
                        </div>

                        <div>
                          <label className="block text-gray-600 font-bold mb-1">No. WhatsApp/HP *</label>
                          <input 
                            type="tel" 
                            required 
                            placeholder="Contoh: 08123456789" 
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value)}
                            className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#703d92]" 
                          />
                        </div>

                        <div>
                          <label className="block text-gray-600 font-bold mb-1">Alamat Lengkap Pengiriman *</label>
                          <textarea 
                            required 
                            placeholder="Blok, No. Rumah, RT/RW, Kelurahan, Kecamatan" 
                            value={authAddress}
                            onChange={(e) => setAuthAddress(e.target.value)}
                            className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#703d92]"
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-gray-600 font-bold mb-1">Buat Kata Sandi *</label>
                          <input 
                            type="password" 
                            required 
                            placeholder="Minimal 6 karakter..." 
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className="w-full border rounded-xl p-3 focus:outline-none focus:border-[#703d92]" 
                          />
                        </div>

                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-xs">
                          {t('registerBtn')}
                        </button>
                      </form>
                    )}

                  </div>
                ) : (
                  
                  // B. If logged in as CUSTOMER: CUSTOMER DASHBOARD (Halaman Pelanggan)
                  <div className="space-y-4 animate-fade-in">
                    
                    {/* User Profile Card */}
                    <div className="bg-gradient-to-tr from-[#703d92] to-[#8e51b8] text-white p-5 rounded-3xl shadow-md text-center relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/5 rounded-full" />
                      <div className="absolute -left-10 -bottom-10 w-28 h-28 bg-white/5 rounded-full" />
                      
                      <div className="relative w-16 h-16 bg-amber-400 rounded-full mx-auto flex items-center justify-center shadow-lg border-2 border-white/20">
                        <LucideIcon name="User" className="text-[#703d92]" size={28} />
                      </div>
                      <h3 className="font-extrabold text-base mt-2">{currentUser.name}</h3>
                      <p className="text-[10px] text-purple-200 font-black uppercase tracking-wider">{lang === 'id' ? 'Pelanggan Setia Toko Hana' : 'Toko Hana Loyal Customer'}</p>
                    </div>

                    {/* Edit Profile Form */}
                    <div className="bg-white rounded-2xl p-4 border shadow-sm">
                      <h4 className="font-extrabold text-[#703d92] border-b pb-2 mb-3 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <LucideIcon name="User" size={13} />
                        <span>{lang === 'id' ? 'Data Profil Saya' : 'My Profile Details'}</span>
                      </h4>
                      <form onSubmit={handleUpdateCustomerProfile} className="space-y-3">
                        <div>
                          <label className="block text-gray-500 font-bold mb-1">{t('fullName')}</label>
                          <input type="text" name="profileName" required defaultValue={currentUser.name} className="w-full border rounded-xl p-2.5 font-medium" />
                        </div>
                        <div>
                          <label className="block text-gray-500 font-bold mb-1">{t('phoneLabel')}</label>
                          <input type="tel" name="profilePhone" required defaultValue={currentUser.phone} className="w-full border rounded-xl p-2.5 font-medium" />
                        </div>
                        <div>
                          <label className="block text-gray-500 font-bold mb-1">Alamat Pengiriman Default</label>
                          <textarea name="profileAddress" required rows="2" defaultValue={currentUser.address} className="w-full border rounded-xl p-2.5 font-medium"></textarea>
                        </div>
                        <button type="submit" className="bg-[#703d92] text-white font-bold py-2 px-5 rounded-xl">Simpan Perubahan</button>
                      </form>
                    </div>

                    {/* Riwayat Belanja Saya (Order History Tracker) */}
                    <div className="bg-white rounded-2xl p-4 border shadow-sm">
                      <h4 className="font-extrabold text-[#703d92] border-b pb-2 mb-3 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <LucideIcon name="ShoppingCart" size={13} />
                        <span>Riwayat Belanja Saya ({customerOrdersList.length})</span>
                      </h4>
                      
                      {customerOrdersList.length === 0 ? (
                        <p className="text-gray-400 text-center py-4 font-semibold">Anda belum pernah melakukan pemesanan.</p>
                      ) : (
                        <div className="space-y-3">
                          {customerOrdersList.map(o => (
                            <div key={o.id} className="p-3 border rounded-2xl bg-gray-50 space-y-1 text-[11px]">
                              <div className="flex items-center justify-between font-bold">
                                <span className="text-gray-700">{o.id}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase ${
                                  o.status === 'Selesai' ? 'bg-green-100 text-green-700' : o.status === 'Diproses' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                }`}>{o.status}</span>
                              </div>
                              <div className="text-[10px] text-gray-400">Tanggal: {o.date} | Metode: {o.payment_method}</div>
                              
                              <div className="border-t border-dashed py-1.5 my-1 text-[10px] text-gray-500 space-y-0.5">
                                {o.items?.map((item, idx) => (
                                  <div key={idx}>- {item.product_name} (x{item.quantity})</div>
                                ))}
                              </div>

                              <div className="flex justify-between font-extrabold text-gray-700">
                                <span>Total Bayar:</span>
                                <span className="text-[#703d92]">Rp {o.total?.toLocaleString('id-ID')}</span>
                              </div>

                              {o.resi && (
                                <div className="bg-purple-50 p-2 rounded-xl border border-purple-100 mt-2 text-[9px]">
                                  <span className="font-bold text-[#703d92] block">Info Pengiriman:</span>
                                  <span>Kurir: <strong>{o.kurir}</strong> | No. Resi: <strong>{o.resi}</strong></span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={handleLogout}
                      className="w-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 font-bold py-3 rounded-xl transition-all text-center"
                    >
                      Keluar dari Akun
                    </button>

                  </div>
                )}

              </div>
            )}
          </main>

          {/* Floating Back to Top Button (Snug, Transparent Glassmorphic, shown only when scrolled to bottom) */}
          <button
            onClick={scrollToTop}
            className={`absolute bottom-20 right-4 z-40 bg-black/40 backdrop-blur-md border border-white/10 text-[#FFD700] hover:bg-black/60 w-11 h-11 rounded-full flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all duration-300 ${
              showBackToTop ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-4 pointer-events-none'
            }`}
            title="Kembali ke Atas"
          >
            <LucideIcon name="ChevronUp" size={18} className="text-[#FFD700]" strokeWidth={2.5} />
            <span className="text-[7px] font-black text-[#FFD700] uppercase leading-none mt-0.5">Top</span>
          </button>
        </div>
      ) : (
        
        // --- 2. BACKOFFICE FULL SCREEN VIEW WITH CRASH PROTECTION (`/admin` page) ---
        <div className="flex-1 flex flex-col bg-[#F5F3F7] animate-fade-in text-xs">
          {/* Header Backoffice */}
          <div className="bg-gradient-to-r from-[#703d92] to-[#553C9A] text-white px-4 py-3 flex items-center justify-between shadow-md flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white p-1 rounded-lg">
                <img src={BRAND_LOGO_DATA_URI} alt="Tas Ungu H" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-extrabold">Backoffice Toko Hana</h3>
                <p className="text-[8px] text-purple-200">CTO Dashboard v3.5</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => { setCurrentTab('Home'); window.location.hash = '#'; }}
                className="text-[10px] bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 text-white border border-white/10"
              >
                <LucideIcon name="Home" size={12} />
                <span>{lang === 'id' ? 'Ke Toko' : 'Go to Shop'}</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="text-[10px] bg-red-500/80 hover:bg-red-600 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 text-white border border-red-400/20 active:scale-95 transition-all"
              >
                <LucideIcon name="LogOut" size={12} />
                <span>{lang === 'id' ? 'Keluar' : 'Logout'}</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Dashboard */}
          <div className="grid grid-cols-3 gap-2 p-3.5 bg-white border-b shadow-sm text-center flex-shrink-0">
            <div className="bg-purple-50 rounded-xl p-2 border border-purple-100">
              <span className="text-[8px] text-gray-500 block uppercase font-bold">Omzet Hari Ini</span>
              <span className="text-xs font-extrabold text-[#703d92]">Rp {(financeRecap?.omzetHariIni || 0).toLocaleString('id-ID')}</span>
            </div>
            <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-100">
              <span className="text-[8px] text-gray-500 block uppercase font-bold">Omzet Minggu Ini</span>
              <span className="text-xs font-extrabold text-emerald-700">Rp {(financeRecap?.omzetMingguan || 0).toLocaleString('id-ID')}</span>
            </div>
            <div className="bg-blue-50 rounded-xl p-2 border border-blue-100">
              <span className="text-[8px] text-gray-500 block uppercase font-bold">Sukses</span>
              <span className="text-xs font-extrabold text-blue-700">{financeRecap?.totalTransactions || 0} Order</span>
            </div>
          </div>

          {/* Tab Menu Backoffice - 5 Menu + Branding Setting */}
          <div className="flex overflow-x-auto bg-white p-1.5 gap-1.5 no-scrollbar border-b flex-shrink-0">
            {[
              { id: 'produk', label: 'Produk', icon: 'ShoppingBag' },
              { id: 'kategori', label: 'Kategori', icon: 'LayoutGrid' },
              { id: 'pelanggan', label: 'Pelanggan', icon: 'User' },
              { id: 'orderan', label: 'Orderan', icon: 'ShoppingCart' },
              { id: 'pengiriman', label: 'Pengiriman', icon: 'Truck' },
              { id: 'keuangan', label: 'Keuangan', icon: 'TrendingUp' },
              { id: 'branding', label: 'Branding', icon: 'Cpu' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAdminActiveSubMenu(tab.id)}
                className={`px-3 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  adminActiveSubMenu === tab.id 
                    ? 'bg-[#703d92] text-white border-[#703d92] shadow-sm' 
                    : 'bg-[#F5F3F7] text-gray-600 border-transparent'
                }`}
              >
                <LucideIcon name={tab.icon} size={11} className={adminActiveSubMenu === tab.id ? 'text-amber-300' : 'text-[#703d92]'} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Subview Area */}
          <div className="flex-1 p-3 overflow-y-auto pb-8">
            
            {/* [1] MANAJEMEN PRODUK */}
            {adminActiveSubMenu === 'produk' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 border shadow-sm">
                  <h4 className="font-extrabold text-xs text-[#703d92] uppercase tracking-wider mb-3">
                    {editingProduct ? '✏️ Edit Produk' : '✨ Tambah Produk Baru'}
                  </h4>

                  <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                    <input type="text" required value={prodForm.name} onChange={(e) => setProdForm({...prodForm, name: e.target.value})} placeholder="Nama Produk *" className="w-full border rounded-xl p-2.5" />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" required value={prodForm.price} onChange={(e) => setProdForm({...prodForm, price: e.target.value})} placeholder="Harga Promo *" className="w-full border rounded-xl p-2.5" />
                      <input type="number" value={prodForm.original_price} onChange={(e) => setProdForm({...prodForm, original_price: e.target.value})} placeholder="Harga Slashed" className="w-full border rounded-xl p-2.5" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" required value={prodForm.stock} onChange={(e) => setProdForm({...prodForm, stock: e.target.value})} placeholder="Stok *" className="w-full border rounded-xl p-2.5" />
                      <input type="number" required value={prodForm.sold} onChange={(e) => setProdForm({...prodForm, sold: e.target.value})} placeholder="Terjual *" className="w-full border rounded-xl p-2.5" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <select value={prodForm.category} onChange={(e) => setProdForm({...prodForm, category: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white cursor-pointer">
                        {categories.slice(1).map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                      <input type="url" required value={prodForm.image} onChange={(e) => setProdForm({...prodForm, image: e.target.value})} placeholder="URL Gambar *" className="w-full border rounded-xl p-2.5" />
                    </div>

                    <input type="text" required value={prodForm.desc} onChange={(e) => setProdForm({...prodForm, desc: e.target.value})} placeholder="Deskripsi Singkat 1 Baris *" className="w-full border rounded-xl p-2.5" />

                    <div className="flex gap-2 pt-1">
                      <button type="button" onClick={() => fillWithRandomUnsplash('product')} className="bg-purple-100 text-[#703d92] px-4 py-2.5 rounded-xl font-bold">Gambar Acak</button>
                      <button type="submit" className="flex-1 bg-[#703d92] text-white font-bold py-2.5 rounded-xl">{editingProduct ? 'Simpan' : 'Tambah'}</button>
                    </div>
                  </form>
                </div>

                <div className="bg-white rounded-2xl p-4 border shadow-sm">
                  <h4 className="font-extrabold text-xs text-[#703d92] uppercase tracking-wider mb-2">Daftar Produk ({(products || []).length})</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
                    {(products || []).map(p => (
                      <div key={p.id} className="flex items-center justify-between p-2 border rounded-xl hover:bg-gray-50 text-xs">
                        <div className="flex items-center space-x-2">
                          <img src={p.image} alt="" className="w-10 h-10 object-cover rounded border" onError={(e) => { e.currentTarget.src = getPlaceholderImage(p.name, p.category) }} />
                          <div className="min-w-0">
                            <h6 className="font-bold truncate w-32">{p.name}</h6>
                            <span className="text-[10px] text-gray-400">Rp {p.price.toLocaleString()} | Stok: {p.stock} | Terjual: {p.sold}</span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button onClick={() => handleEditProductClick(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><LucideIcon name="Edit" size={12} /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><LucideIcon name="Trash2" size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* [2] MANAJEMEN KATEGORI */}
            {adminActiveSubMenu === 'kategori' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 border shadow-sm text-xs">
                  <h4 className="font-extrabold text-xs text-[#703d92] uppercase tracking-wider mb-3">
                    {editingCategory ? '✏️ Edit Kategori' : '✨ Tambah Kategori Baru'}
                  </h4>
                  <form onSubmit={handleSaveCategory} className="space-y-3">
                    <input type="text" required value={catForm.name} onChange={(e) => setCatForm({...catForm, name: e.target.value})} placeholder="Nama Kategori *" className="w-full border rounded-xl p-2.5" />
                    
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Pilih Ikon Kategori</label>
                      <select value={catForm.icon} onChange={(e) => setCatForm({...catForm, icon: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white cursor-pointer">
                        <option value="LayoutGrid">LayoutGrid (Semua)</option>
                        <option value="Smartphone">Smartphone (Digital)</option>
                        <option value="ShoppingBag">ShoppingBag (Sembako)</option>
                        <option value="GlassWater">GlassWater (Minuman)</option>
                        <option value="Cookie">Cookie (Snack)</option>
                        <option value="Sparkles">Sparkles (Kosmetik)</option>
                        <option value="Soup">Soup (Makanan Instan)</option>
                        <option value="ChefHat">ChefHat (Bumbu Dapur)</option>
                        <option value="Home">Home (Rumah Tangga)</option>
                        <option value="Cigarette">Cigarette (Rokok 18+)</option>
                        <option value="Package">Package (Lainnya)</option>
                      </select>
                    </div>

                    <button type="submit" className="w-full bg-[#703d92] text-white font-bold py-2.5 rounded-xl">{editingCategory ? 'Simpan' : 'Tambah'}</button>
                  </form>
                </div>

                <div className="bg-white rounded-2xl p-4 border shadow-sm text-xs">
                  <h4 className="font-extrabold text-xs text-[#703d92] uppercase tracking-wider mb-2.5">Urutan & Manajemen Kategori</h4>
                  <div className="space-y-2">
                    {(categories || []).map((cat, idx) => (
                      <div key={cat.name + '-' + idx} className="flex items-center justify-between p-2 border rounded-xl">
                        <div className="flex items-center space-x-2">
                          <LucideIcon name={cat.icon} size={15} className="text-[#703d92]" />
                          <span className="font-bold text-gray-700">{cat.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button onClick={() => handleMoveCategory(idx, -1)} disabled={idx === 0} className="p-1 disabled:opacity-30 text-gray-500"><LucideIcon name="ChevronLeft" size={13} /></button>
                          <button onClick={() => handleMoveCategory(idx, 1)} disabled={idx === (categories || []).length - 1} className="p-1 disabled:opacity-30 text-gray-500"><LucideIcon name="ChevronRight" size={13} /></button>
                          <button onClick={() => handleEditCategoryClick(cat)} className="p-1 text-blue-600"><LucideIcon name="Edit" size={13} /></button>
                          <button onClick={() => handleDeleteCategory(cat.name)} className="p-1 text-red-600"><LucideIcon name="Trash2" size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* [3] MANAJEMEN PELANGGAN */}
            {adminActiveSubMenu === 'pelanggan' && (
              <div className="bg-white rounded-2xl p-4 border shadow-sm text-xs">
                <h4 className="font-extrabold text-xs text-[#703d92] uppercase tracking-wider mb-3">Daftar Pelanggan Setia</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
                  {(customers || []).map(c => (
                    <div key={c.id} className="p-3 border rounded-xl space-y-1 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-gray-800 text-xs">{c.name}</span>
                        <span className="bg-purple-100 text-[#703d92] font-black text-[9px] px-2 py-0.5 rounded-full">ID: {c.id}</span>
                      </div>
                      <div className="text-[10px] text-gray-500">📞 No. WA: {c.phone}</div>
                      <div className="text-[10px] text-gray-500">📍 Alamat: {c.address}</div>
                      <div className="text-[10px] text-gray-500">📅 Bergabung: {c.join_date}</div>
                      <div className="border-t border-dashed pt-1.5 mt-1.5 flex justify-between font-bold text-gray-700 text-[10px]">
                        <span>Kontribusi Omzet</span>
                        <span className="text-[#703d92]">Rp {(c.total_spending || 0).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* [4] MANAJEMEN ORDERAN */}
            {adminActiveSubMenu === 'orderan' && (
              <div className="bg-white rounded-2xl p-4 border shadow-sm text-xs">
                <h4 className="font-extrabold text-xs text-[#703d92] uppercase tracking-wider mb-3">Status Pemesanan</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
                  {(orders || []).map(o => (
                    <div key={o.id} className="p-3 border rounded-xl space-y-1 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-gray-800">{o.id}</span>
                        <span className={`font-black text-[8px] uppercase px-2 py-0.5 rounded-full ${
                          o.status === 'Selesai' ? 'bg-green-100 text-green-700' : o.status === 'Diproses' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>{o.status}</span>
                      </div>
                      <div className="text-[10px] font-bold text-gray-700">Pelanggan: {o.customer_name} ({o.phone})</div>
                      <div className="text-[10px] text-gray-500">Tanggal: {o.date} | Metode: {o.payment_method}</div>
                      <div className="text-[10px] text-gray-500">Alamat: {o.address}</div>
                      
                      <div className="border-t border-dashed my-1.5 pt-1.5">
                        <span className="text-[9px] text-gray-400 block font-bold">Daftar Barang Belanja:</span>
                        {(o.items || []).map((item, idx) => (
                          <div key={idx} className="text-[9px] text-gray-600 font-medium">
                            - {item.product_name || 'Item'} (x{item.quantity || 1}) = Rp {((item.quantity || 1) * (item.price || 0)).toLocaleString('id-ID')}
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-1.5 flex justify-between font-extrabold text-gray-700">
                        <span>Total Bayar:</span>
                        <span className="text-[#703d92]">Rp {(o.total || 0).toLocaleString('id-ID')}</span>
                      </div>

                      {/* Status changer buttons */}
                      {o.status === 'Baru' && (
                        <div className="flex gap-2 pt-2">
                          <button 
                            onClick={() => {
                              setOrders(prev => prev.map(order => order.id === o.id ? { ...order, status: 'Diproses' } : order));
                              showToast(`Order ${o.id} diproses!`);
                            }}
                            className="flex-1 bg-blue-600 text-white font-bold py-1.5 rounded-lg text-[10px]"
                          >
                            Proses Orderan
                          </button>
                        </div>
                      )}
                      
                      {o.status === 'Diproses' && (
                        <div className="flex gap-2 pt-2">
                          <button 
                            onClick={() => setSelectedOrderToShip(o)}
                            className="flex-1 bg-amber-500 text-white font-bold py-1.5 rounded-lg text-[10px]"
                          >
                            Kirim & Input Resi
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* [5] MANAJEMEN PENGIRIMAN */}
            {adminActiveSubMenu === 'pengiriman' && (
              <div className="space-y-4 text-xs">
                {selectedOrderToShip && (
                  <div className="bg-white rounded-2xl p-4 border shadow-sm">
                    <h4 className="font-extrabold text-[#703d92] mb-3">Input Pengiriman Order {selectedOrderToShip.id}</h4>
                    <form onSubmit={handleShipOrder} className="space-y-3">
                      <div>
                        <label className="block text-gray-600 font-bold mb-1">Kurir Pengiriman</label>
                        <select 
                          value={shipForm.kurir} 
                          onChange={(e) => setShipForm({ ...shipForm, kurir: e.target.value })}
                          className="w-full border rounded-xl p-2.5 bg-white cursor-pointer"
                        >
                          <option value="J&T Express">J&T Express</option>
                          <option value="JNE Reguler">JNE Reguler</option>
                          <option value="SiCepat Reguler">SiCepat Reguler</option>
                          <option value="GoSend / GrabExpress">GoSend / GrabExpress</option>
                          <option value="Kurir Toko Hana">Kurir Toko Hana</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-600 font-bold mb-1">Nomor Resi / Bukti Antar</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Masukkan no resi..." 
                          value={shipForm.resi} 
                          onChange={(e) => setShipForm({ ...shipForm, resi: e.target.value })}
                          className="w-full border rounded-xl p-2.5" 
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button type="button" onClick={() => setSelectedOrderToShip(null)} className="bg-gray-100 text-gray-600 font-bold py-2.5 px-4 rounded-xl">Batal</button>
                        <button type="submit" className="flex-1 bg-[#703d92] text-white font-bold py-2.5 rounded-xl">Kirim Paket</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="bg-white rounded-2xl p-4 border shadow-sm">
                  <h4 className="font-extrabold text-xs text-[#703d92] uppercase tracking-wider mb-3">Daftar Paket Terkirim</h4>
                  <div className="space-y-2">
                    {(orders || []).filter(o => o && o.status === 'Selesai' && o.resi).map(o => (
                      <div key={o.id} className="p-3 border rounded-xl bg-gray-50 space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span>{o.id}</span>
                          <span className="text-green-600 font-black uppercase text-[8px]">Terkirim</span>
                        </div>
                        <div className="text-[10px] text-gray-600 font-bold">Kurir: {o.kurir} | Resi: {o.resi}</div>
                        <div className="text-[10px] text-gray-400">Penerima: {o.customer_name} ({o.address})</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* [6] KEUANGAN DETAILED */}
            {adminActiveSubMenu === 'keuangan' && (
              <div className="bg-white rounded-2xl p-4 border shadow-sm text-xs space-y-4">
                <h4 className="font-extrabold text-xs text-[#703d92] uppercase tracking-wider mb-2">Rekap Keuangan Harian/Mingguan</h4>
                
                <div className="space-y-3">
                  <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                    <span className="text-gray-500 font-bold block uppercase text-[8px]">Perkiraan Omzet Hari Ini</span>
                    <h2 className="text-xl font-black text-[#703d92] mt-0.5">Rp {(financeRecap?.omzetHariIni || 0).toLocaleString('id-ID')}</h2>
                    <div className="w-full bg-purple-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#703d92] h-full rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <span className="text-gray-500 font-bold block uppercase text-[8px]">Perkiraan Omzet Minggu Ini</span>
                    <h2 className="text-xl font-black text-emerald-700 mt-0.5">Rp {(financeRecap?.omzetMingguan || 0).toLocaleString('id-ID')}</h2>
                    <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-black block mb-2">Riwayat Pendapatan Sukses</span>
                  <div className="space-y-2">
                    {(orders || []).filter(o => o && o.status === 'Selesai').map(o => (
                      <div key={o.id} className="flex items-center justify-between p-2 border rounded-xl">
                        <div className="min-w-0">
                          <h6 className="font-bold text-gray-700 text-[10px]">{o.id} - {o.customer_name}</h6>
                          <span className="text-[9px] text-gray-400">{o.date} | {o.payment_method}</span>
                        </div>
                        <span className="font-bold text-emerald-600 text-xs">+ Rp {(o.total || 0).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* [7] BRANDING & CONFIGURATION */}
            {adminActiveSubMenu === 'branding' && (
              <div className="space-y-4 text-xs">
                <div className="bg-white rounded-2xl p-4 border shadow-sm space-y-4">
                  <h4 className="font-extrabold text-xs text-[#703d92] uppercase tracking-wider border-b pb-2">
                    🖼️ Pengaturan Branding Warung
                  </h4>
                  
                  {/* Header pattern upload */}
                  <form onSubmit={handleSaveHeaderPattern} className="space-y-3">
                    <div>
                      <label className="block font-semibold text-gray-600 mb-1">URL Gambar Pattern Header (.png/.jpg)</label>
                      <input 
                        type="url" 
                        name="headerPattern"
                        defaultValue={headerPatternUrl}
                        placeholder="https://images.unsplash.com/... atau pattern url"
                        className="w-full border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-[#703d92]"
                      />
                      <p className="text-[9px] text-gray-400 mt-0.5">Biarkan kosong untuk menggunakan warna solid premium #703d92.</p>
                    </div>
                    <button 
                      type="submit"
                      className="bg-[#703d92] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-sm shadow-purple-100"
                    >
                      Terapkan Pattern Header
                    </button>
                  </form>

                  <div className="border-t border-gray-100 pt-3 mt-3"></div>

                  {/* QRIS Image Upload */}
                  <form onSubmit={handleSaveQrisImage} className="space-y-3">
                    <div>
                      <label className="block font-semibold text-gray-600 mb-1">URL Gambar QRIS Merchant</label>
                      <input 
                        type="url" 
                        name="qrisImage"
                        defaultValue={qrisImageUrl}
                        placeholder="https://link-gambar-qris-toko.com/qris.jpg"
                        className="w-full border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-[#703d92]"
                      />
                      <p className="text-[9px] text-gray-400 mt-0.5">Biarkan kosong untuk memuat QRIS instan cantik yang ter-render murni secara offline.</p>
                    </div>
                    <button 
                      type="submit"
                      className="bg-[#703d92] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-sm"
                    >
                      Terapkan Gambar QRIS
                    </button>
                  </form>

                  <div className="border-t border-gray-100 pt-3 mt-3"></div>

                  {/* Merchant WhatsApp Configuration */}
                  <form onSubmit={handleSaveWaNumber} className="space-y-3">
                    <div>
                      <label className="block font-semibold text-gray-600 mb-1">{lang === 'id' ? 'Nomor WhatsApp Merchant (Gunakan kode negara, misal: 62812...)' : 'Merchant WhatsApp Number (With country code, e.g., 62812...)'}</label>
                      <input 
                        type="text" 
                        name="waNumber"
                        defaultValue={merchantWaNumber}
                        placeholder="Contoh: 628122792099"
                        className="w-full border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-[#703d92] font-semibold text-gray-800"
                        required
                      />
                      <p className="text-[9px] text-gray-400 mt-0.5">{lang === 'id' ? 'Nomor inilah yang akan menerima semua pesan pesanan dari pembeli.' : 'This number will receive all order messages from buyers.'}</p>
                    </div>
                    <button 
                      type="submit"
                      className="bg-[#703d92] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-sm shadow-purple-100 active:scale-95 transition-all"
                    >
                      {lang === 'id' ? 'Simpan Nomor WhatsApp' : 'Save WhatsApp Number'}
                    </button>
                  </form>

                  <div className="border-t border-gray-100 pt-3 mt-3"></div>

                  {/* Pi Network Rate Configuration */}
                  <form onSubmit={handleSavePiRate} className="space-y-3">
                    <div>
                      <label className="block font-semibold text-gray-600 mb-1">{lang === 'id' ? 'Nilai Tukar 1 Pi dalam Rupiah (Rp)' : '1 Pi Exchange Rate in Rupiah (Rp)'}</label>
                      <input 
                        type="number" 
                        name="piRate"
                        defaultValue={piExchangeRate}
                        placeholder="Contoh: 2000000"
                        className="w-full border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-[#703d92] font-semibold text-gray-800"
                        required
                        min="1"
                        step="any"
                      />
                      <p className="text-[9px] text-gray-400 mt-0.5">
                        {lang === 'id' 
                          ? `Nilai konsensus saat ini: 1 Pi = Rp ${piExchangeRate.toLocaleString('id-ID')} (Rp 2.000 = ${(2000 / piExchangeRate).toLocaleString('en-US', {maximumFractionDigits: 6})} Pi).`
                          : `Current rate: 1 Pi = Rp ${piExchangeRate.toLocaleString('id-ID')} (Rp 2,000 = ${(2000 / piExchangeRate).toLocaleString('en-US', {maximumFractionDigits: 6})} Pi).`
                        }
                      </p>
                    </div>
                    <button 
                      type="submit"
                      className="bg-[#703d92] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-sm shadow-purple-100 active:scale-95 transition-all"
                    >
                      {lang === 'id' ? 'Simpan Nilai Tukar Pi' : 'Save Pi Exchange Rate'}
                    </button>
                  </form>

                  <div className="border-t border-gray-100 pt-3 mt-3"></div>

                  {/* 🎏 Promo Banners CRUD */}
                  <div className="space-y-3">
                    <h5 className="font-extrabold text-[#703d92] flex items-center gap-1.5 uppercase tracking-wider text-[11px] mt-2">
                      <LucideIcon name="Tag" size={13} />
                      <span>{lang === 'id' ? '🎏 Manajemen Banner Promosi' : '🎏 Promo Banners Management'}</span>
                    </h5>
                    
                    <form onSubmit={handleSaveBanner} className="space-y-3 bg-gray-50/50 p-3 rounded-2xl border border-dashed border-purple-200">
                      <h6 className="font-bold text-gray-700 text-[10px]">
                        {editingBanner ? (lang === 'id' ? '✏️ Edit Banner' : '✏️ Edit Banner') : (lang === 'id' ? '✨ Tambah Banner Baru' : '✨ Add New Banner')}
                      </h6>
                      
                      <div className="space-y-2">
                        <div>
                          <label className="block text-gray-500 font-bold mb-0.5">{lang === 'id' ? 'Judul Banner' : 'Banner Title'}</label>
                          <input 
                            type="text" 
                            value={bannerForm.title} 
                            onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})} 
                            placeholder={lang === 'id' ? 'Contoh: Diskon Sembako 50%' : 'e.g. 50% Off Groceries'} 
                            className="w-full border border-gray-200 rounded-xl p-2.5 bg-white focus:outline-none focus:border-[#703d92]" 
                            required 
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-500 font-bold mb-0.5">{lang === 'id' ? 'URL Gambar Banner' : 'Banner Image URL'}</label>
                          <div className="flex gap-1.5">
                            <input 
                              type="url" 
                              value={bannerForm.image} 
                              onChange={(e) => setBannerForm({...bannerForm, image: e.target.value})} 
                              placeholder="https://images.unsplash.com/..." 
                              className="flex-1 border border-gray-200 rounded-xl p-2.5 bg-white focus:outline-none focus:border-[#703d92]" 
                              required 
                            />
                            <button 
                              type="button" 
                              onClick={() => fillWithRandomUnsplash('banner')} 
                              className="bg-purple-100 text-[#703d92] px-3.5 rounded-xl text-[10px] font-extrabold hover:bg-purple-200"
                              title="Isi Gambar Acak"
                            >
                              Random
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-500 font-bold mb-0.5">{lang === 'id' ? 'Hubungkan ke Produk (Opsional)' : 'Link to Product (Optional)'}</label>
                          <select 
                            value={bannerForm.productId} 
                            onChange={(e) => setBannerForm({...bannerForm, productId: e.target.value})} 
                            className="w-full border border-gray-200 rounded-xl p-2.5 bg-white cursor-pointer focus:outline-none focus:border-[#703d92] font-semibold text-gray-700"
                          >
                            <option value="">{lang === 'id' ? '-- Pilih Produk untuk Ditautkan --' : '-- Select Product to Link --'}</option>
                            {(products || []).map(p => (
                              <option key={p.id} value={p.id}>{p.name} (Rp {p.price.toLocaleString('id-ID')})</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-[10px] shadow hover:bg-emerald-700 active:scale-95 transition-all">
                          {editingBanner ? (lang === 'id' ? 'Perbarui Banner' : 'Update Banner') : (lang === 'id' ? 'Simpan Banner' : 'Save Banner')}
                        </button>
                        {editingBanner && (
                          <button 
                            type="button" 
                            onClick={() => { setEditingBanner(null); setBannerForm({title: '', image: '', productId: ''}); }} 
                            className="bg-gray-200 text-gray-700 font-bold px-4 rounded-xl text-[10px] hover:bg-gray-300"
                          >
                            {lang === 'id' ? 'Batal' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Banner List */}
                    <div className="space-y-2 mt-3">
                      <label className="block text-gray-500 font-bold">{lang === 'id' ? 'Daftar Banner Aktif' : 'Active Banners List'}</label>
                      {(banners || []).length === 0 ? (
                        <p className="text-gray-400 italic text-center py-2">{lang === 'id' ? 'Belum ada banner.' : 'No banners available.'}</p>
                      ) : (
                        <div className="space-y-2">
                          {(banners || []).map(b => {
                            const linkedProduct = products.find(p => p.id === parseInt(b.productId));
                            return (
                              <div key={b.id} className="bg-white border rounded-xl p-2.5 flex items-center gap-3 shadow-sm">
                                <img src={b.image} alt="" className="w-12 h-10 object-cover rounded-lg border flex-shrink-0" onError={(e) => { e.currentTarget.src = getBannerPlaceholder(b.title) }} />
                                <div className="flex-1 min-w-0">
                                  <h6 className="font-extrabold text-gray-800 truncate text-[11px]">{b.title}</h6>
                                  <p className="text-[9px] text-[#703d92] font-extrabold truncate mt-0.5">
                                    {linkedProduct ? (lang === 'id' ? `🔗 Menuju: ${linkedProduct.name}` : `🔗 Links to: ${linkedProduct.name}`) : (lang === 'id' ? '❌ Tidak ditautkan' : '❌ No link')}
                                  </p>
                                </div>
                                <div className="flex gap-1.5 flex-shrink-0">
                                  <button type="button" onClick={() => handleEditBannerClick(b)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><LucideIcon name="Edit" size={12} /></button>
                                  <button type="button" onClick={() => handleDeleteBanner(b.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><LucideIcon name="Trash2" size={12} /></button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- EXTRA PREMIUM SEAMLESS CURVED CUTOUT BOTTOM NAVBAR (100% PIXEL PERFECT MATCH TO TEMA.PNG!) --- */}
      <div className="fixed bottom-0 left-0 right-0 sm:absolute z-30 h-20 flex flex-col justify-end select-none pointer-events-none">
        <div className="relative w-full h-16 pointer-events-auto">
          
          {/* Custom SVG Background to render the perfect physical cutout curve (dip/scoop) */}
          <div className="absolute inset-0 z-0 bg-transparent">
            <svg className="w-full h-20 text-[#703d92] drop-shadow-[0_-10px_24px_rgba(0,0,0,0.15)]" viewBox="0 0 400 64" preserveAspectRatio="none" style={{ transform: 'translateY(-16px)' }}>
              <path d="M 0 16 L 166 16 A 34 34 0 0 0 234 16 L 400 16 L 400 64 L 0 64 Z" fill="currentColor" />
            </svg>
          </div>

          {/* Interactive Navigation Elements aligned on top of the physical SVG background */}
          <nav className="relative z-10 flex items-center justify-around h-full pb-1 px-1">
            
            {/* Tab 1: Home */}
            <button
              onClick={() => { setCurrentTab('Home'); setSelectedCategory('Semua'); }}
              className="flex flex-col items-center justify-center flex-1 h-full focus:outline-none active:scale-95 transition-all"
            >
              <LucideIcon name="Home" size={20} className={currentTab === 'Home' ? 'text-[#FFD700]' : 'text-white'} strokeWidth={currentTab === 'Home' ? 2.5 : 2} />
              <span className="text-[9px] tracking-tight mt-1 font-bold text-white/80 active:text-[#FFD700]">
                Home
              </span>
            </button>

            {/* Tab 2: Promo */}
            <button
              onClick={() => { setCurrentTab('Promo'); setSelectedCategory('Semua'); }}
              className="flex flex-col items-center justify-center flex-1 h-full focus:outline-none active:scale-95 transition-all"
            >
              <LucideIcon name="Tag" size={20} className={currentTab === 'Promo' ? 'text-[#FFD700]' : 'text-white'} strokeWidth={2} />
              <span className="text-[9px] tracking-tight mt-1 font-bold text-white/80 active:text-[#FFD700]">
                Promo
              </span>
            </button>

            {/* Tab 3: QRIS (ELEVATED LARGE CENTER GRADIENT BUTTON - NO TEXT LABEL AS SHOWN IN THE IMAGE!) */}
            <div className="relative flex flex-col items-center justify-center flex-1 h-full">
              <button
                onClick={() => setShowQrisModal(true)}
                className="absolute bg-gradient-to-tr from-[#703d92] to-[#2d1242] text-[#FFD700] w-14 h-14 rounded-full shadow-[0_4px_16px_rgba(255,215,0,0.35)] border-4 border-[#FFD700] flex items-center justify-center active:scale-95 transition-all focus:outline-none"
                style={{ top: '-15px' }}
                title="Pindai QRIS Merchant"
              >
                <LucideIcon name="QrCode" size={22} className="text-[#FFD700]" strokeWidth={2.5} />
              </button>
            </div>

            {/* Tab 4: Cart */}
            <button
              onClick={() => setCurrentTab('Cart')}
              className="relative flex flex-col items-center justify-center flex-1 h-full focus:outline-none active:scale-95 transition-all"
            >
              <LucideIcon name="ShoppingCart" size={20} className={currentTab === 'Cart' ? 'text-[#FFD700]' : 'text-white'} strokeWidth={2} />
              <span className="text-[9px] tracking-tight mt-1 font-bold text-white/80 active:text-[#FFD700]">
                {lang === 'id' ? 'Keranjang' : 'Cart'}
              </span>
              {totalCartItems > 0 && (
                <span className="absolute top-1.5 right-3.5 bg-amber-400 text-[#2d1242] font-black text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#703d92]">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Tab 5: Admin / Profile (Saya) */}
            <button
              onClick={() => {
                if (currentUser && currentUser.role === 'customer') {
                  setCurrentTab('Profil');
                } else if (adminLoggedIn && currentTab === 'AdminPage') {
                  setCurrentTab('Profil');
                } else if (adminLoggedIn) {
                  setCurrentTab('AdminPage');
                  window.location.hash = '#/admin';
                } else {
                  setCurrentTab('Profil');
                  setAuthActiveTab('login');
                }
              }}
              className="flex flex-col items-center justify-center flex-1 h-full focus:outline-none active:scale-95 transition-all"
            >
              <LucideIcon name="User" size={20} className={currentTab === 'Profil' || currentTab === 'AdminPage' ? 'text-[#FFD700]' : 'text-white'} strokeWidth={2} />
              <span className="text-[9px] tracking-tight mt-1 font-bold text-white/80 active:text-[#FFD700]">
                {adminLoggedIn ? t('tabAdmin') : (currentUser ? (lang === 'id' ? 'Saya' : 'Me') : (lang === 'id' ? 'Saya' : 'Me'))}
              </span>
            </button>

          </nav>
        </div>
      </div>

      {/* --- BOTTOM SHEET MODAL: ALL CATEGORIES GRID --- */}
      {showCategorySheet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center animate-fade-in" onClick={() => setShowCategorySheet(false)}>
          <div 
            className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl animate-slide-up text-xs flex flex-col border-t border-purple-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h4 className="font-extrabold text-sm text-[#703d92] flex items-center gap-1.5">
                <LucideIcon name="LayoutGrid" size={15} />
                <span>Daftar Semua Kategori Warung</span>
              </h4>
              <button onClick={() => setShowCategorySheet(false)} className="p-1 bg-gray-100 rounded-full text-gray-500">
                <LucideIcon name="X" size={15} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 pb-6">
              {(categories || []).map((cat, idx) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name + '-sheet-' + idx}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setShowCategorySheet(false);
                      if (currentTab !== 'Home') setCurrentTab('Home');
                    }}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border transition-all ${
                      isSelected 
                        ? 'bg-purple-50 border-[#703d92] text-[#703d92] font-bold shadow-sm' 
                        : 'bg-[#F5F3F7] border-transparent text-gray-600'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border bg-white shadow-sm">
                      <LucideIcon name={cat.icon} size={16} className="text-[#703d92]" />
                    </div>
                    <span className="text-[9px] leading-tight font-extrabold truncate w-full">{translateCategory(cat.name)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- METODE QRIS PAY MODAL --- */}
      {showQrisModal && (() => {
        const [payTab, setPayTab] = React.useState('qris'); // qris | pi
        const walletAddress = "GCTK4HANA7666SOLOHOSTPIEVENTECOLOGY777777777777777";
        const copyWallet = () => {
          navigator.clipboard.writeText(walletAddress);
          showToast(lang === 'id' ? '📋 Alamat Wallet Pi berhasil disalin!' : '📋 Pi Wallet address copied!');
        };
        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowQrisModal(false)}>
            <div 
              className="w-full max-w-sm bg-white rounded-3xl p-5 flex flex-col items-center shadow-2xl animate-scale-up" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex items-center justify-between border-b pb-2 mb-3">
                <h4 className="font-extrabold text-sm text-[#703d92] flex items-center gap-1.5">
                  <LucideIcon name="Wallet" size={16} />
                  <span>{lang === 'id' ? 'Pintu Pembayaran Global' : 'Global Payment Gateway'}</span>
                </h4>
                <button onClick={() => setShowQrisModal(false)} className="p-1 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200">
                  <LucideIcon name="X" size={15} />
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex bg-[#F5F3F7] p-1 rounded-xl w-full mb-4">
                <button 
                  type="button"
                  onClick={() => setPayTab('qris')} 
                  className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[10px] transition-all ${payTab === 'qris' ? 'bg-[#703d92] text-white shadow' : 'text-gray-500'}`}
                >
                  Indonesian QRIS
                </button>
                <button 
                  type="button"
                  onClick={() => setPayTab('pi')} 
                  className={`flex-1 py-1.5 rounded-lg text-center font-bold text-[10px] transition-all flex items-center justify-center gap-1 ${payTab === 'pi' ? 'bg-amber-500 text-white shadow' : 'text-gray-500'}`}
                >
                  🪙 Pi Network (Solo Host)
                </button>
              </div>

              {payTab === 'qris' ? (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full max-w-[240px] aspect-[1/1.3] bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border">
                    <img src={qrisImageUrl || getQRISDefaultImage()} alt="Merchant QRIS" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[9px] text-gray-400 font-semibold text-center mt-3.5 max-w-[220px]">
                    {lang === 'id' ? 'Pindai memakai m-Banking / e-Wallet Indonesia Anda.' : 'Scan using your Indonesian m-Banking or e-Wallet.'}
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 rounded-2xl border border-amber-200 w-full text-center space-y-2">
                    <div className="w-12 h-12 bg-amber-500 text-white font-black text-xl rounded-full flex items-center justify-center mx-auto shadow-md shadow-amber-200">π</div>
                    <h5 className="font-extrabold text-amber-800 text-xs">{lang === 'id' ? 'Event Komunitas Pi - Solo Host' : 'Pi Community Event - Solo Host'}</h5>
                    <p className="text-[9px] text-amber-700 font-bold leading-relaxed">
                      {lang === 'id' ? 'Konversi Resmi: Rp 2.000 = 0.001 Pi (1 Pi = Rp 2.000.000)' : 'Official Rate: Rp 2,000 = 0.001 Pi (1 Pi = Rp 2,000,000)'}
                    </p>
                  </div>
                  
                  <div className="w-full mt-3">
                    <label className="block text-[10px] text-gray-500 font-bold mb-1">{lang === 'id' ? 'Alamat Wallet Pi Toko Hana:' : 'Toko Hana Pi Wallet Address:'}</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={walletAddress} 
                        className="flex-1 border bg-gray-50 rounded-lg p-2 text-[9px] font-mono text-gray-600 focus:outline-none select-all" 
                      />
                      <button 
                        type="button"
                        onClick={copyWallet} 
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 rounded-lg text-[10px] flex items-center"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-400 font-semibold text-center mt-3 max-w-[220px]">
                    {lang === 'id' ? 'Silakan buka Pi Browser Wallet Anda dan lakukan transfer sesuai total Pi yang tertera.' : 'Please open your Pi Browser Wallet and complete the transfer.'}
                  </p>
                </div>
              )}

              <button 
                type="button"
                onClick={() => setShowQrisModal(false)} 
                className="w-full mt-4 bg-gradient-to-r from-[#703d92] to-[#553C9A] text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md active:scale-95"
              >
                {lang === 'id' ? 'Selesai Pembayaran' : 'Finish Payment'}
              </button>
            </div>
          </div>
        );
      })()}

      {/* --- PRODUCT DETAIL MODAL --- */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center animate-fade-in" onClick={() => setSelectedProductDetail(null)}>
          <div className="w-full max-w-md bg-white rounded-t-3xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="bg-purple-100 text-[#703d92] font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">Detail Produk</span>
              <button onClick={() => setSelectedProductDetail(null)} className="p-1.5 bg-gray-100 text-gray-500 rounded-full"><LucideIcon name="X" size={16} /></button>
            </div>
            <img src={selectedProductDetail.image} alt={selectedProductDetail.name} className="w-full h-48 object-cover rounded-xl border border-gray-100 shadow-sm" onError={(e) => { e.currentTarget.src = getPlaceholderImage(selectedProductDetail.name, selectedProductDetail.category) }} />
            <div className="mt-4">
              <h3 className="font-extrabold text-base text-gray-800 leading-snug">{selectedProductDetail.name}</h3>
              <p className="text-xs text-gray-500 mt-1 font-medium">{selectedProductDetail.desc}</p>
              
              <div className="flex justify-between items-center border-t border-dashed mt-3 pt-3">
                <div className="flex flex-col text-xs text-gray-500">
                  <span>{t('categoryLabel')}: {translateCategory(selectedProductDetail.category)}</span>
                  <span className="font-bold text-[#703d92] mt-0.5">Stok: {selectedProductDetail.stock} | Terjual: {selectedProductDetail.sold}</span>
                </div>
                
                <div className="flex flex-col items-end">
                  {selectedProductDetail.original_price && selectedProductDetail.original_price > selectedProductDetail.price && (
                    <span className="text-[10px] text-gray-400 line-through">Rp {selectedProductDetail.original_price.toLocaleString()}</span>
                  )}
                  <span className="font-black text-base text-[#703d92]">Rp {selectedProductDetail.price.toLocaleString('id-ID')}</span>
                  <span className="font-black text-amber-500 text-xs bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 mt-1 flex items-center gap-1 shadow-sm">
                    🪙 {(convertRpToPi(selectedProductDetail.price)).toFixed(4)} π
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => { handleAddToCart(selectedProductDetail); setSelectedProductDetail(null); }}
              className="w-full mt-4 bg-gradient-to-r from-[#703d92] to-[#553C9A] text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md shadow-purple-100 active:scale-95"
            >
              <LucideIcon name="ShoppingCart" size={14} />
              <span>{t('addCartBtn')}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
