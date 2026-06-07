import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, Loader2, RefreshCw, Film, Users, Activity, 
  HardDrive, CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';

export default function Admin() {
  const { user, session, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [stats, setStats] = useState({ movies: 0, users: 0, views: 0 });
  const [syncResult, setSyncResult] = useState(null);

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    const checkAuth = async () => {
      if (!session?.access_token) {
        navigate('/login');
        return;
      }

      if (!isAdmin) {
        navigate('/');
        return;
      }

      await fetchStats();
      setLoading(false);
    };

    checkAuth();
  }, [session, isAdmin, navigate]);

  const fetchStats = async () => {
    try {
      const moviesRes = await fetch('/api/movies?limit=1');
      const moviesData = await moviesRes.json();
      
      setStats({
        movies: moviesData.total || 0,
        users: 0,
        views: 0
      });
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const syncMovies = async () => {
    setSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch('/api/admin/sync-movies', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      const data = await res.json();
      setSyncResult(data);
      await fetchStats();
    } catch (err) {
      console.error('Sync error:', err);
      setSyncResult({
        success: false,
        message: err.message
      });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            Admin Panel
          </h1>
          <p className="text-gray-400 mt-2">Manage your streaming platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center">
                <Film className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Movies</p>
                <p className="text-2xl font-bold text-white">{stats.movies}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.users}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-white">{stats.views}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Storage</p>
                <p className="text-2xl font-bold text-white">Azure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Section */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Azure Blob Sync</h2>
              <p className="text-gray-400 text-sm">Sync movies from Azure Blob Storage to database</p>
            </div>
            <button
              onClick={syncMovies}
              disabled={syncing}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {syncing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Sync Movies
                </>
              )}
            </button>
          </div>

          {/* Sync Result */}
          {syncResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl ${
                syncResult.success ? 'bg-green-600/20' : 'bg-red-600/20'
              }`}
            >
              <div className="flex items-start gap-3">
                {syncResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                )}
                <div>
                  <p className="text-white font-medium">{syncResult.message}</p>
                  {syncResult.results && (
                    <div className="mt-2 text-sm text-gray-300">
                      <p>Added: {syncResult.results.added}</p>
                      <p>Updated: {syncResult.results.updated}</p>
                      {syncResult.results.errors?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-red-400">Errors:</p>
                          {syncResult.results.errors.map((err, i) => (
                            <p key={i} className="text-red-400">- {err.movie}: {err.error}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Azure Config Info */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-500 text-sm font-medium">Configuration Required</span>
            </div>
            <p className="text-gray-400 text-sm">
              Set the following environment variables for Azure integration:
            </p>
            <ul className="mt-2 text-gray-400 text-sm space-y-1">
              <li>• <code className="text-red-400">AZURE_STORAGE_ACCOUNT_NAME</code> = streamvaultmovies</li>
              <li>• <code className="text-red-400">AZURE_STORAGE_CONTAINER_NAME</code> = movies</li>
              <li>• <code className="text-red-400">AZURE_STORAGE_SAS_KEY</code> = &lt;your-sas-key&gt;</li>
            </ul>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-300 text-sm">System initialized successfully</span>
              <span className="text-gray-500 text-xs ml-auto">Just now</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-gray-300 text-sm">Admin panel accessed</span>
              <span className="text-gray-500 text-xs ml-auto">Just now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
