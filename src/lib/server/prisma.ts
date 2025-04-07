import { PrismaClient } from '@prisma/client';
import { Logger } from './Logger';
import { building } from '$app/environment';

const prisma = new PrismaClient();

if (!building) {
	await prisma.$connect();
	Logger.make('db').info('Connected to database.');
}

export { prisma };
