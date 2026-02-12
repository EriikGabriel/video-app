import { randomUUID } from "node:crypto"
import z from "zod"
import { FastifyTypedInstance } from "./types"

interface Video {
  id: string
  title: string
  description: string
  url: string
}

const videos: Video[] = []

export async function routes(server: FastifyTypedInstance) {
  server.get(
    "/videos",
    {
      schema: {
        tags: ["videos"],
        description: "Retorna a lista de vídeos",
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              description: z.string(),
              url: z.string(),
            }),
          ),
        },
      },
    },
    async (request, reply) => {
      return videos
    },
  )

  server.post(
    "/videos",
    {
      schema: {
        tags: ["videos"],
        description: "Adiciona um novo vídeo",
        body: z.object({
          title: z.string(),
          description: z.string(),
          url: z.url(),
        }),
        response: {
          201: z.object({}).describe("Vídeo criado com sucesso"),
        },
      },
    },
    async (request, reply) => {
      const { description, title, url } = request.body

      videos.push({
        id: randomUUID(),
        title,
        description,
        url,
      })

      return reply.status(201).send({})
    },
  )

  server.patch(
    "/videos/:id",
    {
      schema: {
        tags: ["videos"],
        description: "Atualiza um vídeo existente",
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          url: z.url().optional(),
        }),
        response: {
          200: z.object({}).describe("Vídeo atualizado com sucesso"),
          404: z.object({}).describe("Vídeo não encontrado"),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const { title, description, url } = request.body

      const video = videos.find((v) => v.id === id)

      if (!video) {
        return reply.status(404).send({})
      }

      if (title) video.title = title
      if (description) video.description = description
      if (url) video.url = url

      return reply.status(200).send({})
    },
  )

  server.delete(
    "/videos/:id",
    {
      schema: {
        tags: ["videos"],
        description: "Remove um vídeo existente",
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({}).describe("Vídeo removido com sucesso"),
          404: z.object({}).describe("Vídeo não encontrado"),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const removeIndex = videos.findIndex((v) => v.id === id)

      if (removeIndex === -1) {
        return reply.status(404).send({})
      }

      videos.splice(removeIndex, 1)

      return reply.status(200).send({})
    },
  )
}
