import express from "express";
import healthRouter from "./routes/health.routes";
import shayariRouter from "./routes/shayari.routes";
import weatherRouter from "./routes/weather.routes";
import backgroundRouter from "./routes/background.routes";
import homeRouter from "./routes/home.routes";
import { config } from "./env";
import { runMigrations } from "./db/db";
import { apiRateLimiter } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.set('trust proxy', true); // Enable trust proxy for correct X-Forwarded-For handling
}

// Allow cross-origin requests from the extension (and local Vite dev server).
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use("/health", healthRouter);
app.use(apiRateLimiter);
app.use("/api/shayari", shayariRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/background", backgroundRouter);
app.use("/api/home", homeRouter);

// Error handling middleware (should be after routes)
app.use(errorHandler);

// Export the app for testing purposes
export default app;

// Start the server only when this module is executed directly
if (require.main === module) {
  const PORT = config.PORT;
  (async () => {
    try {
      await runMigrations();
      app.listen(PORT, () => {
        console.log(`Hinode server listening on port ${PORT}`);
      });
    } catch (err) {
      console.error('Failed to start server due to migration error:', err);
      process.exit(1);
    }
  })();
}
