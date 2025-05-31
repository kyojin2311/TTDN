import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import { useThemeContext } from "@/lib/context/ThemeContext";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import LabelSelector from "./LabelSelector";

interface TodoSheetProps {
  status: string;
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const statusOptions = [
  { value: "DOING", label: "Doing" },
  { value: "DEMO", label: "Demo" },
  { value: "WAITING_REVIEW", label: "Waiting Review" },
  { value: "NEED_FIXED", label: "Need Fixed" },
];

export default function TodoSheet({
  status,
  children,
  open: controlledOpen,
  setOpen: controlledSetOpen,
}: TodoSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen =
    controlledSetOpen !== undefined ? controlledSetOpen : setUncontrolledOpen;
  const [deadline, setDeadline] = useState("");
  const [currentStatus, setCurrentStatus] = useState(status);
  const { rem } = useThemeContext();

  // Popover state for link editing
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editorContentRef = useRef<HTMLDivElement>(null);
  const linkButtonRef = useRef<HTMLButtonElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Bold,
      Italic,
      BulletList,
      OrderedList,
      ListItem,
      Placeholder.configure({ placeholder: "Write something..." }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "min-h-[160px] outline-none focus:outline-none bg-transparent",
        style: "resize: none; box-shadow: none; border: none;",
      },
      handleKeyDown(view, event) {
        if (event.ctrlKey || event.metaKey) {
          if (event.key === "b") {
            editor?.chain().focus().toggleBold().run();
            event.preventDefault();
            return true;
          }
          if (event.key === "k") {
            openLinkPopover();
            event.preventDefault();
            return true;
          }
        }
        return false;
      },
    },
  });

  // Popover logic
  const openLinkPopover = useCallback(() => {
    if (!editor) return;
    setLinkUrl(editor.getAttributes("link").href || "");
    setLinkPopoverOpen(true);
  }, [editor]);

  const handleApplyLink = () => {
    if (editor && linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setLinkPopoverOpen(false);
  };
  const handleRemoveLink = () => {
    if (editor) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setLinkPopoverOpen(false);
  };

  // Toolbar actions for Tiptap
  const toolbarActions = [
    {
      icon: <b>B</b>,
      action: () => editor?.chain().focus().toggleBold().run(),
      isActive: editor?.isActive("bold"),
      label: "Bold (Ctrl+B)",
    },
    {
      icon: <i>I</i>,
      action: () => editor?.chain().focus().toggleItalic().run(),
      isActive: editor?.isActive("italic"),
      label: "Italic (Ctrl+I)",
    },
    {
      icon: <u>U</u>,
      action: () => editor?.chain().focus().toggleUnderline().run(),
      isActive: editor?.isActive("underline"),
      label: "Underline (Ctrl+U)",
    },
    {
      icon: <span style={{ fontWeight: 600 }}>A</span>,
      action: () => editor?.chain().focus().unsetAllMarks().run(),
      isActive: false,
      label: "Clear Formatting",
    },
    {
      icon: <span style={{ fontWeight: 600 }}>•</span>,
      action: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: editor?.isActive("bulletList"),
      label: "Bullet List",
    },
    {
      icon: <span style={{ fontWeight: 600 }}>1.</span>,
      action: () => editor?.chain().focus().toggleOrderedList().run(),
      isActive: editor?.isActive("orderedList"),
      label: "Ordered List",
    },
    {
      icon: <span style={{ fontWeight: 600 }}>↔</span>,
      action: openLinkPopover,
      isActive: editor?.isActive("link"),
      label: "Link (Ctrl+K)",
      ref: linkButtonRef,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" className="w-full">
            + Add Ticket
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="right"
        className="!w-[650px] !max-w-none flex flex-col p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-2 border-b">
          <SheetTitle className="text-2xl">Add Ticket</SheetTitle>
        </SheetHeader>
        <form className="flex-1 flex flex-col justify-between overflow-y-auto">
          <div className="flex-1 px-6 py-4 space-y-5">
            <div style={{ marginBottom: `calc(${rem} * 1.5)` }}>
              <Label
                htmlFor="status"
                style={{ marginBottom: `calc(${rem} * 0.5)` }}
              >
                Status
              </Label>
              <Select value={currentStatus} onValueChange={setCurrentStatus}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div style={{ marginBottom: `calc(${rem} * 1.5)` }}>
              <Label
                htmlFor="deadline"
                style={{ marginBottom: `calc(${rem} * 0.5)` }}
              >
                Deadline Final
              </Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full"
              />
            </div>
            <div style={{ marginBottom: `calc(${rem} * 1.5)` }}>
              <Label style={{ marginBottom: `calc(${rem} * 0.5)` }}>
                Labels
              </Label>
              <LabelSelector />
            </div>
            <div style={{ marginBottom: `calc(${rem} * 1.5)` }}>
              <Label style={{ marginBottom: `calc(${rem} * 0.5)` }}>
                Description
              </Label>
              <div className="border rounded min-h-[320px] bg-white focus-within:ring-2 focus-within:ring-blue-500 relative">
                {/* Toolbar */}
                <div className="flex items-center gap-2 border-b px-4 py-2 bg-gray-50 rounded-t">
                  {toolbarActions.map((item, idx) => (
                    <Button
                      key={idx}
                      type="button"
                      ref={
                        item.label === "Link (Ctrl+K)"
                          ? linkButtonRef
                          : undefined
                      }
                      variant={item.isActive ? "secondary" : "ghost"}
                      size="icon"
                      className={`${
                        item.isActive ? "text-primary" : "text-muted-foreground"
                      } size-5`}
                      onClick={item.action}
                      title={item.label}
                      tabIndex={-1}
                    >
                      {item.icon}
                    </Button>
                  ))}
                  {/* Popover for link editing */}
                  <Popover
                    open={linkPopoverOpen}
                    onOpenChange={setLinkPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <span ref={linkButtonRef} />
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-4" align="start">
                      <Input
                        type="text"
                        placeholder="Paste or type a link"
                        value={linkUrl}
                        autoFocus
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleApplyLink();
                          if (e.key === "Escape") setLinkPopoverOpen(false);
                        }}
                        className="mb-2"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          type="button"
                          size="sm"
                          variant="link"
                          onClick={handleApplyLink}
                        >
                          Apply
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="link"
                          className="text-red-500 hover:text-red-600"
                          onClick={handleRemoveLink}
                        >
                          Remove
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="p-5 min-h-[240px]" ref={editorContentRef}>
                  {editor && (
                    <EditorContent editor={editor} className="tiptap" />
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <span className="mr-2">Ctrl+B: Bold</span>
                <span className="mr-2">Ctrl+K: Link</span>
                <span>Ctrl+I: Italic</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t bg-white flex justify-end gap-2 sticky bottom-0 z-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
