import { FaLock } from "react-icons/fa";
import Link from "next/link";

export default function PermissionDenied() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-md w-full text-center animate-fadeIn">
        <div className="flex justify-center mb-6">
          <FaLock className="text-red-500 text-6xl animate-bounce" />
        </div>
        <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Доступ запрещён
        </h2>
        <p className="text-gray-600 mb-8">
          У вас нет прав для просмотра этой страницы.
          <br />
          Если вы считаете, что это ошибка — обратитесь к администратору.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
        >
          Вернуться на главную
        </Link>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
