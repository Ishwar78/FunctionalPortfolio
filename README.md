# Sachin Takoria – Full-Stack Portfolio (MERN)

A production-ready personal portfolio application with a full admin panel for managing projects, blogs, resume, experience, certifications, and contact enquiries.

## 🔗 Live Demo

- 🌐 **Public Site:** https://sachintakoria.in/
- 🔑 **Admin Panel:** https://sachintakoria.in/admin/login  
  (Credentials are set via your own environment variables – not included here.)

---

## ✨ Features

### 👨‍💻 Public Portfolio

- Hero section with intro & CTA buttons  
- Dynamic **Projects** page with:
  - Category-wise projects
  - Detailed project pages (`/projects/:slug`)
  - GitHub & Live Demo links
- **About** page with professional summary
- **Skills** page
  - Grouped by Frontend / Backend / Tools / DevOps
  - Clean, modern badges with icons
- **Experience** & **Certifications** pages
- **Blogs**:
  - Blog listing (`/blogs`)
  - Blog details by slug (`/blog/:slug`)
- **Resume** page:
  - View/download resume from admin-managed content
- **Contact** page:
  - Validated contact form
  - Sends enquiry to backend
  - WhatsApp integration via API (configurable)
- PWA Ready:
  - `PWAInstallButton` for “Add to Home Screen”
  - Works nicely on mobile
- Floating **WhatsApp widget** for quick contact
- Dark/Light **Theme switcher**
- Fully responsive (mobile, tablet, desktop)

### 🛠 Admin Panel

All admin routes are protected using JWT and a `ProtectedRoute` wrapper in frontend.

- **Admin Login:** `/admin/login`
- **Dashboard:** `/admin`
  - Stats: total projects, featured projects, total messages, etc.
  - Quick action shortcuts

#### Admin Modules

- **Projects Management** – `/admin/projects`
  - List, search, filter projects
  - Create / Edit / Delete projects
  - Fields: title, short description, long description, category, tech stack, GitHub URL, live URL, featured flag, etc.

- **Content Management** – `/admin/content`
  - Manage hero text, about, contact info, and other CMS content keys

- **Messages** – `/admin/messages`
  - View contact form submissions
  - Status / read tracking

- **Resume** – `/admin/resume`
  - Upload/update resume link & related text

- **Experience** – `/admin/experience`
  - Manage timeline items (company, role, duration, description)

- **Certifications** – `/admin/certifications`
  - Manage certificates list (title, issuer, link, year)

- **Blogs** – `/admin/blogs`
  - Create / edit / delete blog posts
  - Slug support for SEO-friendly URLs

- **Theme Settings** – `/admin/theme`
  - Customize theme / branding content (logo/text etc. as implemented)

---

## 🧰 Tech Stack

### Frontend

- **React** + **TypeScript**
- **Vite**
- **React Router DOM**
- **Tailwind CSS**
- **shadcn/ui** (Radix UI based components)
- **React Hook Form** + **Zod** (form + validation)
- **TanStack Query (@tanstack/react-query)** for data fetching
- **Framer Motion** for subtle animations
- **Lucide-react** icons

### Backend

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT Authentication**
- **bcrypt** for password hashing
- **Zod** for validation
- **CORS**, **morgan** for logging
- **express-rate-limit** for rate limiting (e.g., contact endpoint)
- **pdf-parse** (for resume-related processing if enabled)

### Other

- **TypeScript** for backend
- ESLint + Prettier config for clean code
- Supabase config folder (optional, used only if you wire it in)

---

## 📂 Project Structure

High-level structure (relevant parts):

```bash
.
├── src/                     # Frontend (React + Vite + TS)
│   ├── components/          # Reusable components + UI
│   ├── pages/               # Page components (Home, About, Projects, Admin, etc.)
│   ├── contexts/            # Theme & other contexts
│   ├── lib/                 # Helpers, API client, etc.
│   └── App.tsx              # Route definitions
│
├── server/                  # Backend (Node + Express + TS)
│   ├── src/
│   │   ├── config/          # DB config
│   │   ├── models/          # Mongoose models (AdminUser, Project, Blog, etc.)
│   │   ├── routes/          # API routes (auth, projects, content, messages...)
│   │   ├── middleware/      # auth, error handler, rate limiter
│   │   ├── services/        # Business logic
│   │   ├── validation/      # Zod schemas
│   │   └── seeds/           # Seed scripts (default admin, sample data)
│   ├── package.json
│   └── tsconfig.json
│
├── public/                  # Static assets for frontend
├── supabase/                # Supabase config/migrations (optional)
├── .env.example             # Example root env
├── server/.env.example      # Example backend env (if present)
├── package.json             # Frontend/root scripts & deps
└── README.md                # Project documentation (this file)
✅ Prerequisites
Node.js v18+

npm or pnpm or yarn (README assumes npm)

MongoDB Atlas (or any reachable MongoDB instance)

🔐 Environment Variables
⚠️ Do NOT commit real secrets. Use .env files locally and environment variables in production.

Root .env (optional, if you centralize some vars)
You can keep it minimal or skip this if you prefer only server .env.

Backend – server/.env
env
Copy code
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your-super-secret-jwt-key

ADMIN_DEFAULT_EMAIL=admin@example.com
ADMIN_DEFAULT_PASSWORD=YourStrongAdminPassword123

WHATSAPP_TO_NUMBER=91xxxxxxxxxx
WHATSAPP_API_KEY=your-whatsapp-api-key
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id

PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
Replace all placeholder values (<username>, <password>, your-super-secret-jwt-key, etc.) with your own secure values.

Frontend – client/.env.local or root .env for Vite
If you use a separate client env file:

env
Copy code
VITE_API_BASE_URL=http://localhost:5000
In production (for https://sachintakoria.in), set it to your backend URL, e.g.:

env
Copy code
VITE_API_BASE_URL=https://api.yourdomain.com
(Adjust according to your hosting setup.)

🚀 Local Development
1. Clone the Repository
bash
Copy code
git clone <your-repo-url>.git
cd <your-project-folder>
2. Install Frontend Dependencies
From project root:

bash
Copy code
npm install
3. Install Backend Dependencies
bash
Copy code
cd server
npm install
cd ..
4. Configure Environment
Copy .env.example → .env files where needed.

Set MONGODB_URI, JWT_SECRET, admin email/password, WhatsApp keys (if using that feature), and VITE_API_BASE_URL.

5. Seed the Database (Optional but Recommended)
Create default admin user and sample content:

bash
Copy code
cd server
npm run seed
cd ..
6. Run Backend (Dev Mode)
bash
Copy code
cd server
npm run dev
Backend will typically run on: http://localhost:5000

7. Run Frontend (Dev Mode)
In a separate terminal, from project root:

bash
Copy code
npm run dev
Frontend will run on something like: http://localhost:5173

🔁 Run Frontend & Backend Together
From root:

bash
Copy code
npm run dev:full
This uses concurrently to run both frontend and backend dev servers.

🧩 API Overview
All APIs are prefixed with /api.

Public Endpoints
GET /api/projects – List all public projects

GET /api/content/:key – Get CMS content by key (e.g. hero, about, contact info)

POST /api/contact – Submit a contact enquiry

GET /api/resumes – Get resume data

GET /api/experience – Get experience timeline

GET /api/certifications – Get certifications list

GET /api/blogs – Get blogs listing

GET /api/blogs/:slug – Get blog by slug (depending on route implementation)

Admin Endpoints (JWT Protected)
POST /api/admin/auth/login – Login admin & receive JWT

GET /api/admin/projects – List projects

POST /api/admin/projects – Create project

PUT /api/admin/projects/:id – Update project

DELETE /api/admin/projects/:id – Delete project

PUT /api/admin/content/:key – Update content

GET /api/admin/messages – List contact form messages

GET /api/admin/resumes / POST /api/admin/resumes – Manage resumes

GET /api/admin/experience / POST/PUT/DELETE – Manage experience

GET /api/admin/certifications / POST/PUT/DELETE – Manage certifications

GET /api/admin/blogs / POST/PUT/DELETE – Manage blogs

(Exact payloads and responses are defined in the Zod validation schemas in server/src/validation/.)

🧪 Production Build
Build Frontend
bash
Copy code
npm run build
This will generate a production build of the React app in dist/.

Backend (Production)
bash
Copy code
cd server
npm run build    # Compiles TypeScript → dist
npm start        # Runs dist/index.js
Set all necessary environment variables on your server / hosting provider (no real secrets in Git).

🔒 Security Notes
Do NOT commit .env files or real credentials to Git.

Use strong, unique values for:

JWT_SECRET

ADMIN_DEFAULT_PASSWORD

API keys (WhatsApp etc.)

Rotate credentials regularly for production deployments.

📌 TODO / Ideas (Optional)
Add rate-limited public blog RSS feed

Add project tags & filters on frontend

Integrate analytics (e.g., Plausible, Google Analytics)

Add multi-language support (EN / HI)

🙌 Credits
Built as a full-stack MERN portfolio and CMS for Sachin Takoria.
Frontend + Backend both are custom built and deployed at:

https://sachintakoria.in/
