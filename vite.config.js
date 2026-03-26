import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei"],
          "vendor-motion": ["framer-motion"],
          "vendor-utils": ["lucide-react"],
          "vendor-maps": ["leaflet", "react-leaflet"],
        },
        // Optimize asset file names for caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
    // Reduce sourcemap size in production
    sourcemap: false,
    // Better minification
    minify: "esbuild",
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 600,
    // Target modern browsers for smaller bundles
    target: "es2020",
  },
  // Optimize dev server
  server: {
    hmr: {
      overlay: true,
    },
    proxy: {
      "/api": {
        target: "https://edu.3dbharat.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, "/server"),
      },
    },
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "three",
    ],
    // Exclude heavy dependencies that are rarely changed
    exclude: [],
  },
  // Enable esbuild for faster builds
  esbuild: {
    // Drop console.log in production
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
});
