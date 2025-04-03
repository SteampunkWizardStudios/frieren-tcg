import { PrismaClient } from '@prisma/client';
import matchExt from './extensions/match';

const prismaClient = new PrismaClient().$extends(
    { ...matchExt },
);

export default prismaClient;