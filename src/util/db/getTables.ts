import prismaClient from "@prismaClient";

export default async function getTables(): Promise<string[]> {
  const tableNames = await prismaClient.$queryRaw<{ tablename: string }[]>`
    SELECT tablename
    FROM pg_catalog.pg_tables
    WHERE schemaname = 'public'
  `;

  return tableNames
    .filter((table) => table.tablename !== "_prisma_migrations")
    .map((table) => table.tablename);
}
