import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

import PageHeader from "../components/PageHeader";
import GigCard from "../components/GigCard";
import { useSelector } from "react-redux";

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const { isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthChecked) return;

    api
      .get("/api/bids/my", { withCredentials: true })
      .then((res) => setBids(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isAuthChecked]);

  if (!isAuthChecked) {
    return <p className="p-6">Loading...</p>;
  }

  // Apply search on gig title
  const filteredBids = bids.filter((bid) =>
    bid.gigId.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader title="My Bids" search={search} onSearch={setSearch} />

      {loading && <p className="text-gray-500">Loading your bids...</p>}

      {!loading && filteredBids.length === 0 && (
        <p className="text-gray-500">You haven’t placed any bids yet</p>
      )}

      <div className="grid gap-4">
        {filteredBids.map((bid) => (
          <Link key={bid._id} to={`/gigs/${bid.gigId._id}`} className="block">
            <GigCard
              gig={bid.gigId}
              footer={
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">₹{bid.price}</span>

                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                      bid.status === "hired"
                        ? "bg-green-100 text-green-700"
                        : bid.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {bid.status}
                  </span>
                </div>
              }
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
