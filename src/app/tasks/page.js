'use client'
import Head from 'next/head'
import Board from "@/components/tasks/Board"

export default function TasksPage() {
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
        <div style={{
          margin: '0 auto',
        }}>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 700,
            marginBottom: '30px',
            textAlign: 'center',
            color: '#333',
          }}>
            My Tasks Board
          </h1>

          <Board />
        </div>
      </main>
    </>
  )
}
