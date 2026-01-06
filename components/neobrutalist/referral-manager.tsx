/* =============================================================================
   NEOBRUTALIST COMPONENT: REFERRAL MANAGER
   Manage referral contacts at various companies
   ============================================================================= */

"use client";

import type React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReferrals } from "@/lib/storage";
import type { Referral } from "@/lib/app-types";
import { Users, Plus, Trash2, Mail, Phone, Building2, ExternalLink, Calendar } from "lucide-react";

interface ReferralManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferralManager({ isOpen, onClose }: ReferralManagerProps) {
  const { referrals, addReferral, updateReferral, deleteReferral } = useReferrals();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Pending" as Referral["status"],
    applicationLink: "",
    timeLimit: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReferral: Referral = {
      id: Date.now().toString(),
      ...formData,
      addedDate: new Date().toISOString(),
    };

    addReferral(newReferral);

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "Pending",
      applicationLink: "",
      timeLimit: "",
    });
    setShowAddForm(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete referral from ${name}?`)) {
      deleteReferral(id);
    }
  };

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-400",
    Accepted: "bg-green-100 text-green-800 border-green-400",
    Declined: "bg-red-100 text-red-800 border-red-400",
    Used: "bg-blue-100 text-blue-800 border-blue-400",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <Users className="h-6 w-6" />
            Referral Network
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!showAddForm && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-black hover:bg-black/80 text-white rounded-xl border-2 border-black font-bold h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Referral Contact
            </Button>
          )}

          {showAddForm && (
            <form onSubmit={handleSubmit} className="bg-blue-50 border-4 border-black rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-black mb-2">New Referral Contact</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-2 border-black rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-bold">
                    Company *
                  </Label>
                  <Input
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="border-2 border-black rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-2 border-black rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold">
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-2 border-black rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-bold">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => setFormData({ ...formData, status: val as Referral["status"] })}
                  >
                    <SelectTrigger className="border-2 border-black rounded-lg font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-black">
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Declined">Declined</SelectItem>
                      <SelectItem value="Used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeLimit" className="text-sm font-bold">
                    Time Limit (Optional)
                  </Label>
                  <Input
                    id="timeLimit"
                    type="date"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                    className="border-2 border-black rounded-lg"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="applicationLink" className="text-sm font-bold">
                    Application Link (Optional)
                  </Label>
                  <Input
                    id="applicationLink"
                    type="url"
                    value={formData.applicationLink}
                    onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                    placeholder="https://company.com/careers/job-id"
                    className="border-2 border-black rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-green-400 hover:bg-green-500 text-black rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  Add Contact
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  variant="outline"
                  className="flex-1 border-2 border-black rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {referrals.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 border-4 border-dashed border-black rounded-xl">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="font-bold text-lg mb-2">No Referrals Yet</p>
              <p className="text-sm text-gray-600">Add contacts who can refer you to companies</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-black">{referral.name}</h3>
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-600 mt-1">
                            <Building2 className="h-4 w-4" />
                            {referral.company}
                          </div>
                        </div>
                        <Badge className={`${statusColors[referral.status]} border-2 font-bold`}>
                          {referral.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <a href={`mailto:${referral.email}`} className="hover:underline font-semibold">
                            {referral.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <a href={`tel:${referral.phone}`} className="hover:underline font-semibold">
                            {referral.phone}
                          </a>
                        </div>
                      </div>

                      {referral.applicationLink && (
                        <a
                          href={referral.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Application Link
                        </a>
                      )}

                      {referral.timeLimit && (
                        <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 bg-orange-50 border-2 border-orange-300 rounded-lg p-2">
                          <Calendar className="h-4 w-4" />
                          Time limit: {new Date(referral.timeLimit).toLocaleDateString()}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Select
                          value={referral.status}
                          onValueChange={(val) => updateReferral(referral.id, { status: val as Referral["status"] })}
                        >
                          <SelectTrigger className="w-40 border-2 border-black rounded-lg font-bold text-xs h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-2 border-black">
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Accepted">Accepted</SelectItem>
                            <SelectItem value="Declined">Declined</SelectItem>
                            <SelectItem value="Used">Used</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          onClick={() => handleDelete(referral.id, referral.name)}
                          size="sm"
                          variant="ghost"
                          className="hover:bg-red-100 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

