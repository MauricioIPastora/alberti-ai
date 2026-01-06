/* =============================================================================
   ALBERTI AI - MAIN PAGE
   Neobrutalist Job Tracker with SerpAPI Integration
   
   RETAINED LOGIC: Job retrieval via /api/search-jobs (SerpAPI backend)
   UPDATED: UI components with neobrutalist design system
   ============================================================================= */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchJobs } from "@/lib/jobs";
import { useApplications, useReferrals, useResume } from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import type { UIJob, Application } from "@/lib/app-types";
import JobCard from "@/components/neobrutalist/job-card";
import JobSearch from "@/components/neobrutalist/job-search";
import OptimizeModal from "@/components/neobrutalist/optimize-modal";
import ResumeUpload from "@/components/neobrutalist/resume-upload";
import ApplicationTracker from "@/components/neobrutalist/application-tracker";
import ReferralManager from "@/components/neobrutalist/referral-manager";
import AuthModal from "@/components/neobrutalist/auth-modal";
import UserSettings from "@/components/neobrutalist/user-settings";
import { Upload, Briefcase, Users, Zap, UserCircle } from "lucide-react";
import Image from "next/image";

export default function JobTrackerPro() {
  // Job state
  const [jobs, setJobs] = useState<UIJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Modal states
  const [selectedJob, setSelectedJob] = useState<UIJob | null>(null);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [showReferrals, setShowReferrals] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showSettings, setShowSettings] = useState(false);

  // Storage hooks for persistent data
  const { applications, addApplication, deleteApplicationByJobId } =
    useApplications();
  const { referrals } = useReferrals();
  const { resume } = useResume();
  const { isAuthenticated, user } = useAuth();

  /**
   * Handle job search - calls the SerpAPI backend
   * RETAINED: Uses existing /api/search-jobs endpoint
   */
  const handleSearch = async (query: string, location: string) => {
    setLoading(true);
    setHasSearched(true);

    try {
      const data = await fetchJobs(query, location);
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle job application - opens apply URL and tracks application
   */
  const handleApply = (job: UIJob) => {
    // Create application record
    const newApplication: Application = {
      id: Date.now().toString(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      appliedDate: new Date().toISOString(),
      status: "Applied",
    };
    addApplication(newApplication);

    // Open the job's application URL in new tab
    if (job.applyUrl && job.applyUrl !== "#") {
      window.open(job.applyUrl, "_blank");
    }
  };

  /**
   * Handle optimize button - opens AI optimization modal
   */
  const handleOptimize = (job: UIJob) => {
    setSelectedJob(job);
    setShowOptimizeModal(true);
  };

  /**
   * Check if user has already applied to a job
   */
  const hasApplied = (jobId: string) => {
    return applications.some((app) => app.jobId === jobId);
  };

  /**
   * Get referral contact for a company if exists
   */
  const getReferralForCompany = (company: string) => {
    return referrals.find(
      (ref) =>
        ref.company.toLowerCase() === company.toLowerCase() &&
        ref.status !== "Declined"
    );
  };

  /**
   * Handle protected actions - prompts login if not authenticated
   */
  const handleProtectedAction = (action: () => void) => {
    if (!isAuthenticated) {
      setAuthMode("login");
      setShowAuthModal(true);
    } else {
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto backdrop-blur-xl bg-white/40 border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* =====================================================================
            HEADER SECTION
            Contains logo, action buttons, and search bar
            ===================================================================== */}
        <header className="border-b-4 border-black p-4 sm:p-6 bg-white/60 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            {/* Logo and Title */}
            <div className="flex items-center -my-2 -ml-2">
              <Image
                src="/alberti.png"
                alt="Alberti.AI"
                width={200}
                height={200}
              />
              <h1 className="-ml-16 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-balance">
                ALBERTI.AI
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-black rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <UserCircle className="h-4 w-4 mr-2" />
                  {user?.name}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setAuthMode("login");
                      setShowAuthModal(true);
                    }}
                    variant="outline"
                    className="bg-white hover:bg-gray-50 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      setAuthMode("signup");
                      setShowAuthModal(true);
                    }}
                    className="bg-black hover:bg-black/80 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    Sign Up
                  </Button>
                </>
              )}
              <Button
                onClick={() =>
                  handleProtectedAction(() => setShowResumeUpload(true))
                }
                variant="outline"
                className="bg-white hover:bg-gray-50 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <Upload className="h-4 w-4 mr-2" />
                {resume ? "Resume ✓" : "Upload Resume"}
              </Button>
              <Button
                onClick={() =>
                  handleProtectedAction(() => setShowTracker(true))
                }
                variant="outline"
                className="bg-white hover:bg-gray-50 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Tracker ({applications.length})
              </Button>
              <Button
                onClick={() =>
                  handleProtectedAction(() => setShowReferrals(true))
                }
                variant="outline"
                className="bg-white hover:bg-gray-50 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <Users className="h-4 w-4 mr-2" />
                Referrals ({referrals.length})
              </Button>
            </div>
          </div>

          {/* Search Component */}
          <JobSearch onSearch={handleSearch} isLoading={loading} />
        </header>

        {/* =====================================================================
            MAIN CONTENT SECTION
            Displays job listings or empty/loading states
            ===================================================================== */}
        <div className="p-4 sm:p-6">
          {loading ? (
            /* Loading State */
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
              <p className="font-bold mt-4">Searching for jobs...</p>
              <p className="text-sm text-gray-600 mt-1">
                Powered by Google Jobs
              </p>
            </div>
          ) : !hasSearched ? (
            /* Initial State - No search yet */
            <div className="text-center py-16 bg-white/50 border-4 border-dashed border-black rounded-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl mx-auto mb-4 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-black mb-2">Find Your Dream Job</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Search for jobs, optimize your resume with AI, track your
                applications, and manage your referral network all in one place.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-yellow-100 border-2 border-black rounded-lg px-4 py-2 font-bold">
                  🔍 Search Jobs
                </div>
                <div className="bg-purple-100 border-2 border-black rounded-lg px-4 py-2 font-bold">
                  ✨ AI Optimization
                </div>
                <div className="bg-green-100 border-2 border-black rounded-lg px-4 py-2 font-bold">
                  📊 Track Applications
                </div>
              </div>
            </div>
          ) : jobs.length === 0 ? (
            /* No Results State */
            <div className="text-center py-12 bg-white border-4 border-dashed border-black rounded-xl">
              <p className="font-bold text-lg mb-2">No jobs found</p>
              <p className="text-sm text-gray-600">
                Try adjusting your search criteria or location
              </p>
            </div>
          ) : (
            /* Job Results */
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-black">
                  {jobs.length} JOB{jobs.length !== 1 ? "S" : ""} FOUND
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    referral={getReferralForCompany(job.company)}
                    onApply={handleApply}
                    onOptimize={handleOptimize}
                    onRemoveApplication={deleteApplicationByJobId}
                    hasApplied={hasApplied(job.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* =====================================================================
            FOOTER
            ===================================================================== */}
        <footer className="border-t-4 border-black p-4 bg-white/60 text-center">
          <p className="text-sm font-bold text-gray-600">
            Powered by <span className="text-black">Alberti AI</span> • Job data
            from Google Jobs via SerpAPI
          </p>
        </footer>
      </div>

      {/* =====================================================================
          MODALS
          Dialogs for various features
          ===================================================================== */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
      <UserSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      <OptimizeModal
        job={selectedJob}
        resume={resume}
        isOpen={showOptimizeModal}
        onClose={() => setShowOptimizeModal(false)}
      />
      <ResumeUpload
        isOpen={showResumeUpload}
        onClose={() => setShowResumeUpload(false)}
      />
      <ApplicationTracker
        isOpen={showTracker}
        onClose={() => setShowTracker(false)}
      />
      <ReferralManager
        isOpen={showReferrals}
        onClose={() => setShowReferrals(false)}
      />
    </div>
  );
}
