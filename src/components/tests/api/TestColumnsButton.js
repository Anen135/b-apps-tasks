"use client";

export default function TestColumnsButton({ loading, onClick }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="px-6 py-2 text-lg font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
        >
            {loading ? "⌛" : "🧱 Тест Columns"}
        </button>
    );
}
