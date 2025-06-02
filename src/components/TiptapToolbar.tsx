import { Editor } from "@tiptap/react";
import { Bold, Italic, Underline, List, ListOrdered, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TiptapToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  return (
    <div className="flex items-center gap-1 border-b px-1 py-0.5 bg-gray-50 rounded-t">
      <Button
        type="button"
        size="sm"
        className="w-7 h-7 p-0"
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <Bold className="w-2.5 h-2.5" />
      </Button>
      <Button
        type="button"
        size="sm"
        className="w-7 h-7 p-0"
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <Italic className="w-2.5 h-2.5" />
      </Button>
      <Button
        type="button"
        size="sm"
        className="w-7 h-7 p-0"
        variant={editor.isActive("underline") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        <Underline className="w-2.5 h-2.5" />
      </Button>
      <Button
        type="button"
        size="sm"
        className="w-7 h-7 p-0"
        variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        <List className="w-2.5 h-2.5" />
      </Button>
      <Button
        type="button"
        size="sm"
        className="w-7 h-7 p-0"
        variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Ordered List"
      >
        <ListOrdered className="w-2.5 h-2.5" />
      </Button>
      <Button
        type="button"
        size="sm"
        className="w-7 h-7 p-0"
        variant={editor.isActive("link") ? "secondary" : "ghost"}
        onClick={() => {
          const url = window.prompt("Enter link");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        title="Link"
      >
        <Link className="w-2.5 h-2.5" />
      </Button>
    </div>
  );
}
