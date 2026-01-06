/* =============================================================================
   NEOBRUTALIST COMPONENT: APPLICATION TRACKER
   Track and manage job applications with status updates
   ============================================================================= */

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApplications } from "@/lib/storage";
import type { Application } from "@/lib/app-types";
import { Briefcase, Calendar, Trash2, Edit2 } from "lucide-react";

interface ApplicationTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationTracker({ isOpen, onClose }: ApplicationTrackerProps) {
  const { applications, updateApplication, deleteApplication } = useApplications();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const handleStatusChange = (id: string, status: Application["status"]) => {
    updateApplication(id, { status });
  };

  const handleNotesUpdate = (id: string) => {
    updateApplication(id, { notes: editNotes });
    setEditingId(null);
    setEditNotes("");
  };

  const handleDelete = (id: string, jobTitle: string) => {
    if (confirm(`Delete application for ${jobTitle}?`)) {
      deleteApplication(id);
    }
  };

  const statusColors = {
    Applied: "bg-blue-100 text-blue-800 border-blue-400",
    Interview: "bg-yellow-100 text-yellow-800 border-yellow-400",
    Offer: "bg-green-100 text-green-800 border-green-400",
    Rejected: "bg-red-100 text-red-800 border-red-400",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            Application Tracker
          </DialogTitle>
        </DialogHeader>

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border-4 border-dashed border-black rounded-xl">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="font-bold text-lg mb-2">No Applications Yet</p>
            <p className="text-sm text-gray-600">Start applying to jobs to track them here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-black mb-1">{app.jobTitle}</h3>
                    <p className="text-sm font-semibold text-gray-600 mb-2">{app.company}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="border-2 border-black font-bold rounded-lg">
                        <Calendar className="h-3 w-3 mr-1" />
                        Applied: {new Date(app.appliedDate).toLocaleDateString()}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <label className="text-xs font-bold mb-1 block">Status:</label>
                      <Select
                        value={app.status}
                        onValueChange={(val) => handleStatusChange(app.id, val as Application["status"])}
                      >
                        <SelectTrigger className="w-full sm:w-48 border-2 border-black rounded-lg font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-2 border-black">
                          <SelectItem value="Applied">Applied</SelectItem>
                          <SelectItem value="Interview">Interview</SelectItem>
                          <SelectItem value="Offer">Offer</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {editingId === app.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Add notes about this application..."
                          className="border-2 border-black rounded-lg text-sm min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleNotesUpdate(app.id)}
                            size="sm"
                            className="bg-green-400 hover:bg-green-500 text-black border-2 border-black rounded-lg font-bold"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingId(null);
                              setEditNotes("");
                            }}
                            size="sm"
                            variant="outline"
                            className="border-2 border-black rounded-lg font-bold"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {app.notes && (
                          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-2 mb-2">
                            <p className="text-xs font-semibold">Notes:</p>
                            <p className="text-sm">{app.notes}</p>
                          </div>
                        )}
                        <Button
                          onClick={() => {
                            setEditingId(app.id);
                            setEditNotes(app.notes || "");
                          }}
                          size="sm"
                          variant="outline"
                          className="border-2 border-black rounded-lg font-bold"
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          {app.notes ? "Edit Notes" : "Add Notes"}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row sm:flex-col gap-2">
                    <Badge className={`${statusColors[app.status]} border-2 font-bold`}>{app.status}</Badge>
                    <Button
                      onClick={() => handleDelete(app.id, app.jobTitle)}
                      size="icon"
                      variant="ghost"
                      className="hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="border-t-4 border-black pt-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["Applied", "Interview", "Offer", "Rejected"] as const).map((status) => {
              const count = applications.filter((app) => app.status === status).length;
              return (
                <div key={status} className={`${statusColors[status]} border-2 rounded-xl p-3 text-center`}>
                  <p className="text-2xl font-black">{count}</p>
                  <p className="text-xs font-bold">{status}</p>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

