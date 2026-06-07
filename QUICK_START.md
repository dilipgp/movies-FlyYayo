# 🚀 StreamVault - Quick Start Guide

## Local Development (5 Minutes)

### 1. Install Node.js
Download from [nodejs.org](https://nodejs.org) (LTS version)

### 2. Clone & Install
```bash
git clone <your-repo-url>
cd streamvault
npm install
```

### 3. Create .env File
Create `.env` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run
```bash
npm run dev
```
Open http://localhost:5173

---

## Azure Storage Quick Setup

### Create Storage Account
1. Go to [portal.azure.com](https://portal.azure.com)
2. Create a resource → Storage account
3. Name: `streamvaultmovies`
4. Click Create

### Create Container
1. Open your storage account
2. Containers → + Container
3. Name: `movies`
4. Access: Private

### Upload Movies
1. Open `movies` container
2. Click Upload
3. Select `.mp4` files
4. Click Upload

### Get SAS Token
1. Storage account → Shared access signature
2. Permissions: Read, List
3. Set expiry date
4. Generate and copy SAS token
5. Add to `.env`:
```env
AZURE_STORAGE_ACCOUNT_NAME=streamvaultmovies
AZURE_STORAGE_CONTAINER_NAME=movies
AZURE_STORAGE_SAS_KEY=sv=2021-01-01&ss=b...
```

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
# Mac/Linux
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Module not found
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Environment variables not loading
- Ensure `.env` is in project root
- Restart dev server after changes
- Check for typos in variable names

---

## Demo Credentials

- **Email:** admin@streamvault.com
- **Password:** admin123

---

## Need Help?

See `BEGINNERS_GUIDE.md` for detailed instructions.
