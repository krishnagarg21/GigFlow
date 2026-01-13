import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGigs } from "../redux/slices/gigSlice";
import { Link } from "react-router-dom";
import GigCard from "../components/GigCard";
import PageHeader from "../components/PageHeader";
import { getOwnerId } from "../utils/getOwnerId";

function Gigs() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const { list, loading } = useSelector((state) => state.gigs);
  const { user, isAuthChecked  } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchGigs());
  }, [dispatch]);

  if (!isAuthChecked) {
    return <p className="p-6">Loading...</p>;
  }

  // 1️⃣ Only gigs NOT created by current user
  const openGigs = user
  ? list.filter((g) => getOwnerId(g.ownerId) !== user.id)
  : [];


  // 2️⃣ Apply search on open gigs
  const filteredGigs = openGigs.filter((gig) =>
    gig.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Open Gigs"
        search={search}
        onSearch={setSearch}
      />

      {loading && <p className="text-gray-500">Loading gigs...</p>}

      <div className="grid gap-4">
        {!loading && filteredGigs.length === 0 && (
          <p className="text-gray-500">No gigs found</p>
        )}

        {filteredGigs.map((gig) => (
          <Link
            key={gig._id}
            to={`/gigs/${gig._id}`}
            className="block"
          >
            <GigCard gig={gig} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Gigs;
