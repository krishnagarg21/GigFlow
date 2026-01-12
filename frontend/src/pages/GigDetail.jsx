import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../services/api";

export default function GigDetail() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidForm, setBidForm] = useState({ message: "", price: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // ✅ SAME API CALL (DO NOT TOUCH)
        const gigRes = await api.get(`/gigs/${id}`);
        setGig(gigRes.data);

        // ✅ SAME OWNER-ONLY BIDS FETCH
        try {
          const bidsRes = await api.get(`/bids/${id}`);
          setBids(bidsRes.data);
        } catch {
          // ignore for non-owner
        }
      } catch (err) {
        console.error("Failed to load gig", err);
      }
    };

    loadData();
  }, [id]);

  const submitBid = async () => {
    setError("");
    try {
      await api.post("/bids", {
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
    await api.patch(`/bids/${bidId}/hire`);
    const bidsRes = await api.get(`/bids/${id}`);
    setBids(bidsRes.data);
    alert("Freelancer hired");
  };

  if (!gig) {
    return <p className="p-6 text-gray-500">Loading...</p>;
  }

  const isOwner = gig.ownerId === user.id;
  const myBid = bids.find(
    (b) => b.freelancerId._id === user.id
  );

  return (
    <div className="space-y-8">
      {/* GIG INFO */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-slate-900">
          {gig.title}
        </h1>

        <p className="text-gray-600 mt-2">
          {gig.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="font-semibold text-slate-800">
            ₹{gig.budget}
          </span>

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
          <h2 className="text-lg font-semibold mb-4">
            Place a Bid
          </h2>

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

            {error && (
              <p className="text-red-600 text-sm">
                {error}
              </p>
            )}
          </div>
        </div>
      )}

      {!isOwner && myBid && (
        <div className="border p-4 rounded mt-4 max-w-md">
          <h2 className="font-semibold mb-1">Your Bid</h2>

          <p>
            <strong>Message:</strong> {myBid.message}
          </p>

          <p className="mt-1">
            <strong>Price:</strong> ₹{myBid.price}
          </p>

          <p className="mt-2 text-sm">
            <strong>Status:</strong>{" "}
            <span className="capitalize font-semibold">
              {myBid.status}
            </span>
          </p>
        </div>
      )}

      {/* BIDS LIST — OWNER ONLY */}
      {isOwner && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Bids
          </h2>

          {bids.length === 0 && (
            <p className="text-gray-500">
              No bids yet
            </p>
          )}

          {bids.map((bid) => (
            <div
              key={bid._id}
              className="bg-white p-5 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    {bid.freelancerId.name}
                  </p>
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

              <p className="mt-3 text-gray-700">
                {bid.message}
              </p>

              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold">
                  ₹{bid.price}
                </span>

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


// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import api from "../services/api";

// export default function GigDetail() {
//   const { id } = useParams();
//   const { user } = useSelector((state) => state.auth);

//   const [gig, setGig] = useState(null);
//   const [bids, setBids] = useState([]);
//   const [bidForm, setBidForm] = useState({ message: "", price: "" });
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // ✅ Fetch SINGLE gig (works for open + assigned)
//         const gigRes = await api.get(`/gigs/${id}`);
//         setGig(gigRes.data);

//         // ✅ Fetch bids (only works for owner, 403 for others)
//         try {
//           const bidsRes = await api.get(`/bids/${id}`);
//           setBids(bidsRes.data);
//         } catch {
//           // ignore for non-owner
//         }
//       } catch (err) {
//         console.error("Failed to load gig", err);
//       }
//     };

//     loadData();
//   }, [id]);

// const submitBid = async () => {
//   setError("");
//   try {
//     await api.post("/bids", {
//       gigId: id,
//       message: bidForm.message,
//       price: Number(bidForm.price),
//     });

//     setBidForm({ message: "", price: "" });
//     alert("Bid placed successfully");

//     // ❌ DO NOT fetch /bids/:id here (owner-only)
//   } catch (err) {
//     setError(err.response?.data?.message || "Failed to place bid");
//   }
// };


//   const hireBid = async (bidId) => {
//     await api.patch(`/bids/${bidId}/hire`);
//     const bidsRes = await api.get(`/bids/${id}`);
//     setBids(bidsRes.data);
//     alert("Freelancer hired");
//   };

//   if (!gig) return <p className="p-6">Loading...</p>;

//   const isOwner = gig.ownerId === user.id;

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">{gig.title}</h1>
//       <p>{gig.description}</p>
//       <p className="font-bold">₹{gig.budget}</p>

//       {/* BID FORM — ONLY NON-OWNER */}
//       {!isOwner && (
//         <div className="max-w-md space-y-2">
//           <h2 className="font-semibold">Place a Bid</h2>

//           <input
//             className="border p-2 w-full"
//             placeholder="Message"
//             value={bidForm.message}
//             onChange={(e) =>
//               setBidForm({ ...bidForm, message: e.target.value })
//             }
//           />

//           <input
//             className="border p-2 w-full"
//             placeholder="Price"
//             value={bidForm.price}
//             onChange={(e) =>
//               setBidForm({ ...bidForm, price: e.target.value })
//             }
//           />

//           <button
//             onClick={submitBid}
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Place Bid
//           </button>

//           {error && <p className="text-red-600">{error}</p>}
//         </div>
//       )}

//       {/* BIDS LIST — ONLY OWNER */}
//       {isOwner && (
//         <div>
//           <h2 className="text-xl font-bold">Bids</h2>

//           {bids.length === 0 && <p>No bids yet</p>}

//           {bids.map((bid) => (
//             <div
//               key={bid._id}
//               className="border p-3 rounded my-2"
//             >
//               <p>
//                 <strong>Bidder:</strong>{" "}
//                 {bid.freelancerId.name} (
//                 {bid.freelancerId.email})
//               </p>
//               <p>
//                 <strong>Message:</strong> {bid.message}
//               </p>
//               <p>
//                 <strong>Price:</strong> ₹{bid.price}
//               </p>
//               <p>
//                 <strong>Status:</strong> {bid.status}
//               </p>

//               {bid.status === "pending" && (
//                 <button
//                   onClick={() => hireBid(bid._id)}
//                   className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
//                 >
//                   Hire
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
