'use client'
import Link from "next/link";

export default function TestRoutePage() {


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <Link href={"/test/api"}>
            <button className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition">
                API
            </button>
        </Link>
        <Link href={"/test/JWT"}>
            <button className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition">
                JWT
            </button>
        </Link>
    </main>
  );
}
