# A Louder Voice — Deployment Guide

## Architecture
- **Frontend**: Vercel (React + Vite) → https://www.aloudervoice.co.za
- **Backend**: Railway (Node + Express) → https://api.aloudervoice.co.za
- **Database**: MongoDB Atlas
- **Media**: Cloudinary (images & videos)

---

## Step 1: Cloudinary Setup (FREE — required for uploads)

1. Sign up at https://cloudinary.com (free tier = 25GB storage)
2. Go to **Dashboard → Account Details**
3. Copy: `Cloud Name`, `API Key`, `API Secret`
4. Add to Railway env vars (Step 3)

---

## Step 2: Gmail App Password (required for contact form & password reset)

1. Go to https://myaccount.google.com (your Gmail)
2. Enable **2-Step Verification** if not already on
3. Go to **Security → App Passwords**
4. Create new app password → name it "A Louder Voice"
5. Copy the **16-character code** (e.g. `abcd efgh ijkl mnop` — use without spaces: `abcdefghijklmnop`)
6. Add to Railway as `EMAIL_PASS`

---

## Step 3: Railway Environment Variables

In your Railway backend service → **Variables**, set ALL of these:

```
MONGO_URI=mongodb+srv://adminUser:Admin%4012345@cluster0.1q3lqmq.mongodb.net/myDatabase?retryWrites=true&w=majority&maxPoolSize=100
JWT_SECRET=uji7t2fQHgNGRIc1JOp4LoWVE8x0eXkhDbqmPSTln6MvaACUdy5FzKr3YBwZ9s
NODE_ENV=production
ALLOWED_ORIGINS=https://aloudervoice.co.za,https://www.aloudervoice.co.za
PORT=5000
CLIENT_URL=https://www.aloudervoice.co.za
EMAIL_USER=TshegoIsithebe@gmail.com
EMAIL_PASS=your_16_char_app_password_no_spaces
CONTACT_EMAIL=TshegoIsithebe@gmail.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Step 4: Vercel Environment Variables

In Vercel → Project Settings → **Environment Variables**:

```
VITE_BACKEND_URL=https://api.aloudervoice.co.za
```

(Replace with your actual Railway public URL if different)

---

## Step 5: Deploy

**Backend (Railway):**
```bash
cd backend
git add -A && git commit -m "fix: cloudinary uploads + email fixes"
git push
```

**Frontend (Vercel):**
```bash
# From project root
git add -A && git commit -m "fix: cloudinary image URLs + admin auth"
git push
```

---

## Issues Fixed in This Version

| Issue | Fix |
|-------|-----|
| Contact form fails | Added `CONTACT_EMAIL` + `CLIENT_URL` env vars; fixed EMAIL_PASS format |
| Forgot password fails | Added `CLIENT_URL` env var so reset links work |
| Images don't upload | Switched from disk storage → Cloudinary (Railway filesystem is ephemeral) |
| Videos don't upload | Same — Cloudinary handles video too |
| Admin create post auth | Added `Authorization` header to upload request |
| Images broken after deploy | All image/video URLs are now full Cloudinary URLs, no backend prefix needed |
| NODE_ENV was development | Set to `production` |

---

## Testing After Deploy

1. **Contact form**: Go to /contact, fill form, submit → check email
2. **Forgot password**: Go to /forgot-password, enter email → check for reset link
3. **Upload image**: Log in as admin → /admin → Create Post → attach image → submit
4. **Upload video**: Same as above with a video file
5. **View post**: Click a post with image/video — should display correctly
