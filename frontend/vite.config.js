import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default {
  server: {
    allowedHosts: [
      'a6dd6ee8e67d24525b12be22b7025e04-783236026.ap-south-1.elb.amazonaws.com'
    ]
  }
}

