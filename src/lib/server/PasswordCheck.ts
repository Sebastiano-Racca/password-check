import entrpy from 'ideal-password';
import fs from 'fs';
import { Logger } from './Logger';

const logger = Logger.make('pwd-check');

class WordList {
	private words: Set<string>;
	length: number;

	constructor(readonly path: string) {
		this.words = new Set(
			fs
				.readFileSync(this.path, 'utf-8')
				.split(/\r?\n/)
				.filter((word) => word.length > 0)
		);
		this.length = this.words.size;

		logger.debug('Wordlist loaded', { path: this.path });
	}

	has(word: string) {
		return this.words.has(word);
	}
}

const wordlists: Record<string, WordList> = {};

export class PasswordCheck {
	constructor(private readonly password: string) {}

	logger() {
		return logger;
	}

	wordlist(path: string) {
		if (!wordlists[path]) {
			wordlists[path] = new WordList(path);
		}

		return wordlists[path];
	}

	wordlistLength(path: string) {
		return wordlists[path].length;
	}

	entropy() {
		return entrpy(this.password);
	}
}
