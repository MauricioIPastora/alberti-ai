/* =============================================================================
   NEOBRUTALIST COMPONENT: RESUME UPLOAD
   Upload and manage resume files with S3 integration
   ============================================================================= */

"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, FileText, X, Check } from "lucide-react";
import { useResume } from "@/lib/storage";

interface ResumeUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeUpload({ isOpen, onClose }: ResumeUploadProps) {
  const { resume, uploadResume, deleteResume } = useResume();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const result = await uploadResume(file);

      if (!result.success) {
        setError(result.error || "Failed to upload resume");
        setUploading(false);
        return;
      }

      setUploading(false);
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred");
      setUploading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your resume?")) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const result = await deleteResume();
      if (!result.success) {
        setError(result.error || "Failed to delete resume");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }

    setDeleting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            Resume Manager
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-400 rounded-xl p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {resume ? (
            <div className="bg-green-50 border-4 border-green-400 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-white border-2 border-black rounded-lg p-2">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm mb-1 truncate">
                    {resume.fileName}
                  </p>
                  <p className="text-xs text-gray-600">
                    Uploaded:{" "}
                    {new Date(resume.uploadedDate).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="hover:bg-red-100 rounded-lg disabled:opacity-50"
                >
                  {deleting ? (
                    <span className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-4 border-dashed border-black rounded-xl p-8 text-center bg-blue-50">
              <Upload className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="font-bold mb-2">No resume uploaded</p>
              <p className="text-sm text-gray-600 mb-4">
                Upload your resume to use optimization features
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || deleting}
            className="w-full bg-black hover:bg-black/80 text-white rounded-xl border-2 border-black font-bold h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Uploading...
              </span>
            ) : uploadSuccess ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                Uploaded Successfully!
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                {resume ? "Replace Resume" : "Upload Resume"}
              </>
            )}
          </Button>

          <p className="text-xs text-gray-600 text-center">
            Supported formats: PDF, DOC, DOCX (max 5MB)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
