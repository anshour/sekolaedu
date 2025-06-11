import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";

// TODO: CHANGE THIS TO DATABASE PATH
const client = new PGlite("./pgdata");

const db = drizzle({ client, schema });

export default db;
