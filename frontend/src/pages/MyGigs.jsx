import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function MyGigs() {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    api.get("/gigs/my").then(res => setGigs(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">My Gigs</h1>
      {gigs.map(g => (
        <Link key={g._id} to={`/gigs/${g._id}`}>
          <div className="border p-3 my-2">
            {g.title}
          </div>
        </Link>
      ))}
    </div>
  );
}
