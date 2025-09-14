import  { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider , signInWithPopup } from 'firebase/auth';
import {auth} from "../firebase/Firebase"
import axios from 'axios';
export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const validate = () => {
    if (!email) return 'Email is required.';
   
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) return 'Please enter a valid email address.';
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // user will be available via AuthContext
  } catch (err) {
    setError("Google login failed.");
  }
};

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) return setError(v);

    try {
      setLoading(true);
      const res  = await axios.post(`${import.meta.env.VITE_LOCALHOST_URL}/api/user/login` , {
        email,
        password
      })
        if(res){
              //jwt stored in local storage
              localStorage.setItem("token" , res.data)
            if(res.status == 200){
                navigate("/Homepage");
            }
        }
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-md  w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Sign in to continue to your account</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-300 px-2 py-1 rounded"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm gap-2 text-gray-600 dark:text-gray-300">
              <input type="checkbox" className="h-4 w-4 rounded text-indigo-600" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">or continue with</div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99H7.898v-2.889h2.54V9.412c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.889h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/></svg>
            Facebook
          </button>

          <button onClick={handleGoogleLogin} className="py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M21.805 10.023h-9.029v3.954h5.149c-.223 1.377-1.401 4.032-5.149 4.032-3.095 0-5.612-2.556-5.612-5.706 0-3.15 2.174-5.82 5.612-5.82 1.744 0 2.913.745 3.583 1.391l2.18-2.09C18.826 4.057 16.218 3 13.099 3 7.93 3 3.5 7.523 3.5 12.693 3.5 17.86 8.07 22.5 13.219 22.5c6.076 0 8.586-5.14 8.586-9.696 0-.538-.0-1.07-.0-2.781z"/></svg>
            Google
          </button>
        </div>

        <footer className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Don\'t have an account? <a onClick={() => navigate("/Signup")} href="#" className="text-indigo-600 hover:underline">Sign up</a>
        </footer>
      </div>
    </div>
  );
}
