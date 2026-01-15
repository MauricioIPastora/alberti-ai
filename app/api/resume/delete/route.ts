/* =============================================================================
   ALBERTI AI - RESUME DELETE API
   Handles resume file deletion from S3
   ============================================================================= */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sanitizeEmail } from "@/lib/utils";
import { deleteResumeFromS3 } from "@/services/s3";

export async function DELETE(request: NextRequest) {
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

    // 2. Parse the request body
    const body = await request.json();
    const { s3Key } = body;

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
        { success: false, error: "Unauthorized - cannot delete this file" },
        { status: 403 }
      );
    }

    // 4. Delete from S3
    const deleteResult = await deleteResumeFromS3(s3Key);

    if (!deleteResult.success) {
      return NextResponse.json(
        { success: false, error: deleteResult.error || "Failed to delete file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Resume delete error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
