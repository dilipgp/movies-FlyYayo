import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Film, Heart, Clock, Settings, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    navigate('/login');
    signOut();
  };

  const isAdmin = profile?.role === 'admin';

  const mainNavLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/movies', label: 'Movies', icon: Film },
    { to: '/favorites', label: 'Favorites', icon: Heart },
    { to: '/history', label: 'History', icon: Clock },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-[#08080a]/95 backdrop-blur-xl border-b border-white/5' 
            : 'bg-gradient-to-b from-[#08080a] via-[#08080a]/60 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 rounded-lg blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Film className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-semibold text-white tracking-tight">Stream</span>
                <span className="text-lg font-semibold text-amber-500 tracking-tight">Vault</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {mainNavLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-white/5 rounded-lg border border-white/10"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
              
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    location.pathname === '/admin'
                      ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                      : 'text-amber-500 hover:text-amber-400 hover:bg-amber-500/5'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block w-56 lg:w-64">
                <SearchBar />
              </div>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div className="relative">
                      <img
                        src={user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${user.email}&background=f59e0b&color=fff`}
                        alt={user.email}
                        className="w-8 h-8 rounded-lg object-cover ring-2 ring-white/10"
                      />
                      {isAdmin && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 rounded flex items-center justify-center">
                          <Shield className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-60 bg-[#121214] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50"
                      >
                        <div className="p-4 border-b border-white/5">
                          <p className="text-white font-medium truncate">
                            {profile?.name || user.user_metadata?.full_name || user.user_metadata?.name || 'User'}
                          </p>
                          <p className="text-gray-500 text-sm truncate">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-flex items-center gap-1.5 mt-2 px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-lg border border-amber-500/20">
                              <Shield className="w-3 h-3" />
                              Administrator
                            </span>
                          )}
                        </div>
                        <div className="p-2">
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="lg:hidden flex items-center gap-3 px-3 py-2.5 text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                            >
                              <Shield className="w-4 h-4" />
                              Admin Panel
                            </Link>
                          )}
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-sm font-semibold rounded-xl transition-all shadow-lg shadow-amber-900/20 hover:shadow-amber-800/30"
                >
                  Sign In
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#08080a] lg:hidden pt-16"
          >
            <div className="p-4">
              <SearchBar />
            </div>
            <nav className="p-4 space-y-1">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                    location.pathname === link.to
                      ? 'bg-white/5 text-white border border-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20"
                >
                  <Shield className="w-5 h-5" />
                  Admin Panel
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {userMenuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
}
