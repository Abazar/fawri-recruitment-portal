# 🚀 Quick Start - Get Demo Running in 5 Minutes

## Option 1: Using MongoDB Atlas (Recommended - Easiest)

### Step 1: Setup MongoDB Atlas (2 minutes)
Follow the guide: [MONGODB-SETUP.md](./MONGODB-SETUP.md)

You'll get a connection string like:
```
mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/fawri_recruitment?retryWrites=true&w=majority
```

### Step 2: Update .env.local
Replace the `DATABASE_URL` line in `.env.local` with your connection string from Step 1.

### Step 3: Run Setup Script
```bash
npm run setup
```

This will:
- Install dependencies
- Seed the database with admin users
- Verify everything is working

### Step 4: Start the Demo
```bash
npm start
```

This starts both the API server and frontend in one command!

### Step 5: Open Browser
Go to: http://localhost:3000

**Login with:**
- **Admin:** admin@fawri.com / Admin@123
- **HR:** hr@fawri.com / Hr@123456

---

## Option 2: Using Local MongoDB

### Step 1: Install & Start MongoDB

**Mac:**
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

### Step 2: Run Setup
```bash
npm run setup
```

### Step 3: Start the Demo
```bash
npm start
```

### Step 4: Open Browser
Go to: http://localhost:3000

---

## 🎯 What You Can Do

### As Admin (admin@fawri.com / Admin@123):
1. Login via "Staff Login"
2. View all applications dashboard
3. See statistics (Total, Submitted, Under Review, Approved)
4. Filter applications by status
5. View application details

### As New Rider:
1. Click "Apply as Rider"
2. Register with your details
3. Complete application form:
   - Check "I have a motorcycle license"
   - Add license number (e.g., "ABC123456")
   - Add years of experience (e.g., 5)
   - Fill emergency contact info
4. Click "Save Draft" to save
5. Click "Submit Application" to submit
6. See status change from "Draft" to "Submitted"

### Switch Between Users:
1. Logout from current user
2. Login with different credentials
3. See different dashboards based on role

---

## 🔧 Troubleshooting

### "Failed to fetch" error?
The API server needs to be running. Make sure you ran `npm start` (not just `npm run dev`).

### Can't login?
Make sure you ran `npm run setup` to create admin users.

### MongoDB connection error?
- **MongoDB Atlas:** Check your connection string in `.env.local`
- **Local MongoDB:** Run `mongosh` to verify it's running

### Port already in use?
```bash
# Kill processes on ports 3000 and 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

Then run `npm start` again.

---

## 📋 Complete Command Reference

```bash
# First time setup
npm run setup          # Install dependencies + seed database

# Start the demo
npm start              # Start both API and frontend

# Development (separate terminals)
npm run dev:api        # Start API only (Terminal 1)
npm run dev            # Start frontend only (Terminal 2)

# Database
npm run seed           # Create admin users

# Other
npm run build          # Build for production
npm run lint           # Run linter
```

---

## ✅ Success Checklist

- [ ] MongoDB is set up (Atlas or local)
- [ ] Ran `npm run setup` successfully
- [ ] See "Setup Complete!" message
- [ ] Ran `npm start`
- [ ] See API server running on port 3001
- [ ] See Next.js running on port 3000
- [ ] Can open http://localhost:3000 in browser
- [ ] Can login with admin@fawri.com / Admin@123

If all checked, you're ready to go! 🎉

---

## 🆘 Still Need Help?

Check the full README: [README.md](./README.md)

Or open an issue with:
- Error message you're seeing
- Output of `npm run setup`
- Whether you're using Atlas or local MongoDB
