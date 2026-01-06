/* =============================================================================
   ALBERTI AI - JOB FETCHING SERVICE
   Integrates with the existing SerpAPI backend
   RETAINED: Original job retrieval logic from app/api/search-jobs/route.ts
   ============================================================================= */

import type { Job as APIJob } from "@/types/jobs";
import type { UIJob } from "./app-types";

/**
 * Transform API Job response to UI-friendly format
 * Maps the SerpAPI response structure to our UIJob interface
 */
function transformJob(apiJob: APIJob, index: number): UIJob {
  // Extract salary from detected_extensions or extensions
  const salary = apiJob.detected_extensions?.salary || 
    apiJob.extensions?.find(ext => ext.includes("$") || ext.toLowerCase().includes("salary"));
  
  // Extract job type from extensions
  const typeExtension = apiJob.extensions?.find(ext => 
    ["full-time", "part-time", "contract", "internship"].includes(ext.toLowerCase())
  );
  let jobType: UIJob["type"] = "Unknown";
  if (typeExtension) {
    const lower = typeExtension.toLowerCase();
    if (lower === "full-time") jobType = "Full-time";
    else if (lower === "part-time") jobType = "Part-time";
    else if (lower === "contract") jobType = "Contract";
    else if (lower === "internship") jobType = "Internship";
  }

  // Extract posted date from detected_extensions or use current date
  const postedAt = apiJob.detected_extensions?.posted_at || "Recently posted";

  // Build requirements from job_highlights
  const requirements: string[] = [];
  apiJob.job_highlights?.forEach(highlight => {
    if (highlight.title?.toLowerCase().includes("qualifications") || 
        highlight.title?.toLowerCase().includes("requirements")) {
      requirements.push(...(highlight.items || []));
    }
  });
  
  // If no requirements found, try to extract from other highlights
  if (requirements.length === 0) {
    apiJob.job_highlights?.forEach(highlight => {
      requirements.push(...(highlight.items?.slice(0, 3) || []));
    });
  }

  // Get apply URL from first apply option or share link
  const applyUrl = apiJob.apply_options?.[0]?.link || apiJob.share_link || "#";

  return {
    id: `job-${index}-${Date.now()}`,
    title: apiJob.title,
    company: apiJob.company,
    location: apiJob.location,
    type: jobType,
    salary: salary,
    description: apiJob.description,
    requirements: requirements.slice(0, 5), // Limit to 5 requirements
    applyUrl: applyUrl,
    postedDate: postedAt,
    via: apiJob.via,
    shareLink: apiJob.share_link,
  };
}

/**
 * Fetch jobs from the SerpAPI backend
 * RETAINED: Uses the existing /api/search-jobs endpoint
 */
export async function fetchJobs(query: string, location?: string): Promise<UIJob[]> {
  try {
    const response = await fetch("/api/search-jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        query: query || "software engineer", 
        location: location || "United States" 
      }),
    });

    if (!response.ok) {
      console.error("Failed to fetch jobs:", response.statusText);
      return [];
    }

    const data = await response.json();
    const jobs: APIJob[] = data.jobs || [];
    
    return jobs.map((job, index) => transformJob(job, index));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

