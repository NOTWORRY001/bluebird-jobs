# Quick Setup Guide - Save & Share Features

## Step 1: Set Up Database

1. **Open your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Run the following SQL:**

```sql
-- Create saved_jobs table for bookmarking jobs
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  worker_id TEXT NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(worker_id, job_id)
);

-- Create job_shares table for tracking shares
CREATE TABLE IF NOT EXISTS job_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id TEXT,
  shared_via TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_shares ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on saved_jobs" ON saved_jobs FOR ALL USING (true);
CREATE POLICY "Allow all operations on job_shares" ON job_shares FOR ALL USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_saved_jobs_worker_id ON saved_jobs(worker_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id ON saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_job_shares_job_id ON job_shares(job_id);
CREATE INDEX IF NOT EXISTS idx_job_shares_worker_id ON job_shares(worker_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_created_at ON saved_jobs(created_at DESC);
```

4. **Click "Run"** to execute the SQL
5. **Verify tables were created** in the Table Editor

## Step 2: Test the Features

1. **Refresh your application** (already running on `npm run dev`)
2. **Log in** as a worker
3. **Click the bookmark icon** on a job card
4. **Click the share icon** to test sharing

## Step 3: Verify Database

1. Go to Supabase **Table Editor**
2. Check `saved_jobs` table for your bookmark
3. Check `job_shares` table for share records

## Troubleshooting

**If features don't work with Supabase:**
- Features will automatically fall back to localStorage
- Check browser console for any errors
- Verify your Supabase connection in `.env` file

**Icons not showing as filled:**
- Clear browser cache and refresh
- Check that the icon is using the `fill-current` class

That's it! Your save and share features are ready to use! 🎉
