export class HTTPError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}

	getResponse() {
		return {
			message: this.message,
			status: this.status,
		};
	}
}

export function getErrorResult(error: unknown) {
	if (error instanceof HTTPError) {
		return { status: error.status, response: new Response(error.message) };
	}

	if (error instanceof Error) {
		return { status: 500, response: new Response(error.message) };
	}

	return { status: 500, response: new Response("Unknown error") };
}
