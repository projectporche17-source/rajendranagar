# Cloudflare Worker Deployment Guide

## Prerequisites

1. **Cloudflare Account** with Workers enabled
2. **Wrangler CLI** installed
3. **Node.js** 18+ 
4. **Git** configured for authentication

## Installation

```powershell
# Install Wrangler globally
npm install -g wrangler

# Authenticate with Cloudflare
wrangler login
```

## Environment Variables

The Worker needs two secrets:

- `TURSO_URL`: `libsql://rajendranagaronline-garbs.aws-ap-south-1.turso.io`
- `TURSO_TOKEN`: Your Turso auth token

## Deployment Options

### Option 1: Automatic Deployment (Full)
```powershell
npm run deploy:full
```
This will:
1. Prompt to enter TURSO_URL secret
2. Prompt to enter TURSO_TOKEN secret
3. Deploy the Worker to Cloudflare

### Option 2: Set Secrets First, Then Deploy
```powershell
# Set secrets one-time
npm run deploy:secrets

# Deploy Worker
npm run deploy:worker
```

### Option 3: Manual Deployment Script
```powershell
./deploy.ps1
```

### Option 4: Manual Command Line
```powershell
# Set secrets
wrangler secret put TURSO_URL --env production
wrangler secret put TURSO_TOKEN --env production

# Deploy
wrangler deploy --env production worker/worker.js
```

## After Deployment

1. **Get your Worker URL:**
   ```
   https://rajendranagar-worker.<account-hash>.workers.dev
   ```

2. **Configure Cloudflare Routes** (if using subdomain):
   - Go to Cloudflare Dashboard → Workers & Pages
   - Select your Worker
   - Click "Triggers" tab
   - Add route: `api.rajendranagar.online/*`
   - Select zone: `rajendranagar.online`

3. **Test the Worker:**
   ```powershell
   # Get all properties
   curl https://api.rajendranagar.online/properties

   # Get properties by area
   curl https://api.rajendranagar.online/properties?area=kismatpur

   # Get single property (replace ID)
   curl https://api.rajendranagar.online/property/your-property-id
   ```

## Verify Deployment

Check that your Worker is active:
```powershell
wrangler deployments list
```

## Troubleshooting

### "Error: Unauthorized"
- Verify secrets are set: `wrangler secret list --env production`
- Re-enter secrets if needed

### "Database connection failed"
- Check TURSO_URL and TURSO_TOKEN are correct
- Verify Turso database is running
- Check network connectivity

### "Worker not responding"
- View logs: `wrangler tail --env production`
- Check Cloudflare Dashboard for errors
- Verify routes are configured correctly

## Update Worker

After making changes to `worker/worker.js`:
```powershell
npm run deploy:worker
```

## Configuration Files

- **wrangler.toml**: Worker configuration and routes
- **deploy.ps1**: PowerShell deployment script
- **.env.example**: Environment variables reference

---

**Next Steps:**
1. Run deployment command
2. Test API endpoints
3. Integrate with frontend (Home page will fetch from `/properties`)
4. Build Area and Property detail pages
