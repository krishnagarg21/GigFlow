import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function MyBids() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    api.get("/bids/my").then(res => setBids(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Bids</h1>

      {bids.length === 0 && <p>No bids yet</p>}

      {bids.map(b => (
        <div key={b._id} className="border p-4 mb-3 rounded">
          <h2 className="font-semibold">{b.gigId.title}</h2>
          <p>{b.gigId.description}</p>
          <p>Budget: ₹{b.gigId.budget}</p>

          <p className="mt-2">
            <strong>Your Price:</strong> ₹{b.price}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={
                b.status === "hired"
                  ? "text-green-600"
                  : b.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }
            >
              {b.status}
            </span>
          </p>

          <Link
            to={`/gigs/${b.gigId._id}`}
            className="text-blue-600 underline"
          >
            View Gig
          </Link>
        </div>
      ))}
    </div>
  );
}
