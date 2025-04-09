import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Export configuration
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react': 'react',
      'react-dom': 'react-dom',
      'react-dom/client': 'react-dom/client'
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client']
  }
});
