import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.FILEBASE_BUCKET,
    });

    const response = await s3Client.send(command);

    const files = (response.Contents || []).map((item) => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
    }));

    return NextResponse.json({ files });
  } catch (error) {
    console.error("List error:", error);
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
  }
}
