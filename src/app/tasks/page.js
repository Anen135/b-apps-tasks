// sourcery skip: use-braces
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

      <main
        style={{
          minHeight: '100vh',
          backgroundColor: '#f9f9fb',
          padding: '40px 20px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ margin: '0 auto' }}>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 700,
            marginBottom: '10px',
            textAlign: 'center',
            color: '#333',
          }}>
            My Tasks Board
          </h1>

          <StatusIndicator status={status} />

          <Board onStatusChange={setStatus} />
        </div>
      </main>
    </>
  )
}
