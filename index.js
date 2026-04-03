import { fileURLToPath } from "url";

import app from "./src/app.js";
import { connectToDatabase, db } from "./src/config/db.js";
import { port } from "./src/config/env.js";

const isDirectExecution = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  const startServer = async () => {
    try {
      await connectToDatabase();
      await db.command({ ping: 1 });
      console.log("MongoDB connected successfully.");

      app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
      });
    } catch (error) {
      console.error("Failed to connect to MongoDB.", error.message);
      process.exit(1);
    }
  };

  startServer();
}

export default app;
