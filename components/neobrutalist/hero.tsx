"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Briefcase,
  Target,
  TrendingUp,
  Shield,
  UserCircle,
  Handshake,
  Sparkles,
  ChartLine,
  FileText,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import Image from "next/image";

interface LandingHeroProps {
  onSearchSubmit: (query: string) => void;
  onAuthClick: (mode: "login" | "signup") => void;
  onSettingsClick: () => void;
}

export default function LandingHero({
  onSearchSubmit,
  onAuthClick,
  onSettingsClick,
}: LandingHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b-4 border-black p-4 sm:p-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center -my-2 -ml-2">
            <Image
              src="/alberti.png"
              alt="Alberti.AI"
              width={150}
              height={150}
            />
            <h1 className="-ml-12 text-xl sm:text-4xl md:text-5xl font-black tracking-tight text-balance">
              ALBERTI.AI
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="flex-1 sm:flex-initial">
              <div className="relative w-full sm:w-64">
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
              </div>
            </form>

            {isAuthenticated ? (
              <Button
                onClick={onSettingsClick}
                className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-black rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all whitespace-nowrap"
              >
                <UserCircle className="h-4 w-4 mr-2" />
                {user?.name}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={() => onAuthClick("login")}
                  variant="outline"
                  className="bg-white hover:bg-gray-50 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all whitespace-nowrap"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => onAuthClick("signup")}
                  className="bg-black hover:bg-black/80 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all whitespace-nowrap"
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-6 px-4 py-2 bg-yellow-300 border-2 border-black rounded-full font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            ✨ Your Career, Supercharged
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 text-balance leading-tight">
            Land your dream job
            <span className="block mt-2">faster than ever</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto text-pretty">
            Track applications, optimize resumes, and leverage your network all
            in one powerful platform designed for modern job seekers.
          </p>

          {/* CTA Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for jobs by title, company, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-32 py-6 text-lg rounded-2xl border-4 border-black font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[4px] focus:translate-y-[4px] transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6" />
              <Button
                type="submit"
                className="mx-1 absolute top-2 right-2 bg-black hover:bg-black/80 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all whitespace-nowrap"
              >
                Search
              </Button>
            </div>
          </form>

          <p className="text-sm text-gray-600">
            Over <span className="font-black">10,000+</span> job seekers trust
            JobTrack Pro
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: FileText,
              title: "Smart Job Tracking",
              description: "Never lose track of an application again",
              color: "from-blue-400 to-cyan-400",
            },
            {
              icon: Sparkles,
              title: "AI Resume Optimizer",
              description: "Tailor your resume for each job",
              color: "from-pink-400 to-rose-400",
            },
            {
              icon: ChartLine,
              title: "Application Insights",
              description: "Track your progress with analytics",
              color: "from-yellow-400 to-orange-400",
            },
            {
              icon: Handshake,
              title: "Referral Tracking",
              description: "Leverage your own connections at top companies",
              color: "from-green-400 to-emerald-400",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              <div
                className={`inline-flex p-3 rounded-xl border-2 border-black bg-gradient-to-br ${feature.color} mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
              >
                <feature.icon className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-black mb-2">{feature.title}</h3>
              <p className="text-gray-700 font-medium">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            {
              stat: "85%",
              label: "Success Rate",
              sublabel: "Users land interviews",
            },
            {
              stat: "3x",
              label: "Faster Applications",
              sublabel: "With AI optimization",
            },
            { stat: "500+", label: "Companies", sublabel: "In our network" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-400 to-pink-400 border-4 border-black rounded-2xl p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="text-5xl sm:text-6xl font-black mb-2">
                {item.stat}
              </div>
              <div className="text-xl font-black mb-1">{item.label}</div>
              <div className="text-sm font-medium opacity-80">
                {item.sublabel}
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center bg-black text-white border-4 border-black rounded-2xl p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-balance">
            Ready to supercharge your job search?
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90 text-pretty">
            Join thousands of successful job seekers who found their dream roles
            with JobTrack Pro
          </p>
          <Button
            onClick={() => onAuthClick("signup")}
            className="bg-white hover:bg-gray-100 text-black rounded-xl border-2 border-white font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-lg px-8 py-6"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </div>
  );
}
