import { PrismaClient } from "@prisma/client";

/**
 * Use a stable global on `globalThis` to avoid multiple PrismaClient instances
 * during hot-reloads in development.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma =
  global.__prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;

export default prisma;
