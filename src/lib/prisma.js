import { PrismaClient } from "@prisma/client";
// This checks if there is already a "hand" (connection) in the global memory
const prismaClientSingleton = () => {
  return new PrismaClient();
};
const globalForPrisma = globalThis;
// Use the existing hand if it exists, otherwise create a new one
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
export default prisma;
// If we are not in production (meaning we are developing), 
// save this hand into the global memory so it persists across reloads.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;