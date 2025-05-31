import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, Filter } from "lucide-react";

interface TicketFilterPopoverProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  createdAtRange: { from: string; to: string };
  setCreatedAtRange: (range: { from: string; to: string }) => void;
}

export default function TicketFilterPopover({
  open,
  setOpen,
  createdAtRange,
  setCreatedAtRange,
}: TicketFilterPopoverProps) {
  const isActive = !!createdAtRange.from || !!createdAtRange.to;
  const filterCount =
    [createdAtRange.from, createdAtRange.to].filter(Boolean).length > 0 ? 1 : 0;

  function handleReset() {
    setCreatedAtRange({ from: "", to: "" });
    setOpen(false);
  }

  function handleRemove() {
    setCreatedAtRange({ from: "", to: "" });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isActive ? "secondary" : "outline"}
          className="flex items-center gap-2 relative"
        >
          <Filter className="w-4 h-4" />
          <span>Filter</span>
          {filterCount > 0 && (
            <span className="ml-1 bg-blue-500 text-white rounded-full px-1.5 text-xs font-bold absolute -top-2 -right-2">
              {filterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-semibold text-base">Filter</span>
          <Button
            variant="link"
            size="sm"
            onClick={handleReset}
            className="text-blue-600"
          >
            Reset
          </Button>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium w-28">Created at</span>
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              value={createdAtRange.from}
              onChange={(e) =>
                setCreatedAtRange({ ...createdAtRange, from: e.target.value })
              }
              className="w-44"
            />
            <span className="mx-2 text-muted-foreground">-</span>
            <Input
              type="date"
              value={createdAtRange.to}
              onChange={(e) =>
                setCreatedAtRange({ ...createdAtRange, to: e.target.value })
              }
              className="w-44"
            />
            {isActive && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="ml-2"
              >
                ×
              </Button>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => setOpen(false)}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
