/* eslint-disable @typescript-eslint/no-namespace */

import { ApiUtils } from "@/lib/apiUtils";

export namespace TaskApi {
  const PATH = "tasks/";
  const { METHOD, fetchList, HOST } = ApiUtils;

  export async function getTasks() {
    console.log("tre");
    return await fetchList({
      functionName: "Get list tasks",
      url: HOST + PATH,
      method: METHOD.GET,
    });
  }
}
