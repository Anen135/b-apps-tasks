'use client'

import { useSession } from 'next-auth/react'
import SidebarLayout from '@/components/SidebarLayout'
import { LoadingPage } from '@/components/Loading'
import { Toaster } from 'sonner'

export default function SessionWrapper({ children }) {
    const { data, status } = useSession()
    console.warn('SessionWrapper', !data?.user, data, status)
    return (
        <>
            {
                status === 'loading' ? <LoadingPage /> :
                    data?.user ? <>
                        <SidebarLayout>{children}</SidebarLayout>
                        <Toaster
                            position="top-right"
                            richColors
                            closeButton
                            toastOptions={{
                                className: 'bg-background text-foreground',
                                style: { fontFamily: 'var(--font-geist-sans)' },
                            }}
                        />
                    </> : <>{children}</>
            }
        </>
    )
}
