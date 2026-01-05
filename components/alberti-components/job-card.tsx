"use client";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { MapPin, Calendar, DollarSign, Briefcase, ExternalLink, Sparkles } from "lucide-react";
import { Job } from "@/types/jobs";

interface JobCardProps {
    job: Job;
}

export default function JobCard({ job }: JobCardProps) {
    return (
        <Card>
            <CardHeader>
            <h3
              title={job.title}
            >
              {job.title}
            </h3>
            <p
              title={job.company}
            >
              {job.company}
            </p>
      </CardHeader>

      <CardContent>
        <div>
          {/* Location, Remote, and Date Info */}
          <div>
            {job.location && (
              <div title={`Location: ${job.location}`}>
                <MapPin aria-hidden="true" />
                <span>{job.location}</span>
              </div>
            )}
            
            {job.detected_extensions.work_from_home && (
              <span title="Remote work available">
                Remote
              </span>
            )}
            
            {job.detected_extensions.posted_at && (
              <div title={`Posted: ${job.detected_extensions.posted_at}`}>
                <Calendar aria-hidden="true" />
                <span>{job.detected_extensions.posted_at}</span>
              </div>
            )}
            
            {job.detected_extensions.salary && (
              <div title={`Salary: ${job.detected_extensions.salary}`}>
                <DollarSign aria-hidden="true" />
                <span>{job.detected_extensions.salary}</span>
              </div>
            )}
            
            {job.detected_extensions.schedule_type && (
              <div title={`Schedule: ${job.detected_extensions.schedule_type}`}>
                <Briefcase aria-hidden="true" />
                <span>{job.detected_extensions.schedule_type}</span>
              </div>
            )}
          </div>

          {/* Description Preview */}
          {job.description && (
            <p title={job.description}>
              {job.description}
            </p>
          )}

          {/* Action Buttons */}
          <div>
            <Button
              onClick={() => console.log('Optimize resume for:', job.title)}
              aria-label={`Optimize resume for ${job.title} at ${job.company}`}
            >
              <Sparkles aria-hidden="true" />
              Optimize Resume
            </Button>

            {job.share_link && (
              <Button
                variant="outline"
                onClick={() => window.open(job.share_link, '_blank')}
                aria-label={`Open job posting for ${job.title} at ${job.company} in new tab`}
              >
                <ExternalLink aria-hidden="true" />
                Open Posting
              </Button>
            )}
            
            {job.apply_options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => window.open(option.link, '_blank')}
                aria-label={`Apply via ${option.title} for ${job.title}`}
              >
                <ExternalLink aria-hidden="true" />
                Apply via {option.title}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
        </Card>
    )
    }
