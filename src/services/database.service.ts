import { Database } from "bun:sqlite";

export class DatabaseService extends Database {
	constructor(private readonly databaseUrl: string) {
		super(databaseUrl);
	}

	async checkHealth() {
		return await Bun.file(this.databaseUrl).exists();
	}
}
