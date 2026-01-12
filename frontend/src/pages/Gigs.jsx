import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGigs } from "../redux/slices/gigSlice";
import { logout } from "../redux/slices/authSlice";
import { Link } from "react-router-dom";

function Gigs() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.gigs);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchGigs());
  }, [dispatch]);

  const openGigs = list.filter(
    (g) => g.ownerId !== user?.id
  );


  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Open Gigs</h1>
        <Link to="/create-gig" className="bg-green-600 text-white px-4 py-2 rounded">
          Create Gig
        </Link>

        <button
          onClick={() => dispatch(logout())}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {loading && <p>Loading gigs...</p>}

      <div className="grid gap-4">
        {openGigs.map((gig) => (
          <Link to={`/gigs/${gig._id}`} className="block">
            <div
              key={gig._id}
              className="bg-white p-4 rounded shadow"
            >
              <h2 className="text-lg font-semibold">
                {gig.title}
              </h2>
              <p className="text-gray-600">
                {gig.description}
              </p>
              <p className="font-bold mt-2">
                ₹{gig.budget}
              </p>
            </div>
          </Link>
        ))}

        {!loading && list.length === 0 && (
          <p>No gigs available</p>
        )}
      </div>
    </div>
  );
}

export default Gigs;
