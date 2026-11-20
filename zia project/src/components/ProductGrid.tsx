import React, { useState } from 'react';
import { Product } from '../types/product';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, variant: string) => void;
}

const CATEGORIES = ['All', 'Watches', 'Bags', 'Eyewear', 'Everyday Carry'] as const;

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((item) => item.category === selectedCategory);

  const handleVariantSelect = (productId: string, variant: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  };

  return (
    <section id="collection" className="border-t border-zinc-900 bg-zinc-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header & Category Filter */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
              Curated Essentials
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Featured Accessories
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-white text-zinc-950'
                    : 'border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const activeVariant = selectedVariants[product.id] || product.variants[0];

            return (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/40 transition hover:border-zinc-700"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                  />
                  {product.tag && (
                    <span className="absolute top-3 left-3 rounded-md bg-zinc-950/85 px-2.5 py-1 text-xs font-semibold text-amber-400 backdrop-blur-sm">
                      {product.tag}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-zinc-500">{product.category}</p>
                        <h3 className="mt-0.5 text-base font-semibold text-white">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-base font-bold text-white">${product.price}</p>
                    </div>

                    {/* Color / Variant Selector */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant}
                          onClick={() => handleVariantSelect(product.id, variant)}
                          className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                            activeVariant === variant
                              ? 'border border-amber-400 bg-amber-400/15 text-amber-300'
                              : 'border border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600'
                          }`}
                        >
                          {variant}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(product, activeVariant)}
                    className="mt-5 w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.99]"
                  >
                    Add to Cart • ${product.price}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};