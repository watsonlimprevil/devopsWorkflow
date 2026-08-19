import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/protectedRoutes';
import { BrowserRouter , Route , Routes } from 'react-router-dom';
import Login from './pages/Login';
import Boards from './pages/Boards';
import Signup from './pages/SignUp';
import Board from './pages/Board';
import './App.css';
import Settings from './pages/Settings';

export default function App(){
return(
<BrowserRouter>
  <AuthProvider>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Signup />} />
      <Route path='/boards/:id' element={<Board/>}/>
      <Route
        path="/boards"
        element={
          <ProtectedRoute>
            <Boards />
          </ProtectedRoute>
        }
      />
      <Route path='/settings' element={<Settings/>}/>
    </Routes>
  </AuthProvider>
</BrowserRouter>
)
}