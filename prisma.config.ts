import "dotenv/config";
import { defineConfig } from "prisma/config";

const url = process.env["DATABASE_URL"];

if (!url) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
  },
});
