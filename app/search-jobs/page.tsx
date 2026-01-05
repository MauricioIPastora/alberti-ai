import JobCard from "@/components/alberti-components/job-card";
import { Job } from "@/types/jobs";
import { headers } from "next/headers";

interface SearchJobsPageProps {
    searchParams: {
        query?: string;
        location?: string;
    };
}

async function fetchJobs(query?: string, location?: string): Promise<Job[]> {
    if (!query) {
        return [];
    }

    const incomingHeaders = await headers();
    const protocol = incomingHeaders.get("x-forwarded-proto") ?? "http";
    const host = incomingHeaders.get("host");

    if (!host) {
        return [];
    }

    try {
        const response = await fetch(`${protocol}://${host}/api/search-jobs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, location }),
            cache: "no-store",
        });

        if (!response.ok) {
            return [];
        }

        const data: { jobs?: Job[] } = await response.json();
        return data.jobs ?? [];
    } catch (error) {
        return [];
    }
}

export default async function SearchJobsPage({ searchParams }: SearchJobsPageProps) {
    const { query, location } = await searchParams;
    const jobs = await fetchJobs(query, location);

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-lg font-bold">Found {jobs.length} jobs</h1>
            {jobs.map((job) => (
                <JobCard key={`${job.title}-${job.company}`} job={job} />
            ))}
        </div>
    );
}