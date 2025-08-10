'use client'
import Head from 'next/head'
import { useState } from 'react'
import Board from "@/components/tasks/Board"
import StatusIndicator from "@/components/tasks/StatusIndicator"

export default function TasksPage() {
  const [status, setStatus] = useState('idle')

  return (
    <>
      <Head>
        <title>Kanban Board</title>
      </Head>

      <main className="min-h-screen px-5 py-10 font-sans text-foreground">
        <div className="mx-auto">
          <h1 className="text-[2.2rem] font-bold mb-2.5 text-center text-[#333]">
            My Tasks Board
          </h1>

          <StatusIndicator status={status} />

          <Board onStatusChange={setStatus} />
        </div>
      </main>
    </>
  )
}
