import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Loader2 } from 'lucide-react';
import MovieCard from '../components/MovieCard';

export default function History() {
  const { session } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!session?.access_token) return;

      try {
        const res = await fetch('/api/watch-history', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        const data = await res.json();
        setHistory(data.history?.map(h => h.movie).filter(Boolean) || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [session]);

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <Clock className="w-8 h-8 text-red-500" />
            Watch History
          </h1>
          <p className="text-gray-400 mt-2">Movies you've recently watched</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {history.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No watch history</h3>
            <p className="text-gray-400">Start watching movies to see your history</p>
          </div>
        )}
      </div>
    </div>
  );
}