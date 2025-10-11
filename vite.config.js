import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Production build optimization
  build: {
    // Enable minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"],
      },
    },

    // Chunk splitting strategy
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Core React libraries
          "react-vendor": ["react", "react-dom", "react-router-dom"],

          // UI and icons
          "ui-vendor": ["react-hot-toast", "react-icons"],

          // Charts library (heavy)
          charts: ["recharts"],

          // Utilities
          utils: ["date-fns"],
        },

        // Asset file naming for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },

    // Chunk size warning limit (KB)
    chunkSizeWarningLimit: 1000,

    // Source map for debugging (disable in production for smaller size)
    sourcemap: false,

    // Target modern browsers for smaller bundle
    target: "es2020",

    // Report compressed size
    reportCompressedSize: true,
  },

  // Development server configuration
  server: {
    port: 3000,
    open: true,
  },

  // Preview server configuration
  preview: {
    port: 4173,
    open: true,
  },
});
