import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { enqueueSnackbar } from "notistack";
import { ApiRequestScheduler } from "./apiScheduler";

/* eslint-disable @typescript-eslint/no-namespace */

export const scheduler = new ApiRequestScheduler(5, 300);

export namespace ApiUtils {
  const autoHideDuration = 3000;
  export const METHOD = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
  } as const;

  export const HOST = process.env.NEXT_PUBLIC_BE_HOST;

  export async function getToken() {
    return getAuth(getApp()).currentUser?.getIdToken();
  }

  export function getRefreshToken() {
    return getAuth(getApp()).currentUser?.refreshToken;
  }

  export type ApiResponse<T> = T & {
    message?: string;
    error?: string;
    statusCode?: number;
  };

  export type ApiRequest = {
    url: string;
    method: string;
    body?: Record<string, unknown>;
    params?: Record<string, unknown>;
    isEmpty?: boolean;
    isShowError?: boolean;
    isUnusedToken?: boolean;
  };

  type FetchListConfig = {
    functionName: string;
    url: string;
    method: string;
    hasSuccessfulMsg?: boolean;
    hasErrorMsg?: boolean;
    body?: Record<string, unknown>;
    params?: Record<string, unknown>;
    isShowError?: boolean;
    isReturnError?: boolean;
  };

  type FetchOneConfig = {
    functionName: string;
    url: string;
    method: string;
    hasSuccessfulMsg?: boolean;
    hasErrorMsg?: boolean;
    body?: Record<string, unknown>;
    params?: Record<string, unknown>;
    isEmpty?: boolean;
    isShowError?: boolean;
    isReturnError?: boolean;
  };

  export async function fetchData<T>(
    config: ApiRequest,
    signal?: AbortSignal
  ): Promise<T> {
    console.log("fetchData");
    const token = await ApiUtils.getToken();
    console.log("fetchData1", token, config.url);
    const url = new URL(config.url);
    console.log("fetchData1,5", url);

    if (config.params) {
      Object.entries(config.params).forEach((entry) => {
        if (Array.isArray(entry[1])) {
          entry[1].forEach((value) => {
            if (value !== undefined && value !== null)
              url.searchParams.append(entry[0], value.toString());
          });
        } else {
          if (entry[1] !== undefined && entry[1] !== null)
            url.searchParams.append(entry[0], entry[1].toString());
        }
      });
    }
    console.log("fetchData2", url);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("ngrok-skip-browser-warning", "69420");

    const requestOptions: RequestInit = {
      method: config.method,
      mode: "cors",
      body: JSON.stringify(config.body),
      headers: myHeaders,
      signal,
    };
    console.log("fetchData31", requestOptions);

    try {
      const response = await fetch(url, requestOptions);
      console.log("fetchData32", response);
      if (!response.ok) {
        const responseData = await response.json();
        const errorObj = {
          ...responseData,
          error: responseData.error || "Error",
          statusCode: response.status,
          statusText: response.statusText,
        };

        if (config.isShowError) {
          return errorObj as T;
        }

        throw new Error(JSON.stringify(errorObj));
      }
      const body = config.isEmpty ? response : await response.json();
      return body as T;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("{")) {
        throw error;
      }
      const errorObj = {
        error: (error as Error)?.message || "Unknown error",
        statusCode: 500,
        statusText: "Request Failed",
      };
      throw new Error(JSON.stringify(errorObj));
    }
  }

  export async function fetchOne<T>(
    config: FetchOneConfig,
    signal?: AbortSignal
  ): Promise<T> {
    try {
      const result = await fetchData<ApiResponse<T>>(config, signal);
      const { hasSuccessfulMsg } = config;

      if (hasSuccessfulMsg && !result?.error) {
        enqueueSnackbar(`${config.functionName} successfully.`, {
          variant: "success",
          autoHideDuration: autoHideDuration,
        });
      }
      return result;
    } catch (error) {
      const { hasErrorMsg, functionName, isReturnError } = config;

      try {
        const errorData = JSON.parse((error as Error).message);

        if (hasErrorMsg) {
          enqueueSnackbar(
            `${functionName} failed${
              errorData.message ? `: ${errorData.message}` : ""
            }`,
            {
              variant: "error",
              autoHideDuration: autoHideDuration,
            }
          );
        }

        if (isReturnError) return errorData as unknown as T;

        throw error;
      } catch {
        if (hasErrorMsg) {
          enqueueSnackbar(
            `${functionName} failed: ${(error as Error).message}`,
            {
              variant: "error",
              autoHideDuration: autoHideDuration,
            }
          );
        }

        if (isReturnError)
          return {
            error: (error as Error).message,
            statusCode: 500,
          } as unknown as T;

        throw error;
      }
    }
  }

  export async function fetchList<T>(
    config: FetchListConfig,
    signal?: AbortSignal
  ): Promise<T[]> {
    try {
      console.log("fetchList");
      const result = await fetchData<ApiResponse<T[]>>(config, signal);
      const { hasSuccessfulMsg } = config;

      console.log("fetchList1", result);
      if (hasSuccessfulMsg && !result?.error) {
        enqueueSnackbar(`${config.functionName} successfully.`, {
          variant: "success",
          autoHideDuration: autoHideDuration,
        });
      }

      if (!Array.isArray(result)) return [] as T[];
      return result as T[];
    } catch (error) {
      const { hasErrorMsg, functionName, isReturnError } = config;

      try {
        const errorData = JSON.parse((error as Error).message);

        if (hasErrorMsg) {
          enqueueSnackbar(
            `${functionName} failed${
              errorData.message ? `: ${errorData.message}` : ""
            }`,
            {
              variant: "error",
              autoHideDuration: autoHideDuration,
            }
          );
        }

        if (isReturnError) return errorData as unknown as T[];

        throw error;
      } catch {
        if (hasErrorMsg) {
          enqueueSnackbar(
            `${functionName} failed: ${(error as Error).message}`,
            {
              variant: "error",
              autoHideDuration: autoHideDuration,
            }
          );
        }

        if (isReturnError)
          return {
            error: (error as Error).message,
            statusCode: 500,
          } as unknown as T[];

        throw error;
      }
    }
  }
}
