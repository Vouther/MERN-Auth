import { Routes, Route } from 'react-router-dom'
import FloatingShape from './components/FloatingShape.jsx'

import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import EmailVerifyPage from './pages/EmailVerifyPage.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-slate-500 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color="bg-blue-500" size="w-64 h-64" top="-5%" left="10%" delay={0}></FloatingShape>
      <FloatingShape color="bg-blue-500" size="w-48 h-48" top="70%" left="80%" delay={5}></FloatingShape>
      <FloatingShape color="bg-blue-500" size="w-32 h-32" top="40%" left="-10%" delay={2}></FloatingShape>
      <Routes>
        <Route path='/' element={"Home"}></Route>
        <Route path='/signup' element={<SignUpPage></SignUpPage>}></Route>
        <Route path='/login' element={<LoginPage></LoginPage>}></Route>
        <Route path='/verify-email' element={<EmailVerifyPage></EmailVerifyPage>}></Route>
      </Routes>
    </div>
  )
}
