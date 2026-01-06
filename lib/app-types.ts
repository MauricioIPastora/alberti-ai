/* =============================================================================
   ALBERTI AI - APPLICATION TYPES
   Types for the neobrutalist UI components (separate from API job types)
   ============================================================================= */

/**
 * UI Job representation - adapted from SerpAPI response for display
 * Maps data from the API response to UI-friendly format
 */
export interface UIJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship" | "Unknown";
  salary?: string;
  description: string;
  requirements: string[];
  applyUrl: string;
  postedDate: string;
  logo?: string;
  via?: string;
  shareLink?: string;
}

/**
 * Application tracking - stores user's job applications
 */
export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  notes?: string;
}

/**
 * Referral contact - stores referral connections at companies
 */
export interface Referral {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "Pending" | "Accepted" | "Declined" | "Used";
  applicationLink?: string;
  timeLimit?: string;
  addedDate: string;
}

/**
 * Resume storage - stores uploaded resume information
 */
export interface Resume {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedDate: string;
}

