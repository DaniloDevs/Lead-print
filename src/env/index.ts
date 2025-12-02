import dotenv from "dotenv";
import z from "zod";


dotenv.config()

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	REDIS_PORT: z.coerce.number().default(6379),
	REDIS_HOST: z.string(),
	DATABASE_URL: z.string(),
	MINIO_ACCESS_KEY: z.string(),
	MINIO_SECRET_KEY: z.string(),
	MINIO_ENDPOINT: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
	console.error(
		"❌ Invalid environment variables:",
		_env.error.issues.forEach((issue) => {
			console.log(issue.path, issue.message);
		}),
	);
	throw new Error("Invalid environment variables:\n");
}

export const env = _env.data;
