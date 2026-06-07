import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Movie not found' });
        }
        throw error;
      }

      res.status(200).json(data);
    } else if (req.method === 'PUT') {
      // Admin only
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

      const { data, error: updateError } = await supabase
        .from('movies')
        .update(req.body)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      res.status(200).json(data);
    } else if (req.method === 'DELETE') {
      // Admin only
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

      const { error: deleteError } = await supabase
        .from('movies')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      res.status(200).json({ ok: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Movie API error:', err);
    res.status(500).json({ error: err.message });
  }
}
