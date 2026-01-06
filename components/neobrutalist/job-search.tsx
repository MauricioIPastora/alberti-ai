/* =============================================================================
   NEOBRUTALIST COMPONENT: JOB SEARCH
   Search bar with location filter for job queries
   ============================================================================= */

"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

interface JobSearchProps {
  onSearch: (query: string, location: string) => void;
  isLoading?: boolean;
}

export default function JobSearch({ onSearch, isLoading }: JobSearchProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      {/* Job Title/Keywords Search */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <Input
          type="text"
          placeholder="Search by title, company, or keywords..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 border-4 border-black rounded-xl font-semibold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
        />
      </div>

      {/* Location Search */}
      <div className="sm:w-64 relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        <Input
          type="text"
          placeholder="Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="pl-10 h-12 border-4 border-black rounded-xl font-semibold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
        />
      </div>

      {/* Search Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-black hover:bg-black/80 text-white rounded-xl border-2 border-black font-bold h-12 px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Searching...
          </span>
        ) : (
          "Search Jobs"
        )}
      </Button>
    </form>
  );
}

