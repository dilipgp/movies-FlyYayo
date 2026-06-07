// Load environment variables FIRST before any other imports
import { config } from 'dotenv';
config();

// Now import everything else
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

// Verify environment variables are loaded
console.log('Environment check:');
console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Set' : '✗ Missing');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Import all API handlers (after env vars are loaded)
const { default: authMeHandler } = await import('./api/auth/me.js');
const { default: authProfileHandler } = await import('./api/auth/profile.js');
const { default: authGoogleHandler } = await import('./api/auth/google.js');
const { default: moviesIndexHandler } = await import('./api/movies/index.js');
const { default: moviesSearchHandler } = await import('./api/movies/search.js');
const { default: moviesIdHandler } = await import('./api/movies/[id].js');
const { default: favoritesHandler } = await import('./api/favorites/index.js');
const { default: watchHistoryHandler } = await import('./api/watch-history/index.js');
const { default: streamHandler } = await import('./api/stream/[movieName].js');
const { default: adminSyncHandler } = await import('./api/admin/sync-movies.js');

// Wrap Vercel-style handler for Express
function wrapHandler(handler) {
  return async (req, res) => {
    const vercelReq = {
      ...req,
      method: req.method,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
    };

    try {
      await handler(vercelReq, res);
    } catch (err) {
      console.error('Handler error:', err);
      res.status(500).json({ error: err.message });
    }
  };
}

// Register routes
console.log('\nRegistering routes...');
app.all('/api/auth/me', wrapHandler(authMeHandler));
app.all('/api/auth/profile', wrapHandler(authProfileHandler));
app.all('/api/auth/google', wrapHandler(authGoogleHandler));
app.all('/api/movies/search', wrapHandler(moviesSearchHandler));
app.all('/api/movies/:id', wrapHandler(moviesIdHandler));
app.all('/api/movies', wrapHandler(moviesIndexHandler));
app.all('/api/favorites', wrapHandler(favoritesHandler));
app.all('/api/watch-history', wrapHandler(watchHistoryHandler));
app.all('/api/stream/:movieName', wrapHandler(streamHandler));
app.all('/api/admin/sync-movies', wrapHandler(adminSyncHandler));
console.log('✓ All routes registered\n');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 StreamVault Backend Server                           ║
║                                                           ║
║   Backend API:  http://localhost:${PORT}                     ║
║   Frontend:      http://localhost:5173 (run separately)   ║
║                                                           ║
║   Health Check:  http://localhost:${PORT}/api/health         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
