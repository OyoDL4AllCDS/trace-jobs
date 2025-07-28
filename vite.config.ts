import { defineConfig, ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { IncomingMessage, ServerResponse } from "http";
import { NextHandleFunction } from "connect";

// Middleware to handle serverless functions in development
const apiDevMiddleware = (server: ViteDevServer) => {
  server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: NextHandleFunction) => {
    if (req.url?.startsWith("/api/")) {
      try {
        const modulePath = path.join(__dirname, req.url);

        const module = await import(`${modulePath}.js?t=${Date.now()}`);
        await module.default(req, res);
      } catch (error) {
        console.error("API middleware error:", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    } else {
      // @ts-expect-error: connect type is incorrect
      next();
    }
  });
};

export default defineConfig({
  plugins: [
    react(),
    {
      name: "api-dev-server",
      configureServer: apiDevMiddleware,
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
