import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
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
      const { data, error: fetchError } = await supabase
        .from('favorites')
        .select(`
          *,
          movie:movies(*)
        `)
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      res.status(200).json({ favorites: data });
    } else if (req.method === 'POST') {
      const { movie_id } = req.body;

      const { data, error: insertError } = await supabase
        .from('favorites')
        .insert({ user_id: authUser.id, movie_id })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          return res.status(400).json({ error: 'Already in favorites' });
        }
        throw insertError;
      }

      res.status(201).json(data);
    } else if (req.method === 'DELETE') {
      const { movie_id } = req.body;

      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', authUser.id)
        .eq('movie_id', movie_id);

      if (deleteError) throw deleteError;

      res.status(200).json({ ok: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Favorites error:', err);
    res.status(500).json({ error: err.message });
  }
}
