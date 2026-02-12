import axios from "axios"
import { useEffect, useState } from "react"
import type { Video, VideoFormData } from "../types"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data } = await api.get<Video[]>("/videos")
      setVideos(data)
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.message : "Erro desconhecido")
      console.error("Erro ao buscar vídeos:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const addVideo = async (data: VideoFormData) => {
    try {
      await api.post("/videos", data)
      await fetchVideos()
    } catch (err) {
      console.error("Erro ao adicionar vídeo:", err)
      throw err
    }
  }

  const updateVideo = async (id: string, data: VideoFormData) => {
    try {
      await api.patch(`/videos/${id}`, data)
      await fetchVideos()
    } catch (err) {
      console.error("Erro ao atualizar vídeo:", err)
      throw err
    }
  }

  const deleteVideo = async (id: string) => {
    try {
      await api.delete(`/videos/${id}`)
      await fetchVideos()
    } catch (err) {
      console.error("Erro ao deletar vídeo:", err)
      throw err
    }
  }

  return {
    videos,
    loading,
    error,
    addVideo,
    updateVideo,
    deleteVideo,
    refetch: fetchVideos,
  }
}
