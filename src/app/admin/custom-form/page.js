// app/admin/page.js
import Link from "next/link";

export default async function AdminIndex({ searchParams }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"; // dev fallback

  const res = await fetch(`${baseUrl}/api/admin/models`, { cache: "no-store" });
  const json = await res.json();
  const models = json.models || [];

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin — Models</h1>
      <ul>
        {models.map((m) => (
          <li key={m}>
            <Link href={`/admin/${m}`}>{m}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
