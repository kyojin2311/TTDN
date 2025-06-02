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
import { useState, useEffect } from "react";
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
import LabelSelector from "./LabelSelector";
import { TaskApi } from "@/api/TaskApi";
import { useForm, Controller } from "react-hook-form";
import TiptapToolbar from "./TiptapToolbar";
import useSWR from "swr";
import dayjs from "dayjs";

interface TodoSheetProps {
  status: string;
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  task?: any;
  mutate: any;
}

// Map giá trị status sang label
const statusLabels: Record<string, string> = {
  todo: "Todo",
  doing: "Doing",
  done: "Done",
};

export default function TodoSheet({
  status,
  children,
  open: controlledOpen,
  setOpen: controlledSetOpen,
  task,
  mutate,
}: TodoSheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen =
    controlledSetOpen !== undefined ? controlledSetOpen : setUncontrolledOpen;
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      deadline: task?.deadline || "",
      status: task?.status || status,
      labels: (task?.labels || []).map((l) => l._id),
    },
  });

  const isEdit = !!task;
  const { rem } = useThemeContext();

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
    immediatelyRender: false,
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
            return true;
          }
        }
        return false;
      },
    },
  });

  // Đồng bộ state khi task thay đổi
  useEffect(() => {
    if (task) {
      if (editor) {
        editor.commands.setContent(task.description || "");
      }
    } else {
      if (editor) {
        editor.commands.setContent("");
      }
    }
  }, [task, editor]);

  useEffect(() => {
    reset({
      title: task?.title || "",
      description: task?.description || "",
      deadline: task?.deadline || "",
      status: task?.status || status,
      labels: (task?.labels || []).map((l) =>
        typeof l === "string" ? l : l._id
      ),
    });
  }, [task, status, reset]);

  const onSubmit = async (data: any) => {
    const submitData = {
      ...data,
      deadline: data.deadline ? dayjs(data.deadline).format("MM/DD/YYYY") : "",
    };
    if (isEdit) {
      await TaskApi.updateTask(task._id, submitData);
    } else {
      await TaskApi.createTask(submitData);
    }
    if (mutate) mutate();
    if (setOpen) setOpen(false);
  };

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
          <SheetTitle className="text-2xl">
            {isEdit ? "Edit Task" : "Add Ticket"}
          </SheetTitle>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col justify-between overflow-y-auto"
        >
          <div className="flex-1 px-6 py-4 space-y-5">
            <div style={{ marginBottom: `calc(${rem} * 1.5)` }}>
              <Label htmlFor="title" style={{ marginBottom: "10px" }}>
                Title
              </Label>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => <Input {...field} className="w-full" />}
              />
              {typeof errors.title?.message === "string" && (
                <span className="text-red-500 text-xs">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div style={{ marginBottom: `calc(${rem} * 1.5)` }}>
              <Label htmlFor="deadline" style={{ marginBottom: "10px" }}>
                Deadline
              </Label>
              <Controller
                name="deadline"
                control={control}
                rules={{ required: "Deadline is required" }}
                render={({ field }) => {
                  let value = field.value;
                  if (value) {
                    value = dayjs(value).format("YYYY-MM-DD");
                  }
                  return (
                    <Input
                      type="date"
                      {...field}
                      value={value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      className="w-full"
                    />
                  );
                }}
              />
              {typeof errors.deadline?.message === "string" && (
                <span className="text-red-500 text-xs">
                  {errors.deadline.message}
                </span>
              )}
            </div>
            <div style={{ marginBottom: `calc(${rem} * 1.5)` }}>
              <Label htmlFor="status" style={{ marginBottom: "10px" }}>
                Status
              </Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {typeof errors.status?.message === "string" && (
                <span className="text-red-500 text-xs">
                  {errors.status.message}
                </span>
              )}
            </div>
            <div style={{ marginBottom: `calc(${rem} * 1.5)` }}>
              <Label style={{ marginBottom: "10px" }}>Labels</Label>
              <Controller
                name="labels"
                control={control}
                render={({ field }) => (
                  <LabelSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div style={{ marginBottom: `calc(${rem} * 1.5)` }}>
              <Label htmlFor="description" style={{ marginBottom: "10px" }}>
                Description
              </Label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <div className="border rounded min-h-[160px] bg-white focus-within:ring-2 focus-within:ring-blue-500">
                    <TiptapToolbar editor={editor} />
                    <div className="p-4">
                      <EditorContent
                        editor={editor}
                        className="tiptap"
                        onBlur={() =>
                          setValue("description", editor?.getHTML() || "")
                        }
                      />
                    </div>
                  </div>
                )}
              />
              {typeof errors.description?.message === "string" && (
                <span className="text-red-500 text-xs">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
          <div className="px-6 py-4 border-t bg-white flex justify-end gap-2 sticky bottom-0 z-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen && setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Update" : "Save"}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
