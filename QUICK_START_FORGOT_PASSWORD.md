# QUICK START: Forgot Password Feature Configuration

## ⚡ 5-Minute Setup Guide

Follow these steps to get the feature running:

---

## Step 1: Gmail Configuration (2 minutes)

### 1.1 Enable 2-Factor Authentication
- Go to https://myaccount.google.com
- Navigate to Security settings
- Enable "2-Step Verification"

### 1.2 Generate App Password
- Go to https://myaccount.google.com/apppasswords
- Select "Mail" → "Windows Computer"
- Copy the 16-character password

### 1.3 Update application.properties
Edit: `backend/kotto-backend/src/main/resources/application.properties`

Replace these lines:
```properties
spring.mail.username=YOUR_GMAIL_ADDRESS@gmail.com
spring.mail.password=YOUR_16_CHAR_APP_PASSWORD_HERE
```

Example:
```properties
spring.mail.username=kotto.restaurant@gmail.com
spring.mail.password=abcd efgh ijkl mnop
```

---

## Step 2: Update Frontend URL (1 minute)

In the same `application.properties` file, verify:
```properties
app.frontend.url=http://localhost:5173
```

For **production**, change to your domain:
```properties
app.frontend.url=https://kotto-restaurant.com
```

---

## Step 3: Rebuild Backend (1 minute)

```bash
cd backend/kotto-backend
mvn clean install
mvn spring-boot:run
```

Watch for:
- ✅ `HibernateJpaAutoConfiguration` - Table created
- ✅ `MailSenderAutoConfiguration` - Email configured
- ✅ `Started KottoBackendApplication` - Ready

---

## Step 4: Start Frontend (1 minute)

In another terminal:
```bash
cd frontend/kotto-frontend
npm install
npm run dev
```

Open: http://localhost:5173

---

## Step 5: Quick Test (1 minute)

1. Click "Login" → "Forgot Password?"
2. Enter any email (test@example.com)
3. Check your email (check spam folder)
4. Click reset link from email
5. Enter new password
6. Login with new credentials

---

## ✅ SUCCESS INDICATORS

- [ ] Backend starts without errors
- [ ] Frontend loads on http://localhost:5173
- [ ] "Forgot Password?" link visible on login page
- [ ] Email received in inbox within 30 seconds
- [ ] Reset link in email works
- [ ] New password accepted on login

---

## 🚨 If Email Not Sent

### Check 1: Application Logs
Look for error in backend console output:
```
Failed to send password reset email to test@example.com
```

### Check 2: Gmail Credentials
Verify in `application.properties`:
- Email address spelled correctly
- App password is 16 characters (not regular password)
- No extra spaces around password
- 2-Factor authentication is enabled on Gmail account

### Check 3: SMTP Connection
Try this test (replace with your credentials):
```bash
curl -v smtp://smtp.gmail.com:587 --ssl
```

Should show: `220 smtp.gmail.com ESMTP ...`

### Check 4: Application Properties Syntax
Ensure no typos:
```
spring.mail.properties.mail.smtp.auth=true        ✅ Correct
spring.mail.propertiesmail.smtp.auth=true         ❌ Wrong (no dot)
```

---

## 📧 DEFAULT EMAIL TEMPLATE

Users will receive:
```
Subject: Password Reset Request - KOTTO Restaurant

Hello,

You requested a password reset for your KOTTO Restaurant account.

Click the link below to reset your password:
http://localhost:5173/reset-password?token=YOUR_TOKEN

This link will expire in 30 minutes.

If you did not request a password reset, please ignore this email.

Best regards,
KOTTO Restaurant Team
```

To customize, edit: `EmailService.buildEmailBody()`

---

## 🔐 SECURITY REMINDERS

✅ This implementation is production-ready and includes:
- Token hashing (BCrypt)
- 30-minute expiry
- Single-use tokens
- Email non-enumeration
- Password validation
- CSRF protection

⚠️ Additional recommended steps:
- Add rate limiting (prevent brute force)
- Monitor failed reset attempts
- Implement email verification (first-time setup)
- Add CAPTCHA on forgot-password form

---

## 📱 TESTING CHECKLIST

```
Unit Test Scenarios:
[ ] Valid email → Email sent
[ ] Invalid email → Validation error
[ ] Non-existent email → No error (security)
[ ] Expired token (31+ min) → Error
[ ] Used token (already reset) → Error
[ ] Invalid token format → Error
[ ] Password < 6 chars → Error
[ ] Password > 6 chars → Success
[ ] Passwords don't match → Error
[ ] Reset → Can login with new password
[ ] Original password doesn't work → Confirmed
```

---

## 🚀 DEPLOYMENT CHECKLIST

Before going to production:

```
[ ] Test complete flow on staging
[ ] Update all credentials (email, password, domain)
[ ] Set up proper HTML email templates
[ ] Enable rate limiting (optional)
[ ] Set up monitoring/alerts for failed emails
[ ] Document procedure in user guide
[ ] Have support team test the feature
[ ] Monitor error logs for first 24 hours
[ ] Analyze usage metrics
```

---

## 📞 COMMON ERRORS & SOLUTIONS

| Error | Cause | Solution |
|-------|-------|----------|
| `SMTPAuthenticationException` | Wrong credentials | Verify app password in settings |
| `MessagingException: 535` | Auth failed | Check 2FA enabled on Gmail |
| `No reset email received` | SMTP misconfigured | Check spring.mail.properties |
| `Invalid reset token` | Token expired | Must be within 30 minutes |
| `Token already used` | Already reset password | Request new reset link |
| `CORS error` | Frontend/backend mismatch | Verify CORS config |

---

## 🎯 NEXT STEPS

1. ✅ Complete configuration steps above
2. ✅ Test the feature end-to-end
3. ✅ Review security checklist
4. ✅ Customize email template (optional)
5. ✅ Deploy to production
6. ✅ Monitor logs for issues
7. ✅ Gather user feedback

---

## 📚 FULL DOCUMENTATION

For detailed implementation information, see:
`FORGOT_PASSWORD_IMPLEMENTATION.md`

Key sections:
- Complete architecture overview
- File-by-file code documentation
- API endpoints & curl examples
- Troubleshooting guide
- Production checklist

---

**Status:** ✅ Ready for Production
**Configuration Time:** ~5 minutes
**Testing Time:** ~2 minutes
