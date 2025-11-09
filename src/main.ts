import { Elysia } from "elysia";
import { getErrorResult, HTTPError } from "@/lib/get-error-result";
import { AdminService } from "@/services/admin.service";
import {
	BlogCreateBodySchema,
	BlogDeleteBodySchema,
	BlogListResponseSchema,
	BlogPostSchema,
	BlogUpdateBodySchema,
} from "@/schemas/blog.schemas";
import { BlogService } from "@/services/blog.service";
import { cors } from "@elysiajs/cors";
import { ConfigService } from "@/services/config.service";
import { DatabaseService } from "@/services/database.service";

const config = new ConfigService();
const db = new DatabaseService(config.getDatabaseUrl());
const adminService = new AdminService(config.adminSecret);
const blogService = new BlogService(db);

const app = new Elysia()
	.use(
		cors({
			origin: config.getCorsOrigin(),
			methods: ["GET"],
		}),
	)
	.derive(() => ({ db, adminService, blogService }))
	.macro({
		admin: {
			resolve: async (c) => {
				const submittedPassword = c.headers["X-Password"] || c.headers["x-password"];
				await c.adminService?.checkAccess(submittedPassword);
			},
		},
	})
	.get("/", "Hello blog")
	.get("/health", async (c) => {
		const dbHealth = await c.db.checkHealth();
		if (!dbHealth) {
			throw new HTTPError("DB file not found", 500);
		}
		return `Healthy at ${config.port}`;
	})
	.get(
		"/blog",
		async (c) => {
			const posts = await c.blogService.list();
			return posts;
		},
		{ response: BlogListResponseSchema },
	)
	.post(
		"/blog",
		async (c) => {
			const post = await c.blogService.create(c.body);
			return post;
		},
		{ body: BlogCreateBodySchema, response: BlogPostSchema, admin: true },
	)
	.post(
		"/blog/edit",
		async (c) => {
			const post = await c.blogService.update(c.body);
			return post;
		},
		{ body: BlogUpdateBodySchema, response: BlogPostSchema, admin: true },
	)
	.delete(
		"/blog",
		async (c) => {
			await c.blogService.delete(c.body);
		},
		{ body: BlogDeleteBodySchema, admin: true },
	)
	.onError((c) => {
		console.log(c.request.url, c.request.method, c.error);
		const result = getErrorResult(c.error);
		return c.status(result.status, result.response);
	});

export { app };
export type App = typeof app;
