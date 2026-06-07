import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Play, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Sparkles, Crown, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from '../lib/googleAuth';

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const supabase = createClient(supabaseUrl, supabaseKey);

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        if (data.user) navigate('/', { replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0808] flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-amber-600/20 rounded-full" />
          <div className="absolute inset-0 w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <Crown className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-amber-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0808] relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0808] via-[#1a0a0a] to-[#0a0808]" />
        
        {/* Velvet curtain texture - Left */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 lg:w-56">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4a1520] via-[#3a1018] to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a0a10] to-transparent" />
          {/* Curtain folds */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `repeating-linear-gradient(90deg, 
              transparent 0px, transparent 8px, 
              rgba(0,0,0,0.3) 8px, rgba(0,0,0,0.3) 16px,
              transparent 16px, transparent 24px)`
          }} />
          {/* Curtain highlight */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-amber-900/20 to-transparent" />
        </div>
        
        {/* Velvet curtain texture - Right */}
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 lg:w-56">
          <div className="absolute inset-0 bg-gradient-to-l from-[#4a1520] via-[#3a1018] to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#2a0a10] to-transparent" />
          {/* Curtain folds */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `repeating-linear-gradient(90deg, 
              transparent 0px, transparent 8px, 
              rgba(0,0,0,0.3) 8px, rgba(0,0,0,0.3) 16px,
              transparent 16px, transparent 24px)`
          }} />
          {/* Curtain highlight */}
          <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-amber-900/20 to-transparent" />
        </div>
        
        {/* Top curtain valance */}
        <div className="absolute top-0 left-0 right-0 h-32 md:h-40">
          <div className="absolute inset-0 bg-gradient-to-b from-[#3a1018] via-[#2a0a10] to-transparent" />
          {/* Gold trim */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent" />
          <div className="absolute bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </div>
        
        {/* Art Deco pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(212, 175, 55, 0.1) 50px, rgba(212, 175, 55, 0.1) 51px),
            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(212, 175, 55, 0.1) 50px, rgba(212, 175, 55, 0.1) 51px)
          `
        }} />
        
        {/* Art Deco corner decorations */}
        <svg className="absolute top-4 left-4 w-24 h-24 text-amber-600/10" viewBox="0 0 100 100">
          <path d="M0 0 L40 0 L40 5 L5 5 L5 40 L0 40 Z" fill="currentColor" />
          <path d="M10 10 L30 10 L30 15 L15 15 L15 30 L10 30 Z" fill="currentColor" />
          <circle cx="20" cy="20" r="3" fill="currentColor" />
        </svg>
        <svg className="absolute top-4 right-4 w-24 h-24 text-amber-600/10 scale-x-[-1]" viewBox="0 0 100 100">
          <path d="M0 0 L40 0 L40 5 L5 5 L5 40 L0 40 Z" fill="currentColor" />
          <path d="M10 10 L30 10 L30 15 L15 15 L15 30 L10 30 Z" fill="currentColor" />
          <circle cx="20" cy="20" r="3" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-4 left-4 w-24 h-24 text-amber-600/10 scale-y-[-1]" viewBox="0 0 100 100">
          <path d="M0 0 L40 0 L40 5 L5 5 L5 40 L0 40 Z" fill="currentColor" />
          <path d="M10 10 L30 10 L30 15 L15 15 L15 30 L10 30 Z" fill="currentColor" />
          <circle cx="20" cy="20" r="3" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-4 right-4 w-24 h-24 text-amber-600/10 scale-[-1]" viewBox="0 0 100 100">
          <path d="M0 0 L40 0 L40 5 L5 5 L5 40 L0 40 Z" fill="currentColor" />
          <path d="M10 10 L30 10 L30 15 L15 15 L15 30 L10 30 Z" fill="currentColor" />
          <circle cx="20" cy="20" r="3" fill="currentColor" />
        </svg>
        
        {/* Cinematic spotlights */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-gradient-to-b from-amber-500/10 to-transparent rounded-full blur-[100px]" />
        
        {/* Gold shimmer particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/40 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                y: -10,
                opacity: 0 
              }}
              animate={{ 
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100,
                opacity: [0, 1, 1, 0]
              }}
              transition={{ 
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear'
              }}
            />
          ))}
        </div>
        
        {/* Stage floor gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#1a0a0a]/50 via-amber-900/5 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Logo & Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="flex items-center justify-center gap-5 mb-8"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl blur-2xl opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl blur-xl opacity-30 animate-pulse" style={{ animationDuration: '3s' }} />
              
              {/* Icon container */}
              <div className="relative w-20 h-20 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-900/50 border border-amber-400/30">
                <Film className="w-10 h-10 text-white" />
                <div className="absolute -top-1 -right-1">
                  <Crown className="w-5 h-5 text-amber-300" />
                </div>
              </div>
            </div>
            
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-4xl md:text-5xl font-light text-white tracking-wide">Stream</span>
                <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">Vault</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-px w-8 bg-gradient-to-r from-amber-600 to-transparent" />
                <span className="text-amber-600/80 text-xs tracking-[0.3em] uppercase font-light">Premium Cinema</span>
                <div className="h-px w-8 bg-gradient-to-l from-amber-600 to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl md:text-5xl lg:text-6xl font-light text-white mb-4 tracking-tight"
          >
            Unlimited <span className="font-semibold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Entertainment</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 text-base md:text-lg max-w-md mx-auto leading-relaxed"
          >
            Stream thousands of premium movies and exclusive shows in stunning HD quality
          </motion.p>
          
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex items-center justify-center gap-3 mt-6"
          >
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-amber-600/50" />
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-amber-600/50" />
          </motion.div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="relative">
            {/* Card glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-amber-600/20 rounded-3xl blur-xl" />
            
            {/* Card container */}
            <div className="relative bg-gradient-to-b from-[#1a1015]/90 to-[#0d0a0c]/95 backdrop-blur-xl border border-amber-900/30 rounded-3xl overflow-hidden shadow-2xl">
              {/* Top gold accent */}
              <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              
              {/* Card content */}
              <div className="p-8 md:p-10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {isLogin ? 'Sign in to continue your experience' : 'Join us for premium streaming'}
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl flex items-center gap-3 text-red-300"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleEmailAuth} className="space-y-5">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 font-medium tracking-wide">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-amber-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="relative w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2 font-medium tracking-wide">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-amber-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="relative w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="relative w-full py-4 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-50"
                  >
                    {/* Button gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-[length:200%_100%] group-hover:bg-right transition-all duration-500" />
                    {/* Shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                    {/* Content */}
                    <span className="relative flex items-center justify-center gap-2">
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          {isLogin ? 'Sign In' : 'Create Account'}
                          <Sparkles className="w-4 h-4" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Toggle */}
                <p className="text-center mt-6 text-gray-500 text-sm">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button
                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>

                {/* Divider */}
                <div className="flex items-center gap-4 my-7">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="text-gray-600 text-xs tracking-wider uppercase">or continue with</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* Google Sign In */}
                <button
                  onClick={() => signInWithGoogle('StreamVault')}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <p className="text-gray-600 text-xs text-center mt-6">
                  By signing in, you agree to our{' '}
                  <span className="text-gray-500">Terms of Service</span> and{' '}
                  <span className="text-gray-500">Privacy Policy</span>
                </p>
              </div>
            </div>
          </div>

          {/* Demo credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 p-5 bg-gradient-to-r from-amber-900/20 via-amber-800/15 to-amber-900/20 border border-amber-700/30 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-amber-400 text-sm font-medium tracking-wide">Demo Admin Access</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 text-xs">Email</span>
                <p className="text-white font-mono text-sm">admin@streamvault.com</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Password</span>
                <p className="text-white font-mono text-sm">admin123</p>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-10 grid grid-cols-3 gap-4"
          >
            {[
              { icon: Film, label: '1000+ Movies', sub: 'HD Quality', color: 'amber' },
              { icon: Play, label: 'HD Streaming', sub: 'No Buffering', color: 'amber' },
              { icon: Crown, label: 'Premium', sub: 'No Ads', color: 'amber' },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className={`w-12 h-12 bg-${item.color}-600/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-${item.color}-500/20`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                </div>
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-gray-600 text-xs mt-1">{item.sub}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
