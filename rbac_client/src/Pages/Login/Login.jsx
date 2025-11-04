import {  sendPasswordResetEmail } from "firebase/auth";

import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FaEyeSlash, FaRegEye, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import loginImg from '../../assets/Images/wmremove-transformed.jpeg';


import './Login.css';
import { AuthContext } from "../../Context/AuthContext";
import { auth } from "../../Components/Firebase/Firebase.init";
import Swal from "sweetalert2";



const Login = () => {
  const { signInUser,  signOutUser, signWithGoogle, user } =
    useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const signInWithGoogle = async () => {
    try {
      await signWithGoogle();
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
    }
  };




  const handleSignOut = () => {
    signOutUser()
      .then(() => setUser(null))
      .catch((error) => console.log(error));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    try{
        const result=await signInUser(email,pass);
        if(result.user.emailVerified){
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                showConfirmButton: false,
                timer: 1500
            })
            setEmail("");
            setPass("");
            navigate(from, { replace: true });
        }else Swal.fire({
            icon: 'error',
            title: 'Please verify your email before logging in.',
            showConfirmButton: false,
            timer: 1500
        })
    }
    catch(error){
        Swal.fire({
            icon: 'error',
            title: error.message,
            showConfirmButton: false,
            timer: 1500
        })
    }
  };
 
  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then((result) => {
        Swal.fire({
          icon: 'success',
          title: 'Password reset link sent to your email.',
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch((error) => Swal.fire({
        icon: 'error',
        title: error.message,
        showConfirmButton: false,
        timer: 1500
      }));
  };
  return (
    <div className="login-container">
      {/* Left section with animated image */}
      <div className="login-left">
        <img src={loginImg} alt="Login Illustration" className="login-image" />
      </div>

      {/* Right section with login form */}
      <div className="login-right">
        <div className="login-form glass-card">
          <h2 className="login-title title fs-2">Login</h2>

          {user ? (
            <div className="user-info">
              <button onClick={handleSignOut} className="logout-btn">
                Sign Out
              </button>
            </div>
          ) : (
            <>
              {/* Email/Password Form */}
              <form onSubmit={handleEmailLogin} className="email-login-form">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  required
                />
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="login-input"
                    required
                  />
                  {showPassword ? (
                    <FaEyeSlash
                      onClick={() => setShowPassword(false)}
                      className="toggle-icon"
                    />
                  ) : (
                    <FaRegEye
                      onClick={() => setShowPassword(true)}
                      className="toggle-icon"
                    />
                  )}
                </div>
                <div>
                  <Link onClick={handleForgotPassword} className="text-warning">Forgot Password</Link>
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-btn title fs-4">
                  Login
                </button>
              </form>
              <hr className="hr" />
              {/* Social login buttons with icons */}
              
              <div className="flex title fs-5 justify-center items-center gap-3 bg-black text-white px-3 py-3 rounded-2"> 
                <button
                style={{cursor:'pointer'}}
                onClick={signInWithGoogle}
               
              >
                Login with Google
              </button>
               <FcGoogle className="" />
              </div>
             

              <p className="signup-link">
                New User? <Link to="/register">Sign Up</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;