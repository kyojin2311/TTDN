import { useLabelContext } from "@/lib/context/LabelContext";
import { useEffect, useState } from "react";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

export default function LabelFilterSelector({
  value,
  onChange,
}: {
  value?: string[];
  onChange?: (ids: string[]) => void;
}) {
  const { labels } = useLabelContext();
  const [selected, setSelected] = useState<string[]>(value || []);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      value &&
      (value.length !== selected.length ||
        value.some((v, i) => v !== selected[i]))
    ) {
      setSelected(value);
    }
  }, [value]);

  useEffect(() => {
    if (onChange) onChange(selected);
  }, [selected]);

  function handleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  return (
    <Select.Root open={open} onOpenChange={setOpen} value={""}>
      <Select.Trigger className="w-full flex gap-2 flex-wrap min-h-[38px] border rounded px-2 py-1 bg-white">
        {selected.length === 0 && (
          <span className="text-muted-foreground">Select labels...</span>
        )}
        {selected.map((id) => {
          const l = labels.find((l) => l._id === id);
          if (!l) return null;
          return (
            <span
              key={id}
              className="flex items-center px-2 py-1 rounded text-xs font-medium mr-1"
              style={{ background: l.color, color: "#fff" }}
            >
              {l.name}
            </span>
          );
        })}
        <ChevronDownIcon className="ml-auto w-4 h-4 text-muted-foreground" />
      </Select.Trigger>
      <Select.Content className="bg-white rounded shadow-md z-50 min-w-[200px]">
        <Select.Viewport className="p-2">
          {labels.map((label) => (
            <div
              key={label._id}
              className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer hover:bg-accent/20 select-none ${
                selected.includes(label._id!) ? "bg-accent/10" : ""
              }`}
              onClick={() => handleSelect(label._id!)}
              tabIndex={0}
              role="option"
              aria-selected={selected.includes(label._id!)}
            >
              <span
                className="w-4 h-4 rounded"
                style={{ background: label.color, display: "inline-block" }}
              ></span>
              <span
                className="flex-1 text-sm font-medium"
                style={{ color: label.color }}
              >
                {label.name}
              </span>
              {selected.includes(label._id!) && (
                <CheckIcon className="w-4 h-4 text-green-600 ml-auto" />
              )}
            </div>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Root>
  );
}
