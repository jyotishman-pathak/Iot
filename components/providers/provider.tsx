import { ClerkProvider } from '@clerk/nextjs'
import React, { ReactNode } from 'react'

const Provider = ({children}:{children: ReactNode}) => {
  return (
  <ClerkProvider>
    {children}
  </ClerkProvider>
  )
}

export default Provider