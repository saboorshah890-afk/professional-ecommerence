import React, { useState } from 'react';
import { CartItem } from '../types/product';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: string, variant: string, delta: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onClearCart,
}) => {
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      onClearCart();
      setOrderSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-950 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <h2 className="text-lg font-bold">Your Bag ({items.length})</h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white"
          >
            Close ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {orderSuccess ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-xl text-emerald-400">
                ✓
              </div>
              <h3 className="text-lg font-bold">Order Confirmed!</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Thank you for shopping with ACCESSORABLE.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm text-zinc-400">Your shopping bag is empty.</p>
              <button
                onClick={onClose}
                className="mt-4 rounded-lg bg-white px-5 py-2 text-xs font-semibold text-zinc-950"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedVariant}`}
                  className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-16 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold">{item.name}</h4>
                      <p className="text-xs text-zinc-400">Style: {item.selectedVariant}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQty(item.id, item.selectedVariant, -1)}
                          className="text-xs text-zinc-400 hover:text-white"
                        >
                          −
                        </button>
                        <span className="text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.selectedVariant, 1)}
                          className="text-xs text-zinc-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-bold">${item.price * item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Footer */}
        {items.length > 0 && !orderSuccess && (
          <form onSubmit={handleCheckout} className="border-t border-zinc-800 p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Subtotal</span>
              <span className="text-lg font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <input
              type="email"
              required
              placeholder="Enter email for order confirmation"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-amber-400 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-300"
            >
              Place Demo Order • ${subtotal.toFixed(2)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};