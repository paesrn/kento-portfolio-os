type DecisionBlockProps = {
  title: string;
  items: string[];
  color: string;
};

export default function DecisionBlock({
  title,
  items,
  color,
}: DecisionBlockProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black p-5">
      <h3 className={`font-semibold ${color}`}>{title}</h3>

      <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
