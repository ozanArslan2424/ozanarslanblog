declare module "bun" {
	interface Env {
		PORT: string;
		BASE_URL: string;
		DATABASE_URL: string;
		ADMIN_SECRET: string;
		CLIENT_URL: string;
	}
}
