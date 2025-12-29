# ⚡ START HERE - Super Simple Instructions

## What You Need to Do (2 Options)

---

## 🌟 OPTION 1: MongoDB Atlas (Cloud - EASIEST, NO INSTALLATION)

### Step 1: Get MongoDB Atlas (2 minutes)
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (use Google login - fastest)
3. Create a FREE cluster (M0 Free option)
4. Create a database user (username: admin, auto-generate password)
5. Allow access from anywhere (Network Access → Add IP → Allow Access from Anywhere)
6. Get your connection string (Database → Connect → Connect your application)
   - It looks like: `mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/`
   - Add `fawri_recruitment?retryWrites=true&w=majority` at the end

### Step 2: Update .env.local
Open the file: `.env.local`

Replace this line:
```
DATABASE_URL=mongodb://localhost:27017/fawri_recruitment
```

With your Atlas connection string:
```
DATABASE_URL=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/fawri_recruitment?retryWrites=true&w=majority
```

### Step 3: Run These Commands
```bash
npm run setup
npm start
```

### Step 4: Open Browser
http://localhost:3000

**Login:** admin@fawri.com / Admin@123

---

## 🖥️ OPTION 2: Local MongoDB (If You Have It Installed)

### Step 1: Start MongoDB
```bash
# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Step 2: Run These Commands
```bash
npm run setup
npm start
```

### Step 3: Open Browser
http://localhost:3000

**Login:** admin@fawri.com / Admin@123

---

## 🎉 That's It!

The `npm start` command runs EVERYTHING - both API server and frontend.

You'll see:
```
[API] ✅ MongoDB connected successfully
[API] 🚀 Fawri Recruitment API Server running on http://localhost:3001
[WEB] ✓ Ready in 2.1s
[WEB] ○ Local: http://localhost:3000
```

---

## 🧪 Test the Demo

### Test 1: Admin Login
- Go to http://localhost:3000
- Click "Staff Login"
- Login: admin@fawri.com / Admin@123
- See admin dashboard with statistics

### Test 2: Register as Rider
- Go to http://localhost:3000
- Click "Apply as Rider"
- Fill form (password needs uppercase, lowercase, number, special char)
- Auto-login after registration
- See applicant dashboard

### Test 3: Submit Application
- Fill in application form
- Check "I have a motorcycle license"
- Add license number: ABC123456
- Add years: 5
- Fill emergency contact
- Click "Submit Application"
- Status changes to "Submitted"

### Test 4: View in Admin
- Open new browser tab
- Login as admin
- See the submitted application in the list!

---

## ❌ If Something Goes Wrong

### Error: "Failed to fetch"
**Fix:** The API server isn't running.
- Make sure you ran `npm start` (not just `npm run dev`)
- Check if you see both [API] and [WEB] in the terminal output

### Error: Can't connect to MongoDB
**Fix:**
- **Using Atlas?** Check your connection string in `.env.local`
- **Using Local?** Run `mongosh` to test if MongoDB is running

### Error: Can't login
**Fix:** Run `npm run seed` to create admin users

### Error: Port in use
**Fix:**
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
npm start
```

---

## 📞 Need More Help?

1. Read detailed guide: [QUICKSTART.md](./QUICKSTART.md)
2. MongoDB setup help: [MONGODB-SETUP.md](./MONGODB-SETUP.md)
3. Full documentation: [README.md](./README.md)

---

## 💡 Pro Tips

- Use MongoDB Atlas (Option 1) - it's easier and always available
- Keep the terminal running - don't close it
- Open http://localhost:3000 in a new browser window
- Try registering multiple riders and view them all as admin

---

**You're all set! Enjoy the demo! 🚀**
