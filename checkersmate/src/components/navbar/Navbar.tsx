import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { getAuth, signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import "../../css/navbar/navbar-styling.css";
import "../../css/navbar/navbar-responsive.css";

const Navbar = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const logout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out successful");
      })
      .catch((error) => {
        toast.error(`Logout failed: ${error.message}`);
      });
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="container">
          <div className="home">
            <button>
              <Link to="/">CheckersMate</Link>
            </button>
          </div>
          <ul className="list">
            <li>
              <button>
                <Link to="/rules">Rules</Link>
              </button>
            </li>
            <li>
              <button>
                <Link to="/game-start">Game</Link>
              </button>
            </li>
            <li>
              <button>
                <Link to="/about">About</Link>
              </button>
            </li>
            <li>
              <DropdownMenuPrimitive.Root>
                <DropdownMenuPrimitive.Trigger asChild>
                  <button className="menu">
                    <IoMdMenu fontSize={25} />
                  </button>
                </DropdownMenuPrimitive.Trigger>

                <DropdownMenuPrimitive.Content className="dropdown-menu">
                  <DropdownMenuPrimitive.Item
                    onSelect={() => navigate("/profile")}
                  >
                    Profile
                  </DropdownMenuPrimitive.Item>
                  <DropdownMenuPrimitive.Item
                    onSelect={() => navigate("/reset-password")}
                  >
                    Reset Password
                  </DropdownMenuPrimitive.Item>
                  <DropdownMenuPrimitive.Item onSelect={logout}>
                    Log Out
                  </DropdownMenuPrimitive.Item>
                </DropdownMenuPrimitive.Content>
              </DropdownMenuPrimitive.Root>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
