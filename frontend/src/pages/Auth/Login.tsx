import { Link } from "react-router-dom"
import { useState, useCallback } from "react"
import { useAuth } from "../../context/AuthContext"
import InputForm from "../../components/UI/InputForm"
import FormButton from "../../components/UI/FormButton"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"//! delete

const Login = () => {
  const nav = useNavigate()//! delete
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isFirstRequest, setIsFirstRequest] = useState<boolean>(true);

  const submit = useCallback(async () => {
    if (!isFirstRequest) return;
    
    if (formData.email.length === 0 || formData.password.length === 0) {
      toast.error("Please enter values");
      return;
    }

    setIsFirstRequest(false);
    
    toast.promise(
      login(formData).then(() => setIsFirstRequest(true)),
      {
        pending: 'Signing in...',
        success: 'Logged in successfully!',
        error: {
          render({ data }: any) {
            setIsFirstRequest(true)
            return data?.response?.data?.error || 'Login failed'
          }
        }
      }
    );
  }, [formData, isFirstRequest, login]);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4"
    >
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-gray-500">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <InputForm
              id="email"
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData(prev => ({...prev, email: e.target.value}));
              }}
            />

            <InputForm
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData(prev => ({...prev, password: e.target.value}));
              }}
            />
          </div>

          <FormButton 
            label="Sign In" 
            onClick={submit} 
            isFirstRequest={isFirstRequest}
          />
          <button onClick={()=>nav("/")}>Here</button>//! delete
        </div>

      </motion.div>
    </div>
  );
};

export default Login;