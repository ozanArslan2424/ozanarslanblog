import type {
	BlogCreateBodyType,
	BlogDeleteBodyType,
	BlogListResponseType,
	BlogPostType,
	BlogUpdateBodyType,
} from "@/schemas/blog.schemas";
import type { DatabaseService } from "@/services/database.service";

export class BlogService {
	constructor(private readonly db: DatabaseService) {
		this.createTable();
	}

	private createTable() {
		const query = this.db.query(`
CREATE TABLE IF NOT EXISTS blog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);`);
		query.run();
	}

	async get(id: number): Promise<BlogPostType> {
		const query = this.db.query("SELECT * FROM blog WHERE id = ?");
		const post = query.get(id) as BlogPostType | null;
		if (!post) throw new Error("Post not found");
		return post;
	}

	async list(): Promise<BlogListResponseType> {
		const query = this.db.query("SELECT * FROM blog ORDER BY createdAt DESC");
		const posts = query.all() as BlogListResponseType;
		return posts;
	}

	async create(body: BlogCreateBodyType): Promise<BlogPostType> {
		const { title, content } = body;
		const query = this.db.query("INSERT INTO blog (title, content) VALUES (?, ?) RETURNING *");
		const post = query.get(title, content) as BlogPostType;
		return post;
	}

	async update(body: BlogUpdateBodyType): Promise<BlogPostType> {
		const { id, title, content } = body;
		const query = this.db.query("UPDATE blog SET title = ?, content = ? WHERE id = ?");
		query.run(title, content, id);
		const post = await this.get(id);
		return post;
	}

	async delete(body: BlogDeleteBodyType): Promise<boolean> {
		const { id } = body;
		const query = this.db.query("DELETE FROM blog WHERE id = ?");
		const result = query.run(id);
		return result.changes > 0;
	}
}
