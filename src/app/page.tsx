"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useAuthContext } from "@/lib/context/AuthContext";
import { useState } from "react";
import { Todo, TodoStatus } from "@/types/todo";
import TodoColumn from "@/components/TodoColumn";
import { Button } from "@/components/ui/button";
import { useSnackbar } from "notistack";
import Loading from "@/components/Loading";
import Image from "next/image";
import ThemeSettingsModal from "@/components/ThemeSettingsModal";

const initialColumns: Record<TodoStatus, Todo[]> = {
  DOING: [],
  DEMO: [],
  WAITING_REVIEW: [],
  NEED_FIXED: [],
};

export default function Home() {
  const { user, loading, signInWithGoogle, logout } = useAuthContext();
  const [columns, setColumns] = useState(initialColumns);
  const { enqueueSnackbar } = useSnackbar();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Organize Your Tasks with Ease
              </h1>
              <p className="text-xl text-gray-600">
                A modern, intuitive task management tool that helps you stay
                organized and boost productivity.
              </p>
              <div className="space-y-4">
                <Button
                  onClick={signInWithGoogle}
                  className="w-full md:w-auto bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
                >
                  <Image
                    src="/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Sign in with Google
                </Button>
                <p className="text-sm text-gray-500">
                  No credit card required. Free forever.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="relative">
                <Image
                  src="/dashboard-preview.svg"
                  alt="Dashboard Preview"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Simple Task Management
              </h3>
              <p className="text-gray-600">
                Organize your tasks with our intuitive drag-and-drop interface.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is encrypted and protected with industry-standard
                security.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                Stay in sync with your team with instant updates and
                notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="w-full px-2 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <h1 className="text-3xl font-bold text-gray-900">My Todo List</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() =>
                enqueueSnackbar(
                  "Add new todo feature will be available soon!",
                  { variant: "info" }
                )
              }
              className="bg-primary hover:bg-primary/90"
            >
              Add New Todo
            </Button>
            <Button onClick={logout} variant="outline">
              Sign Out
            </Button>
            <ThemeSettingsModal />
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <TodoColumn id="DOING" title="Doing" todos={columns.DOING} />
            <TodoColumn id="DEMO" title="Demo" todos={columns.DEMO} />
            <TodoColumn
              id="WAITING_REVIEW"
              title="Waiting Review"
              todos={columns.WAITING_REVIEW}
            />
            <TodoColumn
              id="NEED_FIXED"
              title="Need Fixed"
              todos={columns.NEED_FIXED}
            />
          </div>
        </DragDropContext>
      </div>
    </main>
  );
}
