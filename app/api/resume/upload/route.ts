/* =============================================================================
   ALBERTI AI - RESUME UPLOAD API
   Handles resume file uploads to S3
   ============================================================================= */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sanitizeEmail } from "@/lib/utils";
import { uploadResumeToS3 } from "@/services/s3";

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: NextRequest) {
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

    // 2. Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // 3. Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Please upload a PDF or Word document." },
        { status: 400 }
      );
    }

    // 4. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // 5. Sanitize filename (remove special characters, keep extension)
    const originalName = file.name;
    const extension = originalName.split(".").pop() || "";
    const baseName = originalName
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[^a-zA-Z0-9._-]/g, "_") // Sanitize
      .substring(0, 100); // Limit length
    const sanitizedFileName = `${baseName}.${extension}`;

    // 6. Create S3 key (path)
    const timestamp = Date.now();
    const s3Key = `users/${sanitizedEmail}/original-resumes/${timestamp}_${sanitizedFileName}`;

    // 7. Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 8. Upload to S3
    const uploadResult = await uploadResumeToS3(buffer, s3Key, file.type);

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error || "Failed to upload file" },
        { status: 500 }
      );
    }

    // 9. Return success with file metadata
    return NextResponse.json({
      success: true,
      data: {
        id: timestamp.toString(),
        fileName: originalName,
        s3Key: s3Key,
        uploadedDate: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
