import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../redux/slices/authSlice";
import { useState } from "react";


export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [open, setOpen] = useState(false);


  if (!user) return null;

  const isOpenGigs = () => 
    location.pathname === "/gigs";

  const isMyGigs = () =>
    location.pathname.startsWith("/my-gigs");

  const isMyBids = () =>
    location.pathname.startsWith("/my-bids");

  // const navItem = (path, label) => (
  //   <Link
  //     to={path}
  //     className={`px-3 py-2 rounded-md text-sm font-medium transition
  //       ${
  //         location.pathname.startsWith(path)
  //           ? "bg-slate-900 text-white"
  //           : "text-slate-300 hover:text-white hover:bg-slate-700"
  //       }`}
  //   >
  //     {label}
  //   </Link>
  // );

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          
          {/* LEFT: Navigation */}
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold text-lg mr-4">
              GigFlow
            </span>

            <Link
              to="/gigs"
              className={`px-3 py-2 rounded ${
                isOpenGigs()
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Open Gigs
            </Link>

            <Link
              to="/my-gigs"
              className={`px-3 py-2 rounded ${
                isMyGigs()
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              My Gigs
            </Link>

            <Link
              to="/my-bids"
              className={`px-3 py-2 rounded ${
                isMyBids()
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              My Bids
            </Link>

            <Link
              to="/create-gig"
              className={`px-3 py-2 rounded ${
                location.pathname === "/create-gig"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Create Gig
            </Link>





            {/* {navItem("/gigs", "Open Gigs")}
            {navItem("/my-gigs", "My Gigs")}
            {navItem("/my-bids", "My Bids")}
            {navItem("/create-gig", "Create Gig")} */}
          </div>

          {/* RIGHT: User dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">
                {user.name}
              </span>
            </button>

            {open && (
              <div
                onMouseLeave={() => setOpen(false)}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                <button
                  onClick={() => dispatch(logoutUser())}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

