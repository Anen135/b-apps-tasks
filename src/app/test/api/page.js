"use client";

import { useState } from "react";
import TestTasksButton from "@/components/tests/api/TestTasksButton";
import TestColumnsButton from "@/components/tests/api/TestColumnsButton";
import TestUsersButton from "@/components/tests/api/TestUsersButton";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ApiTestPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testResult, setTestResult] = useState([]);

  const parseJsonSafely = async (res) => {
    const raw = await res.text();
    try {
      return JSON.parse(raw);
    } catch (e) {
      return { error: "Ошибка при разборе JSON", raw };
    }
  };

  const runTest = async (method, url, body = null) => {
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : null,
      });

      const data = await parseJsonSafely(res);
      return {
        step: `${method} ${url}`,
        success: res.ok,
        data,
      };
    } catch (err) {
      return {
        step: `${method} ${url}`,
        success: false,
        data: { error: err.message },
      };
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <Breadcrumbs />
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          🧪 API Тестирование
        </h1>

        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <TestColumnsButton
            loading={loading}
            runTest={runTest}
            setLoading={setLoading}
            setError={setError}
            setTestResult={setTestResult}
          />
          <TestTasksButton
            loading={loading}
            runTest={runTest}
            setLoading={setLoading}
            setError={setError}
            setTestResult={setTestResult}
          />
          <TestUsersButton
            loading={loading}
            runTest={runTest}
            setLoading={setLoading}
            setError={setError}
            setTestResult={setTestResult}
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-6">
            ❌ Ошибка: {error}
          </div>
        )}

        <ul className="space-y-4">
          {testResult.map((res, i) => (
            <li
              key={i}
              className={`p-4 rounded-lg shadow-sm border ${
                res.success
                  ? "bg-green-50 border-green-300"
                  : "bg-red-50 border-red-300"
              }`}
            >
              <div className="font-semibold text-gray-800 mb-2">
                {res.step}: {res.success ? "✅ Успешно" : "❌ Ошибка"}
              </div>
              {res.data && (
                <pre className="text-sm bg-gray-100 rounded p-3 overflow-x-auto text-gray-700">
                  {JSON.stringify(res.data, null, 2)}
                </pre>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
