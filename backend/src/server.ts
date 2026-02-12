import fastifyCors from "@fastify/cors"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { fastify } from "fastify"
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod"

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(fastifyCors, { origin: "*" })

server.register(fastifySwagger, {
  swagger: {
    info: {
      title: "Video App API",
      description: "API para gerenciamento de vídeos",
      version: "1.0.0",
    },
  },
})

server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
})

server.get("/", async (request, reply) => {
  return { message: "Hello, World!" }
})

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(`Server listening at ${address}`)
})
