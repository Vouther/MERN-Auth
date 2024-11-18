import { create } from "zustand";
import axios from "axios";

/*
Al usar Zustand, cualquier cambio en el estado dispara una re-renderización en los componentes React que se consumen aqui, garantizando que la UI esté sincronizada con el estado actual.
*/

const API_URL = "http://localhost:5000/api/auth"


//Configuramos Axios para incluir automáticamente las cookies en las solicitudes
axios.defaults.withCredentials = true;

export const useAuthSrote = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,

    signup: async(email, password, name) => {
        set({isLoading: true, error: null});
        try{
            const response = await axios.post(`${API_URL}/signup`, {email, password, name})
            set({ user: response.data.user, isAuthenticated: true, isLoading: false})
        } catch (err) {
            set({error: err.response.data.message || "Error al registrarse", isLoading: false});
            throw err;
        }
    },

    login: async(email, password) => {
        set({isLoading: true, error: null});
        try{
            const response = await axios.post(`${API_URL}/login`, {email, password})
            set({
                isAuthenticated: true,
                user: response.data.user,
                error: null,
                isLoading: false
            })
        }catch (err){
            set({error: err.response?.data?.message || "Error al iniciar sesion", isLoading:false})
            throw err;
        }
    },

    verifyEmail: async(code) => {
        set({isLoading: true, error: null});
        try{
            const response = await axios.post(`${API_URL}/verify-email`, {code})
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
            return response.data
        } catch (err) {
            set({ error: err.response.data.message || "Error al verificar el correo", isLoading: false})
            throw err;
        }
    },

    checkAuth: async () => {
        set({isCheckingAuth: true, error: null});
        try{
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false})
        } catch (err) {
            set({error: null, isCheckingAuth: false, isAuthenticated: false})
            console.log(err);
        }
    }
}))