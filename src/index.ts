import { serve } from "bun";
import { app } from "./main";
import admin from "@/static/admin.html";

const start = performance.now();

const port = Number(process.env.PORT ?? "3000");

function path(url: string, searchValue = `${process.env.BASE_URL}/`) {
	const replaceValue = "";
	return url.replace(searchValue, replaceValue);
}

function api(req: Bun.BunRequest<"/api/*">) {
	const url = path(req.url, "/api");
	const request = new Request(url, req);
	return app.handle(request);
}

serve({
	port,
	routes: {
		"/api/*": (req) => api(req),
		"/admin": admin,
	},
	development: process.env.NODE_ENV !== "production" && {
		hmr: true,
		console: true,
	},
});

const end = performance.now();
const startup = end - start;
console.log(`🚀 Server started in ${startup.toFixed(2)}ms`);
console.log(`📡 Listening on port ${port}`);
