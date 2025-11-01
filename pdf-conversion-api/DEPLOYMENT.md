# 🚀 Deployment Guide - Render.com Free Tier

This guide will help you deploy your PDF Conversion API to Render.com's free tier and keep it running smoothly.

## 📋 Prerequisites

- GitHub account
- Render.com account (free, no credit card required)
- This repository pushed to GitHub

## 🌐 Deploy to Render.com

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Deploy on Render

1. Go to [Render.com](https://render.com) and sign up/log in
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and deploy both services:
   - **Gotenberg** (document conversion engine)
   - **PDF Conversion API** (your API)

### Step 3: Wait for Deployment

- First deployment takes ~5-10 minutes
- Render will build and start both services
- You'll get a URL like: `https://pdf-conversion-api.onrender.com`

## ⚡ Preventing Sleep Mode (Free Tier)

**Important:** Render's free tier puts apps to sleep after 15 minutes of inactivity. The app wakes up on the first request (~30 seconds).

### Option 1: Use UptimeRobot (Recommended - Free)

[UptimeRobot](https://uptimerobot.com) will ping your app every 5 minutes to keep it awake.

**Setup:**
1. Sign up at [UptimeRobot.com](https://uptimerobot.com) (free)
2. Create a new monitor:
   - **Monitor Type:** HTTP(s)
   - **URL:** `https://your-app.onrender.com/ping`
   - **Monitoring Interval:** 5 minutes
   - **Monitor Name:** PDF API Keep-Alive
3. Save and activate

**Result:** Your app stays awake 24/7 🎉

### Option 2: Cron-job.org (Alternative - Free)

[Cron-job.org](https://cron-job.org) offers similar functionality:

1. Sign up at [cron-job.org](https://cron-job.org)
2. Create a cronjob:
   - **URL:** `https://your-app.onrender.com/ping`
   - **Interval:** Every 5-10 minutes
3. Enable the cronjob

### Option 3: Use GitHub Actions (Free)

Add a GitHub Action to ping your app:

Create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep-Alive Ping

on:
  schedule:
    # Runs every 10 minutes
    - cron: '*/10 * * * *'
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping API
        run: |
          curl -f https://your-app.onrender.com/ping || exit 0
```

**Note:** Replace `your-app.onrender.com` with your actual Render URL.

### Option 4: Accept Sleep Mode

If you don't need 24/7 uptime:
- Let the app sleep after 15 minutes
- It wakes up automatically on first request (~30 seconds)
- **Good for:** Personal projects, demos, testing

## 🔍 Available Endpoints

### Health Check Endpoints

- **`GET /ping`** - Lightweight keep-alive endpoint (use this for monitoring)
- **`GET /api/health`** - Full health check (checks Gotenberg service too)

### Test Your Deployment

After deployment, test these URLs:

```bash
# Quick ping test
curl https://your-app.onrender.com/ping

# Full health check
curl https://your-app.onrender.com/api/health

# Convert a document
curl -X POST https://your-app.onrender.com/api/convert/docx-to-pdf \
  -F "file=@document.docx" \
  -o output.pdf
```

## 📊 Monitoring Your App

### View Logs on Render

1. Go to your Render dashboard
2. Click on your service
3. Click **"Logs"** tab
4. See real-time logs

### Monitor Uptime

With UptimeRobot or Cron-job.org:
- Get email/SMS alerts if app goes down
- View uptime statistics
- Track response times

## ⚙️ Environment Variables

Your `render.yaml` already configures these automatically:

- `NODE_ENV=production`
- `GOTENBERG_URL` - Auto-configured to point to Gotenberg service

No manual configuration needed! 🎉

## 🔧 Troubleshooting

### App Not Responding

**Symptom:** First request takes 30+ seconds
**Cause:** App was sleeping (normal on free tier)
**Solution:** Set up keep-alive monitoring (see above)

### Gotenberg Service Unavailable

**Symptom:** Conversions fail with "Gotenberg unavailable"
**Cause:** Gotenberg container not running
**Solution:** 
1. Check Render dashboard
2. Ensure both services are running
3. Check logs for errors

### Build Failures

**Symptom:** Deployment fails during build
**Solution:**
1. Check build logs in Render dashboard
2. Ensure `package.json` has all dependencies
3. Try redeploying

### Out of Memory

**Symptom:** App crashes during large file conversions
**Cause:** Free tier has 512MB RAM limit
**Solution:**
- Limit file sizes to <50MB
- Upgrade to Render Starter plan ($7/month) for 2GB RAM

## 💰 Cost Breakdown

### Free Tier (Current Setup)
- **Cost:** $0/month
- **RAM:** 512MB per service
- **Sleep:** After 15 min inactivity
- **Good for:** Testing, demos, small projects

### Starter Plan (Recommended for Production)
- **Cost:** $7/month per service ($14 total)
- **RAM:** 2GB per service
- **Sleep:** Never
- **Good for:** Production use, no downtime

## 🎯 Best Practices

1. **Use `/ping` endpoint** for keep-alive monitoring (faster, lighter)
2. **Use `/api/health` endpoint** for comprehensive health checks
3. **Set up monitoring** with UptimeRobot for 24/7 uptime
4. **Monitor logs** regularly for errors
5. **Test thoroughly** before going live
6. **Consider upgrading** to paid tier for production use

## 📱 Next Steps

After deployment:

1. ✅ Set up UptimeRobot monitoring
2. ✅ Test all conversion endpoints
3. ✅ Share your API URL with your team
4. ✅ Monitor logs for any errors
5. ✅ Consider custom domain (available on paid plans)

## 🆘 Support

- **Render Docs:** https://render.com/docs
- **Gotenberg Docs:** https://gotenberg.dev/docs
- **Issues:** Open an issue on GitHub

---

**Built with ❤️ for easy deployment**

Your API will be live at: `https://your-app-name.onrender.com`
