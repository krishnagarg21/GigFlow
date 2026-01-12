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
        // ✅ Fetch SINGLE gig (works for open + assigned)
        const gigRes = await api.get(`/gigs/${id}`);
        setGig(gigRes.data);

        // ✅ Fetch bids (only works for owner, 403 for others)
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

    // ❌ DO NOT fetch /bids/:id here (owner-only)
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

  if (!gig) return <p className="p-6">Loading...</p>;

  const isOwner = gig.ownerId === user.id;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{gig.title}</h1>
      <p>{gig.description}</p>
      <p className="font-bold">₹{gig.budget}</p>

      {/* BID FORM — ONLY NON-OWNER */}
      {!isOwner && (
        <div className="max-w-md space-y-2">
          <h2 className="font-semibold">Place a Bid</h2>

          <input
            className="border p-2 w-full"
            placeholder="Message"
            value={bidForm.message}
            onChange={(e) =>
              setBidForm({ ...bidForm, message: e.target.value })
            }
          />

          <input
            className="border p-2 w-full"
            placeholder="Price"
            value={bidForm.price}
            onChange={(e) =>
              setBidForm({ ...bidForm, price: e.target.value })
            }
          />

          <button
            onClick={submitBid}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Place Bid
          </button>

          {error && <p className="text-red-600">{error}</p>}
        </div>
      )}

      {/* BIDS LIST — ONLY OWNER */}
      {isOwner && (
        <div>
          <h2 className="text-xl font-bold">Bids</h2>

          {bids.length === 0 && <p>No bids yet</p>}

          {bids.map((bid) => (
            <div
              key={bid._id}
              className="border p-3 rounded my-2"
            >
              <p>
                <strong>Bidder:</strong>{" "}
                {bid.freelancerId.name} (
                {bid.freelancerId.email})
              </p>
              <p>
                <strong>Message:</strong> {bid.message}
              </p>
              <p>
                <strong>Price:</strong> ₹{bid.price}
              </p>
              <p>
                <strong>Status:</strong> {bid.status}
              </p>

              {bid.status === "pending" && (
                <button
                  onClick={() => hireBid(bid._id)}
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                >
                  Hire
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../services/api";
// import { useSelector } from "react-redux";

// export default function GigDetail() {
//   const { id } = useParams();
//   const { user } = useSelector((state) => state.auth);

//   const [gig, setGig] = useState(null);
//   const [bids, setBids] = useState([]);
//   const [bidForm, setBidForm] = useState({ message: "", price: "" });
//   const [error, setError] = useState("");


//   const fetchBids = async () => {
//     try {
//       const res = await api.get(`/bids/${id}`);
//       setBids(res.data);
//     } catch {
//       // non-owner will get 403 → ignore
//     }
//   };

//   useEffect(() => {
//     let isMounted = true;

//     const loadData = async () => {
//         try {
//         const gigRes = await api.get(`/gigs/${id}`);
//         setGig(gigRes.data);

//         if (isMounted) setGig(foundGig);

//         try {
//             const bidsRes = await api.get(`/bids/${id}`);
//             if (isMounted) setBids(bidsRes.data);
//         } catch {
//             // non-owner → ignore 403
//         }
//         } catch (err) {
//         console.error("Failed to load gig", err);
//         }
//     };

//     loadData();

//     return () => {
//         isMounted = false;
//     };
//     }, [id]);


//   const submitBid = async () => {
//     setError("");
//     try {
//       await api.post("/bids", {
//         gigId: id,
//         message: bidForm.message,
//         price: Number(bidForm.price),
//       });
//       setBidForm({ message: "", price: "" });
//       fetchBids();
//       alert("Bid placed successfully");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to place bid");
//     }
//   };

//   const hireBid = async (bidId) => {
//     await api.patch(`/bids/${bidId}/hire`);
//     fetchBids();
//     alert("Freelancer hired");
//   };

//   if (!gig) return <p className="p-6">Loading...</p>;

//   const isOwner = gig.ownerId === user.id;

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">{gig.title}</h1>
//       <p><strong>Bidder:</strong> {b.freelancerId.name}</p>
//       <p><strong>Email:</strong> {b.freelancerId.email}</p>
//       <p><strong>Message:</strong> {b.message}</p>
//       <p><strong>Price:</strong> ₹{b.price}</p>
//       <p><strong>Status:</strong> {b.status}</p>


//       {/* BID FORM (ONLY NON-OWNER) */}
//       {!isOwner && (
//         <div className="space-y-2 max-w-md">
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

//       {/* BIDS LIST (ONLY OWNER) */}
//       {isOwner && (
//         <div>
//           <h2 className="font-bold text-xl">Bids</h2>

//           {bids.length === 0 && <p>No bids yet</p>}

//           {bids.map((b) => (
//             <div
//               key={b._id}
//               className="border p-3 my-2 rounded"
//             >
//               <p>
//                 <strong>Message:</strong> {b.message}
//               </p>
//               <p>
//                 <strong>Price:</strong> ₹{b.price}
//               </p>
//               <p>
//                 <strong>Status:</strong> {b.status}
//               </p>

//               {b.status === "pending" && (
//                 <button
//                   onClick={() => hireBid(b._id)}
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
