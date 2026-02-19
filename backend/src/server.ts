import fastifyCors from "@fastify/cors"
import fastifyMultipart from "@fastify/multipart"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { fastify } from "fastify"
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod"
import { routes } from "./routes"

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type"],
  credentials: false,
})

server.register(fastifyMultipart, {
  attachFieldsToBody: false,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
})

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "VideoMe API",
      description: "API para gerenciamento de vídeos",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
})

server.register(routes)

const PORT = Number(process.env.PORT) || 3000
const HOST = process.env.HOST || "0.0.0.0"

server.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(`Server listening at ${address}`)
})
