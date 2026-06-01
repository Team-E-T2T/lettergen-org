# SignIn Setup Guide

## What I've Implemented

I've set up a complete OAuth signin system with Google using NextAuth.js. Here's what was added:

### New Files Created:
1. **`lib/auth.config.ts`** - NextAuth configuration
2. **`lib/auth.ts`** - NextAuth initialization
3. **`app/api/auth/[...nextauth]/route.ts`** - Authentication API route
4. **`app/signin/page.tsx`** - Beautiful signin page with Google button
5. **`.env.local.example`** - Environment variables template

### Updated Files:
1. **`package.json`** - Added `next-auth` dependency
2. **`app/components/Header.tsx`** - Now shows user info and sign out button when logged in

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Google OAuth Credentials

Go to [Google Cloud Console](https://console.cloud.google.com/):

1. Create a new project (or use existing)
2. Enable the Google+ API
3. Go to "Credentials" → "Create OAuth 2.0 credential" (Web application)
4. Add these to **Authorized JavaScript origins**:
   - `http://localhost:3000`
5. Add these to **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`

### 3. Create `.env.local` File

Copy `.env.local.example` and rename to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and fill in:

```
GOOGLE_CLIENT_ID=your_client_id_from_google_console
GOOGLE_CLIENT_SECRET=your_client_secret_from_google_console
NEXTAUTH_SECRET=generate_with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

To generate NEXTAUTH_SECRET on Windows (PowerShell):
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

### 4. Run the Development Server

```bash
npm run dev
```

Then visit `http://localhost:3000/signin` to test the signin flow.

## What Changed

### ✅ What Works Now:
- Signin page at `/signin`
- Google OAuth authentication
- User session management
- Logout functionality
- Header shows user name when logged in

### ✅ No Breaking Changes:
- All existing templates and features remain unchanged
- Homepage at `/` works as before
- `/new` and `/templates` pages unchanged
- "/preview" page unchanged

## How It Works

1. User clicks "Sign In" → Goes to `/signin`
2. User clicks "Sign in with Google" → Redirects to Google login
3. After authentication → User returns to callback URL (default: `/`)
4. Header shows user's name and "Sign Out" button
5. User can click "Sign Out" to logout

## Environment Variables Needed

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | From Google Console | `12345...oauth.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | From Google Console | `GOCSPX-abc... ` |
| `NEXTAUTH_SECRET` | For encryption | `base64_encoded_random_string` |
| `NEXTAUTH_URL` | App base URL | `http://localhost:3000` |

## Troubleshooting

### "404 error" when clicking signin:
- Make sure you've run `npm install` to install next-auth

### "Failed to sign in with Google" error:
- Check `.env.local` has correct Client ID and Secret
- Verify redirect URI in Google Console is `http://localhost:3000/api/auth/callback/google`

### Session not persisting:
- Make sure `NEXTAUTH_SECRET` is set in `.env.local`
- Clear browser cookies and try again

## Production Deployment

For production (Vercel, etc.):
1. Set all environment variables in deployment settings
2. Change `NEXTAUTH_URL` to your production domain: `https://yourdomain.com`
3. Add production domain to Google OAuth redirect URIs
