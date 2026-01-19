-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_type TEXT NOT NULL,
  salary TEXT NOT NULL,
  shift TEXT NOT NULL,
  location TEXT NOT NULL,
  landmark TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on jobs" ON jobs
  FOR ALL USING (true);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id TEXT NOT NULL,
  worker_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('interested', 'not_interested')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add admin contact fields to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS admin_phone TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS admin_photo TEXT;

-- Enable Row Level Security for job_applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Create policy for job_applications
CREATE POLICY "Allow all operations on job_applications" ON job_applications
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_worker_id ON job_applications(worker_id);