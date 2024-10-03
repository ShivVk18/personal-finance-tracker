import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Header from "../components/Header/Header";
import { toast } from "react-toastify";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();

  const createUserDocument = async (user) => {
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();

      try {
        await setDoc(userRef, {
          name: displayName ? displayName : name,
          email,
          photoURL: photoURL ? photoURL : "",
          createdAt,
        });
        toast.success("Account Created!");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        console.error("Error creating user document: ", error);
        setLoading(false);
      }
    }
  };

  const signUpWithEmail = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;
      await createUserDocument(user);
      toast.success("Successfully Signed Up!");
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
      console.error(
        "Error signing up with email and password: ",
        error.message
      );
      setLoading(false);
    }
  };

  const signInWithEmail = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      navigate("/dashboard");
      toast.success("Logged In Successfully!");
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      console.error(
        "Error signing in with email and password: ",
        error.message
      );
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createUserDocument(user);
      toast.success("User Authenticated Successfully!");
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      console.error("Error signing in with Google: ", error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center w-screen h-screen">
        {flag ? (
          <div className="bg-white shadow-lg rounded-lg p-8 w-1/3 min-w-[400px]">
            <h2 className="text-center text-2xl font-bold mb-4">
              Log In on{" "}
              <span className="text-blue-500">Financely</span>
            </h2>
            <form onSubmit={signUpWithEmail}>
              <div className="mb-4">
                <p className="text-black">Email</p>
                <input
                  type="email"
                  placeholder="JohnDoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-black py-2 placeholder-gray-500 focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <p className="text-black">Password</p>
                <input
                  type="password"
                  placeholder="Example123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-black py-2 placeholder-gray-500 focus:outline-none"
                />
              </div>

              <button
                disabled={loading}
                className="w-full text-blue-500 border border-blue-500 rounded py-2 mt-4 hover:bg-blue-500 hover:text-white transition"
                onClick={signInWithEmail}
              >
                {loading ? "Loading..." : "Log In with Email and Password"}
              </button>
            </form>
            <p className="text-center my-2">or</p>
            <button
              disabled={loading}
              className="w-full bg-blue-500 text-white rounded py-2 mt-2 hover:bg-white hover:text-blue-500 border-blue-500 transition"
              onClick={signInWithGoogle}
            >
              {loading ? "Loading..." : "Log In with Google"}
            </button>
            <p
              onClick={() => setFlag(!flag)}
              className="text-center mt-4 text-gray-500 cursor-pointer"
            >
              Or Don't Have An Account? Click Here.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-8 w-1/3 min-w-[400px]">
            <h2 className="text-center text-2xl font-bold mb-4">
              Sign Up on{" "}
              <span className="text-blue-500">Financely</span>
            </h2>
            <form onSubmit={signUpWithEmail}>
              <div className="mb-4">
                <p className="text-black">Full Name</p>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-black py-2 placeholder-gray-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <p className="text-black">Email</p>
                <input
                  type="email"
                  placeholder="JohnDoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-black py-2 placeholder-gray-500 focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <p className="text-black">Password</p>
                <input
                  type="password"
                  placeholder="Example123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-black py-2 placeholder-gray-500 focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <p className="text-black">Confirm Password</p>
                <input
                  type="password"
                  placeholder="Example123"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-b border-black py-2 placeholder-gray-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full text-blue-500 border border-blue-500 rounded py-2 mt-4 hover:bg-blue-500 hover:text-white transition"
              >
                {loading ? "Loading..." : "Sign Up with Email and Password"}
              </button>
            </form>
            <p className="text-center my-2">or</p>
            <button
              disabled={loading}
              className="w-full bg-blue-500 text-white rounded py-2 mt-2 hover:bg-white hover:text-blue-500 border-blue-500 transition"
              onClick={signInWithGoogle}
            >
              {loading ? "Loading..." : "Sign Up with Google"}
            </button>
            <p
              onClick={() => setFlag(!flag)}
              className="text-center mt-4 text-gray-500 cursor-pointer"
            >
              Or Have An Account Already? Click Here
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default SignUp;
