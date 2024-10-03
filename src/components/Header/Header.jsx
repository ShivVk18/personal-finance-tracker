import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import userSvg from "../../assets/user.svg";

function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  function logout() {
    auth.signOut();
    navigate("/");
  }

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="sticky w-full p-3 bg-theme flex justify-between items-center">
      <p className="text-white font-medium text-lg m-0">Financiphy</p>
      {user ? (
        <p className="text-gray-300 font-medium text-base cursor-pointer" onClick={logout}>
          <span className="mr-4">
            <img
              src={user.photoURL ? user.photoURL : userSvg}
              width={user.photoURL ? "32" : "24"}
              className="rounded-full"
              alt="User Avatar"
            />
          </span>
          Logout
        </p>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Header;
