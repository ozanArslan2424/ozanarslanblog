export class ConfigService {
	port = process.env.PORT;
	isDev = process.env.NODE_ENV !== "production";
	databaseUrl = process.env.DATABASE_URL;
	clientUrl = process.env.CLIENT_URL;
	adminSecret = process.env.ADMIN_SECRET;
	baseUrl = process.env.BASE_URL;

	getCorsOrigin() {
		const origins = [this.clientUrl];
		if (this.isDev) {
			origins.push("http://localhost:4173");
			origins.push("http://localhost:5173");
		}
		return origins;
	}

	getDatabaseUrl() {
		if (this.isDev) {
			return "dev.db";
		}
		return this.databaseUrl;
	}
}
