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
   Store and manage uploaded resume information
   ============================================================================= */
export function useResume() {
  const { data, mutate } = useSWR<Resume | null>(STORAGE_KEYS.RESUME, fetcher, {
    fallbackData: null,
  });

  const uploadResume = (resume: Resume) => {
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resume));
    mutate(resume, false);
  };

  const deleteResume = () => {
    localStorage.removeItem(STORAGE_KEYS.RESUME);
    mutate(null, false);
  };

  return {
    resume: data,
    uploadResume,
    deleteResume,
  };
}

