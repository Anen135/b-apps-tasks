"use client";

import { useEffect, useState } from "react";

export default function S3ManagerPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch files from API
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

  // Upload file
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch("/api/s3/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);
    setSelectedFile(null);
    fetchFiles();
  };

  // Download file
  const handleDownload = async (key) => {
    const res = await fetch(`/api/s3/file-url?key=${encodeURIComponent(key)}`);
    const data = await res.json();
    if (data.url) window.open(data.url, "_blank");
  };

  // Delete file
  const handleDelete = async (key) => {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/s3/delete?key=${encodeURIComponent(key)}`, { method: "DELETE" });
    fetchFiles();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">S3 Bucket Manager</h1>

      {/* Upload Section */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl mb-2">Upload File</h2>
        <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* File List */}
      <h2 className="text-xl mb-4">Files in Bucket</h2>
      {loading ? (
        <p>Loading files...</p>
      ) : files.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => (
            <li key={file.key} className="flex justify-between items-center border p-3 rounded">
              <div>
                <p className="font-medium">{file.key}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB | {new Date(file.lastModified).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={() => handleDownload(file.key)}
                >
                  Download
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => handleDelete(file.key)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
