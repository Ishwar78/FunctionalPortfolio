# Quick Setup Guide

## 1. Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Git

## 2. MongoDB Atlas Setup
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create account → Create organization → Create project
3. Build a cluster (free M0 tier)
4. Create database user:
   - Username: `sachintakoria2204_db_user`
   - Password: Generate strong password
5. Get connection string (copy the URI)
6. Network Access: Add your IP address

## 3. Clone & Install

```bash
# Clone repository
git clone <repo-url>
cd portfolio-app

# Install backend
cd server
npm install

# Install frontend
cd ../client
npm install
```

## 4. Configure Environment Variables

### Backend (server/.env)
```env
MONGODB_URI=mongodb+srv://sachintakoria2204_db_user:PASSWORD@cluster0.sshoxfp.mongodb.net/portfolio
JWT_SECRET=Sachin@123
ADMIN_DEFAULT_EMAIL=sachintakoria2204@gmail.com
ADMIN_DEFAULT_PASSWORD=Sachin@123
WHATSAPP_TO_NUMBER=7015242844
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (client/.env.local)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## 5. Initialize Database

```bash
cd server
npm run seed
```

This creates:
- Default admin user
- 3 sample projects
- 6 content sections

## 6. Run Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
→ Server at http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
→ App at http://localhost:5173

## 7. Access Admin Panel

1. Go to http://localhost:5173/admin/login
2. Login with:
   - Email: `sachintakoria2204@gmail.com`
   - Password: `Sachin@123`
3. Change password immediately!

## 8. Optional: Setup WhatsApp Notifications

1. Get WhatsApp Cloud API credentials
2. Add to server/.env:
   ```env
   WHATSAPP_API_KEY=your_token
   WHATSAPP_PHONE_NUMBER_ID=your_id
   ```
3. Restart server

## Quick Test

1. **Visit homepage**: http://localhost:5173
   - Should show hero with content from CMS
   - Featured projects grid below

2. **View projects**: http://localhost:5173/projects
   - Should display 3 seeded projects
   - Filterable by category

3. **Admin dashboard**: http://localhost:5173/admin
   - Shows stats (3 projects, 0 messages)
   - Quick action links

4. **Create project**: /admin/projects → New Project
   - Fill form → Save
   - Appears immediately on homepage

5. **Edit content**: /admin/content
   - Switch tabs to edit Hero, About, Skills, etc.
   - Changes reflect instantly on public pages

6. **Test contact form**: /contact
   - Submit message
   - Appears in /admin/messages
   - WhatsApp notification sent (if configured)

## Troubleshooting

### MongoDB Connection Failed
- Check MONGODB_URI is correct
- Verify username:password@cluster
- Add your IP to Network Access
- Ensure database name is `portfolio`

### Admin Login Fails
- Run `npm run seed` again
- Check ADMIN_DEFAULT_EMAIL matches env
- Verify JWT_SECRET is set

### Frontend Can't Reach API
- Check VITE_API_BASE_URL in client/.env.local
- Backend must be running on port 5000
- Check CORS_ORIGIN matches your frontend URL

### Port Already in Use
Backend: `PORT=5001 npm run dev`
Frontend: `npm run dev -- --port 5174`

## Next Steps

1. **Update Default Credentials**
   - Edit `/admin` → Change admin password

2. **Add Your Content**
   - Edit hero section
   - Update about/skills/contact
   - Create your projects

3. **Configure WhatsApp (Optional)**
   - Setup WhatsApp Cloud API
   - Get access token & phone number ID
   - Add to server/.env

4. **Deploy**
   - Frontend: Netlify, Vercel
   - Backend: Railway, Render, Heroku
   - Update VITE_API_BASE_URL to production API URL

## File Structure Quick Reference

```
portfolio-app/
├── server/
│   ├── src/
│   │   ├── models/          ← MongoDB schemas
│   │   ├── routes/          ← API endpoints
│   │   ├── middleware/      ← Auth, errors
│   │   ├── services/        ← Business logic
│   │   ├── seeds/           ← Database seeding
│   │   └── index.ts         ← Server entry
│   ├── .env                 ← Your secrets
│   └── package.json
└── client/
    ├── src/
    │   ├── pages/           ← Routes (Home, Admin, etc.)
    │   ├── components/      ← Reusable components
    │   ├── hooks/           ← Custom hooks
    │   └── lib/             ← Utils & API
    ├── .env.local           ← API URL
    └── package.json
```

## Important Notes

⚠️ **Security**
- Never commit .env files with secrets
- Change default admin password immediately
- Use strong JWT_SECRET in production
- Set NODE_ENV=production for deployment

📝 **Database**
- All data stored in MongoDB Atlas
- Free tier: 512MB storage
- Can upgrade anytime

🚀 **Production**
- Build frontend: `npm run build`
- Build backend: `npm run build`
- Set CORS_ORIGIN to production domain
- Update VITE_API_BASE_URL to production API

## Support

Check README.md for detailed documentation on:
- API endpoints
- Admin panel features
- WhatsApp integration
- Markdown support in projects
- Deployment options
