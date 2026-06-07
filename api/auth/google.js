import supabase from '../db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id_token } = req.body;

    if (!id_token) {
      return res.status(400).json({ error: 'ID token required' });
    }

    // Verify Google ID token
    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
    );

    if (!googleResponse.ok) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    const googleUser = await googleResponse.json();
    const { email, name, picture, sub: googleId } = googleUser;

    // Check if user exists, create if not
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code === 'PGRST116') {
      // User doesn't exist, create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email,
          name,
          picture,
          google_id: googleId,
          role: 'user'
        })
        .select()
        .single();

      if (createError) throw createError;
      user = newUser;
    } else if (error) {
      throw error;
    }

    // Create session using Supabase auth
    const { data: session, error: sessionError } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: id_token
    });

    if (sessionError) {
      console.error('Session error:', sessionError);
      // Continue without Supabase session, use our own token
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role
      },
      access_token: session?.session?.access_token || id_token
    });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: err.message });
  }
}
