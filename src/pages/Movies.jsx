import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film, Loader2 } from 'lucide-react';
import MovieCard from '../components/MovieCard';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  useEffect(() => {
    fetchMovies(0);
  }, []);

  const fetchMovies = async (offset) => {
    try {
      const res = await fetch(`/api/movies?limit=${LIMIT}&offset=${offset}`);
      const data = await res.json();
      
      if (offset === 0) {
        setMovies(data.movies || []);
      } else {
        setMovies(prev => [...prev, ...(data.movies || [])]);
      }
      
      setHasMore((data.movies || []).length === LIMIT);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const newPage = page + 1;
    setPage(newPage);
    fetchMovies(newPage * LIMIT);
  };

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <Film className="w-8 h-8 text-red-500" />
            All Movies
          </h1>
          <p className="text-gray-400 mt-2">Browse our complete collection</p>
        </div>

        {/* Movies Grid */}
        {loading && movies.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} index={i} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && movies.length === 0 && (
          <div className="text-center py-20">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No movies available</h3>
            <p className="text-gray-400">Check back later for new content</p>
          </div>
        )}
      </div>
    </div>
  );
}