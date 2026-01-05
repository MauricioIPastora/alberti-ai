export type JobHighlight = {
  title: string;
  items: string[];
};

export type ApplyOption = {
  title: string;
  link: string;
};

export type DetectedExtensions = {
  posted_at?: string;
  salary?: string;
  work_from_home?: boolean;
  schedule_type?: string;
  health_insurance?: boolean;
  dental_coverage?: boolean;
  qualifications?: string;
};

export type Job = {
  title: string;
  company: string;
  location: string;
  via: string;
  description: string;
  job_highlights: JobHighlight[];
  apply_options: ApplyOption[];
  extensions: string[];
  detected_extensions: DetectedExtensions;
  share_link: string;
};

export type JobSearchResponse = {
  jobs_results: Job[];
};