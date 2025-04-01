import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Export configuration
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // No need for alias here, unless you are specifically overriding a path.
    },
  },
});
