import React, { useEffect, useState, useRef } from 'react';
import SupplierModal from '../SupplierModal';
import SupplierDetailPanel from '../SupplierDetailPanel';
import NetworkGraph from '../NetworkGraph';

const DashboardPage = () => {
  const [stats, setStats] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [networkData, setNetworkData] = useState({ nodes: [], edges: [] });
  
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [loadingNetwork, setLoadingNetwork] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const chartRef = useRef(null);

  const showToast = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const fetchStats = () => {
    setLoadingStats(true);
    fetch('http://localhost:3000/api/stats')
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(data => { setStats(data); setLoadingStats(false); })
      .catch(() => setLoadingStats(false));
  };

  const fetchSuppliers = () => {
    setLoadingSuppliers(true);
    fetch('http://localhost:3000/api/suppliers')
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(data => { setSuppliers(data); setLoadingSuppliers(false); })
      .catch(() => setLoadingSuppliers(false));
  };

  const fetchNetwork = () => {
    setLoadingNetwork(true);
    fetch('http://localhost:3000/api/network')
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(data => { setNetworkData(data); setLoadingNetwork(false); })
      .catch(() => setLoadingNetwork(false));
  };

  useEffect(() => {
    fetchStats();
    fetchSuppliers();
    fetchNetwork();
  }, []);

  // Convert edges from [[id1, id2], ...] to [{source: id1, target: id2}, ...] format
  const formattedNetworkData = React.useMemo(() => {
    const formattedEdges = (networkData.edges || []).map(edge => ({
      source: Array.isArray(edge) ? edge[0] : edge.fromId || edge.source,
      target: Array.isArray(edge) ? edge[1] : edge.toId || edge.target
    }));
    return {
      nodes: networkData.nodes || [],
      edges: formattedEdges
    };
  }, [networkData]);

  const openAddModal = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const openEditModal = (e, supplier) => {
    e.stopPropagation();
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleSaveSupplier = (payload) => {
    const isEditing = !!editingSupplier;
    const url = isEditing 
      ? `http://localhost:3000/api/suppliers/${editingSupplier.id}`
      : `http://localhost:3000/api/suppliers`;
    const method = isEditing ? 'PUT' : 'POST';

    if (!isEditing) {
      payload.id = `sup_${Date.now()}`;
    }

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setIsModalOpen(false);
      fetchSuppliers();
      fetchNetwork();
      showToast(isEditing ? 'Supplier updated successfully!' : 'New supplier added successfully!');
    })
    .catch(error => {
      console.error('Error saving supplier:', error);
      showToast('Failed to save supplier. Please try again.');
    });
  };

  const handleDeleteSupplier = (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    
    fetch(`http://localhost:3000/api/suppliers/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchSuppliers();
        fetchNetwork();
        showToast('Supplier deleted');
      })
      .catch(() => showToast('Failed to delete supplier'));
  };

  const renderScoreRing = (score, colorClass) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} className="score-ring-bg" />
          <circle 
            cx="50" 
            cy="50" 
            r={radius} 
            className="score-ring-fill"
            style={{ 
              stroke: colorClass === 'emerald' ? '#4ade80' : colorClass === 'yellow' ? '#eab308' : '#f87171',
              strokeDasharray: circumference,
              '--target-offset': offset 
            }}
          />
        </svg>
        <div className="text-3xl font-bold text-white z-10">{score}</div>
      </div>
    );
  };

  return (
    <>
      {/* Success Toast */}
      <div className={`fixed top-24 right-4 z-50 transition-all duration-300 ${showSuccessToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className="bg-green-500/90 text-white px-6 py-3 rounded-lg shadow-xl backdrop-blur-md border border-green-400/50 flex items-center gap-3">
          <span className="material-symbols-outlined">check_circle</span>
          {toastMessage}
        </div>
      </div>

      <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
        
        {/* Stats Section with Animated Charts */}
        <section id="stats" className="py-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-headline-lg text-3xl mb-8 text-white text-center">TrustGraph Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loadingStats ? (
                <>
                  <div className="h-40 skeleton rounded-2xl"></div>
                  <div className="h-40 skeleton rounded-2xl"></div>
                  <div className="h-40 skeleton rounded-2xl"></div>
                </>
              ) : stats.map((stat, i) => (
                <div 
                  key={i}
                  className="glass-panel p-6 rounded-2xl backdrop-blur-md bg-surface-container/40 border border-white/10 hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl">{stat.icon}</span>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                      <div className="text-on-surface-variant text-sm">{stat.label}</div>
                    </div>
                  </div>
                  <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/50 rounded-full"
                      style={{ 
                        width: '100%',
                        animation: 'slideRight 1s ease-out forwards',
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Animated Bar Chart */}
            <div className="mt-12 glass-panel p-8 rounded-2xl backdrop-blur-md bg-surface-container/30 border border-white/10">
              <h3 className="font-headline-md text-xl text-white mb-8">Risk Distribution Across Suppliers</h3>
              <div className="grid grid-cols-5 gap-6">
                {['Critical', 'High', 'Medium', 'Low', 'Healthy'].map((risk, i) => {
                  const widths = [10, 20, 30, 25, 65];
                  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-400', 'bg-green-400'];
                  const animDelays = ['0s', '0.2s', '0.4s', '0.6s', '0.8s'];
                  const pulseDelays = ['0s', '0.5s', '1s', '1.5s', '2s'];
                  return (
                    <div key={risk} className="space-y-3 text-center">
                      <div className="text-sm font-medium text-white/80">{risk}</div>
                      <div className="h-16 bg-white/5 rounded-xl relative overflow-hidden flex items-end">
                        <div 
                          className={`absolute bottom-0 left-0 right-0 ${colors[i]} rounded-t-xl transition-all duration-1000 ease-out`}
                          style={{ 
                            height: suppliers.length > 0 ? `${widths[i] * 1.5}%` : '5%',
                            animation: suppliers.length > 0 ? `growHeight 1.5s ease-out ${animDelays[i]} forwards, pulseGlow ${3 + i * 0.5}s ease-in-out ${pulseDelays[i]} infinite` : 'none'
                          }}
                        />
                      </div>
                      <div className="text-lg font-bold text-white">{widths[i]}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Supplier Trust Scores */}
        <section id="suppliers" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-white/10 pb-md gap-md backdrop-blur-md bg-surface-container/20 rounded-2xl p-6 mb-6">
              <div className="space-y-sm max-w-2xl">
                <h2 className="font-headline-lg text-4xl text-white">Supplier Trust Scores</h2>
                <p className="text-white/70">Our engine analyzes 500+ data points to deliver actionable risk scores. Click any card for detailed analytics.</p>
              </div>
              <button 
                onClick={openAddModal}
                className="bg-primary text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap hover:bg-primary/90 active:scale-95 shadow-lg shadow-primary/30"
              >
                <span className="material-symbols-outlined">add</span>
                Add Supplier
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md mt-6">
              {loadingSuppliers ? (
                <>
                  <div className="h-64 skeleton rounded-xl"></div>
                  <div className="h-64 skeleton rounded-xl"></div>
                  <div className="h-64 skeleton rounded-xl"></div>
                </>
              ) : suppliers.length === 0 ? (
                <div className="col-span-3 text-center py-16 glass-panel rounded-xl backdrop-blur-md">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <svg className="w-16 h-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-white/70 mb-6 text-lg">No suppliers yet. Add your first supplier to get started.</p>
                  <button 
                    onClick={openAddModal}
                    className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">add</span>
                    Add First Supplier
                  </button>
                </div>
              ) : (
                suppliers.map((supplier, i) => (
                  <div 
                    key={supplier.id} 
                    onClick={() => { setSelectedSupplier(supplier); setIsPanelOpen(true); }}
                    className={`glass-panel p-lg rounded-xl flex flex-col justify-between hover:translate-y-[-8px] transition-all cursor-pointer group backdrop-blur-md bg-surface-container/40 border border-white/10 ${supplier.score < 50 ? 'border-red-500/30' : supplier.score < 80 ? 'border-yellow-500/30' : 'border-green-500/30'}`}
                    style={{ animation: `fadeSlideUp 0.4s ease-out ${i * 0.1}s both` }}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-md">
                        <span className="p-sm bg-primary/20 rounded-lg text-primary material-symbols-outlined">
                          {supplier.industry?.toLowerCase().includes('pharma') || supplier.industry?.toLowerCase().includes('medical') ? 'medical_services' : supplier.industry?.toLowerCase().includes('electronics') ? 'memory' : 'factory'}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={(e) => openEditModal(e, supplier)}
                            className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button 
                            onClick={(e) => handleDeleteSupplier(e, supplier.id)}
                            className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                      <h3 className="font-headline-md text-lg mb-1 text-white">{supplier.name}</h3>
                      <p className="text-white/60 text-sm mb-lg">{supplier.industry}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      {renderScoreRing(supplier.score, supplier.riskColor)}
                      <div className="text-right">
                        <div className={`text-sm font-bold uppercase tracking-wider mb-1 ${supplier.riskColor === 'emerald' || supplier.riskColor === 'green' ? 'text-green-400' : supplier.riskColor === 'yellow' ? 'text-yellow-500' : 'text-red-400'}`}>
                          {supplier.risk}
                        </div>
                        <div className="text-xs text-white/50">Updated Today</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Network Graph */}
        <section id="network" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-xl items-center min-h-[500px]">
              <div className="z-10 space-y-lg order-2 lg:order-1 px-lg backdrop-blur-md bg-surface-container/40 rounded-2xl p-6 border border-white/10">
                <h2 className="font-headline-lg text-4xl text-white">Visualize Your Entire Business Network</h2>
                <p className="text-white/70 text-lg">
                  Don't just see your direct suppliers. TrustGraph uncovers 'Deep-Tier' risks. If your supplier's supplier is in trouble, you'll know it first.
                </p>
                <div className="pt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-white">
                    <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse"></div>
                    <span>Healthy (Score {'>80'})</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse"></div>
                    <span>Warning (Score 50-79)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white">
                    <div className="w-4 h-4 rounded-full bg-red-400 animate-pulse"></div>
                    <span>Critical (Score {'<50'})</span>
                  </div>
                </div>
              </div>
              
              <div className="relative h-[400px] lg:h-[600px] order-1 lg:order-2 flex items-center justify-center backdrop-blur-sm bg-surface-container/30 rounded-2xl p-4 border border-white/10">
                {loadingNetwork ? (
                  <div className="w-full h-full skeleton rounded-xl" style={{ minHeight: '300px' }}></div>
                ) : (
                  <NetworkGraph nodes={formattedNetworkData.nodes} edges={formattedNetworkData.edges} />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: How It Works */}
        <section id="how-it-works" className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-headline-lg text-4xl text-white mb-md">3 Steps to Financial Resilience</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-xl relative">
              <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              {[
                { num: '1', title: 'Connect Data', desc: 'Securely link your ERP, Tally, or GST portal. We use bank-grade encryption.' },
                { num: '2', title: 'AI Trust Graph', desc: 'Our neural engine maps your business entities against millions of data points.' },
                { num: '3', title: 'Predictive Alerts', desc: 'Receive instant notifications when a supplier\'s risk profile changes.' }
              ].map((item, i) => (
                <div 
                  key={i}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-4 relative border border-white/10 hover:bg-white/10 hover:scale-105 transition-all cursor-pointer"
                  style={{ animation: `fadeSlideUp 0.5s ease-out ${i * 0.15}s both` }}
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 text-white font-bold text-xl shadow-lg shadow-primary/30">
                    {item.num}
                  </div>
                  <h3 className="font-headline-md text-xl text-white">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* Modal */}
      <div className={isModalOpen ? 'fixed inset-0 z-50 flex items-center justify-center' : 'hidden'}>
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        />
        <div 
          className="relative glass-panel rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl bg-surface-container/90 border border-white/20"
          onClick={e => e.stopPropagation()}
        >
          <SupplierModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            supplier={editingSupplier}
            onSave={handleSaveSupplier}
          />
        </div>
      </div>

      {/* Detail Panel */}
      <div className={isPanelOpen ? 'fixed inset-0 z-50' : 'hidden'}>
        <SupplierDetailPanel 
          isOpen={isPanelOpen}
          onClose={() => { setIsPanelOpen(false); setSelectedSupplier(null); }}
          supplier={selectedSupplier}
        />
      </div>
    </>
  );
};

export default DashboardPage;