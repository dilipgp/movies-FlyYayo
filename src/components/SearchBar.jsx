import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Film, Clock, Star } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setResults(data.movies || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchMovies, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (movie) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/watch/${movie.id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search movies..."
            className="w-full pl-10 pr-10 py-2.5 bg-white/5 hover:bg-white/[0.07] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-all text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {isOpen && (query.trim() || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#121214] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50 z-50"
          >
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
              </div>
            ) : results.length > 0 ? (
              <ul className="py-1">
                {results.map((movie) => (
                  <li key={movie.id}>
                    <button
                      onClick={() => handleSelect(movie)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left group"
                    >
                      <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#1a1a1c]">
                        <img
                          src={movie.thumbnail_url}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm truncate group-hover:text-amber-400 transition-colors">
                          {movie.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                          <span>{movie.year}</span>
                          {movie.rating && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500" fill="currentColor" />
                              {movie.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : query.trim() ? (
              <div className="py-10 text-center">
                <Film className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No movies found</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
