import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({
  connectionString: DB_URL,
});

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  }).$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
