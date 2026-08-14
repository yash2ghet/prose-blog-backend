import app from "./app.ts";
import { env } from "./config/env.ts";
import { connectDB } from "./config/db.ts";

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(
      `🚀 Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`
    );
  });
};

startServer();