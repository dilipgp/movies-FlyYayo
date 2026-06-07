import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Play, TrendingUp, Clock, Star, Film, Sparkles, Award } from 'lucide-react';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('/api/movies?limit=20');
        const data = await res.json();
        setMovies(data.movies || []);
        setTrending((data.movies || []).slice(0, 5));
        setRecent((data.movies || []).slice(5, 12));
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Auto-rotate featured movie
  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % trending.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [trending.length]);

  const featuredMovie = trending[currentSlide];

  const categories = [
    { name: 'Action', color: 'from-red-600 to-orange-600', icon: '🎬' },
    { name: 'Drama', color: 'from-purple-600 to-pink-600', icon: '🎭' },
    { name: 'Comedy', color: 'from-yellow-500 to-orange-500', icon: '😂' },
    { name: 'Thriller', color: 'from-gray-700 to-gray-900', icon: '🔪' },
    { name: 'Sci-Fi', color: 'from-blue-600 to-cyan-600', icon: '🚀' },
    { name: 'Romance', color: 'from-pink-500 to-rose-600', icon: '💕' },
  ];

  return (
    <div className="min-h-screen bg-[#08080a] text-white">
      {/* Hero Section */}
      {featuredMovie && (
        <section className="relative min-h-[90vh] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/hero-bg.jpg"
              alt="Theater"
              className="w-full h-full object-cover opacity-30"
            />
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/70 to-[#08080a]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-[#08080a]/60" />
          
          {/* Ambient Glow Effects */}
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px]" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-amber-600/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-amber-900/10 to-transparent blur-[80px]" />
          
          {/* Spotlight Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[40%] bg-gradient-to-b from-amber-400/30 via-amber-500/10 to-transparent" />
            <div className="absolute top-0 left-[40%] w-[1px] h-[30%] bg-gradient-to-b from-amber-400/20 via-amber-500/5 to-transparent" />
            <div className="absolute top-0 right-[40%] w-[1px] h-[30%] bg-gradient-to-b from-amber-400/20 via-amber-500/5 to-transparent" />
          </div>

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `
              linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center pt-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
              {/* Left Content */}
              <motion.div
                key={featuredMovie.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-xl"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <span className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Premium
                  </span>
                  <span className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 text-sm">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    Trending
                  </span>
                </motion.div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                  <span className="text-white">{featuredMovie.title}</span>
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5">
                    <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                    <span className="text-white font-semibold">{featuredMovie.rating?.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">/ 10</span>
                  </div>
                  <span className="text-gray-400">{featuredMovie.year}</span>
                  {featuredMovie.duration && (
                    <span className="text-gray-400">{Math.floor(featuredMovie.duration / 60)} min</span>
                  )}
                  {featuredMovie.categories?.[0] && (
                    <span className="px-3 py-1 bg-white/5 rounded-lg text-gray-300 text-sm border border-white/5">
                      {featuredMovie.categories[0]}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-400 text-lg mb-8 leading-relaxed line-clamp-3">
                  {featuredMovie.description}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to={`/watch/${featuredMovie.id}`}
                    className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-amber-900/30 hover:shadow-amber-800/40 hover:scale-[1.02]"
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                    Watch Now
                  </Link>
                  <Link
                    to={`/watch/${featuredMovie.id}`}
                    className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20"
                  >
                    <Film className="w-5 h-5" />
                    More Info
                  </Link>
                </div>
              </motion.div>

              {/* Right - Featured Movie Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="hidden lg:block relative"
              >
                <div className="relative">
                  {/* Glow behind card */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-amber-600/10 rounded-3xl blur-2xl opacity-50" />
                  
                  {/* Card */}
                  <div className="relative aspect-[2/3] max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                    <img
                      src={featuredMovie.thumbnail_url}
                      alt={featuredMovie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Rating overlay */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                      <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                      <span className="text-white font-semibold">{featuredMovie.rating?.toFixed(1)}</span>
                    </div>
                    
                    {/* Play button overlay */}
                    <Link
                      to={`/watch/${featuredMovie.id}`}
                      className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40"
                    >
                      <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50">
                        <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Slide indicators */}
                {trending.length > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {trending.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'w-8 bg-amber-500' 
                            : 'w-1.5 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Content Sections */}
      <div className="relative z-10 bg-[#08080a]">
        {/* Trending Section */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/30">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Trending Now</h2>
                  <p className="text-gray-500 text-sm">Most watched this week</p>
                </div>
              </div>
              <Link
                to="/movies"
                className="flex items-center gap-2 text-amber-500 hover:text-amber-400 text-sm font-medium group"
              >
                View All 
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {trending.map((movie, i) => (
                  <MovieCard key={movie.id} movie={movie} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 bg-gradient-to-b from-transparent via-[#0c0c0e] to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/30">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Browse by Category</h2>
                <p className="text-gray-500 text-sm">Find your favorite genre</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/search?category=${category.name}`}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-colors"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-80 transition-opacity`} />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <span className="text-2xl filter drop-shadow-lg">{category.icon}</span>
                    <span className="text-white font-semibold text-sm group-hover:scale-105 transition-transform">
                      {category.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recently Added Section */}
        {recent.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/30">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Recently Added</h2>
                    <p className="text-gray-500 text-sm">Fresh content for you</p>
                  </div>
                </div>
                <Link
                  to="/movies"
                  className="flex items-center gap-2 text-amber-500 hover:text-amber-400 text-sm font-medium group"
                >
                  View All 
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {recent.map((movie, i) => (
                  <MovieCard key={movie.id} movie={movie} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Movies Section */}
        <section className="py-16 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/30">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">All Movies</h2>
                  <p className="text-gray-500 text-sm">Complete collection</p>
                </div>
              </div>
              <Link
                to="/movies"
                className="flex items-center gap-2 text-amber-500 hover:text-amber-400 text-sm font-medium group"
              >
                View All 
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {movies.slice(0, 10).map((movie, i) => (
                  <MovieCard key={movie.id} movie={movie} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
