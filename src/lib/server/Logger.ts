import { LOG_PATH } from '$env/static/private';
import { appendFile } from 'fs';
import { Logger as TsLog } from 'tslog';

const instances: Record<string, Logger> = {};

export class Logger extends TsLog<unknown> {
	private constructor(name: string, path: string) {
		super({
			type: 'pretty',
			hideLogPositionForProduction: true,
			name
		});

		this.attachTransport((logObj) => {
			appendFile(path, JSON.stringify(logObj) + '\n', (err) => {
				if (err) throw err;
			});
		});
	}

	static make(name: string, path: string = LOG_PATH) {
		if (!instances[name]) {
			instances[name] = new this(name, path);
		}

		return instances[name];
	}
}
