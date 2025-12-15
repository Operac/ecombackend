const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

console.log("Prisma Client Initialized. Models:", Object.keys(prisma).filter(key => key[0] !== '_' && key[0] !== '$'));
module.exports = prisma;
