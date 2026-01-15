import { Route, Routes, Navigate } from "react-router-dom" 
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import Home from './pages/Home'
import Admin from './pages/Admin'
import HostalDetails from './pages/HostalDetails'
import Footer from "./components/Footer"
import { LoginPage} from "./pages/Auth/Login"
import { RegisterPage } from "./pages/Auth/Register"


function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/admin" element={<Admin />}/>
        <Route path="/hostaldetails/:id" element={<HostalDetails />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App