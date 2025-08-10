'use client';

import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export function Loading() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full py-20 min-h-screen"
      initial={{ backgroundColor: '#f3f4f6' }}
      animate={{ backgroundColor: ['#f3f4f6', '#d8b4fe', '#c4b5fd', '#f3f4f6'] }}
      transition={{ duration: 6, repeat: Infinity, repeatType: 'loop' }}
    >
      <Loader className="animate-spin text-purple-700" size={48} />
      <span className="mt-4 text-gray-700 dark:text-gray-300 font-semibold text-lg">
        Загрузка данных...
      </span>
    </motion.div>
  );
}
