import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ToastAlert from './ToastAlert';
import ParticlesBackground from './ui/particles-bg';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col text-on-surface relative" style={{ backgroundColor: '#121314' }}>
      {/* Particles Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <ParticlesBackground />
      </div>
      
      {/* Header */}
      <header className="border-b border-white/10 relative z-20" style={{ backgroundColor: 'rgba(31, 32, 33, 0.95)' }}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink 
              to="/" 
              end
              className="flex items-center space-x-2 text-headline-md font-headline-md font-bold text-white hover:text-primary transition-colors"
            >
              TrustGraph AI
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <button 
              onClick={(e) => scrollToSection(e, 'suppliers')}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:text-primary hover:bg-white/10 transition-all backdrop-blur-sm border border-transparent hover:border-primary/30"
            >
              Dashboard
            </button>
            <button 
              onClick={(e) => scrollToSection(e, 'network')}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:text-primary hover:bg-white/10 transition-all backdrop-blur-sm border border-transparent hover:border-primary/30"
            >
              Network
            </button>
            <button 
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:text-primary hover:bg-white/10 transition-all backdrop-blur-sm border border-transparent hover:border-primary/30"
            >
              How It Works
            </button>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center">
            <div className="hidden md:block">
              {isAuthenticated ? (
                <>
                  <span className="text-white/80 font-label-md text-label-md mr-3 drop-shadow-md">
                    {user?.email ?? 'User'}
                  </span>
                  <button 
                    onClick={async () => {
                      await logout();
                      // Clear any cached state and redirect to home
                      window.location.href = '/';
                    }}
                    className="bg-primary/80 text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary transition-all border border-primary/50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-all border border-primary/50"
                >
                  Login
                </button>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white hover:text-primary p-2 ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-surface-container/95 backdrop-blur-md border-b border-white/10 p-4 space-y-2 z-30">
            <button 
              onClick={(e) => scrollToSection(e, 'suppliers')}
              className="w-full text-left px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors border border-white/10"
            >
              Dashboard
            </button>
            <button 
              onClick={(e) => scrollToSection(e, 'network')}
              className="w-full text-left px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors border border-white/10"
            >
              Network
            </button>
            <button 
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="w-full text-left px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors border border-white/10"
            >
              How It Works
            </button>
            {isAuthenticated && (
              <button 
                onClick={async () => {
                  await logout();
                  window.location.href = '/';
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors border border-white/10"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <div className="px-4 pt-8 sm:px-6 lg:px-8">
          {/* Toast Alert */}
          <ToastAlert />
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 relative z-10" style={{ backgroundColor: 'rgba(18, 19, 20, 0.95)' }}>
        <div className="max-w-7xl mx-auto mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex flex-col gap-xs items-center md:items-start">
            <div className="text-headline-md font-headline-md font-bold text-on-surface cursor-pointer" onClick={() => {
              navigate('/');
            }}>
              TrustGraph AI
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant text-sm">© 2026 TrustGraph AI. Empowering Indian MSMEs with Predictive Intelligence.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-lg">
            <button 
              className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors cursor-pointer"
              onClick={() => {
                alert('Privacy Policy\n\nTrustGraph AI is committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your data.\n\n1. Data Collection: We collect only necessary information to provide our services.\n2. Data Usage: Your data is used solely for risk assessment and service improvement.\n3. Data Protection: We employ industry-standard encryption and security measures.\n4. Contact: privacy@trustgraph.ai for any concerns.');
              }}
            >
              Privacy Policy
            </button>
            <button 
              className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors cursor-pointer"
              onClick={() => {
                alert('Terms of Service\n\nBy using TrustGraph AI, you agree to:\n\n1. Use the platform for legitimate business purposes only.\n2. Not attempt to reverse engineer or manipulate our AI models.\n3. Report any security vulnerabilities responsibly.\n4. Comply with all applicable Indian laws and regulations.\n5. Accept that risk predictions are advisory only.');
              }}
            >
              Terms of Service
            </button>
            <button 
              className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors cursor-pointer"
              onClick={() => {
                const email = prompt('Enter your email for support:', '');
                const issue = prompt('Describe your issue:', '');
                if (email && issue) {
                  alert(`Support ticket created!\n\nEmail: ${email}\nIssue: ${issue}\n\nOur team will contact you within 24 hours.\n\nFor immediate assistance, call: 1800-123-4567`);
                }
              }}
            >
              Contact Support
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;