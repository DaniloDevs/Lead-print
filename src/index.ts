import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifyScalar from "@scalar/fastify-api-reference";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { serverAdapter } from "./connections/bull-board";
import SetupRoutes from "./routes/setup-routes";
import Multipart from "@fastify/multipart"
import { env } from "./env";

const app = Fastify();


app.register(serverAdapter.registerPlugin(), {
   prefix: "/dashboard/jobs",
});

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(Multipart);

app.register(fastifySwagger, {
   openapi: {
      info: {
         title: "Lead Print API",
         description: `
**Orquestrador de Captação de Leads e Impressão Térmica.**

Esta API gerencia o fluxo completo de eventos presenciais, desde o cadastro de participantes até a emissão física de comprovantes para sorteios.

### Módulos Principais:
* **Hardware Integration:** Controle direto de impressoras térmicas (USB/Serial).
* **Background Jobs:** Processamento assíncrono de filas (via BullMQ) para garantir alta disponibilidade.
* **Event Management:** Gestão de múltiplos eventos e seus respectivos leads.
         `,
         version: "1.0.0",
      },
      servers: [
         {
            url: `http://localhost:${env.PORT}`,
            description: 'Ambiente de Desenvolvimento (Local)'
         },
      ],
      tags: [
         { name: 'Events', description: 'Gerenciamento do ciclo de vida dos eventos e configurações globais.' },
         { name: 'Leads', description: 'Cadastro e consulta de participantes captados e validação de funil.' },
         { name: 'Printer', description: 'Integração direta com hardware, diagnóstico de conexão e comandos de impressão.' },
         { name: 'Jobs', description: 'Observabilidade das filas de processamento (Active, Waiting, Failed, Completed).' },
         { name: 'Metrics', description: 'Dashboards analíticos e KPIs de performance dos eventos.' },
      ]
   },
   transform: jsonSchemaTransform,
});

app.register(fastifyScalar, {
   routePrefix: "/docs",
   configuration: {
      searchHotKey: 'k',
      theme: 'deepSpace',
      layout: 'modern',
   }
});


app.register(SetupRoutes)

export { app }