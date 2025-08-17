import { motion } from "framer-motion";
import { Code2, Monitor } from "lucide-react";

export default function NodeWave() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#0d0b14] py-20">
      <div className="relative flex items-center w-full max-w-md px-6">
        {/* Developer Node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-[#4ade80] flex items-center justify-center shadow-[0_0_25px_8px_rgba(74,222,128,0.4)]">
            <Code2 className="w-6 h-6 text-[#0d0b14]" />
          </div>
          <span className="text-xs mt-2 text-gray-400 font-mono">dev</span>
        </motion.div>

        {/* Wave Animation */}
        <div className="flex-1 relative h-16">
          <svg
            viewBox="0 0 200 40"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* Первая волна */}
            <motion.path
              d="M0 20 Q 50 0, 100 20 T 200 20"
              fill="transparent"
              stroke="url(#gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={{ pathLength: [0, 1, 1, 0], pathOffset: [0, 0, 1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Вторая волна (медленнее и со сдвигом) */}
            <motion.path
              d="M0 20 Q 50 10, 100 30 T 200 20"
              fill="transparent"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={{ pathLength: [0, 1, 1, 0], pathOffset: [0, 0, 1, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />

            {/* Третья волна (быстрее и тоньше) */}
            <motion.path
              d="M0 20 Q 50 30, 100 10 T 200 20"
              fill="transparent"
              stroke="url(#gradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={{ pathLength: [0, 1, 1, 0], pathOffset: [0, 0, 1, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </svg>
        </div>

        {/* Client Node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-[#a855f7] flex items-center justify-center shadow-[0_0_25px_8px_rgba(168,85,247,0.4)]">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs mt-2 text-gray-400 font-mono">client</span>
        </motion.div>
      </div>
    </div>
  );
}
