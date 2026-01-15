/* =============================================================================
   ALBERTI AI - RESUME API
   GET: Generate presigned URL for resume download
   ============================================================================= */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sanitizeEmail } from "@/lib/utils";
import { getResumePresignedUrl } from "@/services/s3";

export async function GET(request: NextRequest) {
  try {
    // 1. Verify authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - please sign in" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const sanitizedEmail = sanitizeEmail(userEmail);

    // 2. Get the S3 key from query params
    const { searchParams } = new URL(request.url);
    const s3Key = searchParams.get("s3Key");

    if (!s3Key) {
      return NextResponse.json(
        { success: false, error: "No S3 key provided" },
        { status: 400 }
      );
    }

    // 3. Security check: Ensure the S3 key belongs to this user
    const expectedPrefix = `users/${sanitizedEmail}/`;
    if (!s3Key.startsWith(expectedPrefix)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - cannot access this file" },
        { status: 403 }
      );
    }

    // 4. Generate presigned URL
    const result = await getResumePresignedUrl(s3Key);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to generate download URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
    });
  } catch (error: any) {
    console.error("Resume fetch error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
