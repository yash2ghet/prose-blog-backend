import app from "./app.ts";
import { env } from "./config/env.ts";
import { connectDB } from "./config/db.ts";

connectDB();

if (process.env.NODE_ENV !== "production") {
  app.listen(env.PORT, () => {
    console.log(
      `🚀 Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`
    );
  });
}

export default app;