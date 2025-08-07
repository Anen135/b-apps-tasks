"use client";

export default function TestTasksButton({ loading, onClick }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="px-6 py-2 text-lg font-medium bg-purple-600 text-white rounded-full hover:bg-purple-700 transition disabled:opacity-50"
        >
            {loading ? "⌛" : "🗂️ Тест Tasks"}
        </button>
    );
}
