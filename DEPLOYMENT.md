# 🚀 Deploy StreamVault to Azure Static Web Apps

This guide walks you through deploying StreamVault to Azure Static Web Apps with GitHub Actions.

---

## 📋 Prerequisites

1. **Azure Account** - [Create a free account](https://azure.microsoft.com/free/)
2. **GitHub Account** - [Sign up](https://github.com/signup)
3. **Supabase Project** - [Create one](https://supabase.com/dashboard)
4. **Git installed** on your machine

---

## Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - StreamVault movie streaming app"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Create Azure Static Web App

1. **Go to Azure Portal**: https://portal.azure.com

2. **Create a resource** → Search for "Static Web App" → Click **Create**

3. **Fill in the basics**:
   | Field | Value |
   |-------|-------|
   | Resource Group | `streamvault-rg` (create new) |
   | Name | `streamvault-app` |
   | Plan Type | **Free** (for development) |
   | Region | Choose closest to your users |
   | Source | **GitHub** |

4. **Connect to GitHub**:
   - Click **Sign in with GitHub**
   - Authorize Azure to access your repositories
   - Select your repository and branch (`main`)

5. **Build configurations**:
   | Field | Value |
   |-------|-------|
   | Build Presets | **Vite** |
   | App location | `/` |
   | Api location | `api` |
   | Output location | `dist` |

6. **Click Review + Create** → **Create**

7. **Wait for deployment** (~2-3 minutes)

---

## Step 3: Get Deployment Token

1. Go to your Static Web App resource in Azure Portal
2. In the left menu, click **Configuration** → **Deployment token**
3. Click **Copy token** - you'll need this for GitHub secrets

---

## Step 4: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following:

### Required Secrets

| Secret Name | Value | Where to get it |
|-------------|-------|-----------------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Deployment token from Step 3 | Azure Portal |
| `SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Supabase Dashboard → Settings → API |

### Optional Secrets (for Google OAuth)

| Secret Name | Value |
|-------------|-------|
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
| `GOOGLE_AUTH_PROXY` | `https://designarena.ai/auth/google/callback` |

---

## Step 5: Trigger Deployment

### Option A: Push a commit
```bash
git commit --allow-empty -m "Trigger deployment"
git push
```

### Option B: Manual trigger
1. Go to **Actions** tab in GitHub
2. Click **Deploy to Azure Static Web Apps**
3. Click **Run workflow**

---

## Step 6: Access Your App

1. Go to Azure Portal → Your Static Web App
2. Click the **URL** shown in the overview
3. Your app is now live! 🎉

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `.github/workflows/azure-static-web-apps.yml` | GitHub Actions deployment pipeline |
| `staticwebapp.config.json` | Azure Static Web Apps routing & auth config |
| `api/host.json` | Azure Functions host configuration |
| `api/local.settings.json` | Local development settings |
| `api/package.json` | API dependencies |

---

## 🧪 Local Development with Azure Functions

### Install Azure Functions Core Tools
```bash
# macOS
brew install azure-functions-core-tools@4

# Windows
winget install Microsoft.Azure.FunctionsCoreTools

# Linux
sudo apt-get install azure-functions-core-tools
```

### Run locally
```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start Azure Functions
cd api
npm install
func start --port 7071
```

### Environment variables for local development
Edit `api/local.settings.json` and add your Supabase credentials.

---

## 🌐 Project Structure

```
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml    # GitHub Actions pipeline
│
├── api/                                  # Azure Functions (Backend)
│   ├── auth/                            # Authentication endpoints
│   │   ├── me.js
│   │   ├── profile.js
│   │   └── google.js
│   ├── movies/                          # Movie endpoints
│   │   ├── index.js
│   │   └── [id].js
│   ├── favorites/                       # User favorites
│   ├── watch-history/                   # Viewing history
│   ├── stream/                          # Video streaming
│   ├── admin/                           # Admin endpoints
│   ├── db-client.js                     # Supabase client
│   ├── db-wake.js                       # Database wake utility
│   ├── host.json                        # Azure Functions config
│   ├── local.settings.json              # Local dev settings
│   └── package.json                     # API dependencies
│
├── src/                                 # React Frontend
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   └── pages/
│
├── staticwebapp.config.json             # Azure routing config
├── vercel.json                          # Vercel config (alternative)
└── package.json                         # Frontend dependencies
```

---

## 🔐 Authentication Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Azure API      │────▶│   Supabase      │
│   (React)       │     │   (Functions)    │     │   (Database)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                       │
        │   1. Login with        │                       │
        │      email/Google      │                       │
        │                        │                       │
        │   2. Get JWT token     │                       │
        │◀───────────────────────│                       │
        │                        │                       │
        │   3. API calls with    │                       │
        │      Bearer token      │                       │
        │───────────────────────▶│   4. Verify token     │
        │                        │──────────────────────▶│
        │                        │                       │
        │                        │   5. Return data      │
        │                        │◀──────────────────────│
        │   6. Return response   │                       │
        │◀───────────────────────│                       │
```

---

## 🐛 Troubleshooting

### Deployment fails
1. Check GitHub Actions logs for errors
2. Verify all secrets are set correctly
3. Ensure `SUPABASE_SERVICE_ROLE_KEY` is correct

### API returns 404
1. Check `api/` folder structure
2. Verify `host.json` exists
3. Check Azure Functions logs in Azure Portal

### Authentication fails
1. Verify Supabase URL and keys
2. Check browser console for errors
3. Ensure CORS is configured (Supabase handles this automatically)

### Build fails
1. Run `npm run build` locally to check for errors
2. Check TypeScript errors with `npx tsc --noEmit`

---

## 💰 Cost Estimation (Free Tier)

| Service | Free Tier Limits |
|---------|------------------|
| Azure Static Web Apps | 100GB bandwidth, 500K API requests/month |
| Supabase | 500MB database, 1GB storage, 50K monthly active users |

---

## 📞 Support

- **Azure Static Web Apps Docs**: https://docs.microsoft.com/azure/static-web-apps/
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Actions Docs**: https://docs.github.com/en/actions

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Azure Static Web App created
- [ ] Deployment token copied
- [ ] GitHub secrets configured
- [ ] Deployment triggered
- [ ] App accessible via Azure URL
- [ ] Login works with admin@streamvault.com
- [ ] Movies load correctly
- [ ] Video playback works

---

**Happy Streaming! 🎬**
