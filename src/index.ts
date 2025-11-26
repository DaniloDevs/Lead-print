import Fastify from "fastify";
import Swagger from "@fastify/swagger";
import ScalarSwagger from "@scalar/fastify-api-reference";
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { serverAdapter } from "./connections/bull-board";
import SetupRoutes from "./routes/setup-routes";

const app = Fastify();


app.register(serverAdapter.registerPlugin(), {
   prefix: "/dashboard/jobs",
});


// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(Swagger, {
   openapi: {
      info: {
         title: "Lead Print",
         description: "Sistema de captação de lead e impressão para sorteiow",
         version: "0.0.1",
      },
   },
});

app.register(ScalarSwagger, {
   routePrefix: "/docs",
});


app.register(SetupRoutes)

export { app }