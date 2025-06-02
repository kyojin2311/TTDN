"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { Todo, TodoStatus } from "@/types/todo";
import TodoColumn from "@/components/TodoColumn";
import { Input } from "@/components/ui/input";
import TicketFilterPopover from "@/components/TicketFilterPopover";
import TodoHeader from "@/components/TodoHeader";
import { TaskApi } from "@/api/TaskApi";
import useSWR from "swr";
import LabelFilterSelector from "@/components/LabelFilterSelector";

const initialColumns: Record<TodoStatus, Todo[]> = {
  todo: [],
  doing: [],
  done: [],
};

export default function TodoBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // State cho filter thực tế (áp dụng)
  const [appliedCreatedAtRange, setAppliedCreatedAtRange] = useState<{
    from: string;
    to: string;
  }>({ from: "", to: "" });
  const [appliedLabels, setAppliedLabels] = useState<string[]>([]);

  // State cho filter tạm thời (chỉ dùng trong popover)
  const [tempCreatedAtRange, setTempCreatedAtRange] = useState<{
    from: string;
    to: string;
  }>({ from: "", to: "" });
  const [tempLabels, setTempLabels] = useState<string[]>([]);

  const { data, mutate } = useSWR("tasks", () => TaskApi.getTasks(), {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  useEffect(() => {
    if (data) {
      const tasks = data as Todo[];
      const newColumns = {
        todo: tasks.filter((task) => task.status === "todo"),
        doing: tasks.filter((task) => task.status === "doing"),
        done: tasks.filter((task) => task.status === "done"),
      };
      setColumns(newColumns);
    }
  }, [data]);

  // Khi mở popover, sync filter tạm thời với filter thực tế
  useEffect(() => {
    if (filterOpen) {
      setTempCreatedAtRange(appliedCreatedAtRange);
      setTempLabels(appliedLabels);
    }
  }, [filterOpen]);

  const onDragEnd = async (result: DropResult) => {
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
      const prevColumns = { ...columns };
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
      // Gọi API cập nhật status
      try {
        await TaskApi.updateTask(removed._id, {
          status: destination.droppableId,
        });
        mutate();
      } catch {
        // Nếu lỗi, reset lại columns về trước khi kéo thả
        setColumns(prevColumns);
        mutate();
      }
    }
  };

  function filterTodos(todos: Todo[]) {
    return todos.filter((todo) => {
      const desc = (todo.description || "").toLowerCase();
      const matchSearch = search === "" || desc.includes(search.toLowerCase());
      const matchDate =
        (!appliedCreatedAtRange.from ||
          new Date(todo.createdAt) >= new Date(appliedCreatedAtRange.from)) &&
        (!appliedCreatedAtRange.to ||
          new Date(todo.createdAt) <= new Date(appliedCreatedAtRange.to));
      const matchLabel =
        appliedLabels.length === 0 ||
        (todo.labels &&
          todo.labels.some((l: any) =>
            appliedLabels.includes(typeof l === "string" ? l : l._id)
          ));
      return matchSearch && matchDate && matchLabel;
    });
  }

  // Handler cho popover filter
  function handleApplyFilter() {
    setAppliedCreatedAtRange(tempCreatedAtRange);
    setAppliedLabels(tempLabels);
    setFilterOpen(false);
  }
  function handleResetFilter() {
    setTempCreatedAtRange({ from: "", to: "" });
    setTempLabels([]);
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
            createdAtRange={tempCreatedAtRange}
            setCreatedAtRange={setTempCreatedAtRange}
            selectedLabels={tempLabels}
            setSelectedLabels={setTempLabels}
            onApply={handleApplyFilter}
            onReset={handleResetFilter}
          />
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-0 flex-1 items-stretch">
              <TodoColumn
                id="todo"
                title="To Do"
                todos={filterTodos(columns.todo)}
                mutate={mutate}
              />
              <TodoColumn
                id="doing"
                title="Doing"
                todos={filterTodos(columns.doing)}
                mutate={mutate}
              />
              <TodoColumn
                id="done"
                title="Done"
                todos={filterTodos(columns.done)}
                mutate={mutate}
              />
            </div>
          </DragDropContext>
        </div>
      </div>
    </main>
  );
}
