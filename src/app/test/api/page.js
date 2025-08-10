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


    const testColumns = async () => {
        setLoading(true);
        setError(null);
        const results = [];

        try {
            const colCreate = await runTest("POST", "/api/columns", {
                title: "Test Column",
                color: "#FFEEAA"
            });
            results.push(colCreate);
            const column = colCreate.data;

            results.push(await runTest("GET", "/api/columns"));

            results.push(await runTest("GET", `/api/columns/${column.id}`));
            results.push(await runTest("GET", `/api/columns/fake-id-123`));

            results.push(await runTest("PUT", `/api/columns/${column.id}`, {
                title: "Updated Column",
                color: "#ABCDEF"
            }));
            results.push(await runTest("PUT", `/api/columns/fake-id-123`, {
                title: "Broken",
                color: "#000"
            }));

            results.push(await runTest("DELETE", `/api/columns/${column.id}`));
            results.push(await runTest("DELETE", `/api/columns/fake-id-123`));

        } catch (err) {
            setError(err.message);
        } finally {
            setTestResult(results);
            setLoading(false);
        }
    };

    const testTasks = async () => {
        setLoading(true);
        setError(null);
        const results = [];

        try {
            const col = await runTest("POST", "/api/columns", {
                title: "Temp Column",
                color: "#DDDDDD"
            });
            results.push(col);
            const columnId = col.data.id;

            const task = await runTest("POST", "/api/tasks", {
                content: "Test Task",
                position: 0,
                columnId,
                color: "#FF0000",
                tags: ["urgent"]
            });
            results.push(task);
            const taskId = task.data.id;

            results.push(await runTest("GET", "/api/tasks"));
            results.push(await runTest("GET", `/api/tasks/${taskId}`));
            results.push(await runTest("GET", `/api/tasks/fake-id-123`));

            results.push(await runTest("PUT", `/api/tasks/${taskId}`, {
                content: "Updated Task",
                position: 1,
                columnId,
                color: "#00FF00",
                tags: ["updated"]
            }));

            results.push(await runTest("PUT", `/api/tasks/fake-id-123`, {
                content: "Broken",
                position: 0,
                columnId,
                color: "#000"
            }));

            results.push(await runTest("DELETE", `/api/tasks/${taskId}`));
            results.push(await runTest("DELETE", `/api/tasks/fake-id-123`));
            results.push(await runTest("DELETE", `/api/columns/${columnId}`));

        } catch (err) {
            setError(err.message);
        } finally {
            setTestResult(results);
            setLoading(false);
        }
    };

    const testUsers = async () => {
        setLoading(true);
        setError(null);
        const results = [];

        try {
            const login = `testuser_${Date.now()}`;
            const nickname = `Test Nick ${Date.now()}`;

            // ✅ 1. Создание пользователя с обязательным nickname
            const user = await runTest("POST", "/api/users", {
                login,
                password: "password123",
                nickname, // 👈 добавлено
                color: "#FFDDDD",
                tags: ["test"],
                avatarUrl: null
            });
            results.push(user);

            const userId = user.data.id;

            // ✅ 2. Прочие запросы
            results.push(await runTest("GET", "/api/users"));
            results.push(await runTest("GET", `/api/users/${userId}`));
            results.push(await runTest("GET", `/api/users/fake-id-123`));

            // ✅ 3. Создание колонки
            const col = await runTest("POST", "/api/columns", {
                title: "Column for User Task",
                color: "#ABCDEF"
            });
            results.push(col);

            // ✅ 4. Создание задачи
            const task = await runTest("POST", "/api/tasks", {
                content: "User Task",
                position: 0,
                columnId: col.data.id,
                color: "#0000FF",
                userId
            });
            results.push(task);

            // ✅ 5. Получение задач пользователя
            results.push(await runTest("GET", `/api/users/${userId}/tasks`));
            results.push(await runTest("GET", `/api/users/fake-id-123/tasks`));

            // ✅ 6. Удаление
            results.push(await runTest("DELETE", `/api/tasks/${task.data.id}`));
            results.push(await runTest("DELETE", `/api/columns/${col.data.id}`));

        } catch (err) {
            setError(err.message);
        } finally {
            setTestResult(results);
            setLoading(false);
        }
    };


    return (
        <main className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            <Breadcrumbs />
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">🧪 API Тестирование</h1>

                <div className="flex justify-center gap-4 mb-6 flex-wrap">
                    <TestColumnsButton loading={loading} onClick={testColumns} />
                    <TestTasksButton loading={loading} onClick={testTasks} />
                    <TestUsersButton loading={loading} onClick={testUsers} />
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
