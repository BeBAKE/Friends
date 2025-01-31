import { Link } from "react-router-dom";
import InputForm from "../../components/UI/InputForm";
import FormButton from "../../components/UI/FormButton";
import { useAuth } from "../../context/AuthContext";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const Signup = () => {
  const nav = useNavigate()
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: ""
  });
  const [isFirstRequest, setIsFirstRequest] = useState<boolean>(true);

  const submit = useCallback(async () => {
    if (!isFirstRequest) return;
    
    if (!formData.email || !formData.username || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    setIsFirstRequest(false);
    
    toast.promise(
      signup(formData).then(() => {
        setIsFirstRequest(true)
        nav("/")
      }),
      {
        pending: 'Creating account...',
        success: 'Account created successfully!',
        error: {
          render({ data }: any) {
            setIsFirstRequest(true);
            return data?.response?.data?.error || 'Registration failed';
          }
        }
      }
    );
  }, [formData, isFirstRequest, signup]);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4"
    >
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Create an Account
          </h1>
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Login here
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
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
            />

            <InputForm
              id="username"
              label="Username"
              placeholder="Enter your username"
              onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))}
            />

            <InputForm
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
            />
          </div>

          <FormButton 
            label="Create Account" 
            onClick={submit} 
            isFirstRequest={isFirstRequest}
          />

        </div>
      </motion.div>
    </div>
  );
};

export default Signup;