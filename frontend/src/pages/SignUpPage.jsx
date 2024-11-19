//Atajo rafce
import { motion } from "framer-motion"
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SafetyFeatures from "../components/SafetyFeatures";
import { useAuthSrote } from "../store/authStore";

const SignUpPage = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [ password, setPassword ] = useState('')
    const navigate = useNavigate()

    const {signup, error, isLoading} = useAuthSrote();

    const handleSignUp = async(e) => {
        e.preventDefault();

        try {
            await signup(email, password, name);
            navigate("/verify-email");
        } catch (err) {
            console.log(err)
        }
    }

  return (
    <motion.div
        initial={{opacity: 0, y:20}}
        animate={{opacity: 1, y:0}}
        transition={{duration: 0.5}}
        className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >
        <div className="p-8">

            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-slate-500 text-transparent bg-clip-text">
                Crear Cuenta
            </h2>

            <form onSubmit={handleSignUp}>
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
                {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

                {/*Evaluacion caracteristicas de seguridad en la contraseña*/}
                <SafetyFeatures password={password}></SafetyFeatures>

                <motion.button
                    className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-slate-600 text-white
                    font-bold rounded-lg shadow-lg hover:from-blue-600
                    hover:to-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    focus:ring-offset-gray-900 transition duration-200'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type='submit'
                    disabled={isLoading}
                >
                    {isLoading ? <Loader className="animate-spin mx-auto"></Loader> : "Registrarme"}
                </motion.button>
            </form>
        </div>
        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <p className="text-sm text-gray-400">
                Ya tienes una cuenta?{" "}
                <Link to={"/login"} className="text-blue-400 hover:underline">Acceder</Link>
            </p>
        </div>
    </motion.div>
  )
}

export default SignUpPage