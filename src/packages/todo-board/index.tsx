"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import { Todo, TodoStatus } from "@/types/todo";
import TodoColumn from "@/components/TodoColumn";
import { Input } from "@/components/ui/input";
import TicketFilterPopover from "@/components/TicketFilterPopover";
import TodoHeader from "@/components/TodoHeader";
import { TaskApi } from "@/api/TaskApi";
import useSWR from "swr";

const initialColumns: Record<TodoStatus, Todo[]> = {
  TO_DO: [],
  DOING: [],
  DONE: [],
};

export default function TodoBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [createdAtRange, setCreatedAtRange] = useState<{
    from: string;
    to: string;
  }>({ from: "", to: "" });

  const { data, isLoading } = useSWR("tasks", () => TaskApi.getTasks(), {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  console.log(data, isLoading);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId as TodoStatus];
      const copiedItems = [...column];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: copiedItems,
      });
    } else {
      const sourceColumn = columns[source.droppableId as TodoStatus];
      const destColumn = columns[destination.droppableId as TodoStatus];
      const sourceItems = [...sourceColumn];
      const destItems = [...destColumn];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      });
    }
  };

  function filterTodos(todos: Todo[]) {
    return todos.filter((todo) => {
      const desc = (todo.description || "").toLowerCase();
      const matchSearch = search === "" || desc.includes(search.toLowerCase());
      const matchDate =
        (!createdAtRange.from ||
          new Date(todo.createdAt) >= new Date(createdAtRange.from)) &&
        (!createdAtRange.to ||
          new Date(todo.createdAt) <= new Date(createdAtRange.to));
      return matchSearch && matchDate;
    });
  }

  return (
    <main className="min-h-screen h-full flex flex-col bg-background">
      <div className="w-full px-2 py-8 flex-1 flex flex-col">
        <TodoHeader />

        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <Input
            placeholder="Search ticket"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3"
          />
          <TicketFilterPopover
            open={filterOpen}
            setOpen={setFilterOpen}
            createdAtRange={createdAtRange}
            setCreatedAtRange={setCreatedAtRange}
          />
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-0 flex-1 items-stretch">
              <TodoColumn
                id="TO_DO"
                title="To Do"
                todos={filterTodos(columns.TO_DO)}
              />
              <TodoColumn
                id="DOING"
                title="Doing"
                todos={filterTodos(columns.DOING)}
              />
              <TodoColumn
                id="DONE"
                title="Done"
                todos={filterTodos(columns.DONE)}
              />
            </div>
          </DragDropContext>
        </div>
      </div>
    </main>
  );
}
