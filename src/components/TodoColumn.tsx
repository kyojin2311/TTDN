import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Todo, TodoStatus } from "@/types/todo";
import { Card } from "@/components/ui/card";
import TodoSheet from "@/components/TodoSheet";
import { Plus } from "lucide-react";
import { useState } from "react";

interface TodoColumnProps {
  id: TodoStatus;
  title: string;
  todos: Todo[];
}

export default function TodoColumn({ id, title, todos }: TodoColumnProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4 h-full">
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-4 min-h-[500px] p-4 rounded-2xl bg-gray-100 shadow-sm h-full"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">{title}</h2>
              <TodoSheet status={id} open={sheetOpen} setOpen={setSheetOpen}>
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
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-medium">{todo.title}</h3>
                      {todo.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {todo.description}
                        </p>
                      )}
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
            <div className="mt-4 flex justify-center">
              <TodoSheet status={id} open={sheetOpen} setOpen={setSheetOpen}>
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white text-blue-500 border border-blue-100 shadow-sm hover:bg-blue-50 transition text-sm font-medium"
                >
                  <Plus size={16} /> Add Ticket
                </button>
              </TodoSheet>
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}
