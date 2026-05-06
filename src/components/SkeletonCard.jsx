export default function SkeletonCard() {
  return (
    <div className="bg-[#EAE5D9] border overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-[#D4CFC3]" />
      <div className="p-6 space-y-3">
        <div className="h-3 bg-[#D4CFC3] rounded w-1/3" />
        <div className="h-5 bg-[#D4CFC3] rounded w-3/4" />
        <div className="h-3 bg-[#D4CFC3] rounded w-full" />
        <div className="h-3 bg-[#D4CFC3] rounded w-5/6" />
        <div className="h-3 bg-[#D4CFC3] rounded w-2/3" />
      </div>
    </div>
  );
}
