"use client";

import { useAuthContext } from "@/lib/context/AuthContext";
import TodoBoard from "@/packages/todo-board";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Board() {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return <TodoBoard />;
}
