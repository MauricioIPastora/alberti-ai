/* =============================================================================
   NEOBRUTALIST COMPONENT: JOB CARD
   Display individual job listings with neobrutalist styling
   Adapted to work with SerpAPI job data
   ============================================================================= */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UIJob, Referral } from "@/lib/app-types";
import { Building2, MapPin, DollarSign, Calendar, ExternalLink, Sparkles, Globe, X } from "lucide-react";

interface JobCardProps {
  job: UIJob;
  referral?: Referral;
  onApply: (job: UIJob) => void;
  onOptimize: (job: UIJob) => void;
  onRemoveApplication?: (jobId: string) => void;
  hasApplied?: boolean;
}

export default function JobCard({ job, referral, onApply, onOptimize, onRemoveApplication, hasApplied }: JobCardProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmModal(true);
  };

  const handleConfirmRemove = () => {
    onRemoveApplication?.(job.id);
    setShowConfirmModal(false);
  };

  return (
    <>
      <div className="bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 overflow-hidden">
        {/* Header with job info */}
        <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-b-4 border-black">
          <div className="flex items-start gap-4">
            {/* Company initial as logo placeholder */}
            <div className="w-14 h-14 bg-black text-white border-4 border-black rounded-xl flex items-center justify-center font-black text-xl flex-shrink-0">
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black mb-1 text-balance leading-tight">{job.title}</h3>
              <div className="flex items-center gap-2 text-sm font-bold">
                <Building2 className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
              {job.via && (
                <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                  <Globe className="h-3 w-3" />
                  <span>{job.via}</span>
                </div>
              )}
            </div>
            {hasApplied && (
              <Badge className="bg-green-400 text-black border-2 border-black font-bold shrink-0 flex items-center gap-1 pr-1">
                Applied
                <button
                  onClick={handleRemoveClick}
                  className="ml-1 p-0.5 rounded-full hover:bg-green-500 transition-colors"
                  title="Didn't apply? Click to undo"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>

      {/* Job details */}
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-2 border-black font-bold rounded-lg">
            <MapPin className="h-3 w-3 mr-1" />
            {job.location}
          </Badge>
          {job.type !== "Unknown" && (
            <Badge variant="outline" className="border-2 border-black font-bold rounded-lg">
              {job.type}
            </Badge>
          )}
          {job.salary && (
            <Badge variant="outline" className="border-2 border-black font-bold rounded-lg bg-green-50">
              <DollarSign className="h-3 w-3 mr-1" />
              {job.salary}
            </Badge>
          )}
          <Badge variant="outline" className="border-2 border-black font-bold rounded-lg">
            <Calendar className="h-3 w-3 mr-1" />
            {job.postedDate}
          </Badge>
        </div>

        {/* Referral indicator */}
        {referral && (
          <div className="bg-purple-50 border-2 border-purple-600 rounded-lg p-3">
            <p className="text-sm font-bold text-purple-900">
              🎉 You have a referral at {job.company}! Contact: {referral.name}
            </p>
            {referral.timeLimit && (
              <p className="text-xs font-semibold text-purple-700 mt-1">
                ⏰ Time limit: {new Date(referral.timeLimit).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Description */}
        <div>
          <p className="text-sm leading-relaxed line-clamp-3">{job.description}</p>
        </div>

        {/* Requirements */}
        {job.requirements.length > 0 && (
          <div>
            <p className="text-xs font-bold mb-2">Requirements:</p>
            <ul className="space-y-1">
              {job.requirements.slice(0, 3).map((req, index) => (
                <li key={index} className="text-xs flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  <span className="leading-relaxed line-clamp-2">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => onApply(job)}
            disabled={hasApplied}
            className="flex-1 bg-black hover:bg-black/80 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {hasApplied ? "Applied" : "Apply Now"}
          </Button>
          <Button
            onClick={() => onOptimize(job)}
            variant="outline"
            className="flex-1 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-black rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Optimize
          </Button>
        </div>
      </div>
    </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Undo Application?</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you didn&apos;t apply to this job? This will remove it from your tracked applications.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 my-2">
            <p className="text-sm font-bold text-yellow-800">
              {job.title} at {job.company}
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              className="rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRemove}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Yes, I didn&apos;t apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

