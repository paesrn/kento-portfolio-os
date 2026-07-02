type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function InputField({
  label,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <label className="block">
      <span className="text-sm text-zinc-400">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-green-500"
      />
    </label>
  );
}
