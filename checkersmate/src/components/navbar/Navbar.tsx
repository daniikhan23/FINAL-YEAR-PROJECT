import { Link, useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { getAuth, signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import { IoMdMenu } from "react-icons/io";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import "../../css/navbar-styling.css";

/**
 * Renders the navigation bar for the web-app.
 * Provides links to various pages such as the Home, Rules, Game Start, and About.
 * Also includes a dropdown menu for accessing the user's profile, resetting password, and logging out.
 *
 * The navigation bar uses `react-router-dom` for navigation and `@radix-ui/react-dropdown-menu` for the dropdown menu.
 * `firebase/auth` is used for handling the logout functionality.
 */
const Navbar = () => {
  // Initialize Firebase authentication
  const auth = getAuth();
  const navigate = useNavigate();

  /**
   * Handles the logout process for the user. Signs the user out using Firebase authentication,
   * displays a success message upon successful logout, and an error message if the logout fails.
   */
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
