import Fastify from "fastify";
import { env } from "./env";
import jobsRoute from "./routes/jobs";
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import userRoute from "./routes/user";

const app = Fastify();

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(jobsRoute)
app.register(userRoute)


app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
   console.log(`API rodando na porta ${env.PORT}`);
});
