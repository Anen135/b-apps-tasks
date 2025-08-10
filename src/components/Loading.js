'use client';

import { Loader } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <Loader className="animate-spin text-purple-700" size={48} />
      <span className="mt-4 text-gray-700 dark:text-gray-300 font-semibold text-lg">
        Загрузка данных...
      </span>
    </div>
  );
}
