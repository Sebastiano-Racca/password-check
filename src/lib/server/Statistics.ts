import { Logger } from './Logger';
import { prisma } from './prisma';

const logger = Logger.make('stats');

export class Statistics {
	constructor(public readonly id: string) {}

	logger() {
		return logger;
	}

	incrPageVisit(page: string, userAgent?: string) {
		return prisma.pageVisit.create({
			data: {
				page,
				userAgent,
				statsId: this.id
			}
		});
	}

	incrPwdChecks(
		password: string,
		entropy: number,
		score: number,
		estimatedSeconds: number,
		wordlist?: string
	) {
		return prisma.pwdCheck.create({
			data: {
				password,
				entropy,
				estimatedSeconds,
				score,
				wordlist,
				statsId: this.id
			}
		});
	}

	static getAll() {
		return prisma.stats.findMany({
			include: {
				pwdChecks: true,
				pageVisits: true
			}
		});
	}

	static async exists(id: string) {
		return (await prisma.stats.count({ where: { id } })) > 0;
	}

	static async createInstance() {
		return new this((await prisma.stats.create({ data: {} })).id);
	}
}
