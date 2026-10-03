export default function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-zinc-500">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-zinc-400" aria-hidden />}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-zinc-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
