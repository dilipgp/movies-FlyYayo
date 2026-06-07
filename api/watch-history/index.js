import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: authUser }, error } = await supabase.auth.getUser(token);

    if (error || !authUser) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (req.method === 'GET') {
      const { limit = 20 } = req.query;

      const { data, error: fetchError } = await supabase
        .from('watch_history')
        .select(`
          *,
          movie:movies(*)
        `)
        .eq('user_id', authUser.id)
        .order('watched_at', { ascending: false })
        .limit(parseInt(limit));

      if (fetchError) throw fetchError;

      res.status(200).json({ history: data });
    } else if (req.method === 'POST') {
      const { movie_id, progress } = req.body;

      const { data, error: upsertError } = await supabase
        .from('watch_history')
        .upsert({
          user_id: authUser.id,
          movie_id,
          progress,
          watched_at: new Date().toISOString()
        }, { onConflict: 'user_id,movie_id' })
        .select()
        .single();

      if (upsertError) throw upsertError;

      res.status(200).json(data);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Watch history error:', err);
    res.status(500).json({ error: err.message });
  }
}
