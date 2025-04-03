import { PrismaClient } from "@prisma/client";
import matchExt from "./extensions/match";
import masteryExt from "./extensions/characterMastery";

const prismaClient = new PrismaClient().$extends({
  ...matchExt,
  ...masteryExt,
});

export default prismaClient;
