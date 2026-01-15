"use client";

import type React from "react";

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
import { LogIn, UserPlus, AlertCircle, Mail, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "login" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  mode: initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup" | "confirm">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { login, signup, confirmSignup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        const success = await login(email, password);
        if (!success) {
          setError("Invalid email or password");
        } else {
          resetForm();
          onClose();
        }
      } else if (mode === "signup") {
        if (name.trim().length < 2) {
          setError("Name must be at least 2 characters");
          setLoading(false);
          return;
        }
        const result = await signup(email, password, name);
        if (result.success === false) {
          setError(result.error || "An account with this email already exists");
        } else if (result.needsConfirmation) {
          // Switch to confirmation mode
          setMode("confirm");
          setSuccessMessage("Check your email for a confirmation code!");
        } else if (result === true) {
          // Auto-logged in
          resetForm();
          onClose();
        }
      } else if (mode === "confirm") {
        const result = await confirmSignup(email, confirmationCode);
        if (result.success) {
          setSuccessMessage("Email confirmed! Logging you in...");
          // Auto-login after successful confirmation
          const loginSuccess = await login(email, password);
          if (loginSuccess) {
            resetForm();
            onClose();
          } else {
            setError(
              "Confirmation successful, but login failed. Please try logging in manually."
            );
            setMode("login");
          }
        } else {
          setError(result.error || "Invalid confirmation code");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setConfirmationCode("");
    setError("");
    setSuccessMessage("");
  };

  const switchMode = () => {
    if (mode === "confirm") {
      setMode("login");
    } else {
      setMode(mode === "login" ? "signup" : "login");
    }
    setError("");
    setSuccessMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            {mode === "login" ? (
              <LogIn className="h-6 w-6" />
            ) : mode === "signup" ? (
              <UserPlus className="h-6 w-6" />
            ) : (
              <Mail className="h-6 w-6" />
            )}
            {mode === "login"
              ? "Login"
              : mode === "signup"
              ? "Sign Up"
              : "Confirm Email"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "confirm" ? (
            <>
              <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  We sent a confirmation code to <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-bold">
                  Confirmation Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  required
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="border-2 border-black rounded-lg text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>
            </>
          ) : (
            <>
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-2 border-black rounded-lg"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-black rounded-lg"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-bold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-black rounded-lg"
                  minLength={6}
                />
                {mode === "signup" && (
                  <p className="text-xs text-gray-600">
                    Must be at least 6 characters
                  </p>
                )}
              </div>
            </>
          )}

          {successMessage && (
            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm font-semibold text-green-600">
                {successMessage}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-400 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-black/80 text-white rounded-xl border-2 border-black font-bold h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : mode === "login"
              ? "Login"
              : mode === "signup"
              ? "Sign Up"
              : "Confirm"}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm font-bold hover:underline"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : mode === "signup"
                ? "Already have an account? Login"
                : "Back to login"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
