"use client"
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React from 'react'


function Protected({ children }: { children: React.ReactNode }) {
    useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    }
  })
  return (
    <div>{children}</div>
  )
}

export default Protected