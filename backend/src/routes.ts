import z from "zod"
import { prisma } from "./lib/prisma"
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
      return prisma.video.findMany().then((videos: Video[]) => {
        return reply.status(200).send(videos)
      })
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
          400: z.object({}).describe("Erro ao criar vídeo"),
        },
      },
    },
    async (request, reply) => {
      const { description, title, url } = request.body

      await prisma.video
        .create({
          data: {
            title,
            description,
            url,
          },
        })
        .then(() => {
          console.debug("Vídeo criado com sucesso")
          return reply.status(201).send({})
        })
        .catch((error) => {
          console.error("Erro ao criar vídeo:", error)
          return reply.status(400).send({})
        })
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
          400: z.object({}).describe("Erro ao atualizar vídeo"),
          404: z.object({}).describe("Vídeo não encontrado"),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const { title, description, url } = request.body

      const video = await prisma.video.findUnique({ where: { id } })

      if (!video) {
        return reply.status(404).send({})
      }

      await prisma.video
        .update({
          where: { id },
          data: {
            title: title ?? video.title,
            description: description ?? video.description,
            url: url ?? video.url,
          },
        })
        .then(() => {
          console.debug("Vídeo atualizado com sucesso")
          return reply.status(200).send({})
        })
        .catch((error) => {
          console.error("Erro ao atualizar vídeo:", error)
          return reply.status(400).send({})
        })
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
          400: z.object({}).describe("Erro ao remover vídeo"),
          404: z.object({}).describe("Vídeo não encontrado"),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const video = await prisma.video.findUnique({ where: { id } })

      if (!video) {
        return reply.status(404).send({})
      }

      await prisma.video
        .delete({ where: { id } })
        .then(() => {
          console.debug("Vídeo removido com sucesso")
          return reply.status(200).send({})
        })
        .catch((error) => {
          console.error("Erro ao remover vídeo:", error)
          return reply.status(400).send({})
        })
    },
  )
}
