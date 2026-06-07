import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q, category, limit = 20 } = req.query;

    if (!q && !category) {
      return res.status(400).json({ error: 'Search query or category required' });
    }

    let query = supabase
      .from('movies')
      .select('*')
      .eq('is_active', true)
      .limit(parseInt(limit));

    if (q) {
      // Search in title and description
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    }

    if (category) {
      query = query.contains('categories', [category]);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json({ movies: data });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: err.message });
  }
}
