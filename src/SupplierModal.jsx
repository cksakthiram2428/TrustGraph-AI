import React, { useState, useEffect } from 'react';

export default function SupplierModal({ isOpen, onClose, supplier, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    score: 50,
    paymentDelay: '',
    deliveryReliability: '',
    qualityRate: '',
    complaintCount: 0
  });

  // When modal opens or supplier changes, populate form
  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        industry: supplier.industry || '',
        score: supplier.score || 50,
        paymentDelay: supplier.details?.paymentDelay || '',
        deliveryReliability: supplier.details?.deliveryReliability || '',
        qualityRate: supplier.details?.qualityRate || '',
        complaintCount: supplier.details?.complaintCount || 0
      });
    } else {
      // Reset for new supplier
      setFormData({
        name: '',
        industry: '',
        score: 50,
        paymentDelay: '',
        deliveryReliability: '',
        qualityRate: '',
        complaintCount: 0
      });
    }
  }, [supplier, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = (e) => {
    e.preventDefault();
    
    // Debug log
    console.log('Submitting form data:', formData);
    
    // Auto-calculate risk based on score
    const score = parseInt(formData.score);
    let risk = 'Medium Risk';
    let riskIcon = '🟡';
    let riskColor = 'yellow';
    
    if (score >= 80) {
      risk = 'Low Risk';
      riskIcon = '🟢';
      riskColor = 'emerald';
    } else if (score < 50) {
      risk = 'High Risk';
      riskIcon = '🔴';
      riskColor = 'error';
    }
    
    const payload = {
      ...formData,
      score,
      risk,
      riskIcon,
      riskColor
    };
    
    console.log('Payload to send:', payload);
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm modal-overlay"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative glass-panel rounded-2xl w-full max-w-lg mx-4 p-6 shadow-2xl modal-content max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-headline-md font-bold text-primary">
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-white transition-colors p-2"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Company Name</label>
            <input 
              required
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Industry</label>
              <input 
                required
                type="text" 
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Manufacturing"
              />
            </div>
            <div>
              <label className="form-label">Trust Score (0-100)</label>
              <input 
                required
                type="number" 
                min="0"
                max="100"
                name="score"
                value={formData.score}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Payment Delay (Days)</label>
              <input 
                type="text" 
                name="paymentDelay"
                value={formData.paymentDelay}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. 15 Days"
              />
            </div>
            <div>
              <label className="form-label">Delivery Reliability</label>
              <input 
                type="text" 
                name="deliveryReliability"
                value={formData.deliveryReliability}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. 98%"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Quality Rate</label>
              <input 
                type="text" 
                name="qualityRate"
                value={formData.qualityRate}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. 99.5%"
              />
            </div>
            <div>
              <label className="form-label">Complaints (Last 30d)</label>
              <input 
                type="number" 
                name="complaintCount"
                value={formData.complaintCount}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-bold text-on-surface-variant hover:bg-surface-variant transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 rounded-lg font-bold bg-primary text-on-primary hover:brightness-110 active:scale-95 transition-all"
            >
              {supplier ? 'Save Changes' : 'Add Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
