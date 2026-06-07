import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Clock } from 'lucide-react';

export default function MovieCard({ movie, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/watch/${movie.id}`}>
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#121214] border border-white/5 shadow-lg">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1c] to-[#121214] animate-pulse" />
          )}
          
          {/* Movie poster */}
          <img
            src={movie.thumbnail_url}
            alt={movie.title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-105' : 'scale-100'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          {/* Hover overlay */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40"
          />

          {/* Play button */}
          <motion.div
            animate={{ 
              scale: isHovered ? 1 : 0.8, 
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40">
              <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
            </div>
          </motion.div>

          {/* Rating badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
            <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
            <span className="text-xs font-semibold text-white">{movie.rating?.toFixed(1) || 'N/A'}</span>
          </div>

          {/* Info panel */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{movie.year}</span>
              {movie.duration && (
                <>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDuration(movie.duration)}</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Categories */}
            {movie.categories?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {movie.categories.slice(0, 2).map((cat) => (
                  <span
                    key={cat}
                    className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full text-gray-300"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Border glow on hover */}
          <div
            className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
              isHovered ? 'border border-amber-500/30 shadow-[inset_0_0_20px_rgba(245,158,11,0.1)]' : ''
            }`}
          />
        </div>
      </Link>
    </motion.div>
  );
}
