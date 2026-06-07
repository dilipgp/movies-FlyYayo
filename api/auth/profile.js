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
      // Get user profile from users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', authUser.email)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // If profile doesn't exist, create one
      if (!profile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('users')
          .insert({
            email: authUser.email,
            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email.split('@')[0],
            picture: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture,
            role: 'user'
          })
          .select()
          .single();

        if (insertError) throw insertError;
        
        return res.status(200).json({ profile: newProfile });
      }

      res.status(200).json({ profile });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Profile API error:', err);
    res.status(500).json({ error: err.message });
  }
}
