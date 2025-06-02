/* eslint-disable @typescript-eslint/no-namespace */

import { ApiUtils } from "@/lib/apiUtils";
import { Label } from "@/types/todo";

export namespace TaskApi {
  const PATH = "tasks/";
  const PATH_LABELS = "labels/";
  const { METHOD, fetchList, HOST, fetchOne } = ApiUtils;

  export async function getTasks() {
    return await fetchList({
      functionName: "Get list tasks",
      url: HOST + PATH,
      method: METHOD.GET,
    });
  }

  export async function createTask(body: any) {
    return await fetchOne({
      functionName: "Create task",
      url: HOST + PATH,
      method: METHOD.POST,
      body,
      hasErrorMsg: true,
      hasSuccessfulMsg: false,
    });
  }

  export async function updateTask(id: string, body: any) {
    return await fetchOne({
      functionName: "Update task",
      url: HOST + PATH + id,
      method: METHOD.PATCH,
      body,
      hasErrorMsg: true,
      hasSuccessfulMsg: false,
    });
  }

  export async function deleteTask(id: string) {
    return await fetchOne({
      functionName: "Delete task",
      url: HOST + PATH + id,
      method: METHOD.DELETE,
    });
  }

  export async function getLabels() {
    return await fetchList<Label>({
      functionName: "Get list labels",
      url: HOST + PATH_LABELS,
      method: METHOD.GET,
    });
  }

  export async function createLabel(body: any) {
    return await fetchOne({
      functionName: "Create label",
      url: HOST + PATH_LABELS,
      method: METHOD.POST,
      body,
    });
  }

  export async function updateLabel(id: string, body: any) {
    return await fetchOne({
      functionName: "Update label",
      url: HOST + PATH_LABELS + id,
      method: METHOD.PATCH,
      body,
    });
  }

  export async function deleteLabel(id: string) {
    return await fetchOne({
      functionName: "Delete label",
      url: HOST + PATH_LABELS + id,
      method: METHOD.DELETE,
    });
  }
}
