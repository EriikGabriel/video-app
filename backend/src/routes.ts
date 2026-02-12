import { FastifyTypedInstance } from "./types"

export async function routes(server: FastifyTypedInstance) {
  server.get("/", async (request, reply) => {
    return { message: "Hello, World!" }
  })
}
