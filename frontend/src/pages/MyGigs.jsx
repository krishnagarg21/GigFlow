import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

import PageHeader from "../components/PageHeader";
import GigCard from "../components/GigCard";
import { useSelector } from "react-redux";

export default function MyGigs() {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthChecked) return;

    api
      .get("/api/gigs/my", { withCredentials: true })
      .then((res) => setGigs(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isAuthChecked]);

  if (!isAuthChecked) {
    return <p className="p-6">Loading...</p>;
  }

  // Apply search
  const filteredGigs = gigs.filter((gig) =>
    gig.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader title="My Gigs" search={search} onSearch={setSearch} />

      {loading && <p className="text-gray-500">Loading your gigs...</p>}

      {!loading && filteredGigs.length === 0 && (
        <p className="text-gray-500">You haven’t created any gigs yet</p>
      )}

      <div className="grid gap-4">
        {filteredGigs.map((gig) => (
          <Link key={gig._id} to={`/gigs/${gig._id}`} className="block">
            <GigCard
              gig={gig}
              footer={
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                    gig.status === "assigned"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {gig.status}
                </span>
              }
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
