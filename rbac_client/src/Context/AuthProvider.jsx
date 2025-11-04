import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";

import { AuthContext } from "./AuthContext";
import { auth } from "../Components/Firebase/Firebase.init";
import axios from "axios";
import { useState, useEffect } from "react";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const gProvider = new GoogleAuthProvider();

  // 🔹 গুগল দিয়ে সাইন ইন করলে কল হবে
  const signWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, gProvider);
      const gUser = result.user;

      // ইউজারের ডেটা ব্যাকএন্ডে পাঠানোর জন্য প্রস্তুত করো
      const userData = {
        name: gUser.displayName,
        email: gUser.email,
        photoUrl: gUser.photoURL,
        uid: gUser.uid,
        provider: "google"
      };

      // 🔹 ব্যাকএন্ডে ইউজার ডেটা পাঠানো
      // ⚠️ এখানে withCredentials: true দিতে হবে যেন cookie পাঠানো ও গ্রহণ হয়
      await axios.post("http://localhost:5000/users", userData, {
        withCredentials: true, // 👉 এটি ব্রাউজারে cookie সেট করার অনুমতি দেয়
      });

      console.log("✅ User data sent & JWT cookie set");
      return result;
    } catch (error) {
      console.error("❌ Error sending user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 ইমেইল-পাসওয়ার্ড দিয়ে নতুন ইউজার তৈরি
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // 🔹 ইমেইল-পাসওয়ার্ড দিয়ে লগইন
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 🔹 লগআউট হ্যান্ডলার
  const signOutUser = async () => {
  setLoading(true);
  try {
    // Backend logout clears cookie
    await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
    
    // Firebase sign out
    await signOut(auth);
    
    // Update state
    setUser(null);
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    setLoading(false);
  }
};


  // 🔹 ফায়ারবেস ইউজার স্টেট মনিটর করা
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          // 🔹 লগইন থাকলে JWT সেট করানো হবে backend-এ
          await axios.post(
            "http://localhost:5000/auth/jwt",
            { email: currentUser.email },
            { withCredentials: true }
          );
          console.log("✅ JWT cookie issued");
        } catch (error) {
          console.log("❌ Error generating JWT:", error);
        }
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const userInfo = {
    loading,
    createUser,
    signInUser,
    signOutUser,
    signWithGoogle,
    user,
    setUser,
  };

  return (
    <AuthContext.Provider value={userInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
