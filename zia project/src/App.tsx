import React, { useEffect, useMemo, useState } from 'react';
import heroVideo from './assets/hero.mp4';

type GenderFilter = 'All' | 'Men' | 'Women' | 'Unisex';
type CategoryFilter =
  | 'All'
  | 'Wallets'
  | 'Bags'
  | 'Watches'
  | 'Scarfs'
  | 'Phone Cases'
  | 'Eyewear & Belts';

interface AccessoryItem {
  id: string;
  name: string;
  tagline: string;
  gender: 'Men' | 'Women' | 'Unisex';
  category: Exclude<CategoryFilter, 'All'>;
  price: number;
  material: string;
  dimensions: string;
  warranty: string;
  edition?: string;
  image: string;
  finishes: string[];
}

interface BagEntry extends AccessoryItem {
  selectedFinish: string;
  quantity: number;
}

const ITEMS: AccessoryItem[] = [
  {
    id: 'w-01',
    name: 'Sovereign Full-Grain Bifold Wallet',
    tagline: 'Hand-burnished Italian calfskin with slim profile and RFID protection.',
    gender: 'Men',
    category: 'Wallets',
    price: 165,
    material: 'Full-Grain Italian Calfskin',
    dimensions: '11.2 cm × 8.8 cm × 1.1 cm (8 Card Slots)',
    warranty: '5-Year Leather Craft Guarantee',
    edition: 'Signature',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85',
    finishes: ['Obsidian', 'Espresso', 'Slate'],
  },
  {
    id: 'w-02',
    name: 'Atelier Quilted Zip Card Wallet',
    tagline: 'Supple lambskin compact wallet with brushed champagne-gold hardware.',
    gender: 'Women',
    category: 'Wallets',
    price: 145,
    material: 'Quilted Nappa Lambskin',
    dimensions: '10.8 cm × 8.2 cm × 2.0 cm (Zip Gusset)',
    warranty: '5-Year Leather Craft Guarantee',
    edition: 'New Season',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=85',
    finishes: ['Ivory', 'Burgundy', 'Noir'],
  },
  {
    id: 'w-03',
    name: 'Voyager Passport & Travel Folio',
    tagline: 'A refined travel companion with dedicated passport and boarding-pass sleeves.',
    gender: 'Unisex',
    category: 'Wallets',
    price: 225,
    material: 'Italian Pebbled Calfskin & Cotton Twill',
    dimensions: '14.2 cm × 10.5 cm • 4 Card Pockets',
    warranty: '5-Year Leather Craft Guarantee',
    edition: 'Travel Edit',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    finishes: ['Deep Navy', 'Cognac', 'Forest'],
  },
  {
    id: 'w-04',
    name: 'Aria Mini Leather Shoulder Bag',
    tagline: 'A softly structured silhouette with a secure zip and a detachable shoulder strap.',
    gender: 'Women',
    category: 'Bags',
    price: 395,
    material: 'Pebbled Italian Calfskin & Cotton Lining',
    dimensions: '24 cm × 17 cm × 8 cm • Detachable Strap',
    warranty: '5-Year Leather Craft Guarantee',
    edition: 'New Season',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85',
    finishes: ['Sea Glass', 'Black Cherry', 'Ivory'],
  },
  {
    id: 'ch-01',
    name: 'Chrono No. 04 Sapphire Dress Watch',
    tagline: '316L steel case, anti-reflective sapphire crystal & calfskin strap.',
    gender: 'Men',
    category: 'Watches',
    price: 420,
    material: '316L Surgical Steel & Sapphire Glass',
    dimensions: '40 mm Case Diameter • 7.8 mm Thin • 5 ATM',
    warranty: '3-Year International Movement Warranty',
    edition: 'Limited',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=85',
    finishes: ['Midnight / Black', 'Silver / Cognac'],
  },
  {
    id: 'ch-02',
    name: 'Lumiere Petite Gold Mesh Watch',
    tagline: 'Ultra-slim dress watch paired with a fluid woven Milanese strap.',
    gender: 'Women',
    category: 'Watches',
    price: 340,
    material: '18k Gold PVD Stainless Steel',
    dimensions: '30 mm Case Diameter • 6.4 mm Thin • 3 ATM',
    warranty: '3-Year International Movement Warranty',
    edition: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=85',
    finishes: ['Warm Gold', 'Rose Gold'],
  },
  {
    id: 'ch-03',
    name: 'Monolith Minimalist Field Watch',
    tagline: 'Architectural dial geometry and brushed titanium case for all-day wear.',
    gender: 'Unisex',
    category: 'Watches',
    price: 295,
    material: 'Grade-2 Brushed Titanium',
    dimensions: '38 mm Case Diameter • 7.2 mm Thin • 5 ATM',
    warranty: '3-Year International Movement Warranty',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
    finishes: ['Matte Black', 'Sandstone'],
  },
  {
    id: 'ch-04',
    name: 'Aster No. 08 Automatic Watch',
    tagline: 'An exhibition caseback reveals a finely finished automatic movement.',
    gender: 'Unisex',
    category: 'Watches',
    price: 685,
    material: '316L Stainless Steel & Sapphire Crystal',
    dimensions: '39 mm Case • 10.8 mm Thin • 10 ATM',
    warranty: '5-Year International Movement Warranty',
    edition: 'Atelier Reserve',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85',
    finishes: ['Midnight / Steel', 'Forest / Silver'],
  },
  {
    id: 'sc-01',
    name: 'Aurelia Pure Mulberry Silk Scarf',
    tagline: 'Luminous 18-momme silk with hand-rolled edges and fluid drape.',
    gender: 'Women',
    category: 'Scarfs',
    price: 185,
    material: '100% Grade-6A Mulberry Silk',
    dimensions: '90 cm × 90 cm Square Foulard',
    warranty: 'Authenticated Pure Silk Certificate',
    edition: 'Atelier',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',
    finishes: ['Pearl & Gold', 'Onyx & Cream'],
  },
  {
    id: 'sc-02',
    name: 'Valen Cashmere Blend Neck Scarf',
    tagline: 'Soft brushed weave offering structured warmth without bulk.',
    gender: 'Unisex',
    category: 'Scarfs',
    price: 210,
    material: '70% Inner Mongolian Cashmere, 30% Merino',
    dimensions: '185 cm × 34 cm with Fringed Ends',
    warranty: 'Lifetime Fiber Authenticity Guarantee',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=85',
    finishes: ['Oatmeal', 'Charcoal', 'Espresso'],
  },
  {
    id: 'sc-03',
    name: 'Serein Cashmere-Silk Evening Wrap',
    tagline: 'A feather-light cashmere and silk blend finished with delicate eyelash fringe.',
    gender: 'Women',
    category: 'Scarfs',
    price: 265,
    material: '55% Cashmere, 45% Mulberry Silk',
    dimensions: '200 cm × 70 cm • Hand-Finished Fringe',
    warranty: 'Lifetime Fiber Authenticity Guarantee',
    edition: 'Limited Weave',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=900&q=85',
    finishes: ['Cloud', 'Sage', 'Rosewood'],
  },
  {
    id: 'pc-01',
    name: 'Vanguard Leather MagSafe Case',
    tagline: 'Microfiber-lined leather shell with machined aluminum buttons.',
    gender: 'Unisex',
    category: 'Phone Cases',
    price: 85,
    material: 'Full-Grain Vegetable-Tanned Leather',
    dimensions: 'Precision Fit • 1.8 mm Raised Camera Bezel',
    warranty: '2-Year Structural Fit Warranty',
    edition: 'Essential',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=900&q=85',
    finishes: ['Graphite', 'Saddle Tan', 'Midnight'],
  },
  {
    id: 'pc-02',
    name: 'Velvet Folio Card Phone Case',
    tagline: 'Slim protective case with integrated daily card pocket.',
    gender: 'Women',
    category: 'Phone Cases',
    price: 92,
    material: 'Pebbled Calfskin & Suede Lining',
    dimensions: 'Holds 2 Cards • Wireless Charging Ready',
    warranty: '2-Year Structural Fit Warranty',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=85',
    finishes: ['Warm Taupe', 'Jet Black'],
  },
  {
    id: 'pc-03',
    name: 'Élan Sculpted Leather Phone Case',
    tagline: 'A slim, protective shell with a soft-touch lining and precise camera surround.',
    gender: 'Unisex',
    category: 'Phone Cases',
    price: 108,
    material: 'Vegetable-Tanned Leather & Microfiber',
    dimensions: 'Precision Fit • Wireless Charging Compatible',
    warranty: '2-Year Structural Fit Warranty',
    edition: 'New Season',
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=900&q=85',
    finishes: ['Deep Navy', 'Stone', 'Terracotta'],
  },
  {
    id: 'ex-01',
    name: 'Solstice Polarized Acetate Frames',
    tagline: 'Hand-cut Italian acetate frames with anti-glare polarized optics.',
    gender: 'Unisex',
    category: 'Eyewear & Belts',
    price: 195,
    material: 'Mazzucchelli Cellulose Acetate',
    dimensions: '51-20-145 mm • UV400 Polarized',
    warranty: '2-Year Optical & Hinge Warranty',
    edition: 'Iconic',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=85',
    finishes: ['Havana Tortoise', 'Piano Black'],
  },
  {
    id: 'ex-02',
    name: 'Lunette Round Acetate Sunglasses',
    tagline: 'Lightweight round frames with polarized lenses and refined metal temples.',
    gender: 'Unisex',
    category: 'Eyewear & Belts',
    price: 225,
    material: 'Italian Cellulose Acetate & Polarized Lenses',
    dimensions: '50-20-145 mm • UV400 Protection',
    warranty: '2-Year Optical & Hinge Warranty',
    edition: 'New Season',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85',
    finishes: ['Olive / Smoke', 'Black / Amber'],
  },
];

const GENDERS: GenderFilter[] = ['All', 'Men', 'Women', 'Unisex'];
const CATEGORIES: CategoryFilter[] = [
  'All',
  'Wallets',
  'Bags',
  'Watches',
  'Scarfs',
  'Phone Cases',
  'Eyewear & Belts',
];

const FAQ_CATEGORIES = [
  { id: 'products', title: 'Products & materials', description: 'Details & craftsmanship' },
  { id: 'orders', title: 'Orders & delivery', description: 'Bags, delivery & orders' },
  { id: 'care', title: 'Care & warranty', description: 'Keeping pieces beautiful' },
  { id: 'support', title: 'Returns & support', description: 'Help from our team' },
] as const;

type FaqCategoryId = (typeof FAQ_CATEGORIES)[number]['id'];

const FAQ_ITEMS: {
  id: string;
  category: FaqCategoryId;
  question: string;
  answer: string;
}[] = [
  {
    id: 'browse',
    category: 'products',
    question: 'What accessories can I find in the collection?',
    answer:
      'Explore wallets, bags, watches, scarves, phone cases, eyewear and belts. Use Shop by audience or Discover by category to find pieces that suit your style.',
  },
  {
    id: 'materials',
    category: 'products',
    question: 'Where can I see a piece’s materials, dimensions and warranty?',
    answer:
      'Open a product card and choose its details view to see the materials, dimensions and warranty information listed for that piece.',
  },
  {
    id: 'bag',
    category: 'orders',
    question: 'How do I add a piece to my bag?',
    answer:
      'Choose a finish on a product card, then select Add to Bag. You can update quantities in your bag. This storefront is a preview and checkout is not connected yet.',
  },
  {
    id: 'delivery',
    category: 'support',
    question: 'What are the delivery and return options?',
    answer:
      'Complimentary insured courier is noted for orders over $250. Return arrangements are not configured in this preview, so please contact client care for details before ordering.',
  },
  {
    id: 'care',
    category: 'care',
    question: 'How should I care for my accessory?',
    answer:
      'Care needs vary by material. Check the product details for its material and warranty, and contact client care if you need guidance for a particular piece.',
  },
];

export function App() {
  const [theme, setTheme] = useState<'coffee' | 'sage'>('coffee');
  const [gender, setGender] = useState<GenderFilter>('All');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [search, setSearch] = useState('');
  const [activeFinishes, setActiveFinishes] = useState<Record<string, string>>({});
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [bag, setBag] = useState<BagEntry[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<AccessoryItem | null>(null);
  const [displayItems, setDisplayItems] = useState(ITEMS);
  const [isFiltering, setIsFiltering] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [promoPaused, setPromoPaused] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState<FaqCategoryId | 'all'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('browse');
  const featuredItem = ITEMS[featuredIndex];

  const visibleItems = useMemo(() => {
    return ITEMS.filter((item) => {
      const okGender = gender === 'All' || item.gender === gender;
      const okCat = category === 'All' || item.category === category;
      const q = search.trim().toLowerCase();
      const okQuery =
        !q ||
        item.name.toLowerCase().includes(termOr(q)) ||
        item.category.toLowerCase().includes(q) ||
        item.gender.toLowerCase().includes(q) ||
        item.material.toLowerCase().includes(q);
      return okGender && okCat && okQuery;
    });
  }, [gender, category, search]);

  const filteredFaqs = useMemo(() => {
    const query = faqSearch.trim().toLowerCase();
    return FAQ_ITEMS.filter((faq) => {
      const matchesCategory = faqCategory === 'all' || faq.category === faqCategory;
      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [faqCategory, faqSearch]);

  useEffect(() => {
    if (!filteredFaqs.some((faq) => faq.id === openFaqId)) {
      setOpenFaqId(filteredFaqs[0]?.id ?? null);
    }
  }, [filteredFaqs, openFaqId]);

  useEffect(() => {
    const currentIds = displayItems.map((item) => item.id).join('|');
    const nextIds = visibleItems.map((item) => item.id).join('|');
    if (currentIds === nextIds) return;

    setIsFiltering(true);
    const timeout = window.setTimeout(() => {
      setDisplayItems(visibleItems);
      setIsFiltering(false);
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [displayItems, visibleItems]);

  useEffect(() => {
    if (!detailItem) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDetailItem(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [detailItem]);

  useEffect(() => {
    if (promoPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % ITEMS.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [promoPaused]);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (item: AccessoryItem) => {
    const finish = activeFinishes[item.id] || item.finishes[0];
    setBag((prev) => {
      const idx = prev.findIndex((x) => x.id === item.id && x.selectedFinish === finish);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { ...item, selectedFinish: finish, quantity: 1 }];
    });
    setBagOpen(true);
  };

  const handleQty = (id: string, finish: string, delta: number) => {
    setBag((prev) =>
      prev
        .map((x) =>
          x.id === id && x.selectedFinish === finish ? { ...x, quantity: x.quantity + delta } : x
        )
        .filter((x) => x.quantity > 0)
    );
  };

  const bagCount = bag.reduce((sum, x) => sum + x.quantity, 0);
  const bagSubtotal = bag.reduce((sum, x) => sum + x.price * x.quantity, 0);

  const goToCatalogue = (nextGender?: GenderFilter, nextCat?: CategoryFilter) => {
    if (nextGender) setGender(nextGender);
    if (nextCat) setCategory(nextCat);
    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="site-shell min-h-screen w-full bg-[#171716] text-stone-100" data-theme={theme}>
      <div className="ambient-background" aria-hidden="true" />
      <div className="site-content">
      {/* Top Luxury Bar */}
      <div className="announcement-bar w-full border-b border-white/10 bg-[#1d1d1b] px-4 py-2 text-center text-[11px] font-medium tracking-[0.22em] text-[#d5ccba]/90 uppercase">
        <div className="announcement-inner">
          <p className="announcement-copy">
            Complimentary Insured Courier Over $250 • Men, Women & Unisex Collections
          </p>
          <div className="theme-switcher" role="group" aria-label="Choose a colour palette">
            <button
              type="button"
              className={`theme-option${theme === 'coffee' ? ' is-active' : ''}`}
              aria-pressed={theme === 'coffee'}
              onClick={() => setTheme('coffee')}
            >
              <span className="theme-swatch coffee-swatch" aria-hidden="true" />
              Noir + Orange
            </button>
            <button
              type="button"
              className={`theme-option${theme === 'sage' ? ' is-active' : ''}`}
              aria-pressed={theme === 'sage'}
              onClick={() => setTheme('sage')}
            >
              <span className="theme-swatch sage-swatch" aria-hidden="true" />
              Coffee + Matcha
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="site-header sticky top-0 z-40 w-full border-b border-white/10 bg-[#171716]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-18 w-full max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setGender('All');
              setCategory('All');
              setSearch('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col"
          >
            <span className="font-luxury text-2xl font-bold tracking-[0.22em] text-white sm:text-3xl">
              ACCESSORABLE
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-xs font-semibold tracking-[0.16em] text-stone-300 uppercase lg:flex">
            {GENDERS.map((g) => (
              <button
                key={g}
                onClick={() => goToCatalogue(g, 'All')}
                className={`site-nav-link cursor-pointer py-1 transition hover:text-[#d9c79f] ${
                  gender === g ? 'is-selected' : ''
                }`}
              >
                {g}
              </button>
            ))}
            <span className="h-4 w-[1px] bg-white/15" />
            {(['Wallets', 'Bags', 'Watches', 'Scarfs', 'Phone Cases'] as CategoryFilter[]).map((c) => (
              <button
                key={c}
                onClick={() => goToCatalogue('All', c)}
                className={`site-nav-link cursor-pointer py-1 transition hover:text-[#d9c79f] ${
                  category === c ? 'is-selected' : ''
                }`}
              >
                {c}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="header-icon-button"
              aria-label="Search accessories"
              onClick={() => {
                document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('accessory-search')?.focus({ preventScroll: true });
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.3" />
                <path d="m15.5 15.5 4.2 4.2" />
              </svg>
            </button>
            <a
              className="header-icon-button account-link"
              href="mailto:care@accessorable.example"
              aria-label="Contact client care"
              title="Contact client care"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="3.3" />
                <path d="M5.5 20c.7-3.5 3-5.3 6.5-5.3s5.8 1.8 6.5 5.3" />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => setBagOpen(true)}
              className="btn-3d-gold header-bag-button cursor-pointer rounded-xl px-5 py-2.5 text-xs font-extrabold tracking-[0.16em] uppercase"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 8h14l1 12H4L5 8Z" />
                <path d="M9 9V6a3 3 0 0 1 6 0v3" />
              </svg>
              Bag ({bagCount})
            </button>
          </div>
        </div>
      </header>

      <section className="hero-section border-b border-white/10">
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="hero-background-video"
        />
        <div className="hero-video-shade" aria-hidden="true" />

        <div className="hero-layout mx-auto grid w-full max-w-[1600px] items-center px-6 lg:px-10">
          <div className="hero-copy space-y-5">
            <h1 className="hero-title font-luxury text-4xl leading-[1.06] font-semibold text-white sm:text-6xl">
              Quiet Luxury in <span className="italic text-[#d2bd8d]">Every Detail.</span>
            </h1>

            <p className="hero-description max-w-xl text-sm leading-relaxed text-stone-300 sm:text-base">
              Handcrafted wallets and leather bags, sapphire timepieces, pure silk and cashmere
              scarfs, and precision phone cases for Men, Women, and Unisex styling.
            </p>

            {/* 3D Action Buttons */}
            <div className="hero-actions flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => goToCatalogue('All', 'All')}
                className="btn-3d-gold cursor-pointer rounded-xl px-6 py-3 text-xs font-extrabold tracking-[0.18em] uppercase"
              >
                Explore Collection
              </button>
              <button
                onClick={() => goToCatalogue('Men', 'All')}
                className="btn-3d-dark cursor-pointer rounded-xl px-5 py-3 text-xs font-bold tracking-[0.16em] uppercase"
              >
                Men
              </button>
              <button
                onClick={() => goToCatalogue('Women', 'All')}
                className="btn-3d-dark cursor-pointer rounded-xl px-5 py-3 text-xs font-bold tracking-[0.16em] uppercase"
              >
                Women
              </button>
              <button
                onClick={() => goToCatalogue('Unisex', 'All')}
                className="btn-3d-dark cursor-pointer rounded-xl px-5 py-3 text-xs font-bold tracking-[0.16em] uppercase"
              >
                Unisex
              </button>
            </div>
          </div>

          <div className="hero-media-wrap flex flex-col items-end justify-end">
            <article
              key={featuredItem.id}
              className="featured-product-card"
              onMouseEnter={() => setPromoPaused(true)}
              onMouseLeave={() => setPromoPaused(false)}
              onFocus={() => setPromoPaused(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setPromoPaused(false);
                }
              }}
            >
              <img src={featuredItem.image} alt="" />
              <div className="featured-product-copy">
                <p>{featuredItem.category} · Featured piece</p>
                <h2>{featuredItem.name}</h2>
                <span>${featuredItem.price}</span>
                <div className="featured-product-actions">
                  <button type="button" onClick={() => setDetailItem(featuredItem)}>
                    Discover
                  </button>
                  <button
                    type="button"
                    aria-label={promoPaused ? 'Resume featured items' : 'Pause featured items'}
                    onClick={() => setPromoPaused((paused) => !paused)}
                  >
                    {promoPaused ? '▶' : 'Ⅱ'}
                  </button>
                  <button
                    type="button"
                    aria-label="Show next featured item"
                    onClick={() => setFeaturedIndex((current) => (current + 1) % ITEMS.length)}
                  >
                    →
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="audience-section" aria-labelledby="audience-title">
        <div className="home-section-heading">
          <p>Find your point of view</p>
          <h2 id="audience-title">Shop by audience</h2>
        </div>
        <div className="audience-grid">
          {(['Men', 'Women', 'Unisex'] as const).map((audience) => {
            const image =
              ITEMS.find((item) => item.gender === audience)?.image ?? ITEMS[0].image;

            return (
              <button
                type="button"
                key={audience}
                className="audience-card"
                onClick={() => goToCatalogue(audience, 'All')}
              >
                <img src={image} alt="" loading="lazy" />
                <span className="audience-card-shade" />
                <span className="audience-card-label">
                  <span>Explore the edit</span>
                  <strong>{audience}</strong>
                  <span aria-hidden="true">↗</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Trending and new-in product catalogue */}
      <main id="catalogue" className="catalogue mx-auto w-full max-w-[1400px] px-6 py-12 lg:px-10">
        {/* Header + Search */}
        <div className="catalogue-heading flex flex-col justify-between gap-4 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.25em] text-[#d2bd8d] uppercase">
              Trending · New In
            </p>
            <h2 className="font-luxury mt-1 text-3xl font-semibold text-white sm:text-4xl">
              Pieces worth keeping
            </h2>
            <p className="catalogue-count">{displayItems.length} considered pieces in this collection</p>
          </div>

          <input
            id="accessory-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wallet, watch, scarf, case..."
            aria-label="Search accessories"
            className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:border-[#d2bd8d] focus:outline-none md:w-72"
          />
        </div>

        {/* 3D Category & Department Control Panel */}
        <div className="catalogue-controls rounded-2xl border border-white/10 bg-[#1d1d1b] p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            {/* 3D Gender Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="mr-1 text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
                Department:
              </span>
              {GENDERS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`${
                    gender === g ? 'btn-3d-gold' : 'btn-3d-dark'
                  } cursor-pointer rounded-xl px-4 py-2 text-xs font-bold tracking-[0.14em] uppercase`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* 3D Accessory Category Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="mr-1 text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
                Category:
              </span>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`${
                    category === c ? 'btn-3d-gold' : 'btn-3d-dark'
                  } cursor-pointer rounded-xl px-4 py-2 text-xs font-bold tracking-[0.12em] uppercase`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Product Flash Cards Grid */}
        <div className={`product-grid mt-9 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4${isFiltering ? ' is-exiting' : ''}`}>
          {displayItems.length === 0 && (
            <div className="empty-state col-span-full rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-16 text-center">
              <p className="font-luxury text-3xl text-white">No pieces found</p>
              <p className="mt-2 text-sm text-stone-400">Try another search or clear your filters.</p>
              <button
                type="button"
                onClick={() => {
                  setGender('All');
                  setCategory('All');
                  setSearch('');
                }}
                className="btn-3d-dark mt-6 cursor-pointer rounded-xl px-5 py-2.5 text-xs font-bold tracking-[0.14em] uppercase"
              >
                Clear filters
              </button>
            </div>
          )}
          {displayItems.map((item, index) => {
            const selectedFinish = activeFinishes[item.id] || item.finishes[0];
            const isFlipped = !!flippedCards[item.id];

            return (
              <article
                key={item.id}
                tabIndex={0}
                aria-label={`View details for ${item.name}`}
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest('button, input, a')) return;
                  setDetailItem(item);
                }}
                onKeyDown={(event) => {
                  if (
                    (event.target as HTMLElement).closest('button, input, a') ||
                    (event.key !== 'Enter' && event.key !== ' ')
                  ) {
                    return;
                  }
                  event.preventDefault();
                  setDetailItem(item);
                }}
                className="flash-card flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                {!isFlipped ? (
                  /* FLASH CARD FRONT */
                  <div>
                    <div className="product-visual relative aspect-[4/4] w-full overflow-hidden bg-zinc-900">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="product-image h-full w-full object-cover object-center transition duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="rounded-lg border border-white/15 bg-black/75 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-stone-200 uppercase backdrop-blur-md">
                          {item.gender}
                        </span>
                        {item.edition && (
                          <span className="product-edition rounded-lg px-2.5 py-1 text-[10px] font-extrabold tracking-[0.14em] uppercase">
                            {item.edition}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFlip(item.id)}
                        className="absolute right-3 bottom-3 cursor-pointer rounded-lg border border-white/20 bg-black/75 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[#d9c79f] uppercase backdrop-blur-md transition hover:border-[#d2bd8d]"
                      >
                        Flip Specs ↻
                      </button>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-[0.18em] text-[#d2bd8d] uppercase">
                          {item.category}
                        </span>
                        <span className="text-base font-bold text-white">${item.price}</span>
                      </div>

                      <h3 className="font-luxury mt-1 text-2xl leading-snug font-semibold text-white">
                        {item.name}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-stone-400">
                        {item.tagline}
                      </p>
                      <p className="card-detail-hint">Select this piece to explore details ↗</p>

                      {/* Finish Chips */}
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {item.finishes.map((finish) => (
                          <button
                            key={finish}
                            type="button"
                            onClick={() =>
                              setActiveFinishes((prev) => ({ ...prev, [item.id]: finish }))
                            }
                            className={`finish-chip cursor-pointer rounded-lg px-2.5 py-1 text-[10px] font-medium transition ${
                              selectedFinish === finish
                                ? 'is-selected'
                                : 'border border-white/10 bg-white/[0.03] text-stone-400 hover:border-white/30 hover:text-white'
                            }`}
                          >
                            {finish}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* FLASH CARD BACK (TECHNICAL SPECS) */
                  <div className="product-specs-back flex h-full min-h-[410px] flex-col justify-between p-6">
                    <div>
                      <div className="product-specs-header flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#d2bd8d] uppercase">
                          Atelier Specification Card
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleFlip(item.id)}
                          className="cursor-pointer rounded-lg border border-white/15 px-2.5 py-1 text-[10px] font-semibold text-stone-300 hover:border-[#d2bd8d] hover:text-white"
                        >
                          Front ↺
                        </button>
                      </div>

                      <h3 className="font-luxury mt-4 text-2xl font-semibold text-white">
                        {item.name}
                      </h3>

                      <div className="mt-4 space-y-3 text-xs">
                        <div className="product-spec-field rounded-xl border border-white/10 bg-white/[0.03] p-3">
                          <p className="text-[10px] tracking-[0.16em] text-[#d2bd8d] uppercase">
                            Primary Material
                          </p>
                          <p className="mt-0.5 font-medium text-stone-200">{item.material}</p>
                        </div>

                        <div className="product-spec-field rounded-xl border border-white/10 bg-white/[0.03] p-3">
                          <p className="text-[10px] tracking-[0.16em] text-[#d2bd8d] uppercase">
                            Dimensions & Build
                          </p>
                          <p className="mt-0.5 font-medium text-stone-200">{item.dimensions}</p>
                        </div>

                        <div className="product-spec-field rounded-xl border border-white/10 bg-white/[0.03] p-3">
                          <p className="text-[10px] tracking-[0.16em] text-[#d2bd8d] uppercase">
                            Product Warranty
                          </p>
                          <p className="mt-0.5 font-medium text-stone-200">{item.warranty}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3D Add to Bag Button on Card Bottom */}
                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => handleAdd(item)}
                    className="btn-3d-gold w-full cursor-pointer rounded-xl py-3 text-xs font-extrabold tracking-[0.18em] uppercase"
                  >
                    Add to Bag — ${item.price}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <section className="category-discovery" aria-labelledby="category-title">
        <div className="home-section-heading">
          <p>Made for the everyday</p>
          <h2 id="category-title">Discover by category</h2>
        </div>
        <div className="category-discovery-grid">
          {(['Bags', 'Watches', 'Scarfs', 'Phone Cases', 'Eyewear & Belts'] as const).map(
            (type) => {
              const image =
                ITEMS.find((item) => item.category === type)?.image ?? ITEMS[0].image;

              return (
                <button
                  type="button"
                  className="category-tile"
                  key={type}
                  onClick={() => goToCatalogue('All', type)}
                >
                  <img src={image} alt="" loading="lazy" />
                  <span className="category-tile-shade" />
                  <span className="category-tile-label">
                    {type}
                    <span aria-hidden="true">↗</span>
                  </span>
                </button>
              );
            },
          )}
        </div>
      </section>

      <section
        className="service-strip"
        id="service-information"
        aria-label="Our service commitments"
      >
        <div className="service-item">
          <span className="service-icon" aria-hidden="true">✧</span>
          <div>
            <h3>Insured delivery</h3>
            <p>Complimentary on orders over $250</p>
          </div>
        </div>
        <div className="service-item">
          <span className="service-icon" aria-hidden="true">◇</span>
          <div>
            <h3>Considered materials</h3>
            <p>Details and craftsmanship in every piece</p>
          </div>
        </div>
        <div className="service-item">
          <span className="service-icon" aria-hidden="true">⌑</span>
          <div>
            <h3>Product warranties</h3>
            <p>Every item includes its own care guarantee</p>
          </div>
        </div>
        <div className="service-item">
          <span className="service-icon" aria-hidden="true">↗</span>
          <div>
            <h3>Personal client care</h3>
            <p>Questions? We are here to help</p>
          </div>
        </div>
      </section>

      <section className="faq-section" aria-labelledby="faq-title">
        <div className="faq-light-bars" aria-hidden="true" />
        <div className="faq-content">
          <div className="faq-intro">
            <span className="faq-tag">FAQ</span>
            <h2 id="faq-title">Frequently asked questions</h2>
            <p>
              Helpful answers about our pieces, materials, delivery and the shopping experience.
            </p>
            <a className="faq-contact-button" href="mailto:care@accessorable.example">
              Contact client care
            </a>
          </div>

          <label className="faq-search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.3" />
              <path d="m15.5 15.5 4.2 4.2" />
            </svg>
            <input
              type="search"
              value={faqSearch}
              onChange={(event) => setFaqSearch(event.target.value)}
              placeholder="Search your question"
              aria-label="Search frequently asked questions"
            />
          </label>

          <div className="faq-category-grid" aria-label="FAQ topics">
            {FAQ_CATEGORIES.map((topic) => {
              const articleCount = FAQ_ITEMS.filter((faq) => faq.category === topic.id).length;
              const isSelected = faqCategory === topic.id;

              return (
                <button
                  type="button"
                  className={`faq-category-card${isSelected ? ' is-selected' : ''}`}
                  key={topic.id}
                  aria-pressed={isSelected}
                  onClick={() =>
                    setFaqCategory((current) => (current === topic.id ? 'all' : topic.id))
                  }
                >
                  <span className="faq-category-icon" aria-hidden="true">
                    <svg viewBox="0 0 32 32">
                      {topic.id === 'products' && (
                        <>
                          <path d="M7 12h18l-1.6 14H8.6L7 12Z" />
                          <path d="M12 13V9a4 4 0 0 1 8 0v4" />
                          <path d="M12 19h8" />
                        </>
                      )}
                      {topic.id === 'orders' && (
                        <>
                          <path d="M5 10h14v12H5zM19 14h4l3 4v4h-7" />
                          <circle cx="10" cy="23" r="2" />
                          <circle cx="22" cy="23" r="2" />
                        </>
                      )}
                      {topic.id === 'care' && (
                        <>
                          <path d="M16 4 25 8v7c0 6-4 10-9 13-5-3-9-7-9-13V8l9-4Z" />
                          <path d="m12 16 3 3 6-7" />
                        </>
                      )}
                      {topic.id === 'support' && (
                        <>
                          <path d="M5 6h22v16H15l-7 5v-5H5z" />
                          <path d="M11 12h10M11 17h7" />
                        </>
                      )}
                    </svg>
                  </span>
                  <span className="faq-category-copy">
                    <strong>{topic.title}</strong>
                    <span>{articleCount} {articleCount === 1 ? 'answer' : 'answers'}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="faq-list">
            {filteredFaqs.length === 0 ? (
              <p className="faq-empty-state">No questions match your search.</p>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = faq.id === openFaqId;
                return (
                  <article className={`faq-item${isOpen ? ' is-open' : ''}`} key={faq.id}>
                    <h3>
                      <button
                        type="button"
                        className="faq-question"
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${faq.id}`}
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      >
                        <span>{faq.question}</span>
                        <span className="faq-chevron" aria-hidden="true" />
                      </button>
                    </h3>
                    <div
                      className={`faq-answer${isOpen ? ' is-open' : ''}`}
                      id={`faq-answer-${faq.id}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="faq-answer-inner">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="closing-cta" aria-labelledby="closing-title">
        <div className="closing-cta-inner">
          <div className="closing-copy">
            <span className="closing-pill">
              <span aria-hidden="true">✦</span>
              A considered point of view
            </span>
            <h2 id="closing-title">
              The art of the
              <br />
              <em>everyday.</em>
            </h2>
            <p>
              Discover enduring accessories shaped by thoughtful design, beautiful materials, and
              the small details that make a piece feel entirely your own.
            </p>
            <button
              type="button"
              onClick={() => goToCatalogue('All', 'All')}
              className="closing-cta-button"
            >
              Explore the collection <span aria-hidden="true">↗</span>
            </button>
          </div>

          <button
            type="button"
            className="closing-visual"
            onClick={() => setDetailItem(featuredItem)}
            aria-label={`Discover ${featuredItem.name}`}
          >
            <img src={featuredItem.image} alt="" />
            <span className="closing-visual-shade" />
            <span className="closing-visual-caption">
              <span>THE ATELIER EDIT</span>
              <strong>{featuredItem.category}</strong>
              <span aria-hidden="true">↗</span>
            </span>
          </button>
        </div>
      </section>

      <footer className="site-footer" id="footer">
        <div className="footer-grid">
          <div className="footer-brand" id="footer-brand">
            <a
              href="#"
              className="footer-brand-link"
              onClick={(event) => {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="footer-brand-mark" aria-hidden="true">
                A
              </span>
              <span>ACCESSORABLE</span>
            </a>
            <p>Considered accessories, made to accompany every version of you.</p>
            <div className="footer-socials" aria-label="Social channels">
              <span aria-label="Instagram coming soon" title="Instagram coming soon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle className="social-dot" cx="17.5" cy="6.8" r="1" />
                </svg>
              </span>
              <span aria-label="Pinterest coming soon" title="Pinterest coming soon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M10.2 17.8 12.8 6.7c.5-2.1 4.1-1.6 3.6.7-.4 1.8-1.5 4.9-3.1 5.4-1.1.4-2-.5-1.7-1.7" />
                </svg>
              </span>
              <span aria-label="YouTube coming soon" title="YouTube coming soon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 7.4a2.5 2.5 0 0 0-1.8-1.8C17.6 5.2 12 5.2 12 5.2s-5.6 0-7.2.4A2.5 2.5 0 0 0 3 7.4a26 26 0 0 0-.4 4.6 26 26 0 0 0 .4 4.6 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.2.4 7.2.4s5.6 0 7.2-.4a2.5 2.5 0 0 0 1.8-1.8 26 26 0 0 0 .4-4.6 26 26 0 0 0-.4-4.6Z" />
                  <path d="m10 15.2 5-3.2-5-3.2v6.4Z" />
                </svg>
              </span>
            </div>
          </div>

          <nav className="footer-column" aria-label="Shop">
            <h3>Shop</h3>
            <button type="button" onClick={() => goToCatalogue('All', 'All')}>All accessories</button>
            <button type="button" onClick={() => goToCatalogue('All', 'Wallets')}>Wallets</button>
            <button type="button" onClick={() => goToCatalogue('All', 'Bags')}>Bags</button>
            <button type="button" onClick={() => goToCatalogue('All', 'Watches')}>Watches</button>
          </nav>

          <nav className="footer-column" aria-label="Client care">
            <h3>Client care</h3>
            <a href="mailto:care@accessorable.example">Contact us</a>
            <a href="#service-information">FAQs</a>
            <a href="#service-information">Delivery</a>
            <a href="#service-information">Returns</a>
            <a href="#footer-privacy">Privacy</a>
            <a href="#footer-terms">Terms of service</a>
          </nav>

          <div className="footer-newsletter">
            <h3>A note from our atelier</h3>
            <p>New arrivals, considered stories, and occasional inspiration. Never noise.</p>
            <form
              className="newsletter-form"
              onSubmit={(event) => {
                event.preventDefault();
                setNewsletterMessage('Newsletter sign-up is coming soon.');
              }}
            >
              <label className="sr-only" htmlFor="footer-email">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
              <button type="submit" aria-label="Join the newsletter">↗</button>
            </form>
            <p className="newsletter-note" aria-live="polite">
              {newsletterMessage || 'A little beauty in your inbox. Unsubscribe anytime.'}
            </p>
          </div>
        </div>

        <div className="footer-policy">
          <details id="footer-privacy">
            <summary>Privacy</summary>
            <p>This storefront preview does not store newsletter or account information.</p>
          </details>
          <details id="footer-terms">
            <summary>Terms of service</summary>
            <p>Product and order features shown here are a storefront preview.</p>
          </details>
        </div>

        <div className="footer-signoff">
          <img
            className="footer-hand footer-hand-left"
            src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/4c029f38-d0a0-46d1-9ebc-3edcdaa11fc1.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
          <div className="footer-copyright">
            <span>© {new Date().getFullYear()} ACCESSORABLE</span>
            <span>Carry what matters.</span>
          </div>
          <img
            className="footer-hand footer-hand-right"
            src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/7eba3f06-a99e-44b8-bd46-7ccfaf6b2363.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
          <div className="footer-oversized-wordmark" aria-hidden="true">ACCESSORABLE</div>
        </div>
      </footer>

      {detailItem && (
        <div
          className="detail-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setDetailItem(null);
          }}
        >
          <section
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
          >
            <button
              type="button"
              className="detail-close btn-3d-dark"
              aria-label="Close product details"
              onClick={() => setDetailItem(null)}
            >
              ✕
            </button>
            <div className="detail-image-wrap">
              <img src={detailItem.image} alt={detailItem.name} />
              {detailItem.edition && <span className="detail-edition">{detailItem.edition}</span>}
            </div>
            <div className="detail-copy">
              <p className="detail-kicker">{detailItem.category} · {detailItem.gender}</p>
              <h2 id="detail-title">{detailItem.name}</h2>
              <p className="detail-description">{detailItem.tagline}</p>
              <p className="detail-price">${detailItem.price}</p>

              <div className="detail-finishes">
                <span>Choose your finish</span>
                <div>
                  {detailItem.finishes.map((finish) => {
                    const selectedFinish = activeFinishes[detailItem.id] || detailItem.finishes[0];
                    return (
                      <button
                        key={finish}
                        type="button"
                        aria-pressed={selectedFinish === finish}
                        className={selectedFinish === finish ? 'selected' : ''}
                        onClick={() =>
                          setActiveFinishes((prev) => ({ ...prev, [detailItem.id]: finish }))
                        }
                      >
                        {finish}
                      </button>
                    );
                  })}
                </div>
              </div>

              <dl className="detail-specs">
                <div>
                  <dt>Materials</dt>
                  <dd>{detailItem.material}</dd>
                </div>
                <div>
                  <dt>Dimensions & fit</dt>
                  <dd>{detailItem.dimensions}</dd>
                </div>
                <div>
                  <dt>Product warranty</dt>
                  <dd>{detailItem.warranty}</dd>
                </div>
              </dl>

              <p className="detail-shipping">Complimentary insured courier on orders over $250.</p>
              <button
                type="button"
                className="btn-3d-gold detail-add"
                onClick={() => {
                  handleAdd(detailItem);
                  setDetailItem(null);
                }}
              >
                Add to Bag — ${detailItem.price}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Shopping Bag Drawer */}
      {bagOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
          <div className="shopping-bag-drawer flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#1d1d1b]">
            <div className="shopping-bag-header flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="shopping-bag-title font-luxury text-2xl font-semibold text-white">
                Shopping Bag ({bagCount})
              </h2>
              <button
                onClick={() => setBagOpen(false)}
                className="btn-3d-dark cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold"
              >
                Close ✕
              </button>
            </div>

            <div className="flex-1 space-y-3.5 overflow-y-auto p-6">
              {bag.length === 0 ? (
                <p className="py-12 text-center text-xs tracking-wider text-stone-400 uppercase">
                  Your bag is currently empty.
                </p>
              ) : (
                bag.map((entry) => (
                  <div
                    key={`${entry.id}-${entry.selectedFinish}`}
                    className="shopping-bag-item flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3.5"
                  >
                    <img
                      src={entry.image}
                      alt={entry.name}
                      className="h-20 w-16 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between gap-2">
                          <h4 className="font-luxury text-lg font-semibold text-white">
                            {entry.name}
                          </h4>
                          <span className="shopping-bag-price text-xs font-bold text-[#d9c79f]">
                            ${entry.price * entry.quantity}
                          </span>
                        </div>
                        <p className="shopping-bag-variant text-[11px] text-stone-400">
                          {entry.gender} • {entry.selectedFinish}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => handleQty(entry.id, entry.selectedFinish, -1)}
                          className="shopping-bag-quantity h-6 w-6 cursor-pointer rounded border border-white/15 text-xs hover:border-[#d2bd8d]"
                        >
                          −
                        </button>
                        <span className="min-w-4 text-center text-xs">{entry.quantity}</span>
                        <button
                          onClick={() => handleQty(entry.id, entry.selectedFinish, 1)}
                          className="shopping-bag-quantity h-6 w-6 cursor-pointer rounded border border-white/15 text-xs hover:border-[#d2bd8d]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {bag.length > 0 && (
              <div className="shopping-bag-footer border-t border-white/10 p-6">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-stone-400">Subtotal</span>
                  <span className="shopping-bag-subtotal font-bold text-[#d9c79f]">
                    ${bagSubtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setBag([]);
                    setBagOpen(false);
                  }}
                  className="btn-3d-gold w-full cursor-pointer rounded-xl py-3.5 text-xs font-extrabold tracking-[0.18em] uppercase"
                >
                  Complete Order
                </button>
              </div>
            )}
            </div>
          </div>
      )}
      </div>
    </div>
  );
}

function termOr(q: string) {
  return q;
}

export default App;