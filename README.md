# Fawri Recruitment Portal - V1 Demo

A comprehensive recruitment management system for overseas motorbike rider hiring.

This repository contains:
- Next.js frontend (web)
- Fastify backend (API)

## 🚨 IMPORTANT: Before You Start

**The "Failed to fetch" error means the backend API isn't running!**

You MUST run both the API server AND the Next.js frontend for this demo to work.

---

## Environment Variables

- Use [.env.example](.env.example) as a template.
- For local development, create `.env.local` (not committed; git ignores `.env*`).

Required variables:

### Backend (API)
- `DATABASE_URL` (MongoDB connection string)
- `JWT_SECRET` (required in production)
- `JWT_REFRESH_SECRET` (required in production)
- `API_PORT` (optional; defaults to 3001)

### Frontend (Web)
- `NEXT_PUBLIC_API_URL` (API base URL; defaults to `http://localhost:3001`)
- `NEXT_PUBLIC_APP_URL` (web base URL; used for API CORS + metadata; defaults to `http://localhost:3000`)

---

## Quick Setup (5 Steps)

### Step 1: Start MongoDB

MongoDB must be running before anything else works.

**Mac (using Homebrew):**
```bash
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo systemctl start mongod
```

**Or use MongoDB Atlas (Cloud - Free):**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `DATABASE_URL` in `.env.local`

### Step 2: Seed the Database

Create the initial admin users:

```bash
npm run seed
```

**This creates:**
- **admin@fawri.com** / **Admin@123** (Super Admin)
- **hr@fawri.com** / **Hr@123456** (HR Admin)

### Step 3: Start the API Server

**Open Terminal 1:**
```bash
npm run dev:api
```

You should see:
```
✅ MongoDB connected successfully
🚀 Fawri Recruitment API Server running on http://localhost:3001
```

**Keep this terminal running!**

### Step 4: Start Next.js Frontend

**Open Terminal 2 (new terminal):**
```bash
npm run dev
```

You should see:
```
✓ Ready in 2.1s
○ Local: http://localhost:3000
```

**Keep this terminal running too!**

### Step 5: Open Your Browser

Go to: **http://localhost:3000**

---

## ✅ Testing the Demo

### Test 1: Admin Login
1. Go to http://localhost:3000
2. Click "Staff Login"
3. Login with: **admin@fawri.com** / **Admin@123**
4. You should see the admin dashboard

### Test 2: Register New Rider
1. Go to http://localhost:3000
2. Click "Apply as Rider"
3. Fill in the registration form
4. Password must include: uppercase, lowercase, number, special character
5. After registration, you'll see the applicant dashboard

### Test 3: Submit Application
1. As a rider, fill in the application form
2. Check "I have a motorcycle license"
3. Fill in license number and years of experience
4. Click "Submit Application"
5. Status should change from "Draft" to "Submitted"

### Test 4: View in Admin Dashboard
1. In another browser window, login as admin
2. You should see the submitted application in the list
3. Filter by status to see different applications

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch" error

**Solution:** The API server isn't running or MongoDB isn't connected.

1. Check if MongoDB is running:
   ```bash
   mongosh
   # Should connect. If not, start MongoDB first.
   ```

2. Check if API is running:
   ```bash
   curl http://localhost:3001/health
   # Should return success message
   ```

3. Make sure you ran `npm run dev:api` in a separate terminal

### Issue: Port already in use

**Solution:** Kill the process:
```bash
# For port 3001 (API):
lsof -ti:3001 | xargs kill -9

# For port 3000 (Next.js):
lsof -ti:3000 | xargs kill -9
```

### Issue: Can't submit application

**Solution:** Make sure you:
1. Check "I have a motorcycle license"
2. Fill in the license number
3. Add years of riding experience

### Issue: Admin login doesn't work

**Solution:** Make sure you ran the seed script:
```bash
npm run seed
```

---

## 📁 Project Structure

```
my-first-project/
├── src/
│   ├── app/                      # Next.js Frontend
│   │   ├── page.tsx             # Landing page (NEW! Professional design)
│   │   ├── login/               # Login page (UPDATED!)
│   │   ├── register/            # Registration (UPDATED!)
│   │   ├── applicant/           # Applicant dashboard
│   │   └── admin/               # Admin dashboard
│   ├── server/                   # Fastify Backend API
│   │   ├── models/              # Database models
│   │   ├── routes/              # API routes
│   │   ├── controllers/         # Business logic
│   │   ├── middleware/          # Authentication
│   │   └── index.ts             # Server entry point
│   └── lib/                      # Shared utilities
├── .env.local                    # Environment variables
└── README.md                     # This file
```

---

## 🎨 What's New in the UI

✨ **Professional, Modern Design:**
- NO emojis (replaced with professional icons)
- Clean, modern landing page with sections
- Professional header and footer
- Back navigation on all pages
- Improved forms with black text (easy to read)
- Better error messages
- Demo credentials visible on login page

✨ **Landing Page Features:**
- Hero section with compelling copy
- Feature showcase
- How It Works section
- About section
- Call-to-action sections
- Full footer with links

---

## 🚀 Features

✅ **User Authentication** - JWT-based with secure password hashing
✅ **Role-Based Access** - Different permissions for applicants and admins
✅ **Application Management** - Complete application workflow
✅ **Modern UI** - Professional design with Tailwind CSS & Lucide icons
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Better Error Messages** - Clear instructions when things go wrong

---

## 📊 Default Users

### Admin Account
- **Email:** admin@fawri.com
- **Password:** Admin@123
- **Role:** Super Admin
- **Access:** Full system access

### HR Account
- **Email:** hr@fawri.com
- **Password:** Hr@123456
- **Role:** HR Admin
- **Access:** View and manage applications

### New Riders
- Register at http://localhost:3000/register
- Automatically assigned "Applicant" role
- Can submit and track applications

---

## 🔗 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new applicant
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (protected)

### Applications
- `GET /api/v1/applications/my-application` - Get applicant's application
- `PUT /api/v1/applications/my-application` - Update application
- `POST /api/v1/applications/my-application/submit` - Submit application
- `GET /api/v1/applications` - Get all applications (admin only)
- `GET /api/v1/applications/:id` - Get application by ID (admin only)

---

## 💻 Development Commands

```bash
# Install dependencies
npm install

# Seed database (create admin users)
npm run seed

# Start API server (Terminal 1)
npm run dev:api

# Start Next.js (Terminal 2)
npm run dev

# Run both together (if supported on your OS)
npm run dev:all

# Build for production

npm run build

# Start the demo (runs both API + web in dev mode)
npm start
```

---

## Deploying to Vercel

See [VERCEL-DEPLOYMENT.md](VERCEL-DEPLOYMENT.md) for a minimal guide.

---

## 🎯 What's Included in This Demo

✅ **Working Features:**
- Modern, professional landing page
- User authentication (login/register)
- Application creation and submission
- Admin dashboard with filtering
- Role-based access control
- Responsive design
- Back navigation
- Clear error messages

⏳ **Coming in Next Iterations:**
- Document upload and verification
- Payment processing (Stripe, PayPal)
- Training modules with videos/quizzes
- Email/SMS notifications
- Multi-language support
- Advanced reporting and analytics

---

## 📞 Support

### Common Questions

**Q: Why do I see "Failed to fetch"?**
A: The API server isn't running. Run `npm run dev:api` in a separate terminal.

**Q: Can I skip MongoDB?**
A: No, MongoDB is required. Use MongoDB Atlas (free cloud) if you don't want to install locally.

**Q: Do I need to seed every time?**
A: No, only once. The data persists in MongoDB.

**Q: Can I change the demo credentials?**
A: Yes, edit `src/server/scripts/seed.ts` and run `npm run seed` again.

---

## 🎉 Success Checklist

Before you say "it doesn't work", make sure:

- [ ] MongoDB is running (`mongosh` connects)
- [ ] You ran `npm run seed` at least once
- [ ] Terminal 1 is running `npm run dev:api`
- [ ] Terminal 2 is running `npm run dev`
- [ ] You can access http://localhost:3001/health
- [ ] You can access http://localhost:3000

If all checkboxes are checked and it still doesn't work, check the terminal logs for errors.

---

**Built with ❤️ for Fawri Recruitment**

Version 1.0 - Demo
