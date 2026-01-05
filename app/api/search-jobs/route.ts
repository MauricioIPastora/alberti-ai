import { NextResponse } from 'next/server';
import { getJson } from 'serpapi';


export async function POST(request: Request) {
  const { query, location } = await request.json();
     // basic input guard
     if (!query) {
      return NextResponse.json({ jobs: [] }, { status: 200 });
    }
 
    const serpLocation =
  location?.trim().toLowerCase() === "washington d.c."
    ? "Washington, DC, United States"
    : location?.trim() || "United States";
 
    try {
      const response = await getJson({
        q: query,
        engine: "google_jobs",
        location: serpLocation,
        num: 10,
        api_key: process.env.SERPAPI_KEY,
      });
 
      const jobs = (response.jobs_results ?? []).map((job: any) => ({
        title: job.title,
        company: job.company_name,
        location: job.location,
        via: job.via,
        description: job.description,
        job_highlights: job.job_highlights ?? [],
        apply_options: job.apply_options ?? [],
        extensions: job.extensions ?? [],
        detected_extensions: job.detected_extensions ?? {},
        share_link: job.share_link,
      }));
 
      return NextResponse.json({ jobs });
    } catch (error) {
      console.error("SerpAPI error:", error);
      return NextResponse.json({ jobs: [] }, { status: 500 });
    }
  }