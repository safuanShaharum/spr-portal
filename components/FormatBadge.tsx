import { FORMAT_COLORS } from "@/lib/constants";

interface FormatBadgeProps {
  format: string;
  size?: "sm" | "md";
}

export default function FormatBadge({ format, size = "sm" }: FormatBadgeProps) {
  const color = FORMAT_COLORS[format.toUpperCase()] || "#8A8AA0";
  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider ${
        size === "sm"
          ? "px-2.5 py-1 rounded-md text-[11px]"
          : "px-3 py-1.5 rounded-lg text-xs"
      }`}
      style={{ backgroundColor: color + "15", color }}
    >
      {format}
    </span>
  );
}
