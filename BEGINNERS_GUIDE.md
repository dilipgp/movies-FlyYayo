# 🎬 StreamVault - Complete Beginner's Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [Environment Variables](#environment-variables)
4. [Running the App](#running-the-app)
5. [Troubleshooting](#troubleshooting)
6. [Azure Storage Setup](#azure-storage-setup)
7. [Uploading Movies to Azure](#uploading-movies)
8. [Managing Movie Files](#managing-movies)

---

## 1. Prerequisites <a name="prerequisites"></a>

### What You Need Installed

| Software | Version | Download Link | Purpose |
|----------|---------|---------------|---------|
| **Node.js** | 18.x or higher | [nodejs.org](https://nodejs.org) | Runs JavaScript code |
| **npm** | Comes with Node.js | - | Package manager |
| **Git** | Latest | [git-scm.com](https://git-scm.com) | Version control |
| **VS Code** | Latest | [code.visualstudio.com](https://code.visualstudio.com) | Code editor (recommended) |

### How to Check if Installed

Open **Terminal** (Mac/Linux) or **Command Prompt/PowerShell** (Windows) and run:

```bash
# Check Node.js
node --version
# Should show: v18.x.x or higher

# Check npm
npm --version
# Should show: 9.x.x or higher

# Check Git
git --version
# Should show: git version 2.x.x
```

### Installing Node.js (Detailed Steps)

**Windows:**
1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS** (Long Term Support) version
3. Run the installer (.msi file)
4. Click "Next" through all prompts
5. Restart your terminal

**Mac:**
1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS** version for macOS
3. Run the installer (.pkg file)
4. Follow the installation prompts
5. Restart your terminal

**Alternative - Using Homebrew (Mac):**
```bash
brew install node
```

---

## 2. Local Setup <a name="local-setup"></a>

### Step 1: Download the Project

**Option A: Clone with Git (Recommended)**
```bash
# Navigate to your projects folder
cd ~/Documents  # Mac/Linux
cd %USERPROFILE%\Documents  # Windows

# Clone the repository
git clone https://github.com/your-username/streamvault.git

# Enter the project folder
cd streamvault
```

**Option B: Download ZIP**
1. Go to the GitHub repository
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Open terminal in the extracted folder

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install
```

This command reads `package.json` and downloads all necessary libraries. It may take 1-3 minutes.

**What gets installed:**
- React and React DOM
- Tailwind CSS
- Framer Motion (animations)
- Supabase client
- Lucide React (icons)
- And many more...

### Step 3: Verify Installation

```bash
# Check if node_modules folder exists
ls node_modules  # Mac/Linux
dir node_modules  # Windows

# Should show a long list of folders
```

---

## 3. Environment Variables <a name="environment-variables"></a>

### What Are Environment Variables?

Environment variables are like **secret settings** that your app needs to work. They include:
- Database connection URLs
- API keys
- Secret tokens
- Configuration settings

**⚠️ IMPORTANT:** Never share these values or commit them to GitHub!

### Creating the .env File

1. **Create a new file** in the project root folder
2. **Name it exactly:** `.env` (with the dot at the beginning)
3. **Add your variables:**

```env
# ===========================================
# SUPABASE CONFIGURATION (Required)
# ===========================================
# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co

# Public anonymous key (safe for frontend)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service role key (SECRET - server-side only!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===========================================
# GOOGLE OAUTH (Required for Google Sign-In)
# ===========================================
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com

# ===========================================
# AZURE STORAGE (For video streaming)
# ===========================================
AZURE_STORAGE_ACCOUNT_NAME=streamvaultmovies
AZURE_STORAGE_CONTAINER_NAME=movies
AZURE_STORAGE_SAS_KEY=sv=2021-01-01&ss=b&srt=sco...
```

### Where to Get These Values

#### Supabase Values

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Create a new project
4. Go to **Settings** → **API**
5. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

#### Google OAuth Values

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized JavaScript origins (your domain)
7. Copy the **Client ID** → `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

#### Azure Storage Values (Covered in detail later)

---

## 4. Running the App <a name="running-the-app"></a>

### Development Mode (For Testing)

```bash
# Start the development server
npm run dev
```

**What happens:**
1. Vite starts a local development server
2. Opens your browser automatically
3. Shows the app at `http://localhost:5173`
4. Hot-reloads when you make changes

**Expected output:**
```
  VITE v7.3.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h + enter to show help
```

### Production Build (For Deployment)

```bash
# Build the app for production
npm run build
```

**What happens:**
1. Compiles all TypeScript files
2. Bundles all JavaScript into optimized files
3. Processes all CSS
4. Creates a `dist` folder with static files

**Expected output:**
```
dist/index.html           0.66 kB
dist/assets/index.css    40.00 kB
dist/assets/index.js    600.00 kB
✓ built in 15.00s
```

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

### Common NPM Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check for code errors |

---

## 5. Troubleshooting <a name="troubleshooting"></a>

### Common Issues and Solutions

#### Problem 1: "npm: command not found"

**Solution:**
- Node.js is not installed or not in your PATH
- Reinstall Node.js from [nodejs.org](https://nodejs.org)
- Restart your terminal after installation

#### Problem 2: "EACCES permission denied"

**Solution (Mac/Linux):**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**Solution (Windows):**
- Run Command Prompt as Administrator
- Or use PowerShell as Administrator

#### Problem 3: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules  # Mac/Linux
rmdir /s node_modules  # Windows

rm package-lock.json  # Mac/Linux
del package-lock.json  # Windows

npm install
```

#### Problem 4: Port 5173 already in use

**Solution:**
```bash
# Find and kill the process using port 5173
# Mac/Linux
lsof -i :5173
kill -9 <PID>

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3000
```

#### Problem 5: "Invalid environment variables"

**Solution:**
1. Make sure `.env` file is in the **root folder**
2. Check for typos in variable names
3. Ensure no spaces around the `=` sign
4. Restart the dev server after changing `.env`

#### Problem 6: White screen / Blank page

**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Verify your `.env` variables are correct

#### Problem 7: "Failed to fetch" errors

**Solution:**
1. Check if the API server is running
2. Verify the API URL in your `.env`
3. Check for CORS issues
4. Ensure you're logged in (for protected routes)

### Getting Help

1. **Check the browser console** (F12 → Console tab)
2. **Check the terminal** for server errors
3. **Search the error message** on Google
4. **Check GitHub Issues** for known problems

---

## 6. Azure Storage Setup <a name="azure-storage-setup"></a>

### What is Azure Blob Storage?

Azure Blob Storage is like **cloud hard drive** for storing files:
- **Blob** = Binary Large Object (a file)
- **Container** = Like a folder that holds blobs
- **Storage Account** = The main container for all your data

### Creating an Azure Storage Account

#### Step 1: Create Azure Account

1. Go to [azure.microsoft.com](https://azure.microsoft.com)
2. Click **"Start free"** or **"Sign in"**
3. Complete the registration (requires credit card for verification)
4. You get **$200 free credit** for first 30 days

#### Step 2: Create Storage Account

1. Sign in to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"** (top left, + icon)
3. Search for **"Storage account"**
4. Click **"Create"**

**Fill in the form:**

| Field | Value | Explanation |
|-------|-------|-------------|
| Subscription | Your subscription | Usually "Pay-As-You-Go" |
| Resource group | Create new: "StreamVaultRG" | Groups related resources |
| Storage account name | `streamvaultmovies` | Must be globally unique, lowercase |
| Region | East US (or nearest) | Choose closest to your users |
| Performance | Standard | Good for video streaming |
| Redundancy | LRS | Cheapest option, fine for movies |

5. Click **"Review + create"**
6. Click **"Create"**
7. Wait 1-2 minutes for deployment

#### Step 3: Create a Container

1. Go to your new storage account
2. Click **"Containers"** in the left menu
3. Click **"+ Container"**
4. Name: `movies`
5. Public access level: **Private** (recommended for security)
6. Click **"Create"**

### Understanding the Structure

```
Azure Storage Account: streamvaultmovies
│
└── Container: movies
    │
    ├── action/
    │   ├── movie1.mp4
    │   └── movie2.mp4
    │
    ├── drama/
    │   ├── movie3.mp4
    │   └── movie4.mp4
    │
    └── thumbnails/
        ├── movie1.jpg
        └── movie2.jpg
```

---

## 7. Uploading Movies to Azure <a name="uploading-movies"></a>

### Method 1: Azure Portal (Easiest)

#### Step-by-Step:

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your storage account → **Containers**
3. Click on `movies` container
4. Click **"Upload"** button (top toolbar)
5. **Select files:**
   - Click folder icon or drag & drop
   - Select your `.mp4` video files
6. **Advanced settings (optional):**
   - Block size: Default
   - Blob type: Block blob
   - Access tier: Hot (for frequently accessed files)
7. Click **"Upload"**
8. Wait for upload to complete

**Tips:**
- Maximum file size via portal: **190.7 GB**
- Upload multiple files at once
- Create folders by using `/` in the blob name (e.g., `action/movie1.mp4`)

### Method 2: Azure Storage Explorer (Recommended for Large Files)

#### Installing Azure Storage Explorer:

1. Go to [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)
2. Download for your OS (Windows/Mac/Linux)
3. Install and open the application

#### Connecting to Your Storage:

1. Open Azure Storage Explorer
2. Click **"Connect to Azure Storage"**
3. Select **"Storage account or service"**
4. Choose **"Account name and key"**
5. Enter:
   - **Account name:** `streamvaultmovies`
   - **Account key:** (Get from Azure Portal → Access keys)
6. Click **"Next"** → **"Connect"**

#### Uploading Files:

1. Navigate to **Blob Containers** → `movies`
2. Click **"Upload"** → **"Upload Files"** or **"Upload Folder"**
3. Select your video files
4. Choose destination folder (optional)
5. Click **"Upload"**

**Advantages:**
- Faster uploads
- Resume interrupted uploads
- Upload entire folders
- Preview files
- Manage permissions easily

### Method 3: Azure CLI (Command Line)

#### Installing Azure CLI:

**Windows:**
```powershell
# Download and run the MSI installer from:
# https://aka.ms/installazurecliwindows
```

**Mac:**
```bash
brew install azure-cli
```

**Linux:**
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

#### Uploading Files:

```bash
# Login to Azure
az login

# Upload a single file
az storage blob upload \
  --account-name streamvaultmovies \
  --container-name movies \
  --name "action/hero-movie.mp4" \
  --file "./videos/hero-movie.mp4"

# Upload multiple files
az storage blob upload-batch \
  --account-name streamvaultmovies \
  --destination movies \
  --source "./videos/"

# Upload with SAS token
az storage blob upload \
  --account-name streamvaultmovies \
  --container-name movies \
  --name "movie.mp4" \
  --file "movie.mp4" \
  --sas-token "sv=2021-01-01&ss=b&srt=sco..."
```

### Method 4: Using Code (Node.js)

#### Install Azure SDK:

```bash
npm install @azure/storage-blob
```

#### Upload Script:

```javascript
// upload-movie.js
const { BlobServiceClient } = require('@azure/storage-blob');

// Configuration
const ACCOUNT_NAME = 'streamvaultmovies';
const SAS_TOKEN = 'your-sas-token-here';
const CONTAINER_NAME = 'movies';

async function uploadMovie(filePath, blobName) {
  // Create client
  const blobServiceUrl = `https://${ACCOUNT_NAME}.blob.core.windows.net?${SAS_TOKEN}`;
  const blobServiceClient = new BlobServiceClient(blobServiceUrl);
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  
  // Get blob client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
  // Upload file
  console.log(`Uploading ${filePath}...`);
  const uploadResult = await blockBlobClient.uploadFile(filePath);
  
  console.log(`Upload complete! Blob URL: ${blockBlobClient.url}`);
  return uploadResult;
}

// Usage
uploadMovie('./videos/my-movie.mp4', 'action/my-movie.mp4')
  .then(() => console.log('Done!'))
  .catch(err => console.error('Error:', err));
```

**Run the script:**
```bash
node upload-movie.js
```

---

## 8. Managing Movie Files <a name="managing-movies"></a>

### Generating SAS Tokens

A **SAS (Shared Access Signature) token** is like a temporary password that lets someone access your files for a limited time.

#### Creating a SAS Token in Azure Portal:

1. Go to your storage account
2. Click **"Shared access signature"** in the left menu
3. Configure permissions:

| Setting | Recommended Value |
|---------|-------------------|
| Allowed services | Blob |
| Allowed resource types | Container, Object |
| Allowed permissions | Read, List |
| Start date | Today |
| Expiry date | 1-2 years from now |
| Allowed protocols | HTTPS only |

4. Click **"Generate SAS and connection string"**
5. Copy the **"SAS token"** (starts with `sv=`)

**Example SAS token:**
```
sv=2021-01-01&ss=b&srt=sco&sp=rl&se=2025-12-31T23:59:59Z&st=2024-01-01T00:00:00Z&spr=https&sig=abcdefghijklmnopqrstuvxyz1234567890
```

#### Using SAS Token in Your App:

Add to your `.env` file:
```env
AZURE_STORAGE_SAS_KEY=sv=2021-01-01&ss=b&srt=sco&sp=rl&se=2025-12-31T23:59:59Z&st=2024-01-01T00:00:00Z&spr=https&sig=xxx
```

### Getting Connection String

1. Go to your storage account
2. Click **"Access keys"** in the left menu
3. Click **"Show"** next to Connection string
4. Copy the connection string

**Example connection string:**
```
DefaultEndpointsProtocol=https;AccountName=streamvaultmovies;AccountKey=abcdefghijklmnopqrstuvxyz1234567890abcdefghijklmnopqrstuvxyz1234567890==;EndpointSuffix=core.windows.net
```

### Organizing Your Movies

#### Recommended Folder Structure:

```
movies/
├── action/
│   ├── john-wick.mp4
│   ├── mission-impossible.mp4
│   └── thumbnails/
│       ├── john-wick.jpg
│       └── mission-impossible.jpg
│
├── comedy/
│   ├── superbad.mp4
│   └── thumbnails/
│       └── superbad.jpg
│
├── drama/
│   ├── shawshank-redemption.mp4
│   └── thumbnails/
│       └── shawshank-redemption.jpg
│
└── thumbnails/
    └── default-thumbnail.jpg
```

### Setting Permissions

#### Container-Level Permissions:

1. Go to your container in Azure Portal
2. Click **"Access level"**
3. Choose:
   - **Private** - No anonymous access (recommended)
   - **Blob** - Anyone with URL can read blobs
   - **Container** - Anyone can list and read blobs

#### Using Stored Access Policies:

For better security control, create stored access policies:

```bash
# Create a stored access policy
az storage container policy create \
  --account-name streamvaultmovies \
  --container-name movies \
  --name "read-only-policy" \
  --permission r \
  --expiry "2025-12-31T23:59:59Z"
```

### Listing Files in Azure

#### Using Azure Portal:

1. Go to your container
2. See all files listed
3. Use search/filter to find specific files

#### Using Azure CLI:

```bash
# List all blobs in container
az storage blob list \
  --account-name streamvaultmovies \
  --container-name movies \
  --output table

# List with specific prefix
az storage blob list \
  --account-name streamvaultmovies \
  --container-name movies \
  --prefix "action/" \
  --output table
```

#### Using Azure Storage Explorer:

1. Navigate to your container
2. All files are shown in a file-browser-like interface
3. Use the search box to find files
4. Sort by name, size, or date

### Deleting Files

#### Azure Portal:

1. Go to your container
2. Select the file(s) to delete
3. Click **"Delete"**
4. Confirm deletion

#### Azure CLI:

```bash
# Delete a single blob
az storage blob delete \
  --account-name streamvaultmovies \
  --container-name movies \
  --name "old-movie.mp4"

# Delete all blobs with a prefix
az storage blob delete-batch \
  --account-name streamvaultmovies \
  --container-name movies \
  --source "old-movies/"
```

### Syncing Movies with Database

After uploading movies to Azure, sync them with your database:

1. Log in as **admin** to your StreamVault app
2. Go to **Admin Panel**
3. Click **"Sync Movies"** button
4. The system will:
   - Scan Azure Blob Storage
   - Create new movie records
   - Update existing records
   - Skip duplicates

---

## Quick Reference Card

### Essential Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Upload to Azure (CLI)
az storage blob upload \
  --account-name streamvaultmovies \
  --container-name movies \
  --name "movie.mp4" \
  --file "./movie.mp4"
```

### File Structure

```
streamvault/
├── api/              # Backend API routes
├── public/           # Static files
├── src/              # Frontend code
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── lib/          # Utility functions
│   └── contexts/     # React contexts
├── .env              # Environment variables (create this)
├── package.json      # Dependencies
└── README.md         # Documentation
```

### Getting Help

- **Azure Documentation:** [docs.microsoft.com/azure/storage](https://docs.microsoft.com/azure/storage)
- **Node.js Documentation:** [nodejs.org/docs](https://nodejs.org/docs)
- **React Documentation:** [react.dev](https://react.dev)
- **Stack Overflow:** [stackoverflow.com](https://stackoverflow.com)

---

## Appendix: Video File Requirements

### Supported Formats

| Format | Extension | Recommended |
|--------|-----------|-------------|
| MP4 | `.mp4` | ✅ Yes (best compatibility) |
| WebM | `.webm` | ✅ Yes |
| MOV | `.mov` | ⚠️ Limited browser support |
| AVI | `.avi` | ❌ Not recommended |

### Recommended Encoding

- **Codec:** H.264 (most compatible)
- **Resolution:** 1080p (1920x1080) or 4K (3840x2160)
- **Bitrate:** 5-10 Mbps for 1080p, 15-30 Mbps for 4K
- **Audio:** AAC, 128-320 kbps

### Free Tools for Video Conversion

- **HandBrake:** [handbrake.fr](https://handbrake.fr) (Windows/Mac/Linux)
- **FFmpeg:** [ffmpeg.org](https://ffmpeg.org) (Command line)
- **CloudConvert:** [cloudconvert.com](https://cloudconvert.com) (Online)

---

*Last updated: 2024*
