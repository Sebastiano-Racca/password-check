import type { Statistics } from '$lib/server/Statistics';

declare global {
	namespace App {
		interface Locals {
			stats: Statistics;
		}
	}
}

export {};
