"use client";

import Loading from "@/components/Loading";
import { useAuthContext } from "@/lib/context/AuthContext";
import { LabelProvider } from "@/lib/context/LabelContext";
import TodoBoard from "@/packages/todo-board";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Board() {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <LabelProvider>
      <TodoBoard />
    </LabelProvider>
  );
}
