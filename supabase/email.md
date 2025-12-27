# Email Notifications Setup

This guide explains how to set up email notifications for new talk proposals using your Namecheap PrivateEmail account.

## Prerequisites

- Supabase CLI installed
- Namecheap PrivateEmail account (ai@devperu.org)

## Setup Steps

### 1. Configure Supabase Secrets

Run these commands in your terminal:

```bash
# Navigate to project directory
cd /Users/brunoaybar/dev/ai-dev/site

# Set SMTP configuration for Namecheap PrivateEmail
supabase secrets set SMTP_HOST=mail.privateemail.com
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_USER=you-email@your-email-provider.com
supabase secrets set SMTP_PASSWORD=your-email-password

# Set notification recipient (same email)
supabase secrets set NOTIFICATION_EMAIL=you-email@your-email-provider.com
```

### 2. Deploy Edge Function

```bash
supabase functions deploy notify-new-proposal
```

### 3. Enable pg_net Extension

The trigger uses `pg_net` for async HTTP requests. Enable it in your Supabase dashboard:

1. Go to **Database** → **Extensions**
2. Search for `pg_net`
3. Click **Enable**

### 4. Run Migration

```bash
supabase db push
```

## Testing

1. Navigate to your proposal form: https://ai.devperu.org/proponer-charla
2. Fill out and submit a test proposal
3. Check your community inbox for the notification email
4. Verify the proposal appears in: https://ai.devperu.org/internal/proposals

## Email Format

You'll receive an email with:
- **Subject**: 🎤 Nueva Propuesta: [Talk Title]
- **Body**: Formatted proposal details including name, email, phone, description, and duration
- **Link**: Direct link to the proposals dashboard

## Troubleshooting

### Email not received?

1. **Check Supabase logs:**
   ```bash
   supabase functions logs notify-new-proposal
   ```

2. **Verify secrets are set:**
   ```bash
   supabase secrets list
   ```

3. **Test Edge Function manually:**
   ```bash
   curl -X POST https://your-project.supabase.co/functions/v1/notify-new-proposal \
     -H "Content-Type: application/json" \
     -d '{"type":"INSERT","table":"talk_proposals","record":{"id":"test","full_name":"Test User","email":"test@example.com","phone":"123456789","title":"Test Talk","description":"Test description","duration":"15","created_at":"2025-12-27T00:00:00Z"}}'
   ```

## Alternative SMTP Providers

If you prefer to use a different service:

**Gmail:**
```bash
supabase secrets set SMTP_HOST=smtp.gmail.com
supabase secrets set SMTP_USER=your-email@gmail.com
supabase secrets set SMTP_PASSWORD=your-app-password  # Requires 2FA + App Password
```

**SendGrid (100 emails/day free):**
```bash
supabase secrets set SMTP_HOST=smtp.sendgrid.net
supabase secrets set SMTP_USER=apikey
supabase secrets set SMTP_PASSWORD=your-sendgrid-api-key
```