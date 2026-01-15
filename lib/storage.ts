/* =============================================================================
   ALBERTI AI - LOCAL STORAGE HOOKS
   SWR-based hooks for managing application state in localStorage
   ============================================================================= */

import useSWR from "swr";
import type { Application, Referral, Resume } from "./app-types";

const STORAGE_KEYS = {
  APPLICATIONS: "alberti-applications",
  REFERRALS: "alberti-referrals",
  RESUME: "alberti-resume",
};

// SWR fetcher for localStorage
const fetcher = (key: string) => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

/* =============================================================================
   APPLICATIONS HOOK
   Track job applications with status, notes, and dates
   ============================================================================= */
export function useApplications() {
  const { data, mutate } = useSWR<Application[]>(STORAGE_KEYS.APPLICATIONS, fetcher, {
    fallbackData: [],
  });

  const addApplication = (application: Application) => {
    const applications = data || [];
    const updated = [...applications, application];
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    mutate(updated, false);
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    const applications = data || [];
    const updated = applications.map((app) => (app.id === id ? { ...app, ...updates } : app));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    mutate(updated, false);
  };

  const deleteApplication = (id: string) => {
    const applications = data || [];
    const updated = applications.filter((app) => app.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    mutate(updated, false);
  };

  const deleteApplicationByJobId = (jobId: string) => {
    const applications = data || [];
    const updated = applications.filter((app) => app.jobId !== jobId);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    mutate(updated, false);
  };

  return {
    applications: data || [],
    addApplication,
    updateApplication,
    deleteApplication,
    deleteApplicationByJobId,
  };
}

/* =============================================================================
   REFERRALS HOOK
   Manage referral contacts at various companies
   ============================================================================= */
export function useReferrals() {
  const { data, mutate } = useSWR<Referral[]>(STORAGE_KEYS.REFERRALS, fetcher, {
    fallbackData: [],
  });

  const addReferral = (referral: Referral) => {
    const referrals = data || [];
    const updated = [...referrals, referral];
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(updated));
    mutate(updated, false);
  };

  const updateReferral = (id: string, updates: Partial<Referral>) => {
    const referrals = data || [];
    const updated = referrals.map((ref) => (ref.id === id ? { ...ref, ...updates } : ref));
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(updated));
    mutate(updated, false);
  };

  const deleteReferral = (id: string) => {
    const referrals = data || [];
    const updated = referrals.filter((ref) => ref.id !== id);
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(updated));
    mutate(updated, false);
  };

  return {
    referrals: data || [],
    addReferral,
    updateReferral,
    deleteReferral,
  };
}

/* =============================================================================
   RESUME HOOK
   Store and manage uploaded resume information with S3 integration
   ============================================================================= */
export function useResume() {
  const { data, mutate } = useSWR<Resume | null>(STORAGE_KEYS.RESUME, fetcher, {
    fallbackData: null,
  });

  /**
   * Upload resume file to S3 and store metadata locally
   * @param file - The file to upload
   * @returns Upload result with success status and potential error
   */
  const uploadResume = async (
    file: File
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.error };
      }

      // Store resume metadata locally
      const resume: Resume = {
        id: result.data.id,
        fileName: result.data.fileName,
        fileUrl: "", // We don't store a URL, just the S3 key
        s3Key: result.data.s3Key,
        uploadedDate: result.data.uploadedDate,
      };

      localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resume));
      mutate(resume, false);

      return { success: true };
    } catch (error: any) {
      console.error("Resume upload error:", error);
      return { success: false, error: "Failed to upload resume" };
    }
  };

  /**
   * Delete resume from S3 and remove local metadata
   */
  const deleteResume = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const currentResume = data;
      
      if (currentResume?.s3Key) {
        // Delete from S3
        const response = await fetch("/api/resume/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ s3Key: currentResume.s3Key }),
        });

        const result = await response.json();
        if (!result.success) {
          console.error("Failed to delete from S3:", result.error);
          // Continue to delete local data even if S3 delete fails
        }
      }

      // Remove local data
      localStorage.removeItem(STORAGE_KEYS.RESUME);
      mutate(null, false);

      return { success: true };
    } catch (error: any) {
      console.error("Resume delete error:", error);
      // Still remove local data on error
      localStorage.removeItem(STORAGE_KEYS.RESUME);
      mutate(null, false);
      return { success: false, error: "Failed to delete resume from cloud" };
    }
  };

  return {
    resume: data,
    uploadResume,
    deleteResume,
  };
}

