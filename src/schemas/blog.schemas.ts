import z from "zod";

export const BlogPostSchema = z.object({
	id: z.coerce.number(),
	createdAt: z.string(),
	title: z.string(),
	content: z.string(),
});

export type BlogPostType = z.infer<typeof BlogPostSchema>;

export const BlogListResponseSchema = z.array(BlogPostSchema);

export type BlogListResponseType = z.infer<typeof BlogListResponseSchema>;

export const BlogCreateBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

export type BlogCreateBodyType = z.infer<typeof BlogCreateBodySchema>;

export const BlogUpdateBodySchema = BlogCreateBodySchema.extend({
	id: z.number(),
});

export type BlogUpdateBodyType = z.infer<typeof BlogUpdateBodySchema>;

export const BlogDeleteBodySchema = z.object({
	id: z.number(),
});

export type BlogDeleteBodyType = z.infer<typeof BlogDeleteBodySchema>;
