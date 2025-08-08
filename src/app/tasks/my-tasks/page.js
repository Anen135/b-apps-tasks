// app/tasks/my-tasks/page.jsx
import dynamic from 'next/dynamic'

const MyTasks = dynamic(() => import('@/components/MyTasks'), { ssr: false })

export default function Page() {
  return (
    <div>
      <h1>Страница: Мои задачи</h1>
      <MyTasks />
    </div>
  )
}
