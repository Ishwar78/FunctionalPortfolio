# Deployment and Production Notes

## Pre-Deployment Checklist

### Security
- [ ] Change default admin password from `Sachin@123` to a strong password
- [ ] Generate new JWT_SECRET (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Ensure NODE_ENV=production
- [ ] Enable HTTPS (all hosting providers offer this)
- [ ] Add production database user to MongoDB Atlas
- [ ] Restrict database user permissions to portfolio database only
- [ ] Add production server IP to MongoDB Atlas Network Access

### Configuration
- [ ] Update CORS_ORIGIN to production domain
- [ ] Update VITE_API_BASE_URL to production API URL
- [ ] Verify all environment variables are production-ready
- [ ] Set rate limiting appropriately for production load
- [ ] Configure proper error logging

### Database
- [ ] Create backup of MongoDB
- [ ] Test backup/restore process
- [ ] Monitor MongoDB usage (free tier has 512MB limit)
- [ ] Setup automated backups if needed

### Frontend
- [ ] Run `npm run build` and verify dist/ folder
- [ ] Test production build locally with `npm run preview`
- [ ] Verify all API calls point to production API
- [ ] Check for any hardcoded localhost URLs

### Backend
- [ ] Run `npm run build` and verify dist/ folder
- [ ] Test with `npm start` (uses built files)
- [ ] Verify database connection in production
- [ ] Test all API endpoints

## Deployment Platforms

### Frontend Deployment Options

#### **Netlify**
1. Push code to GitHub
2. Connect repository in Netlify
3. Set build command: `npm run build` (from client folder)
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_BASE_URL=https://api.yourdomain.com`
6. Deploy

#### **Vercel**
1. Push code to GitHub
2. Import project in Vercel
3. Select root directory: `client`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variable: `VITE_API_BASE_URL=https://api.yourdomain.com`
7. Deploy

#### **AWS S3 + CloudFront**
1. Build: `npm run build` (in client)
2. Upload `dist/` to S3 bucket
3. Configure for static website hosting
4. Create CloudFront distribution
5. Set up custom domain
6. Configure cache invalidation

### Backend Deployment Options

#### **Railway.app**
1. Push code to GitHub
2. Create new project on Railway
3. Add GitHub repository
4. Add environment variables (from server/.env)
5. Set start command: `npm start`
6. Deploy
7. Get public URL (e.g., https://yourapp-api.railway.app)

#### **Render.com**
1. Push code to GitHub
2. New Web Service on Render
3. Connect GitHub repository
4. Build command: `npm run build`
5. Start command: `npm start`
6. Add environment variables
7. Free tier available

#### **Heroku**
1. Install Heroku CLI
2. `heroku create your-app-name`
3. `heroku config:set KEY=VALUE` for each env variable
4. `git push heroku main`
5. Monitor with `heroku logs --tail`

#### **AWS EC2**
1. Create EC2 instance (Ubuntu recommended)
2. Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -`
3. Install git: `sudo apt-get install git`
4. Clone repository
5. Install dependencies: `npm install`
6. Build: `npm run build`
7. Use PM2 for process management: `npm install -g pm2`
8. Start: `pm2 start npm --name "portfolio-api" -- start`
9. Setup Nginx as reverse proxy
10. Get SSL certificate from Let's Encrypt

## Post-Deployment Steps

### 1. Test Everything
- [ ] Visit homepage - verify content loads from CMS
- [ ] Test all public pages
- [ ] Create test admin account
- [ ] Test admin panel
- [ ] Submit test contact form
- [ ] Verify WhatsApp notification (if enabled)

### 2. Monitor
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Monitor database usage
- [ ] Monitor API response times
- [ ] Setup uptime monitoring
- [ ] Monitor server logs

### 3. Backup & Recovery
- [ ] Setup automated MongoDB backups
- [ ] Document recovery procedure
- [ ] Test restore process
- [ ] Keep git history clean

## Common Issues & Solutions

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED
```
**Solution:**
- Verify IP is in MongoDB Atlas Network Access
- Check connection string is correct
- Ensure username/password are URL-encoded
- Test connection from production server

### CORS Errors
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:**
- Verify CORS_ORIGIN matches production frontend URL
- Ensure API responds with correct CORS headers
- Check for trailing slashes in URLs

### Rate Limiting Issues
```
429 Too Many Requests
```
**Solution:**
- Adjust rate limiter window/max in middleware
- Implement caching on frontend
- Use request debouncing
- Monitor rate limit hit patterns

### Performance Issues
**Solutions:**
- Enable GZIP compression in Nginx/server
- Optimize database queries (add indexes)
- Implement caching (Redis)
- Use CDN for static assets
- Monitor and optimize slow endpoints

## Environment Variables Checklist

### Production (Backend)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio
JWT_SECRET=<strong-random-secret>
ADMIN_DEFAULT_EMAIL=admin@yourdomain.com
ADMIN_DEFAULT_PASSWORD=<strong-password>
PORT=5000 (or as required by platform)
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
WHATSAPP_API_KEY=<token> (optional)
WHATSAPP_PHONE_NUMBER_ID=<id> (optional)
WHATSAPP_TO_NUMBER=<number> (optional)
```

### Production (Frontend)
```
VITE_API_BASE_URL=https://api.yourdomain.com
```

**Never commit secrets!** Use environment variables on hosting platform.

## SSL/HTTPS Setup

### Let's Encrypt (Free)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

### Netlify/Vercel
- Automatic HTTPS provided

### AWS
- Request certificate in AWS Certificate Manager
- Attach to CloudFront distribution

## Monitoring & Logging

### Application Logging
```javascript
// Already configured in Express
// Logs to console (captured by platform)
// Use: pm2 logs, Heroku logs, Railway logs, etc.
```

### Error Tracking (Optional)
```bash
npm install sentry-sdk
```
Configure in server/src/index.ts to track errors

### Database Monitoring
- Use MongoDB Atlas dashboard
- Monitor connections, storage, operations
- Set up alerts for limits

## Scaling Considerations

### For Larger User Base
1. **Database:**
   - MongoDB Atlas paid tier with auto-scaling
   - Setup proper indexing
   - Implement connection pooling

2. **API Server:**
   - Load balancing with multiple instances
   - Caching layer (Redis)
   - CDN for static assets

3. **Frontend:**
   - Already serverless (Netlify/Vercel)
   - Global CDN included
   - Auto-scaling built-in

4. **Media:**
   - Move images to S3/CDN
   - Implement image optimization
   - Compression (WebP format)

## Updating Production

### Backend Updates
```bash
git pull origin main
npm install  # if dependencies changed
npm run build
# Re-deploy using platform's deploy command
```

### Frontend Updates
```bash
git pull origin main
npm install  # if dependencies changed
npm run build
# Re-deploy using platform's deploy command
```

### Database Migrations
1. Backup current database
2. Apply changes to models if needed
3. Migrate data if schema changes
4. Test thoroughly before deploying
5. Deploy new code

## Disaster Recovery

### Backup Strategy
- **Code:** GitHub (version control)
- **Database:** MongoDB Atlas automated backups + manual exports
- **Environment Variables:** Store securely (not in git)

### Recovery Steps
1. Restore MongoDB from backup
2. Deploy code from GitHub
3. Re-apply environment variables
4. Test all functionality
5. Monitor for issues

## Cost Estimation

### Free Tier Costs
- **MongoDB Atlas:** Free (512MB) → $9/mo for more
- **Netlify:** Free tier generous for personal sites
- **Railway/Render:** Free credits for new users
- **Domain:** $10-15/year
- **Total:** Can run entire app for free initially

### Production Tier
- **MongoDB:** $10-100+/month (depending on usage)
- **Frontend:** $0 (Netlify/Vercel free for personal)
- **Backend:** $5-50/month (Railway/Render/Heroku)
- **Domain:** $10-15/year
- **SSL:** Free (Let's Encrypt)
- **CDN (optional):** $0-20/month
- **Total:** ~$25-50/month for moderate traffic

## Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm run build -- --analyze

# Enable gzip compression (usually automatic)
# Implement lazy loading for images
# Use modern image formats (WebP)
```

### Backend
```javascript
// Add caching headers
app.use(express.static('public', {
  maxAge: '1d', // 1 day for static files
}));

// Implement request compression
import compression from 'compression';
app.use(compression());
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation with Zod
- [ ] Password hashing with bcrypt
- [ ] JWT tokens with expiration
- [ ] No secrets in code/git
- [ ] MongoDB user with minimal permissions
- [ ] IP whitelist for database
- [ ] Regular security updates
- [ ] OWASP vulnerabilities checked

## Support & Debugging

### Viewing Logs
- **Railway:** Dashboard → Deployments → Logs
- **Render:** Services → Logs
- **Heroku:** `heroku logs --tail`
- **Netlify:** Netlify Functions
- **Vercel:** Deployments → Function logs

### Common Commands
```bash
# Check Node version
node -v

# Check npm version
npm -v

# Test API endpoint
curl https://api.yourdomain.com/api/projects

# Check MongoDB connection
# In MongoDB Atlas → Network Access
```

## Next Steps

1. Choose hosting platforms
2. Setup custom domain (optional, can use platform domain)
3. Configure environment variables on platform
4. Deploy frontend
5. Deploy backend
6. Run verification checklist (VERIFICATION_CHECKLIST.md)
7. Monitor and optimize
8. Setup automated backups
9. Configure monitoring/alerting
10. Document any customizations

---

For questions, refer to:
- README.md - Comprehensive documentation
- SETUP_GUIDE.md - Quick setup instructions
- VERIFICATION_CHECKLIST.md - Testing checklist
