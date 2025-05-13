import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/lib/context/ThemeContext";
import { Settings2 } from "lucide-react";
import { useState } from "react";

export default function ThemeSettingsModal() {
  const {
    theme,
    setTheme,
    font,
    setFont,
    fonts,
    themes,
    primaryColor,
    setPrimaryColor,
    primaryColors,
    borderRadius,
    setBorderRadius,
    borderRadiuses,
  } = useThemeContext();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Theme & Font Settings"
        >
          <Settings2 className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs w-full">
        <DialogHeader>
          <DialogTitle>Tuỳ chỉnh giao diện</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <div className="mb-1 font-medium text-sm">Theme</div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="mb-1 font-medium text-sm">Font</div>
            <Select value={font} onValueChange={setFont}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="mb-1 font-medium text-sm flex items-center gap-2">
              Màu chủ đạo
              <span
                className="w-4 h-4 rounded-full border ml-2"
                style={{ background: primaryColor }}
              ></span>
            </div>
            <Select value={primaryColor} onValueChange={setPrimaryColor}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {primaryColors.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{ background: c.value }}
                      ></span>
                      {c.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="mb-1 font-medium text-sm">
              Bo góc (Border Radius)
            </div>
            <Select value={borderRadius} onValueChange={setBorderRadius}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {borderRadiuses.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
