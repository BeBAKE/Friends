import { BrowserRouter as Browser , Route , Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/Layout/ProtectedRoute';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'

function App() {
  return (<>
  
    <Browser>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* <Route path='/test' element={<HomePage/>}/> */}

          <Route path="/" element={<ProtectedRoute/>}>
            <Route element={<HomePage />} index/>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Browser>
    <ToastContainer
      aria-label={"top-center"}
      position="top-center"
      autoClose={1000}
      limit={1}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
      theme="light"
      className={"w-fit mt-3 mx-2 sm:mx-auto sm:mt-auto text-sm sm:text-base"}
    />
  </>
  )
  


}

export default App