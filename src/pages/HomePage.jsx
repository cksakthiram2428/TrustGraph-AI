import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <header id="hero" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-20 pb-24 min-h-[70vh] flex flex-col justify-center items-center text-center">
        <div className="inline-block px-4 py-2 bg-surface-container rounded-full border border-outline-variant mb-6 backdrop-blur-sm">
          <span className="text-primary font-bold text-sm tracking-wide">BETA PLATFORM</span>
        </div>
        <h1 className="text-4xl font-bold text-5xl md:text-5xl mb-6 max-w-3xl text-on-surface">
          Predict Supply Chain Risk Before It Happens
        </h1>
        <p className="text-lg text-on-surface-variant mb-8 max-w-2xl leading-relaxed">
          AI-powered financial health monitoring for Indian MSMEs. Map your network, identify fragile links, and secure your cash flow.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link 
            to="/dashboard"
            className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all"
          >
            Get Started Free
          </Link>
          <a 
            href="#how-it-works"
            className="ml-4 bg-surface-container/80 text-on-surface px-6 py-3 rounded-lg font-bold text-lg hover:bg-surface-variant/80 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">play_circle</span>
            Watch Demo
          </a>
        </div>
      </header>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="font-headline-lg text-4xl mb-md">3 Steps to Financial Resilience</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-xl relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-outline-variant to-transparent -z-10"></div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-4 relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-on-primary">
              <span className="font-bold text-xl">1</span>
            </div>
            <h3 className="font-headline-md text-xl">Connect Data</h3>
            <p className="mt-2 text-on-surface-variant text-sm">
              Securely link your ERP, Tally, or GST portal. We use bank-grade encryption to ensure your data stays private and anonymous.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-4 relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-on-primary">
              <span className="font-bold text-xl">2</span>
            </div>
            <h3 className="font-headline-md text-xl">AI Trust Graph</h3>
            <p className="mt-2 text-on-surface-variant text-sm">
              Our neural engine maps your business entities against millions of data points across the Indian MSME landscape to calculate real-time risk.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-4 relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-on-primary">
              <span className="font-bold text-xl">3</span>
            </div>
            <h3 className="font-headline-md text-xl">Predictive Alerts</h3>
            <p className="mt-2 text-on-surface-variant text-sm">
              Receive instant notifications on WhatsApp or Email the moment a supplier's risk profile changes, allowing you to act before loss occurs.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <div className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-6 pb-16">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-70">
          {["git","npm","Lucidchart","wrike","jquery","openstack","servicenow","Paysafe"].map((brand) => (
            <div key={brand} className="text-xs uppercase tracking-wider text-white/70">{brand}</div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;