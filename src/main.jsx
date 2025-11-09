import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './styles.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <App />
        <ToastContainer position="top-right" theme="light" autoClose={2500} pauseOnHover={false} />
    </AuthProvider>
)