import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import MovieCard from '../components/MovieCard';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Romance', 'Horror', 'Adventure'];

  useEffect(() => {
    const searchMovies = async () => {
      if (!query && !category) {
        setMovies([]);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (category) params.append('category', category);

        const res = await fetch(`/api/movies/search?${params}`);
        const data = await res.json();
        setMovies(data.movies || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput) params.set('q', searchInput);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(selectedCategory === cat ? '' : cat);
    const params = new URLSearchParams();
    if (searchInput) params.set('q', searchInput);
    if (selectedCategory !== cat) params.set('category', cat);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSelectedCategory('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search movies..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl transition-colors ${
                showFilters ? 'bg-red-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
            >
              Search
            </button>
          </form>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-white/5 rounded-xl"
            >
              <h3 className="text-white font-medium mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-red-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Active filters */}
          {(query || category) && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-gray-400 text-sm">Active filters:</span>
              {query && (
                <span className="flex items-center gap-1 px-3 py-1 bg-red-600/20 text-red-400 text-sm rounded-full">
                  "{query}"
                  <button onClick={clearFilters} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {category && (
                <span className="flex items-center gap-1 px-3 py-1 bg-red-600/20 text-red-400 text-sm rounded-full">
                  {category}
                  <button onClick={clearFilters} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div>
            <p className="text-gray-400 mb-4">Found {movies.length} movies</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} index={i} />
              ))}
            </div>
          </div>
        ) : (query || category) ? (
          <div className="text-center py-16">
            <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No movies found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Search for movies</h3>
            <p className="text-gray-400">Enter a movie title or select a category</p>
          </div>
        )}
      </div>
    </div>
  );
}