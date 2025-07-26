'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader2, AlertCircle, List} from 'lucide-react'

const statusMap = {
    idle: {
        text: 'Это ваша доска задач',
        icon: <List />,
        color: 'text-gray-500'
    },
    loading: {
        text: 'Загрузка...',
        icon: <Loader2 className="animate-spin" />,
        color: 'text-blue-500'
    },
    saving: {
        text: 'Сохраняю...',
        icon: <Loader2 className="animate-spin" />,
        color: 'text-yellow-500'
    },
    saved: {
        text: 'Сохранено',
        icon: <CheckCircle />,
        color: 'text-green-600'
    },
    error: {
        text: 'Ошибка',
        icon: <AlertCircle />,
        color: 'text-red-600'
    }
}

export default function StatusIndicator({ status }) {
  const data = statusMap[status]

  return (
    <div className="min-h-[24px] mb-4 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {data && (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-2 text-sm font-medium ${data.color}`}
          >
            {data.icon}
            <span>{data.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}