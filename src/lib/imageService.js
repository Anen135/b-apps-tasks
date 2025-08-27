"use client";

import { useState, useEffect } from "react";

export function useS3Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    setLoading(true);
    const res = await fetch("/api/s3/list");
    const data = await res.json();
    setFiles(data.files || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return { files, loading, fetchFiles };
}

export function useS3Upload(onComplete) {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/s3/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);
    if (onComplete) onComplete();
  };

  return { uploading, uploadFile };
}

export async function downloadFile(key) {
  const res = await fetch(`/api/s3/file-url?key=${encodeURIComponent(key)}`);
  const data = await res.json();
  if (data.url) window.open(data.url, "_blank");
}

export async function deleteFile(key, onComplete) {
  if (!confirm("Delete this file?")) return;
  await fetch(`/api/s3/delete?key=${encodeURIComponent(key)}`, { method: "DELETE" });
  if (onComplete) onComplete();
}

export async function uploadAvatarFromUrl(url, userId) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch avatar from URL");

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get("content-type") || "image/jpeg";

    const key = `avatars/${userId}-${Date.now()}.jpg`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.FILEBASE_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    // Возвращаем ссылку для сохранения в БД
    return `s3://${process.env.FILEBASE_BUCKET}/${key}`;
  } catch (error) {
    console.error("Avatar upload error:", error);
    return null;
  }
}