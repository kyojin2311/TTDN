import { getAuth } from "firebase/auth";
import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }
  return res.json();
}

export function get(url: string) {
  return fetchWithAuth(url, { method: "GET" });
}

export function post<T = unknown>(url: string, data: T) {
  return fetchWithAuth(url, { method: "POST", body: JSON.stringify(data) });
}

export function put<T = unknown>(url: string, data: T) {
  return fetchWithAuth(url, { method: "PUT", body: JSON.stringify(data) });
}

export function del(url: string) {
  return fetchWithAuth(url, { method: "DELETE" });
}

/**
 * useApiQuery - custom hook dùng react-query để fetch API có auth (Firebase token)
 * @param key QueryKey (unique key cho react-query)
 * @param url endpoint
 * @param method HTTP method (bắt buộc, ví dụ: 'GET', 'POST', ...)
 * @param queryOptions: { body, params, notifyOnError, notifyOnSuccess }
 * @param options react-query options (enabled, staleTime, ...)
 * @returns { data, error, isLoading, refetch, ... }
 *
 * Example:
 *   const { data, isLoading, error } = useApiQuery(['todos'], '/api/todos', 'GET', { params: { status: 'done' }, notifyOnError: true });
 */
export interface ApiQueryOptions<
  B = unknown,
  P = Record<string, string | number | boolean | undefined>
> {
  body?: B;
  params?: P;
  notifyOnError?: boolean;
  notifyOnSuccess?: boolean;
}

export function useApiQuery<
  T = unknown,
  B = unknown,
  P = Record<string, string | number | boolean | undefined>
>(
  key: QueryKey,
  url: string,
  method: string,
  queryOptions?: ApiQueryOptions<B, P>,
  options?: UseQueryOptions<T>
) {
  const { enqueueSnackbar } = useSnackbar();
  // Xử lý params
  let finalUrl = url;
  if (queryOptions?.params) {
    const params = Object.entries(queryOptions.params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(
        ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
      )
      .join("&");
    if (params) finalUrl += (finalUrl.includes("?") ? "&" : "?") + params;
  }
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      try {
        const res = await fetchWithAuth(finalUrl, {
          method,
          body: queryOptions?.body
            ? JSON.stringify(queryOptions.body)
            : undefined,
        });
        if (queryOptions?.notifyOnSuccess) {
          enqueueSnackbar("Fetch thành công!", { variant: "success" });
        }
        return res;
      } catch (err) {
        if (queryOptions?.notifyOnError) {
          enqueueSnackbar(
            (err as Error).message || "Có lỗi xảy ra khi fetch API",
            { variant: "error" }
          );
        }
        throw err;
      }
    },
    ...options,
  });
}
