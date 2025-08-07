"use client";

export default function TestUsersButton({ loading, onClick }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="px-6 py-2 text-lg font-medium bg-green-600 text-white rounded-full hover:bg-green-700 transition disabled:opacity-50"
        >
            {loading ? "⌛" : "👤 Тест Users"}
        </button>
    );
}
