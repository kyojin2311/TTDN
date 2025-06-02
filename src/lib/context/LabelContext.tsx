import React, { createContext, useContext, ReactNode } from "react";
import { TaskApi } from "@/api/TaskApi";
import { Label } from "@/types/todo";
import useSWR from "swr";

interface LabelContextType {
  labels: Label[];
  mutate: () => void;
  createLabel: (label: Omit<Label, "_id">) => Promise<void>;
  updateLabel: (id: string, label: Omit<Label, "_id">) => Promise<void>;
  deleteLabel: (id: string) => Promise<void>;
}

const LabelContext = createContext<LabelContextType | undefined>(undefined);

export function LabelProvider({ children }: { children: ReactNode }) {
  const { data: labels = [], mutate } = useSWR("labels", TaskApi.getLabels, {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  const createLabel = async (label: Omit<Label, "_id">) => {
    await TaskApi.createLabel(label);
    mutate();
  };
  const updateLabel = async (id: string, label: Omit<Label, "_id">) => {
    await TaskApi.updateLabel(id, label);
    mutate();
  };
  const deleteLabel = async (id: string) => {
    await TaskApi.deleteLabel(id);
    mutate();
  };

  return (
    <LabelContext.Provider
      value={{ labels, mutate, createLabel, updateLabel, deleteLabel }}
    >
      {children}
    </LabelContext.Provider>
  );
}

export function useLabelContext() {
  const ctx = useContext(LabelContext);
  if (!ctx)
    throw new Error("useLabelContext must be used within a LabelProvider");
  return ctx;
}
