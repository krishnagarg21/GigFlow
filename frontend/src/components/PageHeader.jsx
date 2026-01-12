export default function PageHeader({
  title,
  action,
  search,
  onSearch,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      
      {/* LEFT: Title */}
      <h1 className="text-2xl font-semibold text-slate-900">
        {title}
      </h1>

      {/* RIGHT: Search + Action */}
      <div className="flex items-center gap-3">
        {onSearch && (
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-64 px-3 py-2 border rounded-md text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        )}

        {action}
      </div>
    </div>
  );
}
