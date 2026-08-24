import { QueryClient } from "@tanstack/react-query";

// Single shared instance. Offline-queue behaviour (mutations retried once
// connectivity returns — cf. cahier des charges §7.4) is layered on top of
// this in the Phase 2 incident-reporting task, via TanStack Query's
// `networkMode` + a persisted mutation queue; not configured yet in the
// shell.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});
