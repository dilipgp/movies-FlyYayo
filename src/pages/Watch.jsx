import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Calendar, Heart, Share2, Loader2 } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import { useAuth } from '../contexts/AuthContext';

export default function Watch() {
  const { id } = useParams();
  const { user, session } = useAuth();
  const [movie, setMovie] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Fetch movie details
        const movieRes = await fetch(`/api/movies/${id}`);
        if (!movieRes.ok) throw new Error('Movie not found');
        const movieData = await movieRes.json();
        setMovie(movieData);

        // Fetch stream URL
        if (session?.access_token) {
          const streamRes = await fetch(`/api/stream/${id}`, {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          });
          
          if (streamRes.ok) {
            const streamData = await streamRes.json();
            setStreamUrl(streamData.streamUrl);
          } else {
            // Fallback to video_url from movie data
            setStreamUrl(movieData.video_url);
          }
        } else {
          setStreamUrl(movieData.video_url);
        }

        // Check if favorite
        if (user) {
          const favRes = await fetch('/api/favorites', {
            headers: {
              Authorization: `Bearer ${session?.access_token}`
            }
          });
          if (favRes.ok) {
            const favData = await favRes.json();
            setIsFavorite(favData.favorites?.some(f => f.movie_id === id));
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, user, session]);

  const toggleFavorite = async () => {
    if (!session?.access_token) return;

    try {
      if (isFavorite) {
        await fetch('/api/favorites', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ movie_id: id })
        });
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ movie_id: id })
        });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  const handleProgress = async (progress) => {
    if (!session?.access_token || !movie) return;

    try {
      await fetch('/api/watch-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          movie_id: movie.id,
          progress
        })
      });
    } catch (err) {
      console.error('Progress save error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">{error || 'Movie not found'}</h1>
        <Link to="/" className="text-red-500 hover:text-red-400">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player */}
      <div className="relative w-full h-screen">
        <VideoPlayer
          src={streamUrl || movie.video_url}
          poster={movie.thumbnail_url}
          title={movie.title}
          onProgress={handleProgress}
        />

        {/* Back button */}
        <Link
          to="/"
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
      </div>

      {/* Movie Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Poster */}
          <div className="hidden md:block">
            <img
              src={movie.thumbnail_url}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover rounded-xl shadow-2xl"
            />
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                  <span className="text-white font-medium">{movie.rating?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                </div>
                {movie.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(movie.duration / 60)} min</span>
                  </div>
                )}
              </div>
            </div>

            {/* Categories */}
            {movie.categories?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-gray-300 text-lg leading-relaxed">
              {movie.description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleFavorite}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  isFavorite
                    ? 'bg-red-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'In Favorites' : 'Add to Favorites'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}