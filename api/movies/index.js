import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { category, limit = 50, offset = 0 } = req.query;

      let query = supabase
        .from('movies')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

      if (category) {
        query = query.contains('categories', [category]);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      res.status(200).json({ movies: data, total: count });
    } else if (req.method === 'POST') {
      // Admin only - add new movie
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.replace('Bearer ', '');
      const { data: { user: authUser }, error } = await supabase.auth.getUser(token);

      if (error || !authUser) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const { data: adminUser } = await supabase
        .from('users')
        .select('role')
        .eq('email', authUser.email)
        .single();

      if (!adminUser || adminUser.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const movieData = req.body;
      const { data, error: insertError } = await supabase
        .from('movies')
        .insert(movieData)
        .select()
        .single();

      if (insertError) throw insertError;

      res.status(201).json(data);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Movies API error:', err);
    res.status(500).json({ error: err.message });
  }
}
