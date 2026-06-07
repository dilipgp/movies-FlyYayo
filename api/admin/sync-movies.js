import supabase from '../db-client.js';

// Azure Blob Storage configuration
const AZURE_ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT_NAME || 'streamvaultmovies';
const AZURE_CONTAINER = process.env.AZURE_STORAGE_CONTAINER_NAME || 'movies';
const AZURE_SAS_KEY = process.env.AZURE_STORAGE_SAS_KEY || '';

// Sample movies for demo (in production, this would fetch from Azure)
const DEMO_MOVIES = [
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    thumbnail_url: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    blob_name: 'dark-knight.mp4',
    duration: 9120,
    categories: ['Action', 'Drama', 'Thriller'],
    rating: 9.0,
    year: 2008,
    is_active: true
  },
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    thumbnail_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    blob_name: 'inception.mp4',
    duration: 8880,
    categories: ['Action', 'Sci-Fi', 'Thriller'],
    rating: 8.8,
    year: 2010,
    is_active: true
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    thumbnail_url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    blob_name: 'interstellar.mp4',
    duration: 10140,
    categories: ['Adventure', 'Drama', 'Sci-Fi'],
    rating: 8.6,
    year: 2014,
    is_active: true
  },
  {
    title: 'The Matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    blob_name: 'matrix.mp4',
    duration: 8160,
    categories: ['Action', 'Sci-Fi'],
    rating: 8.7,
    year: 1999,
    is_active: true
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    thumbnail_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    blob_name: 'pulp-fiction.mp4',
    duration: 9480,
    categories: ['Crime', 'Drama'],
    rating: 8.9,
    year: 1994,
    is_active: true
  },
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    blob_name: 'shawshank.mp4',
    duration: 8520,
    categories: ['Drama'],
    rating: 9.3,
    year: 1994,
    is_active: true
  },
  {
    title: 'Avatar',
    description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
    thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    blob_name: 'avatar.mp4',
    duration: 9720,
    categories: ['Action', 'Adventure', 'Fantasy'],
    rating: 7.9,
    year: 2009,
    is_active: true
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.',
    thumbnail_url: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    blob_name: 'godfather.mp4',
    duration: 10500,
    categories: ['Crime', 'Drama'],
    rating: 9.2,
    year: 1972,
    is_active: true
  },
  {
    title: 'Forrest Gump',
    description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
    thumbnail_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    blob_name: 'forrest-gump.mp4',
    duration: 8520,
    categories: ['Drama', 'Romance'],
    rating: 8.8,
    year: 1994,
    is_active: true
  },
  {
    title: 'Fight Club',
    description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
    thumbnail_url: 'https://images.unsplash.com/photo-1535016120720-40c646be5583?w=400',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    blob_name: 'fight-club.mp4',
    duration: 8280,
    categories: ['Drama', 'Thriller'],
    rating: 8.8,
    year: 1999,
    is_active: true
  },
  {
    title: 'Titanic',
    description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
    thumbnail_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    blob_name: 'titanic.mp4',
    duration: 11520,
    categories: ['Drama', 'Romance'],
    rating: 7.9,
    year: 1997,
    is_active: true
  },
  {
    title: 'The Silence of the Lambs',
    description: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.',
    thumbnail_url: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    blob_name: 'silence-lambs.mp4',
    duration: 7080,
    categories: ['Crime', 'Drama', 'Thriller'],
    rating: 8.6,
    year: 1991,
    is_active: true
  }
];

async function fetchMoviesFromAzure() {
  // In production, this would use Azure Storage SDK to list blobs
  // For demo, we return sample movies
  
  if (AZURE_SAS_KEY) {
    try {
      // Try to list blobs from Azure
      const listUrl = `https://${AZURE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}?restype=container&comp=list&${AZURE_SAS_KEY}`;
      const response = await fetch(listUrl);
      
      if (response.ok) {
        const text = await response.text();
        // Parse XML response and extract blob names
        // For now, return demo movies
      }
    } catch (err) {
      console.error('Azure fetch error:', err);
    }
  }
  
  return DEMO_MOVIES;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify admin access
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

    // Fetch movies from Azure (or demo data)
    const movies = await fetchMoviesFromAzure();
    
    const results = {
      added: 0,
      updated: 0,
      errors: []
    };

    for (const movie of movies) {
      try {
        // Check if movie exists
        const { data: existing } = await supabase
          .from('movies')
          .select('id')
          .eq('blob_name', movie.blob_name)
          .single();

        if (existing) {
          // Update existing movie
          const { error: updateError } = await supabase
            .from('movies')
            .update(movie)
            .eq('id', existing.id);
          
          if (updateError) {
            results.errors.push({ movie: movie.title, error: updateError.message });
          } else {
            results.updated++;
          }
        } else {
          // Insert new movie
          const { error: insertError } = await supabase
            .from('movies')
            .insert(movie);
          
          if (insertError) {
            results.errors.push({ movie: movie.title, error: insertError.message });
          } else {
            results.added++;
          }
        }
      } catch (err) {
        results.errors.push({ movie: movie.title, error: err.message });
      }
    }

    res.status(200).json({
      success: true,
      message: `Synced ${movies.length} movies`,
      results
    });
  } catch (err) {
    console.error('Sync error:', err);
    res.status(500).json({ error: err.message });
  }
}
