import { PrismaClient } from "@prisma/client";
import matchExt from "./extensions/match";
import masteryExt from "./extensions/characterMastery";

const prismaClient = new PrismaClient().$extends({
  ...matchExt,
  ...masteryExt,
});

// these extensions may or may not be used, they're just examples

export default prismaClient;
