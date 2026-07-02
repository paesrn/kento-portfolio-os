type ResultCardProps = {
  label: string;
  value: string;
  color: string;
};

export default function ResultCard({
  label,
  value,
  color,
}: ResultCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}