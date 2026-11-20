import React from 'react';
import heroVideo from '../assets/hero.mp4';

export const Hero: React.FC = () => {
  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-[85vh] w-full items-center overflow-hidden bg-zinc-950 text-white">
      {/* Background Video */}
      <video
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center opacity-55"
      />

      {/* Dark Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900/70 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-amber-400 uppercase backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            New Collection • 2026
          </span>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:leading-[1.1]">
            Details That Define <br />
            <span className="bg-gradient-to-r from-white via-zinc-200 to-amber-300 bg-clip-text text-transparent">
              Your Everyday Carry.
            </span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-zinc-300 sm:text-lg">
            Precision-crafted watches, minimalist bags, and modern accessories built to elevate every outfit and daily routine.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={scrollToCollection}
              className="rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.98]"
            >
              Shop Collection
            </button>
            <button
              onClick={scrollToCollection}
              className="rounded-lg border border-white/20 bg-zinc-950/60 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/40 hover:bg-zinc-900"
            >
              Explore Essentials
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};