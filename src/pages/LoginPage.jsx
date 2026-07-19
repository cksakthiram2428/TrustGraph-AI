import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticlesBackground from '../components/ui/particles-bg';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setScrollY(scrollTop);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ perspective: '1200px' }}>
      {/* Particles Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <ParticlesBackground />
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container/60 backdrop-blur-md text-white hover:bg-surface-container/80 transition-all border border-white/20"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        <span className="text-sm font-medium">Back to Home</span>
      </button>
      
      {/* 3D Scrollable Container */}
      <div 
        className="w-full max-w-md relative z-10"
        style={{
          transform: `rotateX(${scrollY * 0.05}deg) translateY(${scrollY * -0.2}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div 
          className="bg-surface-container/60 backdrop-blur-md rounded-2xl shadow-2xl w-full p-8 space-y-4 border border-white/20"
          onScroll={handleScroll}
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 245, 255, 0.15)',
          }}
        >
          <h1 className="text-3xl font-bold text-white mb-2 text-center drop-shadow-lg">
            TrustGraph AI
          </h1>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="bg-primary/30 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-primary/40">Beta</span>
            <span className="bg-primary/30 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-primary/40">Secure</span>
            <span className="bg-primary/30 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-primary/40">Free Trial</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="transform transition-transform hover:translate-x-1">
              <label className="block text-sm font-medium text-white mb-1 drop-shadow-md">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-white/20 backdrop-blur-sm text-white placeholder-white/60"
                placeholder="Enter your email"
              />
            </div>
            <div className="transform transition-transform hover:translate-x-1">
              <label className="block text-sm font-medium text-white mb-1 drop-shadow-md">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-white/20 backdrop-blur-sm text-white placeholder-white/60"
                placeholder="Enter your password"
              />
            </div>
            {error && (
              <p className="text-sm text-red-200 bg-red-500/30 backdrop-blur-sm p-3 rounded-lg border border-red-500/40">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary text-white px-4 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-sm text-center text-white/80 backdrop-blur-sm">
            Don't have an account? <span className="text-primary-light underline cursor-pointer hover:text-white transition-colors">Request access</span>
          </p>
        </div>
        
        {/* Floating decorative elements */}
        <div 
          className="absolute -top-4 -right-4 w-20 h-20 bg-primary/30 rounded-full blur-xl"
          style={{
            transform: `translateZ(${scrollY * 0.5}px)`,
          }}
        />
        <div 
          className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/30 rounded-full blur-xl"
          style={{
            transform: `translateZ(${scrollY * -0.3}px)`,
          }}
        />
      </div>
      
      {/* 3D Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-sm backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
        style={{
          opacity: 1 - (scrollY / 200),
          transform: `translateX(-50%) translateY(${scrollY * 0.5}px) rotateX(${scrollY * 0.1}deg)`,
        }}
      >
        <span className="material-symbols-outlined text-lg animate-bounce">mouse</span>
        <span className="ml-2">Scroll for 3D effect</span>
      </div>
    </div>
  );
};

export default LoginPage;