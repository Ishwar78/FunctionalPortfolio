# Project Verification Checklist

Use this checklist to verify that the entire MERN portfolio application is properly set up and working.

## ✅ Pre-Setup Requirements

- [ ] Node.js 18+ installed (`node -v`)
- [ ] npm or yarn available (`npm -v`)
- [ ] Git installed
- [ ] MongoDB Atlas account created
- [ ] MongoDB connection string obtained
- [ ] Project cloned to local machine

## ✅ Backend Setup

### Environment Variables
- [ ] `server/.env` file created
- [ ] `MONGODB_URI` set correctly
- [ ] `JWT_SECRET` configured
- [ ] `ADMIN_DEFAULT_EMAIL` set
- [ ] `ADMIN_DEFAULT_PASSWORD` set
- [ ] `WHATSAPP_TO_NUMBER` set (optional)
- [ ] `PORT=5000` set
- [ ] `CORS_ORIGIN=http://localhost:5173` set

### Dependencies
- [ ] `cd server && npm install` completed
- [ ] All dependencies installed without errors
- [ ] node_modules directory created

### Database Seeding
- [ ] Connected to MongoDB Atlas successfully
- [ ] Run `npm run seed` in server directory
- [ ] Admin user created
- [ ] 3 sample projects inserted
- [ ] 6 content sections created

### Server Running
- [ ] Run `npm run dev` in server directory
- [ ] Server starts without errors
- [ ] Logs show "Server is running on port 5000"
- [ ] Logs show "MongoDB connected successfully"

### API Verification
- [ ] Test `http://localhost:5000/api/projects` in browser/Postman
- [ ] Should return array of 3 projects (JSON)
- [ ] Test `http://localhost:5000/api/content/hero` 
- [ ] Should return hero content object

## ✅ Frontend Setup

### Environment Variables
- [ ] `client/.env.local` file created
- [ ] `VITE_API_BASE_URL=http://localhost:5000` set

### Dependencies
- [ ] `cd client && npm install` completed
- [ ] All dependencies installed without errors
- [ ] node_modules directory created

### Dev Server
- [ ] Run `npm run dev` in client directory
- [ ] Server starts without errors
- [ ] Browser opens to `http://localhost:5173`
- [ ] No console errors visible

## ✅ Public Frontend Features

### Homepage (/)
- [ ] Page loads without errors
- [ ] Hero section displays with title and subtitle from CMS
- [ ] Featured projects visible in grid
- [ ] Tech stack cards display
- [ ] All images load correctly
- [ ] Framer Motion animations work smoothly
- [ ] Responsive on mobile

### Projects Page (/projects)
- [ ] Projects list displays (3 seeded projects)
- [ ] Category filter buttons work
- [ ] Can filter by "All", "E-Commerce", "Real Estate", "Web Apps"
- [ ] Project cards show cover image, title, description
- [ ] Tech badges visible on cards
- [ ] "Live" and "Code" buttons visible

### Project Detail Page (/projects/:slug)
- [ ] Click on project card opens detail view
- [ ] Cover image displays
- [ ] Title, description visible
- [ ] Tech stack badges displayed
- [ ] GitHub and Live URL buttons work
- [ ] README (Markdown) renders correctly
- [ ] Code blocks format properly
- [ ] Links work
- [ ] Back button returns to projects list

### Contact Page (/contact)
- [ ] Page loads with form and contact info
- [ ] Contact info displays from CMS (email, phone, location)
- [ ] Form has fields: Name, Email, Subject, Message
- [ ] Can fill and submit form
- [ ] Success toast appears on submit
- [ ] Form resets after submission
- [ ] Check /admin/messages to confirm message saved

### Other Pages
- [ ] /about loads successfully
- [ ] /skills loads successfully
- [ ] /resume loads successfully
- [ ] /404 shows for invalid routes

## ✅ Admin Panel

### Login (/admin/login)
- [ ] Page loads with login form
- [ ] Can enter email and password
- [ ] Login with credentials:
  - Email: `sachintakoria2204@gmail.com`
  - Password: `Sachin@123`
- [ ] Redirects to /admin on success
- [ ] Error message shows on wrong credentials
- [ ] Token stored in localStorage

### Dashboard (/admin)
- [ ] Page loads with sidebar
- [ ] Shows 3 stat cards (Projects, Featured, Messages)
- [ ] Numbers display correctly
- [ ] Quick action buttons visible
- [ ] Can click "Create New Project" button
- [ ] Can click "Edit Content Sections" button
- [ ] Can click "View Messages" button
- [ ] Logout button works and clears token

### Projects (/admin/projects)
- [ ] Lists 3 seeded projects in table
- [ ] Columns: Title, Category, Featured, Order, Actions
- [ ] Can search by project title
- [ ] Edit button opens form
- [ ] Delete button shows confirmation dialog
- [ ] "New Project" button navigates to form

### Project Form (/admin/projects/new)
- [ ] Form loads with all fields:
  - Title, Short Description, Detailed Description
  - Category, Display Order
  - Tech Stack (add/remove tags)
  - Cover Image URL, GitHub URL, Live URL
  - README (Markdown)
  - Featured toggle
- [ ] Can fill all fields
- [ ] Can add multiple tech stack items
- [ ] Can remove tech items
- [ ] Save creates new project
- [ ] Success toast appears
- [ ] Redirects to projects list
- [ ] New project appears in list

### Project Edit Form
- [ ] Click edit on existing project
- [ ] Form populates with existing data
- [ ] Can modify fields
- [ ] Save updates project
- [ ] Changes reflected in public view

### Content Management (/admin/content)
- [ ] Page loads with 6 tabs: Hero, About, Skills, Banners, Contact, Social
- [ ] **Hero Tab**:
  - [ ] Title field editable
  - [ ] Subtitle field editable
  - [ ] Save button works
- [ ] **About Tab**:
  - [ ] Summary textarea editable
  - [ ] Can add/remove highlights
  - [ ] Save button works
- [ ] **Skills Tab**:
  - [ ] 3 columns: Frontend, Backend, DevOps
  - [ ] Can add skills to each category
  - [ ] Can remove skills
  - [ ] Save button works
- [ ] **Banners Tab**:
  - [ ] Can add banner items
  - [ ] Can edit image URL, alt text, link URL
  - [ ] Can set display order
  - [ ] Can remove banners
  - [ ] Save button works
- [ ] **Contact Tab**:
  - [ ] Email field editable
  - [ ] Phone field editable
  - [ ] Address field editable
  - [ ] WhatsApp number field editable
  - [ ] Save button works
- [ ] **Social Tab**:
  - [ ] GitHub URL editable
  - [ ] LinkedIn URL editable
  - [ ] Twitter URL editable
  - [ ] Instagram URL editable
  - [ ] Facebook URL editable
  - [ ] YouTube URL editable
  - [ ] Save button works

### Messages (/admin/messages)
- [ ] Page loads with messages table
- [ ] Initially empty (0 messages)
- [ ] Go to /contact and submit test message
- [ ] Message appears in table
- [ ] Can click "View" button
- [ ] Detail modal opens with full message
- [ ] Can copy email button
- [ ] "Reply on WhatsApp" button opens WhatsApp
- [ ] Latest messages appear first (sorted by date)

## ✅ Authentication & Security

- [ ] Can't access /admin without login (redirects to /admin/login)
- [ ] Invalid token in localStorage won't grant access
- [ ] Logout clears token from localStorage
- [ ] Can't access protected routes without token
- [ ] Authorization header sent with admin requests
- [ ] Login token expires after 7 days (JWT)

## ✅ Form Validation

### Contact Form
- [ ] Name field required
- [ ] Email must be valid email
- [ ] Subject field required
- [ ] Message field required (max 2000 chars)
- [ ] Form shows character count
- [ ] Submit disabled while submitting
- [ ] Rate limiting works (max 5/min per IP)

### Project Form
- [ ] Title required
- [ ] Short description required
- [ ] URLs must be valid (if provided)
- [ ] Tech stack validates
- [ ] Form shows validation errors

### Content Form
- [ ] Skills can't be duplicated
- [ ] All text fields trim whitespace
- [ ] Required fields validated

## ✅ API Endpoints

### Public Endpoints
- [ ] `GET /api/projects` returns all projects
- [ ] `GET /api/projects/:slug` returns single project
- [ ] `GET /api/content/:key` returns content section
- [ ] `POST /api/contact` accepts contact form

### Admin Endpoints
- [ ] `POST /api/admin/auth/login` authenticates user
- [ ] `POST /api/admin/projects` creates project (auth required)
- [ ] `PUT /api/admin/projects/:id` updates project (auth required)
- [ ] `DELETE /api/admin/projects/:id` deletes project (auth required)
- [ ] `PUT /api/admin/content/:key` updates content (auth required)
- [ ] `GET /api/admin/messages` lists messages (auth required)

## ✅ Database

- [ ] MongoDB connection established
- [ ] `AdminUser` collection created with default user
- [ ] `Project` collection created with 3 items
- [ ] `ContentSection` collection created with 6 items
- [ ] `Message` collection exists (empty initially)
- [ ] Can view data in MongoDB Atlas dashboard
- [ ] Timestamps working (createdAt, updatedAt)

## ✅ Responsive Design

### Mobile (320px)
- [ ] Homepage stacks vertically
- [ ] Hero text readable
- [ ] Projects grid shows 1 column
- [ ] Sidebar collapses in admin
- [ ] Forms fit on screen

### Tablet (768px)
- [ ] Homepage layout adjusts
- [ ] Projects grid shows 2 columns
- [ ] Navigation responsive
- [ ] Tables scrollable

### Desktop (1024px+)
- [ ] Full layout displays
- [ ] Projects grid shows 3 columns
- [ ] Animations smooth
- [ ] No horizontal scrolling

## ✅ Error Handling

- [ ] Invalid API calls show error toast
- [ ] Network errors handled gracefully
- [ ] 404 page shows for invalid routes
- [ ] Form errors display inline
- [ ] Admin pages show loading state
- [ ] No console errors in DevTools

## ✅ Performance

- [ ] Page loads in < 3 seconds
- [ ] Animations smooth (60 FPS)
- [ ] No memory leaks visible
- [ ] Images optimized (< 500KB total)
- [ ] API requests respond quickly
- [ ] Database queries efficient

## ✅ Optional Features

### WhatsApp Integration (if configured)
- [ ] WhatsApp API credentials added to .env
- [ ] Submit contact form
- [ ] WhatsApp notification received on WHATSAPP_TO_NUMBER
- [ ] Message format includes name, email, subject, message

### Resume Parsing (if resume URL available)
- [ ] Run `npm run parse-resume <url>` in server
- [ ] About section updates with parsed content
- [ ] Skills section populates with parsed skills
- [ ] Experience section shows in about
- [ ] Education section shows in about

## ✅ Build & Deployment Prep

- [ ] `npm run build` completes in server (creates dist/)
- [ ] `npm run build` completes in client (creates dist/)
- [ ] Build outputs contain all necessary files
- [ ] No build warnings
- [ ] ENV variables configured for production
- [ ] CORS_ORIGIN updated for production domain

## ✅ Documentation

- [ ] README.md completed
- [ ] SETUP_GUIDE.md followed and verified
- [ ] API documentation clear
- [ ] Environment variables documented
- [ ] No broken documentation links

## 🎉 Final Checklist

- [ ] All items above checked
- [ ] No console errors
- [ ] No network errors
- [ ] All features working as expected
- [ ] Ready for production deployment

## 🐛 Troubleshooting

If any item fails:

1. **Backend Issues**
   - Check `npm run dev` logs
   - Verify MongoDB connection string
   - Check .env variables
   - Restart server

2. **Frontend Issues**
   - Check browser console for errors
   - Verify VITE_API_BASE_URL
   - Check network requests in DevTools
   - Clear cache and reload

3. **API Issues**
   - Test endpoints with Postman/curl
   - Verify request format
   - Check server error logs
   - Verify authentication headers

4. **Database Issues**
   - Check MongoDB Atlas connection
   - Verify IP whitelist
   - Run seed script again
   - Check data in Atlas dashboard

## 📞 Support

If issues persist:
1. Review README.md for detailed docs
2. Check server console logs
3. Check browser DevTools
4. Verify all environment variables
5. Try restarting both servers
