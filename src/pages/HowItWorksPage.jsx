import React from 'react';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <section className="max-w-7xl mx-auto py-12">
          <div className="text-center mb-20">
            <h2 className="font-headline-lg text-4xl mb-md">3 Steps to Financial Resilience</h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-xl relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-outline-variant to-transparent -z-10"></div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-4 relative border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-on-primary">
                <span className="font-bold text-xl">1</span>
              </div>
              <h3 className="font-headline-md text-xl">Connect Data</h3>
              <p className="mt-2 text-on-surface-variant text-sm">
                Securely link your ERP, Tally, or GST portal. We use bank-grade encryption to ensure your data stays private and anonymous.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-4 relative border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-on-primary">
                <span className="font-bold text-xl">2</span>
              </div>
              <h3 className="font-headline-md text-xl">AI Trust Graph</h3>
              <p className="mt-2 text-on-surface-variant text-sm">
                Our neural engine maps your business entities against millions of data points across the Indian MSME landscape to calculate real-time risk.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-4 relative border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
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
      </div>
    </div>
  );
};

export default HowItWorksPage;