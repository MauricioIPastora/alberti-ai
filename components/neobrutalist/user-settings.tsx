"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import {
  Settings,
  User,
  Mail,
  Calendar,
  LogOut,
  AlertCircle,
  Check,
} from "lucide-react";

interface UserSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSettings({ isOpen, onClose }: UserSettingsProps) {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    if (name.trim().length >= 2) {
      updateUser({ name });
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Account Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {success && (
            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3 flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <p className="text-sm font-semibold text-green-600">
                Settings updated successfully!
              </p>
            </div>
          )}

          <div className="bg-blue-50 border-4 border-black rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-black text-white rounded-full h-16 w-16 flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-black">{user.name}</h3>
                <p className="text-sm text-gray-600 font-semibold">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t-2 border-black">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-sm font-bold">
                      Full Name
                    </Label>
                    <Input
                      id="edit-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-2 border-black rounded-lg"
                      minLength={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      className="flex-1 bg-green-400 hover:bg-green-500 text-black border-2 border-black rounded-lg font-bold"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setName(user.name);
                      }}
                      variant="outline"
                      className="flex-1 border-2 border-black rounded-lg font-bold"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-bold">Name:</span>
                    <span className="font-semibold">{user.name}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="font-bold">Email:</span>
                    <span className="font-semibold">{user.email}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-bold">Joined:</span>
                    <span className="font-semibold">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="w-full border-2 border-black rounded-lg font-bold mt-4"
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Danger Zone</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Logging out will keep your data saved for next time
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full bg-red-500 hover:bg-red-600 text-white border-2 border-black rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
