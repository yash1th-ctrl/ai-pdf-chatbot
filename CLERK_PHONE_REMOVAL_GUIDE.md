# 🔧 How to Remove Phone Number Requirement from Google Login

## 📋 Overview
The phone number requirement for Google authentication is configured in your **Clerk Dashboard**, not in the code. Follow these steps to disable it.

## 🚀 Step-by-Step Instructions

### **Step 1: Access Clerk Dashboard**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Sign in to your account
3. Select your application (AI PDF Chatbot)

### **Step 2: Navigate to User & Authentication Settings**
1. In the left sidebar, click on **"User & Authentication"**
2. Click on **"Email, Phone, Username"**

### **Step 3: Configure Phone Number Settings**
1. Find the **"Phone number"** section
2. **Uncheck** the following options:
   - ❌ **"Required"** - This makes phone number optional
   - ❌ **"Used for sign-in"** - This removes phone as a sign-in method
   - ❌ **"Verify at sign-up"** - This skips phone verification

### **Step 4: Configure Google OAuth Settings**
1. Go to **"Social Connections"** in the left sidebar
2. Find **"Google"** in the list
3. Click on **"Configure"** or the settings icon
4. In the Google configuration:
   - ✅ **Enable** Google OAuth
   - ❌ **Disable** "Require phone number verification"
   - ❌ **Disable** "Collect phone number during sign-up"

### **Step 5: Update Sign-up Flow**
1. Go to **"Customization"** → **"Sign-up"**
2. In the **"Required fields"** section:
   - ✅ Keep **Email address** checked
   - ❌ **Uncheck** **Phone number**
3. In **"Optional fields"**:
   - You can move **Phone number** here if you want it optional
   - Or remove it completely

### **Step 6: Save Changes**
1. Click **"Save"** or **"Update"** at the bottom
2. Wait for changes to propagate (usually immediate)

## 🧪 Testing the Changes

### **Test Google Login**
1. Go to your app: `http://localhost:3001/sign-in`
2. Click **"Continue with Google"**
3. Complete Google OAuth flow
4. **Verify**: You should NOT be prompted for phone number

### **Expected Behavior**
- ✅ Google login works without phone number
- ✅ Users can sign up with just email
- ✅ No phone verification required
- ✅ Faster sign-up process

## 🔍 Alternative Configuration

If you want to keep phone numbers **optional** but not required:

### **Option 1: Optional Phone Number**
- ✅ **Enable** phone number
- ❌ **Disable** "Required"
- ❌ **Disable** "Used for sign-in"
- ✅ **Enable** "Collect during sign-up" (optional)

### **Option 2: Completely Remove Phone**
- ❌ **Disable** phone number entirely
- Remove from all sign-up flows
- Remove from user profile requirements

## 🚨 Important Notes

1. **Changes are immediate** - No code deployment needed
2. **Existing users** with phone numbers will keep them
3. **New users** won't be required to provide phone numbers
4. **Google OAuth** will work with just email verification

## 🎯 Current Clerk Configuration

Your current Clerk keys (from `.env.local`):
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aGFybWxlc3MtbW9uaXRvci04Mi5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_VbcIzUghYgGc5hiDM2al9cVU7Bcz9Hmz5HvBKedL7n
```

## ✅ Verification Checklist

After making changes, verify:
- [ ] Google login works without phone prompt
- [ ] Sign-up flow is streamlined
- [ ] No phone verification emails/SMS
- [ ] Users can access dashboard immediately
- [ ] Authentication flow is faster

## 🆘 Troubleshooting

**If phone number is still required:**
1. Clear browser cache and cookies
2. Try incognito/private browsing mode
3. Wait 5-10 minutes for Clerk changes to propagate
4. Check Clerk Dashboard for any conflicting settings

**If Google login stops working:**
1. Verify Google OAuth is still enabled
2. Check Google OAuth configuration
3. Ensure redirect URLs are correct
4. Test with a different Google account

## 📞 Support

If you need help:
1. Check [Clerk Documentation](https://clerk.com/docs)
2. Visit [Clerk Support](https://clerk.com/support)
3. Check the Clerk Dashboard for any error messages
