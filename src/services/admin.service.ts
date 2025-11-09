import { HTTPError } from "@/lib/get-error-result";

export class AdminService {
	constructor(private readonly adminKey: string) {}

	async checkAccess(password: string | undefined) {
		try {
			if (!password) {
				console.log("no submission");
				throw new HTTPError("Eline ne geçecek?", 400);
			}

			const key = this.adminKey.trim();
			if (key.length === 0) {
				console.log("no key");
				throw new HTTPError("Eline ne geçecek?", 400);
			}

			const isValidPassword = await Bun.password.verify(password, key);
			if (!isValidPassword) {
				console.log("no valid");
				throw new HTTPError("Eline ne geçecek?", 400);
			}
		} catch (err) {
			console.log(err);
			throw new HTTPError("Eline ne geçecek?", 400);
		}
	}
}
