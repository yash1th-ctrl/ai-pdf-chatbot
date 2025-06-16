# 🚀 Gemini API Usage & Limits Guide

## 📊 Current Configuration

Your AI PDF Chatbot is now using **Gemini 1.5 Flash** for optimal performance within free tier limits.

## 🆓 Free Tier Limits

### **Gemini 1.5 Flash (Current Model)**
- ✅ **Requests per minute**: 15
- ✅ **Requests per day**: 1,500
- ✅ **Tokens per minute**: 1 million
- ✅ **Tokens per day**: 50 million

### **Gemini 1.5 Pro (Premium Model)**
- ⚠️ **Requests per minute**: 2
- ⚠️ **Requests per day**: 50
- ⚠️ **Tokens per minute**: 32,000
- ⚠️ **Tokens per day**: 50 million

## 🔄 Model Switching

### **When to use Gemini 1.5 Flash:**
- ✅ High volume usage
- ✅ Quick responses needed
- ✅ General PDF Q&A
- ✅ Daily usage within free tier

### **When to upgrade to Gemini 1.5 Pro:**
- 🎯 Complex analysis required
- 🎯 Higher quality responses needed
- 🎯 Low volume, premium usage
- 🎯 Paid API plan available

## 🛠️ How to Switch Models

### **Switch to Gemini 1.5 Pro:**
```javascript
// In config/AIModel.js
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});
```

### **Switch to Gemini 1.5 Flash:**
```javascript
// In config/AIModel.js
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
```

## 💡 Best Practices

### **Optimize Usage:**
1. **Keep questions concise** - Shorter prompts use fewer tokens
2. **Avoid repetitive queries** - Cache common responses
3. **Use specific questions** - Get better results with fewer retries
4. **Monitor usage** - Check Google AI Studio for quota status

### **Error Handling:**
- ✅ Automatic quota error detection
- ✅ User-friendly error messages
- ✅ Processing state management
- ✅ Retry suggestions

## 📈 Upgrading Your Plan

### **Google AI Studio Paid Plans:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Go to **Billing** section
3. Choose a paid plan for higher limits
4. Switch to Gemini 1.5 Pro for premium features

### **Benefits of Paid Plans:**
- 🚀 Higher request limits
- 🚀 Faster response times
- 🚀 Priority support
- 🚀 Advanced model features

## 🔍 Monitoring Usage

### **Check Current Usage:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Go to **API Keys** section
3. View usage statistics
4. Monitor quota consumption

### **Usage Tips:**
- Check usage before peak hours
- Plan queries for optimal timing
- Consider batch processing for multiple PDFs
- Use caching for frequently asked questions

## 🆘 Troubleshooting

### **Quota Exceeded Error:**
```
Error: You exceeded your current quota
```

**Solutions:**
1. ⏰ **Wait for quota reset** (resets daily)
2. 🔄 **Switch to Gemini 1.5 Flash** (higher limits)
3. 💳 **Upgrade to paid plan**
4. ⚡ **Optimize query frequency**

### **Rate Limit Error:**
```
Error: Too many requests per minute
```

**Solutions:**
1. ⏸️ **Wait 1-2 minutes** before retrying
2. 🐌 **Reduce query frequency**
3. 📊 **Monitor request timing**

## 📞 Support

- 📚 [Google AI Documentation](https://ai.google.dev/docs)
- 🎯 [Gemini API Limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- 💬 [Google AI Studio](https://aistudio.google.com/)
