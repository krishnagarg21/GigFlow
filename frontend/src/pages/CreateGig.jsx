import { useState } from "react";
import { useDispatch } from "react-redux";
import { createGig } from "../redux/slices/gigSlice";
import { useNavigate } from "react-router-dom";

export default function CreateGig() {
  const [form, setForm] = useState({ title: "", description: "", budget: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await dispatch(createGig({ ...form, budget: Number(form.budget) }));
    navigate("/gigs");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 max-w-md mx-auto rounded shadow space-y-3">
        <h2 className="text-xl font-bold">Create Gig</h2>
        <input className="border p-2 w-full" placeholder="Title"
          onChange={(e)=>setForm({...form,title:e.target.value})} />
        <textarea className="border p-2 w-full" placeholder="Description"
          onChange={(e)=>setForm({...form,description:e.target.value})} />
        <input className="border p-2 w-full" placeholder="Budget"
          onChange={(e)=>setForm({...form,budget:e.target.value})} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
}
