/* =============================================================================
   NEOBRUTALIST COMPONENT: OPTIMIZE MODAL
   AI-powered resume and cover letter optimization
   ============================================================================= */

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UIJob, Resume } from "@/lib/app-types";
import { FileText, Sparkles, Download, Copy, Check } from "lucide-react";

interface OptimizeModalProps {
  job: UIJob | null;
  resume: Resume | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OptimizeModal({ job, resume, isOpen, onClose }: OptimizeModalProps) {
  const [optimizedResume, setOptimizedResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<"resume" | "cover" | null>(null);

  const handleOptimize = async () => {
    if (!job || !resume) return;

    setIsGenerating(true);

    // Simulate AI optimization (in production, this would call your AI service)
    setTimeout(() => {
      const requirements = job.requirements.slice(0, 2).join("\n- ");
      
      setOptimizedResume(
        `OPTIMIZED RESUME FOR ${job.title.toUpperCase()}\n\n` +
        `Tailored for: ${job.company}\n` +
        `Location: ${job.location}\n\n` +
        `KEY HIGHLIGHTS:\n` +
        `${requirements ? `- ${requirements}` : "- Skills aligned with job requirements"}\n\n` +
        `Your resume has been optimized to emphasize relevant experience and skills matching this position.`
      );
      
      setCoverLetter(
        `Dear Hiring Manager at ${job.company},\n\n` +
        `I am excited to apply for the ${job.title} position in ${job.location}. ` +
        `With my background and passion for this field, I am confident I would be a valuable addition to your team.\n\n` +
        `Key qualifications:\n` +
        `${job.requirements.slice(0, 3).map(req => `• ${req}`).join("\n")}\n\n` +
        `I am particularly drawn to ${job.company} and would welcome the opportunity to contribute to your team's success.\n\n` +
        `Thank you for your consideration.\n\n` +
        `Best regards`
      );
      
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = async (text: string, type: "resume" | "cover") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClose = () => {
    setOptimizedResume("");
    setCoverLetter("");
    onClose();
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            ✨ Optimize for {job.title}
          </DialogTitle>
          <DialogDescription className="text-sm font-semibold">
            at {job.company} • {job.location}
          </DialogDescription>
        </DialogHeader>

        {!resume ? (
          <div className="bg-yellow-50 border-4 border-yellow-400 rounded-xl p-6 text-center">
            <FileText className="h-12 w-12 mx-auto mb-3" />
            <p className="font-bold mb-2">No Resume Uploaded</p>
            <p className="text-sm">Please upload your resume first to use the optimization feature.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {!optimizedResume && !coverLetter ? (
              <div className="text-center py-8">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-purple-500" />
                <p className="font-bold mb-2">Ready to optimize your application</p>
                <p className="text-sm text-gray-600 mb-4">
                  We&apos;ll tailor your resume and generate a cover letter for this position
                </p>
                <Button
                  onClick={handleOptimize}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Generating...
                    </span>
                  ) : (
                    "Generate Optimized Materials"
                  )}
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="resume" className="w-full">
                <TabsList className="w-full bg-white/50 border-2 border-black rounded-xl p-1 mb-4">
                  <TabsTrigger
                    value="resume"
                    className="flex-1 rounded-lg data-[state=active]:bg-black data-[state=active]:text-white font-bold transition-all"
                  >
                    📄 Optimized Resume
                  </TabsTrigger>
                  <TabsTrigger
                    value="cover"
                    className="flex-1 rounded-lg data-[state=active]:bg-black data-[state=active]:text-white font-bold transition-all"
                  >
                    ✉️ Cover Letter
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="resume" className="space-y-3">
                  <Textarea
                    value={optimizedResume}
                    onChange={(e) => setOptimizedResume(e.target.value)}
                    className="min-h-[300px] border-4 border-black rounded-xl font-mono text-sm"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleCopy(optimizedResume, "resume")}
                      className="flex-1 bg-blue-400 hover:bg-blue-500 text-black rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      {copied === "resume" ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                    <Button className="flex-1 bg-green-400 hover:bg-green-500 text-black rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="cover" className="space-y-3">
                  <Textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="min-h-[300px] border-4 border-black rounded-xl font-mono text-sm"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleCopy(coverLetter, "cover")}
                      className="flex-1 bg-blue-400 hover:bg-blue-500 text-black rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      {copied === "cover" ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                    <Button className="flex-1 bg-green-400 hover:bg-green-500 text-black rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

