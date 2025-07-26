"use client";

import { useState } from "react";

export default function ApiTestPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [testResult, setTestResult] = useState([]);

    const parseJsonSafely = async (res) => {
        try {
            return await res.json();
        } catch (e) {
            return { error: "Ошибка при разборе JSON", raw: await res.text() };
        }
    };

    const runTests = async () => {
        setLoading(true);
        setError(null);
        setTestResult([]);

        const results = [];

        try {
            const res1 = await fetch("/api/columns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Test Column" }),
            });
            const column = await parseJsonSafely(res1);
            results.push({
                step: "POST /api/columns",
                success: res1.ok,
                data: column,
            });

            const res2 = await fetch("/api/columns");
            const allColumns = await parseJsonSafely(res2);
            results.push({
                step: "GET /api/columns",
                success: res2.ok,
                data: allColumns,
            });

            const res3 = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: "Test Task",
                    position: 0,
                    columnId: column.id,
                }),
            });
            const task = await parseJsonSafely(res3);
            results.push({ step: "POST /api/tasks", success: res3.ok, data: task });

            const res4 = await fetch(`/api/tasks/${task.id}`);
            const fetchedTask = await parseJsonSafely(res4);
            results.push({
                step: "GET /api/tasks/[id]",
                success: res4.ok,
                data: fetchedTask,
            });

            const resFake = await fetch(`/api/tasks/fake-id-123`);
            const fakeFetch = await parseJsonSafely(resFake);
            results.push({
                step: "GET /api/tasks/fake-id-123",
                success: resFake.ok,
                data: fakeFetch,
            });

            const res5 = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
            results.push({ step: "DELETE /api/tasks/[id]", success: res5.ok });

            const res6 = await fetch(`/api/columns/${column.id}`, {
                method: "DELETE",
            });
            results.push({ step: "DELETE /api/columns/[id]", success: res6.ok });

            const resFakeCol = await fetch(`/api/columns/fake-id-123`, {
                method: "DELETE",
            });
            const fakeColRes = await parseJsonSafely(resFakeCol);
            results.push({
                step: "DELETE /api/columns/fake-id-123",
                success: resFakeCol.ok,
                data: fakeColRes,
            });

            setTestResult(results);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800"> 🧪 API Тестирование </h1>

                <div className="flex justify-center mb-6">
                    <button
                        onClick={runTests}
                        disabled={loading}
                        className="px-6 py-2 text-lg font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "⌛ Выполняется..." : "🚀 Запустить тесты"}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-6"> ❌ Ошибка: {error} </div>
                )}

                <ul className="space-y-4">
                    {testResult.map((res, i) => (
                        <li
                            key={i}
                            className={`p-4 rounded-lg shadow-sm border ${res.success
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
