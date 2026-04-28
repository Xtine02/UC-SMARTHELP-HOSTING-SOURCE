import { defineConfig } from "vite";
import path from "path";

let reactPlugin;
try {
  reactPlugin = require("@vitejs/plugin-react-swc");
} catch (error) {
  console.warn("React SWC plugin not found, using fallback");
  reactPlugin = null;
}

let componentTaggerPlugin;
try {
  componentTaggerPlugin = require("lovable-tagger").componentTagger;
} catch (error) {
  console.warn("Lovable tagger not found, using fallback");
  componentTaggerPlugin = null;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  preview: {
    allowedHosts: ['all'],
  },
  plugins: [reactPlugin?.(), mode === "development" && componentTaggerPlugin?.()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
