import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Todo, TodoStatus } from "@/types/todo";
import { Card } from "@/components/ui/card";
import TodoSheet from "@/components/TodoSheet";
import { Plus, Clock } from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";

interface TodoColumnProps {
  id: TodoStatus;
  title: string;
  todos: Todo[];
  mutate: any;
}

export default function TodoColumn({
  id,
  title,
  todos,
  mutate,
}: TodoColumnProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);

  const handleEditTask = (task: Todo) => {
    setSelectedTask(task);
    setSheetOpen(true);
  };

  return (
    <div className="h-full flex-1 flex flex-col">
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-4 min-h-0 p-4 rounded-2xl bg-card shadow-md h-full"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-card-foreground">
                {title}
              </h2>
              <TodoSheet
                status={id}
                open={sheetOpen}
                setOpen={(open) => {
                  setSheetOpen(open);
                  if (!open) setSelectedTask(null);
                }}
                task={selectedTask}
                mutate={mutate}
              >
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-blue-500 hover:bg-blue-100 border border-blue-100 shadow-sm transition"
                  aria-label="Add Ticket"
                  tabIndex={0}
                >
                  <Plus size={20} />
                </button>
              </TodoSheet>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {todos.map((todo, index) => {
                const t = todo;
                // Tính màu cho deadline
                let deadlineColor = "#22c55e"; // xanh mặc định
                if (t.status === "done" && t.updatedAt && t.deadline) {
                  if (dayjs(t.updatedAt).isBefore(dayjs(t.deadline))) {
                    deadlineColor = "#22c55e"; // xanh nếu hoàn thành trước deadline
                  } else {
                    deadlineColor = "#ef4444"; // đỏ nếu hoàn thành sau deadline
                  }
                } else if (t.deadline) {
                  const deadlineDate = dayjs(t.deadline);
                  if (deadlineDate.isBefore(dayjs())) {
                    deadlineColor = "#ef4444"; // đỏ
                  } else if (deadlineDate.diff(dayjs(), "hour") < 4) {
                    deadlineColor = "#facc15"; // vàng
                  }
                }
                return (
                  <Draggable key={t._id} draggableId={t._id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-4 bg-card shadow-sm hover:shadow-md transition-shadow relative cursor-pointer"
                        onClick={() => handleEditTask(t)}
                      >
                        {/* Label bar */}
                        {t.labels && t.labels.length > 0 && (
                          <div className="flex gap-1 mb-2">
                            {(
                              t.labels as {
                                id: string;
                                name: string;
                                color: string;
                              }[]
                            ).map((label) => (
                              <div
                                key={label.id}
                                className="h-2 rounded w-8 cursor-pointer"
                                style={{ background: label.color }}
                                title={label.name}
                              />
                            ))}
                          </div>
                        )}
                        <h3 className="font-medium text-card-foreground">
                          {t.title}
                        </h3>
                        {t.description && (
                          <div
                            className="text-sm text-muted-foreground mt-1"
                            dangerouslySetInnerHTML={{ __html: t.description }}
                          />
                        )}
                        {/* Deadline bar */}
                        {t.deadline && (
                          <div
                            className="flex items-center gap-1 mt-4 px-2 py-1 rounded w-fit text-xs font-medium"
                            style={{ background: deadlineColor, color: "#fff" }}
                          >
                            <Clock className="w-4 h-4" />
                            {dayjs(t.deadline).format("D MMM")}
                          </div>
                        )}
                      </Card>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}
