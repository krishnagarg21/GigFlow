export default function GigCard({ gig, footer }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition">
      <h2 className="text-lg font-semibold text-slate-900">
        {gig.title}
      </h2>

      <p className="text-gray-600 mt-1 line-clamp-2">
        {gig.description}
      </p>

      <div className="flex items-center justify-between mt-4">
        <span className="font-semibold text-slate-800">
          ₹{gig.budget}
        </span>

        {footer}
      </div>
    </div>
  );
}
