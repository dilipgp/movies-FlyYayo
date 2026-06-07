import supabase from '../db-client.js';
import crypto from 'crypto';

// Azure Blob Storage configuration
const AZURE_ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT_NAME || 'streamvaultmovies';
const AZURE_CONTAINER = process.env.AZURE_STORAGE_CONTAINER_NAME || 'movies';
const AZURE_SAS_KEY = process.env.AZURE_STORAGE_SAS_KEY || '';

function generateSasUrl(blobName) {
  // If SAS key is provided, use it for secure access
  if (AZURE_SAS_KEY) {
    const baseUrl = `https://${AZURE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}/${blobName}`;
    return `${baseUrl}?${AZURE_SAS_KEY}`;
  }
  
  // Fallback: Generate a time-limited SAS token (simplified version)
  // In production, you'd use @azure/storage-blob SDK
  const expiry = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
  const expiryStr = expiry.toISOString().replace(/\.\d{3}Z$/, 'Z');
  
  // For demo purposes, return public URL if available
  return `https://${AZURE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}/${blobName}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { movieName } = req.query;

    if (!movieName) {
      return res.status(400).json({ error: 'Movie name required' });
    }

    // Verify user is authenticated
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: authUser }, error } = await supabase.auth.getUser(token);

    if (error || !authUser) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get movie from database
    const { data: movie, error: movieError } = await supabase
      .from('movies')
      .select('*')
      .eq('id', movieName)
      .or(`blob_name.eq.${movieName}`)
      .single();

    if (movieError || !movie) {
      // If movie not in DB, try to generate URL directly
      const sasUrl = generateSasUrl(movieName);
      
      return res.status(200).json({
        streamUrl: sasUrl,
        movieName,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      });
    }

    // Generate SAS URL for the movie
    const blobName = movie.blob_name || movie.video_url?.split('/').pop() || movieName;
    const sasUrl = generateSasUrl(blobName);

    // Log watch history
    await supabase
      .from('watch_history')
      .upsert({
        user_id: authUser.id,
        movie_id: movie.id,
        watched_at: new Date().toISOString(),
        progress: 0
      }, { onConflict: 'user_id,movie_id' });

    res.status(200).json({
      streamUrl: sasUrl,
      movie,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    });
  } catch (err) {
    console.error('Stream URL error:', err);
    res.status(500).json({ error: err.message });
  }
}
