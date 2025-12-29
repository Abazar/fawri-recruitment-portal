# MongoDB Atlas Setup (2 Minutes)

MongoDB Atlas is a **FREE cloud database** - no installation needed!

## Step-by-Step Setup

### 1. Create Account (30 seconds)
Go to: https://www.mongodb.com/cloud/atlas/register

- Sign up with Google/GitHub (fastest)
- Or use email

### 2. Create Free Cluster (1 minute)
After signing in:

1. Click **"Build a Database"**
2. Choose **"M0 Free"** (completely free forever)
3. Choose any cloud provider (AWS is fine)
4. Choose a region close to you
5. Cluster Name: leave as default
6. Click **"Create Cluster"**

Wait 1-3 minutes for cluster to be created.

### 3. Create Database User (30 seconds)

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `admin`
5. Password: Click **"Autogenerate Secure Password"** (copy it!)
6. User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### 4. Allow Access (30 seconds)

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

### 5. Get Connection String (30 seconds)

1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **IMPORTANT:** Replace `<password>` with your actual password

### 6. Update .env.local

Open `/workspace/cmjm0s1ne00h2ikpsab9dtar7/my-first-project/.env.local`

Replace this line:
```
DATABASE_URL=mongodb://localhost:27017/fawri_recruitment
```

With your connection string:
```
DATABASE_URL=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/fawri_recruitment?retryWrites=true&w=majority
```

**Note:** Add `/fawri_recruitment` before the `?` in the connection string!

---

## ✅ That's It!

Now run:
```bash
npm start
```

Your app will connect to MongoDB Atlas automatically!

---

## Troubleshooting

### Connection timeout
- Make sure you clicked "Allow Access from Anywhere" in Network Access
- Wait a few minutes after creating the cluster

### Authentication failed
- Double-check your password in the connection string
- Make sure you replaced `<password>` with your actual password

### Need Help?
MongoDB Atlas has great docs: https://www.mongodb.com/docs/atlas/
