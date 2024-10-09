
import './App.css'
import {BrowserRouter ,Route, Routes} from 'react-router-dom'
import Register from './pages/register'
import Home from './pages/home'
import ProtectedRoute from './components/protectedRoute'
import Login from './pages/login'
function App() {
 

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path='register/' element={<Register/>}> 
        </Route>
        <Route path='login/' element={<Login />}></Route>
        <Route path='/' element = {<ProtectedRoute><Home /></ProtectedRoute>}></Route>
      </Routes>
     </BrowserRouter> 
    </>
  )
}

export default App
