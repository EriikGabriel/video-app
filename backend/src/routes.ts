import type { MultipartValue } from "@fastify/multipart"
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary"
import { Readable } from "node:stream"
import z from "zod"
import { cloudinary } from "./lib/cloudinary.js"
import { prisma } from "./lib/prisma.js"
import { FastifyTypedInstance } from "./types.js"

interface Video {
  id: string
  title: string
  description: string
  url: string
  cloudinaryId: string
}

interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  resource_type: string
  format: string
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
              cloudinaryId: z.string(),
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
        description:
          "Adiciona um novo vídeo (multipart/form-data: title, description, file)",
        consumes: ["multipart/form-data"],
        response: {
          201: z.object({}).describe("Vídeo criado com sucesso"),
          400: z.object({ error: z.string() }).describe("Erro ao criar vídeo"),
        },
      },
    },
    async (request, reply) => {
      try {
        const data = await request.file()

        if (!data) {
          return reply
            .status(400)
            .send({ error: "Arquivo de vídeo é obrigatório" })
        }

        const fields = data.fields
        const title = (fields.title as MultipartValue)?.value as string
        const description = (fields.description as MultipartValue)
          ?.value as string

        if (!title || !description) {
          return reply
            .status(400)
            .send({ error: "Título e descrição são obrigatórios" })
        }

        const chunks: Buffer[] = []
        for await (const chunk of data.file) chunks.push(chunk)
        const buffer = Buffer.concat(chunks)

        const uploadResult = await new Promise<CloudinaryUploadResult>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: "video",
                folder: "videome",
                use_filename: true,
              },
              (
                error: UploadApiErrorResponse | undefined,
                result: UploadApiResponse | undefined,
              ) => {
                if (error) reject(error)
                else if (result) resolve(result as CloudinaryUploadResult)
              },
            )

            const readableStream = Readable.from(buffer)
            readableStream.pipe(uploadStream)
          },
        )

        await prisma.video.create({
          data: {
            title,
            description,
            url: uploadResult.secure_url,
            cloudinaryId: uploadResult.public_id,
          },
        })

        console.debug("Vídeo criado com sucesso")
        return reply.status(201).send({})
      } catch (error) {
        console.error("Erro ao criar vídeo:", error)
        return reply.status(400).send({ error: "Erro ao criar vídeo" })
      }
    },
  )

  server.patch(
    "/videos/:id",
    {
      schema: {
        tags: ["videos"],
        description:
          "Atualiza um vídeo existente (multipart/form-data: title, description, file)",
        consumes: ["multipart/form-data"],
        params: z.object({
          id: z.string().describe("ID do vídeo"),
        }),
        response: {
          200: z.object({}).describe("Vídeo atualizado com sucesso"),
          400: z
            .object({ error: z.string() })
            .describe("Erro ao atualizar vídeo"),
          404: z.object({}).describe("Vídeo não encontrado"),
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }

        const video = await prisma.video.findUnique({ where: { id } })

        if (!video) {
          return reply.status(404).send({})
        }

        const data = await request.file()

        if (!data) {
          return reply
            .status(400)
            .send({ error: "Arquivo de vídeo é obrigatório" })
        }

        const fields = data.fields
        const title = (fields.title as MultipartValue)?.value as string
        const description = (fields.description as MultipartValue)
          ?.value as string

        if (!title || !description) {
          return reply
            .status(400)
            .send({ error: "Título e descrição são obrigatórios" })
        }

        const chunks: Buffer[] = []
        for await (const chunk of data.file) chunks.push(chunk)
        const buffer = Buffer.concat(chunks)

        const uploadResult = await new Promise<CloudinaryUploadResult>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: "video",
                folder: "videome",
                use_filename: true,
              },
              (
                error: UploadApiErrorResponse | undefined,
                result: UploadApiResponse | undefined,
              ) => {
                if (error) reject(error)
                else if (result) resolve(result as CloudinaryUploadResult)
              },
            )

            const readableStream = Readable.from(buffer)
            readableStream.pipe(uploadStream)
          },
        )

        try {
          await cloudinary.uploader.destroy(video.cloudinaryId, {
            resource_type: "video",
          })
        } catch (err) {
          console.error("Erro ao deletar vídeo antigo do Cloudinary:", err)
        }

        await prisma.video.update({
          where: { id },
          data: {
            title,
            description,
            url: uploadResult.secure_url,
            cloudinaryId: uploadResult.public_id,
          },
        })

        console.debug("Vídeo atualizado com sucesso")
        return reply.status(200).send({})
      } catch (error) {
        return reply.status(400).send({ error: "Erro ao atualizar vídeo" })
      }
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

      if (video.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(video.cloudinaryId, {
            resource_type: "video",
          })
        } catch (err) {
          console.error("Erro ao deletar vídeo do Cloudinary:", err)
        }
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
