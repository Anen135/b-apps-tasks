'use client'
import Head from 'next/head'
import Board from "@/components/tasks/Board"

export default function Home() {
  return (
    <>
      <Head>
        <title>Kanban Board</title>
      </Head>
      <main>
        <Board />
      </main>
    </>
  )
}
