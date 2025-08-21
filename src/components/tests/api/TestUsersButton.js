"use client";

export default function TestUsersButton({ loading, runTest, setLoading, setError, setTestResult }) {
  const testUsers = async () => {
    setLoading(true);
    setError(null);
    const results = [];

    try {
      const login = `testuser_${Date.now()}`;
      const nickname = `Test Nick ${Date.now()}`;

      const user = await runTest("POST", "/api/users", {
        login,
        password: "password123",
        nickname,
        color: "#FFDDDD",
        tags: ["test"],
      });
      results.push(user);

      const duplicateUser = await runTest("POST", "/api/users", {
        login, // same login as above
        password: "password123",
        nickname: `${nickname} Duplicate`,
        color: "#FFDDDD",
        tags: ["test"],
      });
      results.push({
        ...duplicateUser,
        test: "Duplicate user creation should fail"
      });

      const userId = user.data.id;

      results.push(await runTest("GET", "/api/users"));
      results.push(await runTest("GET", `/api/users/${userId}`));
      results.push(await runTest("GET", `/api/users/fake-id-123`));

      const col = await runTest("POST", "/api/columns", {
        title: "Column for User Task",
        color: "#ABCDEF"
      });
      results.push(col);

      const task = await runTest("POST", "/api/tasks", {
        content: "User Task",
        position: 0,
        columnId: col.data.id,
        color: "#0000FF",
        userId
      });
      results.push(task);

      results.push(await runTest("GET", `/api/users/${userId}/tasks`));
      results.push(await runTest("GET", `/api/users/fake-id-123/tasks`));

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
    <button
      disabled={loading}
      onClick={testUsers}
      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
    >
      👤 Тест пользователей
    </button>
  );
}
