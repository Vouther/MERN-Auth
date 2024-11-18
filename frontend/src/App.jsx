import { Routes, Route, Navigate } from 'react-router-dom'
import FloatingShape from './components/FloatingShape.jsx'

import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import EmailVerifyPage from './pages/EmailVerifyPage.jsx'

import { Toaster } from 'react-hot-toast'
import { useAuthSrote } from './store/authStore.js'
import { useEffect } from 'react'
import HomePage from './pages/HomePage.jsx'

// Rutas protegidas que requieren autenticación
const ProtectedRoute = ({children}) => {
  const { isAuthenticated, user } = useAuthSrote();

  if(!isAuthenticated){
    return <Navigate to='/login' replace></Navigate>
  }

  if(!user.isVerified){
    return <Navigate to='/verify-email' replace></Navigate>
  }

  return children;
}

// Redirigir a los usuarios autenticados a la página de inicio
const RedirectAuthenticated = ({children}) => {
  const { isAuthenticated, user} = useAuthSrote();

  if(isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace/>
  }

  return children;
}

export default function App() {
  const {isCheckingAuth, checkAuth, isAuthenticated, user} = useAuthSrote();

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  console.log("isAuthenticated", isAuthenticated);
  console.log("user",user);
  console.log("isCheckingAuth", isCheckingAuth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-slate-500 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color="bg-blue-500" size="w-64 h-64" top="-5%" left="10%" delay={0}></FloatingShape>
      <FloatingShape color="bg-blue-500" size="w-48 h-48" top="70%" left="80%" delay={5}></FloatingShape>
      <FloatingShape color="bg-blue-500" size="w-32 h-32" top="40%" left="-10%" delay={2}></FloatingShape>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <HomePage></HomePage>
          </ProtectedRoute>
        }></Route>
        <Route path='/signup' element={
          <RedirectAuthenticated>
            <SignUpPage></SignUpPage>
          </RedirectAuthenticated>
          }></Route>
        <Route path='/login' element={
          <RedirectAuthenticated>
            <LoginPage></LoginPage>
          </RedirectAuthenticated>
          }></Route>
        <Route path='/verify-email' element={<EmailVerifyPage></EmailVerifyPage>}></Route>
      </Routes>
      <Toaster></Toaster>
    </div>
  )
}
