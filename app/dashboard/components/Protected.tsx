"use client"
import { db } from '@/firebase'
import { useStore } from '@/store/storeInfos'
import {   doc,  getDoc , setDoc, Timestamp} from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { redirect, usePathname } from 'next/navigation'
import React, { useEffect } from 'react'


function Protected({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    }
  })
  const {storeId,loadStoreId} = useStore();

  useEffect(() => {
    loadStoreId();
    if (session) {
      if(!storeId) {
        if(pathname !== '/dashboard/create-store' && pathname !== '/dashboard/switch-store') {
          redirect('/dashboard/switch-store')
        }
      }
      handleFirstTimeRegistration(session.user as {
        email: string
        name: string
        image: string
      })
    }
  }, [session,storeId,redirect,pathname])

  const handleFirstTimeRegistration = async (user:{
    email: string
    name: string
    image: string
  }) => {
    try {
      const userEmail = user.email
      if (!userEmail) {
        throw new Error('User email is undefined')
      }

      const userRef = doc(db, 'users', userEmail) // Use email as the document ID
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        // User is registering for the first time
        await setDoc(userRef, {
          email: user.email,
          name: user.name || 'Anonymous',
          image: user.image || '',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        })
      }
    } catch (error) {
      console.error('Error registering user:', error)
    }
  }
  if(!session) {
    return null
  }

  return (
    <div>{children}</div>
  )
}

export default Protected