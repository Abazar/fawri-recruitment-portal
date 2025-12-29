# 🚀 Fawri Recruitment Portal - Quick Start Guide

## ⚡ Get the Demo Running in 5 Minutes

### Step 1: Install MongoDB

**Mac (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
```

**Or use MongoDB Atlas (Cloud - Free):**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string
- Update `DATABASE_URL` in `.env.local`

### Step 2: Install Dependencies
```bash
cd my-first-project
npm install
```

### Step 3: Seed the Database
```bash
npm run seed
```

This creates two admin users:
- **admin@fawri.com** / **Admin@123** (Super Admin)
- **hr@fawri.com** / **Hr@123456** (HR Admin)

### Step 4: Start the Application

**Option A: Two terminals (recommended for development)**
```bash
# Terminal 1 - API Server
npm run dev:api

# Terminal 2 - Next.js Frontend
npm run dev
```

**Option B: Single command (runs both)**
```bash
npm run dev:all
```

### Step 5: Open Your Browser

Go to: **http://localhost:3000**

---

## 🎯 Try These User Flows

### Flow 1: Register as New Applicant (2 minutes)
1. Click **"Apply as Rider"**
2. Fill registration form with your details
3. Password must include: uppercase, lowercase, number, special char
4. Login automatically after registration
5. Complete application form (experience & personal info)
6. Click **"Submit Application"**
7. See status change from "Draft" to "Submitted"

### Flow 2: Admin Review (1 minute)
1. Open new browser tab: http://localhost:3000
2. Click **"Staff Login"**
3. Login with: **admin@fawri.com** / **Admin@123**
4. See all applications in dashboard
5. View statistics (Total, Submitted, Under Review, Approved)
6. Filter by status
7. Click "View Details" on any application

### Flow 3: Multi-User Test (3 minutes)
1. Register 2-3 different applicants (use different emails)
2. Have each submit their application
3. Switch to admin view
4. See all applications in the list
5. Notice real-time updates (refresh to see new submissions)

---

## 📡 Test the API Directly

### Health Check
```bash
curl http://localhost:3001/health
```

### Register New User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "nationality": "USA",
    "currentCountry": "USA"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fawri.com",
    "password": "Admin@123"
  }'
```

### Get All Applications (requires auth token from login)
```bash
curl http://localhost:3001/api/v1/applications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎨 What's Included in This Demo

### ✅ Working Features
- **Authentication**: JWT-based with bcrypt password hashing
- **Registration**: New applicants can self-register
- **Login**: Email + password authentication
- **RBAC**: Role-based access control (applicant vs admin)
- **Application Form**: Multi-section application with validation
- **Application Workflow**: Draft → Submitted states
- **Admin Dashboard**: View all applications with filtering
- **Responsive Design**: Works on desktop, tablet, and mobile

### ⚠️ Coming in Next Iterations
- Document upload and verification
- Payment processing
- Training modules
- Email/SMS notifications
- Multi-language support
- Advanced reporting and analytics

---

## 🔧 Common Issues & Solutions

### Issue: MongoDB Connection Failed
```
Solution: Make sure MongoDB is running
Mac: brew services start mongodb-community
Linux: sudo systemctl start mongod
Or use MongoDB Atlas cloud connection
```

### Issue: Port 3001 Already in Use
```
Solution: Kill the process using the port
lsof -ti:3001 | xargs kill -9
```

### Issue: JWT Token Expired
```
Solution: Tokens expire after 15 minutes. Just log in again.
```

### Issue: Can't Submit Application
```
Solution: Make sure you:
1. Check "I have a motorcycle license"
2. Fill in the license number
3. Add years of riding experience
```

---

## 📊 Database Structure

After seeding and testing, your MongoDB will have:

**Users Collection:**
- 2 admin users (from seed)
- N applicant users (from registrations)

**Applications Collection:**
- 1 draft application per applicant
- Updated to "submitted" when applicant submits

---

## 🎓 Understanding the Code

### Key Files to Explore:

**Backend API:**
- `src/server/index.ts` - Fastify server setup
- `src/server/models/User.ts` - User schema with auth logic
- `src/server/models/Application.ts` - Application schema
- `src/server/controllers/authController.ts` - Auth logic
- `src/server/middleware/auth.ts` - JWT verification

**Frontend:**
- `src/app/page.tsx` - Landing page
- `src/app/login/page.tsx` - Login page
- `src/app/register/page.tsx` - Registration
- `src/app/applicant/dashboard/page.tsx` - Applicant dashboard
- `src/app/admin/dashboard/page.tsx` - Admin dashboard
- `src/lib/api.ts` - API client utility

---

## 📞 Need Help?

If something isn't working:
1. Check MongoDB is running: `mongosh` (should connect)
2. Check API is running: `curl http://localhost:3001/health`
3. Check Next.js is running: `curl http://localhost:3000`
4. Check browser console for errors (F12 → Console tab)
5. Check API server logs in the terminal

---

## 🎉 Congratulations!

You now have a working recruitment management system with:
- User authentication
- Application management
- Admin oversight
- Role-based access control

This is the foundation for the full V1 system as specified in the requirements document.

**Next Steps:**
- Add document upload functionality
- Integrate payment gateways
- Build training module
- Add notifications system
- Implement multi-language support

See `planning.md` for the complete roadmap.

---

**Happy Coding! 🚀**
