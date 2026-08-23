export default function AdminLoading() {
  return (
    <div className="grid gap-4">
      <div className="h-8 w-48 animate-pulse rounded-[8px] bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-[8px] border border-slate-200 bg-white" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-[8px] border border-slate-200 bg-white" />
    </div>
  );
}
