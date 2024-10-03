import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import userSvg from "../../assets/user.svg";

function Header() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    // Handle logout
    const logout = async () => {
        await auth.signOut();
        navigate("/");
    };

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate("/");
            } else {
                navigate("/dashboard");
            }
        }
    }, [user, loading, navigate]);

    return (
        <header className="bg-gradient-to-r from-teal-500 to-cyan-500 sticky top-0 w-full py-4 px-4 md:px-6 flex justify-between items-center shadow-lg z-50 transition duration-300 ease-in-out">
            <Link to="/" className="text-white text-2xl md:text-3xl font-extrabold transition duration-300 hover:text-gray-200">
                Financiphy
            </Link>
            <div className="flex items-center">
                {user ? (
                    <>
                        <img
                            src={user.photoURL ? user.photoURL : userSvg}
                            width={user.photoURL ? "40" : "30"}
                            className="rounded-full mr-3 transition-transform duration-300 transform hover:scale-110"
                            alt="User"
                        />
                        <p
                            className="text-white font-semibold cursor-pointer hover:underline transition duration-300"
                            onClick={logout}
                        >
                            Logout
                        </p>
                    </>
                ) : null}
            </div>
        </header>
    );
}

export default Header;
