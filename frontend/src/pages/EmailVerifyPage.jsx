import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuthSrote } from "../store/authStore"
import toast from "react-hot-toast"

const EmailVerifyPage = () => {

    const [code, setCode] = useState(["","","","","",""])
    const inputRefs = useRef([])
    const navigate = useNavigate();

    const {error, isLoading, verifyEmail} = useAuthSrote();

    const handleChange = (index, value) => {
        const newCode = [...code];

        //En caso de que se pegue el codigo
        if(value.length > 1){
            const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Nos enfocamos en la última entrada no vacía o en la primera vacía
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
        } else {
            newCode[index] = value;
			setCode(newCode);

			// Si se ingreso un valor nos enfocamos al siguiente campo de entrada
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
        }
    };

    const handleKeyDown = (index, e) => {
        if(e.key === "Blackspace" && !code[index] && index > 0) {
            inputRefs.current[index -1].focus();
        }};

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join("");
        alert("Código de verificación enviado: " + verificationCode)
        try {
            await verifyEmail(verificationCode);
            navigate("/");
            toast.success("Correo verificado correctamente")
        } catch (err) {
            console.log(err);
        }
    };

    // Envío automático cuando se completan todos los campos
    useEffect(() => {
        if(code.every(digit => digit !== "")){
            handleSubmit(new Event("submit"));
        }
    },[code])

  return (
    <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
        >
            <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-slate-500 text-transparent bg-clip-text'>
					Verificacion de correo
            </h2>
            <p className='text-center text-gray-300 mb-6'>Introduzca el código de 6 caracteres enviado a su dirección de correo electrónico.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type='text'
                            maxLength='6'
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none'
                        />
                    ))}
                </div>
                {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type='submit'
                    disabled={isLoading || code.some((digit) => !digit)}
                    className='w-full bg-gradient-to-r from-blue-500 to-slate-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-blue-600 hover:to-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50'
                >
                    {isLoading ? "Verifying..." : "Verify Email"}
                </motion.button>
            </form>
        </motion.div>
    </div>
  )
}

export default EmailVerifyPage