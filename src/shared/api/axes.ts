import { env } from "@/shared/config/env";

export interface RouteAxis {
  id: string;
  code: string;
  commonName: string | null;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface ListRouteAxesResponse {
  status: true;
  data: RouteAxis[];
  meta: PaginationMeta;
}

/**
 * GET /route-axes is paginated (cf. backend shared/utils/pagination.ts,
 * issue #17), but a map filter bar only needs the full list once — a
 * single request with a large pageSize covers the current scale (21 axes)
 * comfortably. Revisit if the future A/P road classification expansion
 * (cf. architecture technique §6) pushes the axis count past 100.
 */
export async function fetchRouteAxes(): Promise<RouteAxis[]> {
  const url = new URL("/route-axes", env.VITE_API_BASE_URL);
  url.searchParams.set("pageSize", "100");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const body = (await response.json()) as ListRouteAxesResponse;
  return body.data;
}
