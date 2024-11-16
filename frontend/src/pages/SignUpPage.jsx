//Atajo rafce
import { motion } from "framer-motion"
import Input from "../components/Input";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";

const SignUpPage = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const { password, setPassword } = useState('')

    const handleSignUp = (e) => {
        e.preventDefault();
    }

  return (
    <motion.dev
    initial={{opacity: 0, y:20}}
    animate={{opacity: 1, y:0}}
    transition={{duration: 0.5}}
    className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >
        <div className="p-8">

            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-slate-500 text-transparent bg-clip-text">
                Crear Cuenta
            </h2>

            <form onSubmit={handleSignUp}></form>

            <Input icon={User}
            type='text'
            placeholder='Nombre completo'
            value={name}
            onChange={(e) => setName(e.target.value)}></Input>

            <Input icon={Mail}
            type='email'
            placeholder='Correo electronico'
            value={email}
            onChange={(e) => setEmail(e.target.value)}></Input>

            <Input icon={Lock}
            type='password'
            placeholder='Contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}></Input>


        </div>
    </motion.dev>
  )
}

export default SignUpPage