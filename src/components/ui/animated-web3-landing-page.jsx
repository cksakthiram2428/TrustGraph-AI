import React, { useState, useEffect } from "react";

export function Web3HeroAnimated() {
  // Reduced pillar count for performance
  const pillars = [92, 84, 78, 70, 62, 54, 46, 34, 18, 34, 46, 54, 62, 70, 78, 84, 92];

  // State to trigger animations once the component is mounted.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Reduced delay for faster perceived load
    const timer = setTimeout(() => setIsMounted(true), 30);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Inline styles for animations – kept minimal to avoid render‑blocking */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes subtlePulse {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50%      { opacity: 1; transform: scale(1.03); }
          }
          .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        `}
      </style>

      <section className="relative isolate h-screen overflow-hidden bg-black text-white">
        {/* ================== BACKGROUND ================== */}
        {/* Simplified background: only two gradients instead of four */}
        <div
          aria-hidden
          className="absolute inset-0 -z-30"
          style={{
            backgroundImage: [
              // Main central band (reduced complexity)
              "radial-gradient(80% 55% at 50% 52%, rgba(252,166,154,0.3) 0%, rgba(214,76,82,0.35) 30%, rgba(61,36,47,0.25) 55%, rgba(8,8,12,0.8) 80%, rgba(0,0,0,1) 90%)",
              // Soft top vignette only
              "linear-gradient(to bottom, rgba(0,0,0,0.2), transparent 40%)",
            ].join(","),
            backgroundColor: "#000",
          }}
        />
        {/* Vignette corners – keep for depth */}
        <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(140%_120%_at_50%_0%,transparent_60%,rgba(0,0,0,0.85))]" />

        {/* Grid overlay – reduced to one set of lines */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 mix-blend-screen opacity-20"
          style={{
            backgroundImage: [
              // Only major vertical lines
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 80px)",
              // Subtle horizontal scan lines
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 40px)",
            ].join(","),
            backgroundBlendMode: "screen",
          }}
        />

        {/* ================== NAV ================== */}
        <header className="relative z-10">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-8">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-white" />
              <span className="text-lg font-semibold tracking-tight">MoraAI</span>
            </div>

            <nav className="hidden items-center gap-8 text-sm/6 text-white/80 md:flex">
              {['Product','Docs','Customers','Resources','Partners','Pricing'].map((i)=>(
                <a key={i} className="hover:text-white" href="#">{i}</a>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <button className="rounded-full px-4 py-2 text-sm text-white/80 hover:text-white">Sign in</button>
              <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:bg-white/90">Request Demo</button>
            </div>

            <button className="md:hidden rounded-full bg-white/10 px-3 py-2 text-sm">Menu</button>
          </div>
        </header>

        {/* ================== COPY ================== */}
        <div className="relative z-10 mx-auto grid w-full max-w-5xl place-items-center px-6 py-16 md:py-24 lg:py-28">
          {/* Fade‑up animation – only toggle class */}
          <div className={`mx-auto text-center ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-white/70 ring-1 ring-white/10 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" /> web3 toolkit
            </span>
            {/* Staggered animations via CSS delay (reduced timing) */}
            <h1 style={{ animationDelay: '120ms' }} className={`mt-6 text-4xl font-bold tracking-tight md:text-6xl ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
              Create and connect your world on web3
            </h1>
            <p style={{ animationDelay: '180ms' }} className={`mx-auto mt-5 max-w-2xl text-balance text-white/80 md:text-lg ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
              The essential toolkit for sharing and funding anything—from your latest idea to the next big DAO.
            </p>
            <div style={{ animationDelay: '240ms' }} className={`mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <a href="#" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow transition hover:bg-white/90">Try Molithra</a>
              <a href="#" className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur hover:border-white/40">Read More</a>
            </div>
          </div>
        </div>

        {/* ================== PARTNERS ================== */}
        <div className="relative z-10 mx-auto mt-10 w-full max-w-6xl px-6 pb-24">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-60">
            {/* Reduced partner list for faster paint */}
            {["git","npm","Lucidchart","wrike","jquery","openstack"].map((brand) => (
              <div key={brand} className="text-xs uppercase tracking-wider text-white/60">{brand}</div>
            ))}
          </div>
        </div>

        {/* ================== FOREGROUND ================== */}
        {/* Center‑bottom glow – reduced height for less paint */}
        <div
          className="pointer-events-none absolute bottom-[96px] left-1/2 z-0 h-28 w-24 -translate-x-1/2 rounded-md bg-gradient-to-b from-white/60 via-rose-100/40 to-transparent"
          style={{ animation: 'subtlePulse 5s ease-in-out infinite' }}
        />

        {/* Stepped pillars silhouette – reduced height and simplified */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[40vh]">
          {/* dark fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
          {/* bars */}
          <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-px px-[2px]">
            {pillars.map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-black transition-height duration-800 ease-in-out"
                style={{
                  // Animate height from 0% to target when mounted.
                  height: isMounted ? `${h}%` : '0%',
                  // Stagger delay based on distance from center (reduced multiplier).
                  transitionDelay: `${Math.abs(i - Math.floor(pillars.length / 2)) * 30}ms`
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
