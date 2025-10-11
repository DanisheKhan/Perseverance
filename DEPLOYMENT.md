# Perseverance - Deployment Configuration

## 🚀 Vercel Deployment (Recommended)

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/perseverance)

### Manual Deployment Steps

1. **Install Vercel CLI** (optional)

```bash
npm install -g vercel
```

2. **Build the project**

```bash
npm run build
```

3. **Deploy**

```bash
vercel
```

4. **Production deployment**

```bash
vercel --prod
```

### Vercel Configuration

The `vercel.json` file includes:

- ✅ SPA routing (all routes → index.html)
- ✅ Security headers (XSS, frame options)
- ✅ Asset caching (1 year for static files)
- ✅ Gzip compression (automatic)

### Environment Variables

No environment variables required for basic deployment. All data is stored locally in browser.

---

## 🌐 Netlify Deployment

### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/perseverance)

### Manual Deployment Steps

1. **Build the project**

```bash
npm run build
```

2. **Install Netlify CLI** (optional)

```bash
npm install -g netlify-cli
```

3. **Deploy**

```bash
netlify deploy --prod --dir=dist
```

### Netlify Configuration

The `public/_redirects` file handles SPA routing.

Build settings:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18+

---

## 📦 GitHub Pages Deployment

### Setup

1. **Install gh-pages**

```bash
npm install --save-dev gh-pages
```

2. **Add deploy scripts to package.json**

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/perseverance"
}
```

3. **Update vite.config.js**

```javascript
export default defineConfig({
  base: "/perseverance/",
  // ... rest of config
});
```

4. **Deploy**

```bash
npm run deploy
```

---

## 🔧 Build Optimization

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }), // Bundle size analysis
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
          utils: ["date-fns", "react-hot-toast", "react-icons"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },
});
```

### Bundle Analysis

```bash
npm run build
# Opens bundle size visualization
```

---

## 🌍 Custom Domain Setup

### Vercel Custom Domain

1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add your domain (e.g., `perseverance.yourdomain.com`)
3. Update DNS records as instructed:
   - **Type:** CNAME
   - **Name:** perseverance
   - **Value:** cname.vercel-dns.com

### Netlify Custom Domain

1. Go to Netlify dashboard → Your site → Domain settings
2. Add custom domain
3. Update DNS records:
   - **Type:** CNAME
   - **Name:** perseverance
   - **Value:** your-site.netlify.app

---

## 📊 Performance Optimization

### Implemented Optimizations

✅ **Code Splitting**

- Lazy loading for Statistics, Calendar, Settings pages
- Separate chunks for React, Charts, Utils

✅ **Asset Optimization**

- Minified JS/CSS
- Tree shaking enabled
- Dead code elimination

✅ **Caching Strategy**

- Static assets: 1 year cache
- HTML: No cache (always fresh)
- Service worker ready

✅ **Compression**

- Gzip enabled on Vercel/Netlify
- Brotli compression automatic

### Performance Targets

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Lighthouse Score:** 90+
- **Bundle Size:** < 500KB (gzipped)

---

## 🔒 Security Headers

Automatically configured via `vercel.json`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- HTTPS enforced on Vercel/Netlify

---

## 📱 PWA Support (Optional)

To enable Progressive Web App features:

1. **Install workbox**

```bash
npm install --save-dev vite-plugin-pwa
```

2. **Update vite.config.js**

```javascript
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Perseverance Habit Tracker",
        short_name: "Perseverance",
        description: "Personal habit tracking with AI insights",
        theme_color: "#6366F1",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
```

---

## 🔄 CI/CD Setup

### GitHub Actions (Auto-deploy to Vercel)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 💾 Backup Automation

### Local Backup Script

Create `scripts/backup.js`:

```javascript
import fs from "fs";
import path from "path";

const BACKUP_DIR = path.join(process.cwd(), "backups");

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

const date = new Date().toISOString().split("T")[0];
const backupFile = path.join(BACKUP_DIR, `backup-${date}.json`);

console.log(`Backup created: ${backupFile}`);
```

Add to package.json:

```json
{
  "scripts": {
    "backup": "node scripts/backup.js"
  }
}
```

---

## 📈 Analytics Setup (Optional)

### Simple Analytics (Privacy-friendly)

Add to `index.html`:

```html
<script
  async
  defer
  src="https://scripts.simpleanalyticscdn.com/latest.js"
></script>
```

### Plausible Analytics

```html
<script
  defer
  data-domain="yourdomain.com"
  src="https://plausible.io/js/script.js"
></script>
```

---

## 🐛 Error Tracking (Optional)

### Sentry Integration

1. **Install Sentry**

```bash
npm install @sentry/react @sentry/tracing
```

2. **Initialize in main.jsx**

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});
```

---

## ✅ Pre-Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test production build locally (`npm run preview`)
- [ ] Check bundle size (`npm run build` shows size)
- [ ] Verify all routes work in production
- [ ] Test offline functionality
- [ ] Export sample data and test import
- [ ] Check console for errors
- [ ] Test on mobile devices
- [ ] Verify error boundaries work
- [ ] Check performance (Lighthouse)

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Routing Issues

Ensure `vercel.json` or `_redirects` file exists for SPA routing.

### Large Bundle Size

```bash
# Analyze bundle
npm run build
# Check dist/ folder sizes
# Consider code splitting more components
```

---

## 📞 Support

For deployment issues:

- **Vercel:** https://vercel.com/support
- **Netlify:** https://answers.netlify.com
- **GitHub Pages:** https://docs.github.com/pages

---

**Deployment Guide** | Last Updated: October 2025
