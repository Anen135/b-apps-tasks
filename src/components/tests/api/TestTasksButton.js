"use client";

export default function TestTasksButton({ loading, runTest, setLoading, setError, setTestResult }) {
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

  return (
    <button
      disabled={loading}
      onClick={testTasks}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
    >
      ✅ Тест задач
    </button>
  );
}
