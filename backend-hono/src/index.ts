import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Honso!");
});

export default {
  port: 8080,
  fetch: app.fetch,
};
