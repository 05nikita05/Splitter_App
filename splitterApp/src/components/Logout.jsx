import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Assuming AuthContext manages authentication

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming `logout` clears tokens or cookies

  const handleLogout = () => {
    logout(); // Clear tokens or session
    navigate("/login"); // Redirect to login page
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500  text-white rounded shadow hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
