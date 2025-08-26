import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function DELETE(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
      // Only admin can delete files
    if (!user.tags.includes("admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.FILEBASE_BUCKET,
        Key: key,
      })
    );

    return NextResponse.json({ message: "File deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
