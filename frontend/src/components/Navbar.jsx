import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../redux/slices/authSlice";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // ❗ Important: don’t render navbar until user is known
  if (!user) return null;

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-gray-800 text-white">
      <div className="space-x-4">
        <Link to="/gigs" className="hover:underline">
          Open Gigs
        </Link>

        <Link to="/my-gigs" className="hover:underline">
          My Gigs
        </Link>

        <Link to="/my-bids">My Bids</Link>
      </div>

      <div className="space-x-3 flex items-center">
        <span className="font-semibold">{user.name}</span>
        <button
          onClick={() => dispatch(logoutUser())}
          className="bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
