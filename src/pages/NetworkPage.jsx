import React, { useEffect, useState } from 'react';
import NetworkGraph from '../NetworkGraph';

const NetworkPage = () => {
  const [networkData, setNetworkData] = useState({ nodes: [], edges: [] });
  const [loadingNetwork, setLoadingNetwork] = useState(true);

  const fetchNetwork = () => {
    setLoadingNetwork(true);
    fetch('http://localhost:3000/api/network')
      .then(r => {
        if (!r.ok) throw new Error('Network response was not ok');
        return r.json();
      })
      .then(data => { setNetworkData(data); setLoadingNetwork(false); })
      .catch(err => { 
        console.error('Failed to fetch network:', err);
        setLoadingNetwork(false);
      });
  };

  useEffect(() => {
    fetchNetwork();
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <section className="max-w-7xl mx-auto py-12">
          <div className="grid lg:grid-cols-2 gap-xl items-center min-h-[500px]">
            <div className="z-10 space-y-lg order-2 lg:order-1 px-lg backdrop-blur-md bg-surface-container/40 rounded-2xl p-6">
              <h2 className="font-headline-lg text-4xl">Visualize Your Entire Business Network</h2>
              <p className="text-on-surface-variant text-lg">
                Don't just see your direct suppliers. TrustGraph uncovers 'Deep-Tier' risks. If your supplier's supplier is in trouble, you'll know it first before it impacts your production line.
              </p>
              <div className="pt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span>Healthy Supply Chain Node ({'>80'} Score)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Warning: Monitoring Recommended (50-79 Score)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span>Critical Risk: Immediate Action Needed ({'<50'} Score)</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-[400px] lg:h-[600px] order-1 lg:order-2 flex items-center justify-center backdrop-blur-sm bg-surface-container/30 rounded-2xl p-4">
              {loadingNetwork ? (
                <div className="w-full h-full skeleton rounded-xl backdrop-blur-md bg-surface-container/50"></div>
              ) : (
                <NetworkGraph nodes={networkData.nodes} edges={networkData.edges} />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NetworkPage;