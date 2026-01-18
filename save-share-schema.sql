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
  shared_via TEXT, -- 'native', 'clipboard', 'whatsapp', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_shares ENABLE ROW LEVEL SECURITY;

-- Create policy for saved_jobs (allow all for now, can restrict later)
CREATE POLICY "Allow all operations on saved_jobs" ON saved_jobs
  FOR ALL USING (true);

-- Create policy for job_shares
CREATE POLICY "Allow all operations on job_shares" ON job_shares
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_jobs_worker_id ON saved_jobs(worker_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id ON saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_job_shares_job_id ON job_shares(job_id);
CREATE INDEX IF NOT EXISTS idx_job_shares_worker_id ON job_shares(worker_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_created_at ON saved_jobs(created_at DESC);
