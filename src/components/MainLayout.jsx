import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      {/* Toast container will be placed in App.js */}
      <header className="bg-surface-container/80 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <NavLink 
              to="/" 
              className="flex items-center space-x-2 text-headline-md font-headline-md font-bold text-primary"
              end
              className={{ isActive: 'text-primary font-bold', isInactive: 'text-on-surface-variant' }}
            >
              TrustGraph AI
            </NavLink>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <NavLink 
              to="/dashboard" 
              className="px-3 py-2 rounded-md text-sm font-medium text-on-surface-variant hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              end
              className={{ isActive: 'bg-primary text-primary/20', isInactive: 'text-on-surface-variant hover:text-primary' }}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/network" 
              className="px-3 py-2 rounded-md text-sm font-medium text-on-surface-variant hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              end
              className={{ isActive: 'bg-primary text-primary/20', isInactive: 'text-on-surface-variant hover:text-primary' }}
            >
              Network
            </NavLink>
            <NavLink 
              to="/how-it-works" 
              className="px-3 py-2 rounded-md text-sm font-medium text-on-surface-variant hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              end
              className={{ isActive: 'bg-primary text-primary/20', isInactive: 'text-on-surface-variant hover:text-primary' }}
            >
              How It Works
            </NavLink>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              {isAuthenticated ? (
                <>
                  <span className="text-on-surface-variant font-label-md text-label-md mr-2">
                    {user?.email ?? 'User'}
                  </span>
                  <button 
                    onClick={() => {
                      // We'll handle logout in the context, but we need to call the logout function
                      // We'll get the logout function from the context.
                      // We'll add a logout function to the context and call it here.
                      // We'll do that in the context.
                      // For now, we'll just console.log.
                      console.log('Logout');
                    }}
                    className="bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    // We'll navigate to the login page
                    // We'll use the navigate hook from react-router-dom
                    // We'll import it.
                    // For now, we'll just console.log.
                    console.log('Navigate to login');
                  }}
                  className="bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </nav>
        {/* Mobile Hamburger */}
        <button 
          className="md:hidden text-on-surface hover:text-white p-2"
          id="mobile-menu-button"
        >
          <span className="material-symbols-outlined" id="mobile-menu-icon">
            menu
          </span>
        </button>
      </header>

      <div className="flex-1">
        <div className="px-4 pt-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>

      <footer className="bg-surface-dim border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex flex-col gap-xs items-center md:items-start">
            <div className="text-headline-md font-headline-md font-bold text-on-surface cursor-pointer" onClick={() => {
              // We'll navigate to home
              console.log('Navigate to home');
            }}>
              TrustGraph AI
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant text-sm">© 2026 TrustGraph AI. Empowering Indian MSMEs with Predictive Intelligence.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-lg">
            <a 
              className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors cursor-pointer"
              onClick={() => {
                console.log('Privacy Policy');
              }}
            >
              Privacy Policy
            </a>
            <a 
              className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors cursor-pointer"
              onClick={() => {
                console.log('Terms of Service');
              }}
            >
              Terms of Service
            </a>
            <a 
              className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface transition-colors cursor-pointer"
              onClick={() => {
                console.log('Contact Support');
              }}
            >
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;