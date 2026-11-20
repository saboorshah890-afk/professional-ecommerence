export type GenderCategory = 'All' | 'Men' | 'Women' | 'Unisex';
export type AccessoryType =
  | 'All Items'
  | 'Wallets'
  | 'Watches'
  | 'Scarfs'
  | 'Phone Cases'
  | 'Eyewear & Belts';

export interface LuxuryProduct {
  id: string;
  name: string;
  subtitle: string;
  gender: 'Men' | 'Women' | 'Unisex';
  type: Exclude<AccessoryType, 'All Items'>;
  price: number;
  finish: string;
  badge?: string;
  image: string;
  variants: string[];
}

export interface CartEntry extends LuxuryProduct {
  selectedVariant: string;
  quantity: number;
}

export const LUXURY_PRODUCTS: LuxuryProduct[] = [
  {
    id: 'acc-wlt-01',
    name: 'Sovereign Full-Grain Bifold Wallet',
    subtitle: 'Hand-stitched Italian calfskin with RFID lining',
    gender: 'Men',
    type: 'Wallets',
    price: 145,
    finish: 'Obsidian Calfskin',
    badge: 'Signature',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',
    variants: ['Obsidian Black', 'Espresso Brown', 'Slate Charcoal'],
  },
  {
    id: 'acc-wlt-02',
    name: 'Atelier Quilted Zip Card Wallet',
    subtitle: 'Compact luxury zip wallet with gold-tone hardware',
    gender: 'Women',
    type: 'Wallets',
    price: 130,
    finish: 'Supple Lambskin',
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80',
    variants: ['Champagne Ivory', 'Deep Burgundy', 'Noir'],
  },
  {
    id: 'acc-wch-01',
    name: 'Chrono No. 04 Sapphire Dress Watch',
    subtitle: 'Brushed 316L steel case with domed sapphire crystal',
    gender: 'Men',
    type: 'Watches',
    price: 380,
    finish: 'Brushed Steel & Leather',
    badge: 'Limited Edition',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80',
    variants: ['Midnight Dial / Black', 'Silver Dial / Cognac'],
  },
  {
    id: 'acc-wch-02',
    name: 'Lumiere Petite Gold Mesh Watch',
    subtitle: 'Ultra-slim dress timepiece with woven Milanese strap',
    gender: 'Women',
    type: 'Watches',
    price: 295,
    finish: '18k Gold PVD',
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80',
    variants: ['Warm Gold', 'Rose Gold', 'Two-Tone'],
  },
  {
    id: 'acc-wch-03',
    name: 'Monolith Minimalist Field Watch',
    subtitle: 'Clean architectural dial built for everyday versatility',
    gender: 'Unisex',
    type: 'Watches',
    price: 260,
    finish: 'Matte Titanium',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    variants: ['Matte Black', 'Sandstone'],
  },
  {
    id: 'acc-scf-01',
    name: 'Aurelia Pure Mulberry Silk Scarf',
    subtitle: 'Hand-rolled edges with fluid drape and subtle luster',
    gender: 'Women',
    type: 'Scarfs',
    price: 165,
    finish: '100% 18-Momme Silk',
    badge: 'Atelier Pick',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    variants: ['Pearl & Gold', 'Onyx & Cream', 'Terracotta'],
  },
  {
    id: 'acc-scf-02',
    name: 'Valen Cashmere Blend Neck Scarf',
    subtitle: 'Brushed luxury weave offering warmth without bulk',
    gender: 'Unisex',
    type: 'Scarfs',
    price: 190,
    finish: 'Cashmere & Merino',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=80',
    variants: ['Oatmeal', 'Charcoal Heather', 'Deep Espresso'],
  },
  {
    id: 'acc-phn-01',
    name: 'Vanguard Leather MagSafe Phone Case',
    subtitle: 'Microfiber-lined leather shell with anodized metal buttons',
    gender: 'Unisex',
    type: 'Phone Cases',
    price: 75,
    finish: 'Saddle & Smooth Leather',
    badge: 'Essential',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=900&q=80',
    variants: ['Graphite', 'Saddle Tan', 'Midnight'],
  },
  {
    id: 'acc-phn-02',
    name: 'Velvet Folio Case with Card Slot',
    subtitle: 'Slim protective case with integrated daily card pocket',
    gender: 'Women',
    type: 'Phone Cases',
    price: 82,
    finish: 'Pebbled Leather',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80',
    variants: ['Warm Taupe', 'Jet Black'],
  },
  {
    id: 'acc-ext-01',
    name: 'Solstice Acetate Polarized Sunglasses',
    subtitle: 'Hand-polished Italian acetate with anti-glare lenses',
    gender: 'Unisex',
    type: 'Eyewear & Belts',
    price: 185,
    finish: 'Hand-Cut Acetate',
    badge: 'Iconic',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80',
    variants: ['Havana Tortoise', 'Piano Black'],
  },
  {
    id: 'acc-ext-02',
    name: 'Crest Reversible Dress Belt',
    subtitle: '35mm precision strap with brushed rotating buckle',
    gender: 'Men',
    type: 'Eyewear & Belts',
    price: 135,
    finish: 'Full-Grain Leather',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=900&q=80',
    variants: ['Black / Tan', 'Espresso / Slate'],
  },
  {
    id: 'acc-ext-03',
    name: 'Loom Structured Travel Tech & Jewelry Case',
    subtitle: 'Padded compartments for watches, rings, cables & small essentials',
    gender: 'Unisex',
    type: 'Eyewear & Belts',
    price: 115,
    finish: 'Weathered Vegan Leather',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    variants: [' Obsidian', 'Sandstone'],
  },
];