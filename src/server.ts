import { app } from ".";
import { env } from "./env";


app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
   console.log(`Server running on port: ${env.PORT}`);
   console.log(`-> Docs running at URL: http://localhost:3333/docs/ `);
   console.log(`-> Jobs Dashboard running at URL: http://localhost:3333/dashboard/jobs/`);
});
