import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil } from "lucide-react";

const DEFAULT_COLORS = [
  "#4ade80", // green
  "#facc15", // yellow
  "#f87171", // red
  "#fb7185", // pink
  "#a78bfa", // purple
  "#60a5fa", // blue
];

function randomColor() {
  return DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
}

export default function LabelSelector() {
  const [labels, setLabels] = useState([
    { id: 1, name: "Resources & Docs", color: "#60a5fa" },
    { id: 2, name: "Bug", color: "#f87171" },
    { id: 3, name: "Feature", color: "#4ade80" },
    { id: 4, name: "Improvement", color: "#facc15" },
  ]);
  const [selected, setSelected] = useState([1]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [newLabel, setNewLabel] = useState({ name: "", color: randomColor() });

  const filtered = labels.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleToggle(id: number) {
    setSelected((sel) =>
      sel.includes(id) ? sel.filter((i) => i !== id) : [...sel, id]
    );
  }
  function handleCreate() {
    if (!newLabel.name.trim()) return;
    const id = Date.now();
    setLabels((labs) => [...labs, { id, ...newLabel }]);
    setSelected((sel) => [...sel, id]);
    setNewLabel({ name: "", color: randomColor() });
    setShowCreate(false);
  }
  function handleEdit() {
    setLabels((labs) =>
      labs.map((l) => (l.id === editId ? { ...l, ...newLabel } : l))
    );
    setEditId(null);
    setNewLabel({ name: "", color: randomColor() });
    setShowCreate(false);
  }
  function handleDelete(id: number) {
    setLabels((labs) => labs.filter((l) => l.id !== id));
    setSelected((sel) => sel.filter((i) => i !== id));
  }
  function openEdit(label: { id: number; name: string; color: string }) {
    setEditId(label.id);
    setNewLabel({ name: label.name, color: label.color });
    setShowCreate(true);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex gap-2 flex-wrap min-h-[38px]"
        >
          {selected.length === 0 && <span>Select labels...</span>}
          {selected.map((id) => {
            const l = labels.find((l) => l.id === id);
            if (!l) return null;
            return (
              <span
                key={id}
                className="flex items-center px-2 py-1 rounded text-xs font-medium"
                style={{ background: l.color, color: "#fff", marginRight: 4 }}
              >
                {l.name}
              </span>
            );
          })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0">
        <div className="p-4 border-b flex items-center justify-between">
          <span className="font-semibold text-lg">Labels</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCreate(false)}
          >
            ×
          </Button>
        </div>
        {!showCreate ? (
          <>
            <div className="p-4 pt-2">
              <Input
                placeholder="Search labels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-2"
              />
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filtered.map((label) => (
                  <div
                    key={label.id}
                    className="flex items-center gap-2 py-1 px-1 rounded hover:bg-accent/20 group"
                  >
                    <Checkbox
                      checked={selected.includes(label.id)}
                      onCheckedChange={() => handleToggle(label.id)}
                    />
                    <span
                      className="w-6 h-6 rounded"
                      style={{ background: label.color }}
                    ></span>
                    <span className="flex-1 text-sm font-medium">
                      {label.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(label)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(label.id)}
                      className="text-red-500"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-sm text-gray-400 px-2 py-4">
                    No labels found.
                  </div>
                )}
              </div>
              <Button
                className="w-full mt-3"
                variant="outline"
                onClick={() => {
                  setShowCreate(true);
                  setEditId(null);
                  setNewLabel({ name: "", color: randomColor() });
                }}
              >
                Create a new label
              </Button>
              <Button className="w-full mt-2" variant="secondary" disabled>
                Enable colorblind friendly mode
              </Button>
            </div>
          </>
        ) : (
          <div className="p-4 space-y-3">
            <Label>{editId ? "Edit label" : "Create label"}</Label>
            <Input
              placeholder="Label name"
              value={newLabel.name}
              onChange={(e) =>
                setNewLabel((l) => ({ ...l, name: e.target.value }))
              }
            />
            <div className="flex gap-2 items-center">
              {DEFAULT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-7 h-7 rounded-full border-2 ${
                    newLabel.color === c ? "border-black" : "border-transparent"
                  }`}
                  style={{ background: c }}
                  onClick={() => setNewLabel((l) => ({ ...l, color: c }))}
                />
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreate(false);
                  setEditId(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={editId ? handleEdit : handleCreate}>
                {editId ? "Save" : "Create"}
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
