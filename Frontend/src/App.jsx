import { useState } from 'react'
import {router} from './app.routes'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './features/auth/auth.context'
import { InterviewProvider } from './features/interview/interview.context'
import { Toaster } from './components/ui/sonner'
function App() {

  return (
    <>
     <AuthProvider>
      <InterviewProvider>
       <RouterProvider router={router} />
       <Toaster richColors position="top-center"/>
      </InterviewProvider>
     </AuthProvider>
    </>
  )
}

export default App
