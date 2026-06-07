import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  SkipBack, SkipForward, PictureInPicture, Loader2 
} from 'lucide-react';

export default function VideoPlayer({ src, poster, title, onProgress, initialProgress = 0 }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [pip, setPip] = useState(false);
  
  const controlsTimeout = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (initialProgress > 0) {
        video.currentTime = initialProgress * video.duration;
      }
      setBuffering(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onProgress) {
        onProgress(video.currentTime / video.duration);
      }
    };

    const handleWaiting = () => setBuffering(true);
    const handleCanPlay = () => setBuffering(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [initialProgress, onProgress]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    videoRef.current.volume = value;
    setVolume(value);
    setMuted(value === 0);
  };

  const handleSeek = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * duration;
  };

  const skip = (seconds) => {
    videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const togglePip = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setPip(false);
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
        setPip(true);
      }
    } catch (err) {
      console.error('PiP error:', err);
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        playsInline
      />

      {/* Buffering indicator */}
      <AnimatePresence>
        {buffering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30"
          >
            <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause overlay */}
      <AnimatePresence>
        {!playing && !buffering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-24 h-24 bg-red-600/90 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50">
              <Play className="w-12 h-12 text-white ml-2" fill="white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-end pointer-events-none"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Controls container */}
            <div className="relative p-4 md:p-8 pointer-events-auto">
              {/* Title */}
              <h2 className="text-white text-xl md:text-2xl font-bold mb-4 drop-shadow-lg">{title}</h2>

              {/* Progress bar */}
              <div
                ref={progressRef}
                className="relative h-1 bg-white/30 rounded-full cursor-pointer group/progress mb-4"
                onClick={handleSeek}
              >
                <div
n                  className="absolute top-0 left-0 h-full bg-red-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg"
                  style={{ left: `calc(${progress}% - 8px)` }}
                />
              </div>

              {/* Buttons row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  >
                    {playing ? (
                      <Pause className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    ) : (
                      <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5" />
                    )}
                  </button>

                  {/* Skip back */}
                  <button
                    onClick={() => skip(-10)}
                    className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                  >
                    <SkipBack className="w-5 h-5 text-white" />
                  </button>

                  {/* Skip forward */}
                  <button
                    onClick={() => skip(10)}
                    className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                  >
                    <SkipForward className="w-5 h-5 text-white" />
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2 group/volume">
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                    >
                      {muted || volume === 0 ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={muted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-red-600"
                    />
                  </div>

                  {/* Time */}
                  <span className="text-white text-sm hidden md:block">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Picture in Picture */}
                  <button
                    onClick={togglePip}
                    className="w-10 h-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                    title="Picture in Picture"
                  >
                    <PictureInPicture className="w-5 h-5 text-white" />
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="w-10 h-10 md:w-12 md:h-12 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                  >
                    {fullscreen ? (
                      <Minimize className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    ) : (
                      <Maximize className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
