"use client";

export default function TestColumnsButton({ loading, runTest, setLoading, setError, setTestResult }) {
  const testColumns = async () => {
    setLoading(true);
    setError(null);
    const results = [];
    setTestResult(results);

    try {
      const colCreate = await runTest("POST", "/api/columns", {
        title: "Test Column",
        color: "#FFEEAA"
      });
      results.push(colCreate);
      setTestResult(results);
      const column = colCreate.data;

      const duplicateColCreate = await runTest("POST", "/api/columns", {
        title: "Test Column",
        color: "#FFEEAA"
      });
      results.push(duplicateColCreate);
      setTestResult(results);

      results.push(await runTest("GET", "/api/columns"));
      setTestResult(results);
      results.push(await runTest("GET", `/api/columns/${column.id}`));
      setTestResult(results);
      results.push(await runTest("GET", `/api/columns/fake-id-123`));
      setTestResult(results);

      results.push(await runTest("PUT", `/api/columns/${column.id}`, {
        title: "Updated Column",
        color: "#ABCDEF"
      }));
      setTestResult(results);
      results.push(await runTest("PUT", `/api/columns/fake-id-123`, {
        title: "Broken",
        color: "#000"
      }));

      setTestResult(results);

      results.push(await runTest("DELETE", `/api/columns/${column.id}`));
      setTestResult(results);
      results.push(await runTest("DELETE", `/api/columns/fake-id-123`));
      setTestResult(results);
      results.push(await runTest("DELETE", `/api/columns/${duplicateColCreate.data.id}`));
      setTestResult(results);

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
      onClick={testColumns}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
    >
      🗂 Тест колонок
    </button>
  );
}
