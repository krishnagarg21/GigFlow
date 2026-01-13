import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../services/api";
import { getOwnerId } from "../utils/getOwnerId";

export default function GigDetail() {
  const { id } = useParams();
  const { user, isAuthChecked } = useSelector((state) => state.auth);

  const [gig, setGig] = useState(null);
  const [myBid, setMyBid] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidForm, setBidForm] = useState({ message: "", price: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthChecked) return;

    const loadData = async () => {
      try {
        const gigRes = await api.get(`/api/gigs/${id}`);
        setGig(gigRes.data);

        if (user && gigRes.data.ownerId === user.id) {
          const bidsRes = await api.get(`/api/bids/${id}`);
          setBids(bidsRes.data);
        } else if (user) {
          const myBidsRes = await api.get("/api/bids/my");
          const bid = myBidsRes.data.find((b) => b.gigId._id === id);
          setMyBid(bid || null);
        }
      } catch (err) {
        console.error("Failed to load gig", err);
      }
    };

    loadData();
  }, [id, user, isAuthChecked]);

  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       // ✅ SAME API CALL (DO NOT TOUCH)
  //       const gigRes = await api.get(`/api/gigs/${id}`);
  //       setGig(gigRes.data);

  //       // ✅ SAME OWNER-ONLY BIDS FETCH
  //       // OWNER: fetch all bids
  //       if (gigRes.data.ownerId === user.id) {
  //         const bidsRes = await api.get(`/api/bids/${id}`);
  //         setBids(bidsRes.data);
  //       }
  //       // FREELANCER: fetch my bid only
  //       else {
  //         const myBidsRes = await api.get("/api/bids/my");
  //         const bid = myBidsRes.data.find(
  //           (b) => b.gigId._id === id
  //         );
  //         setMyBid(bid || null);
  //       }
  //     } catch (err) {
  //       console.error("Failed to load gig", err);
  //     }
  //   };

  //   loadData();
  // }, [id]);

  const submitBid = async () => {
    setError("");
    try {
      await api.post("/api/bids", {
        gigId: id,
        message: bidForm.message,
        price: Number(bidForm.price),
      });

      setBidForm({ message: "", price: "" });
      alert("Bid placed successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bid");
    }
  };

  const hireBid = async (bidId) => {
    await api.patch(`/api/bids/${bidId}/hire`);
    const bidsRes = await api.get(`/api/bids/${id}`);
    setBids(bidsRes.data);
    alert("Freelancer hired");
  };

  if (!isAuthChecked) {
    return <p className="p-6">Loading...</p>;
  }

  if (!gig) {
    return <p className="p-6 text-gray-500">Loading...</p>;
  }

  // const isOwner = getOwnerId(gig.ownerId) === user.id;
  const isOwner = user && getOwnerId(gig.ownerId) === user.id;

  return (
    <div className="space-y-8">
      {/* GIG INFO */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-slate-900">{gig.title}</h1>

        <p className="text-gray-600 mt-2">{gig.description}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="font-semibold text-slate-800">₹{gig.budget}</span>

          <span
            className={`px-3 py-1 rounded text-xs font-semibold capitalize ${
              gig.status === "assigned"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {gig.status}
          </span>
        </div>
      </div>

      {/* BID FORM — NON OWNER */}
      {!isOwner && !myBid && (
        <div className="bg-white p-6 rounded-lg shadow max-w-md">
          <h2 className="text-lg font-semibold mb-4">Place a Bid</h2>

          <div className="space-y-3">
            <textarea
              className="border p-2 w-full rounded"
              placeholder="Message"
              value={bidForm.message}
              onChange={(e) =>
                setBidForm({
                  ...bidForm,
                  message: e.target.value,
                })
              }
            />

            <input
              className="border p-2 w-full rounded"
              placeholder="Price"
              value={bidForm.price}
              onChange={(e) =>
                setBidForm({
                  ...bidForm,
                  price: e.target.value,
                })
              }
            />

            <button
              onClick={submitBid}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Place Bid
            </button>

            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        </div>
      )}

      {!isOwner && myBid && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-md shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-slate-800">Your Bid</h2>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                myBid.status === "hired"
                  ? "bg-green-100 text-green-700"
                  : myBid.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {myBid.status}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Message
              </p>
              <p className="text-slate-700">{myBid.message}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Your Price
              </p>
              <p className="text-xl font-semibold text-slate-900">
                ₹{myBid.price}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BIDS LIST — OWNER ONLY */}
      {isOwner && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Bids</h2>

          {bids.length === 0 && <p className="text-gray-500">No bids yet</p>}

          {bids.map((bid) => (
            <div key={bid._id} className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{bid.freelancerId.name}</p>
                  <p className="text-sm text-gray-500">
                    {bid.freelancerId.email}
                  </p>
                </div>

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

              <p className="mt-3 text-gray-700">{bid.message}</p>

              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold">₹{bid.price}</span>

                {bid.status === "pending" && (
                  <button
                    onClick={() => hireBid(bid._id)}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Hire
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

