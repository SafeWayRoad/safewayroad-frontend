import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "SafeWayRoad",
        short_name: "SafeWayRoad",
        description:
          "Signalement d'incidents routiers et assistance aux usagers des Routes Nationales du Cameroun",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        // Runtime caching strategy for the Phase 2 shell: cache-first for
        // static assets and map tiles, so the map stays usable when a
        // signal drops on a stretch of N1/N3/N4 (cf. cahier des charges
        // §7.4, architecture technique §11). The offline queue for
        // POST /incidents is application logic (IndexedDB + Background
        // Sync), built on top of this in a later Phase 2 task — this only
        // covers the shell's asset caching.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.maptiler\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "maptiler-tiles",
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      devOptions: {
        // Lets the service worker be inspected during `npm run dev` too —
        // useful while iterating on the offline-queue logic later in Phase 2.
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
});
