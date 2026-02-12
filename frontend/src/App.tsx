import { PlusIcon } from "@phosphor-icons/react"
import { useState } from "react"
import { FormModal } from "./components/FormModal"
import { MessageModal } from "./components/MessageModal"
import { VideoListItem } from "./components/VideoListItem"
import { useVideos } from "./hooks/useVideos"
import type { MessageModalData, VideoFormData, VideoToEdit } from "./types"

export function App() {
  const { videos, loading, error, addVideo, updateVideo, deleteVideo } =
    useVideos()

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoToEdit | null>(null)
  const [messageModalData, setMessageModalData] =
    useState<MessageModalData>(null)

  const handleOpenAddModal = () => {
    setEditingVideo(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEditModal = (video: VideoToEdit) => {
    setEditingVideo(video)
    setIsFormModalOpen(true)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setEditingVideo(null)
  }

  const handleFormSubmit = async (data: VideoFormData) => {
    try {
      if (editingVideo) {
        await updateVideo(editingVideo.id, data)
      } else {
        await addVideo(data)
      }
    } catch (err) {
      setMessageModalData({
        title: "Erro",
        message: `Erro ao ${editingVideo ? "atualizar" : "adicionar"} vídeo. Tente novamente.`,
        actionLabel: "OK",
        onAction: () => setMessageModalData(null),
      })

      console.error(
        `Erro ao ${editingVideo ? "atualizar" : "adicionar"} vídeo:`,
        err,
      )
    }
  }

  const handleOpenDeleteModal = (id: string, title: string) => {
    setMessageModalData({
      title: "Excluir vídeo",
      message: `Tem certeza que deseja excluir o vídeo "${title}"?`,
      actionLabel: "Excluir",
      onAction: async () => {
        try {
          await deleteVideo(id)
        } catch (err) {
          setMessageModalData({
            title: "Erro",
            message: "Não foi possível excluir o vídeo. Tente novamente.",
            actionLabel: "OK",
            onAction: () => setMessageModalData(null),
          })

          console.error("Erro ao excluir vídeo:", err)
        }
      },
    })
  }

  const handlePlayVideo = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <>
      <main className="bg-zinc-900 min-w-dvh min-h-dvh h-full flex items-center justify-center">
        <div className="flex flex-col w-1/2 h-[80vh] gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-center">
              Bem vindo ao <span className="text-orange-200">VideoMe</span>
            </h1>
            <p className="text-center text-white">
              Aqui você pode assistir aos seus vídeos favoritos.
            </p>
          </div>

          <section
            className="p-2 border-t border-t-neutral-600 h-full w-full relative"
            aria-label="Lista de vídeos"
          >
            <button
              className="p-2 rounded-md absolute -top-5 right-5 bg-orange-200 z-10"
              aria-label="Adicionar novo vídeo"
              onClick={handleOpenAddModal}
            >
              <PlusIcon
                className="inline text-neutral-900 size-5"
                aria-hidden="true"
              />
            </button>

            {loading ? (
              <article className="w-full h-full border-2 border-dashed border-neutral-600 rounded-md flex flex-col items-center justify-center gap-4">
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col items-center gap-2"
                >
                  <h2 className="text-2xl font-semibold text-white">
                    Carregando vídeos...
                  </h2>
                </div>
              </article>
            ) : error ? (
              <article className="w-full h-full border-2 border-dashed border-red-600 rounded-md flex flex-col items-center justify-center gap-4">
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col items-center gap-2"
                >
                  <h2 className="text-2xl font-semibold text-red-400">
                    Erro ao carregar vídeos
                  </h2>
                  <p className="text-center text-neutral-400">{error}</p>
                </div>
              </article>
            ) : videos.length === 0 ? (
              <article className="w-full h-full border-2 border-dashed border-neutral-600 rounded-md flex flex-col items-center justify-center gap-4">
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col items-center gap-2"
                >
                  <h2 className="text-2xl font-semibold text-white">
                    Nenhum vídeo adicionado
                  </h2>
                  <p className="text-center text-neutral-400">
                    Clique no botão <strong>+</strong> para adicionar um novo
                    vídeo
                  </p>
                </div>
              </article>
            ) : (
              <ul className="flex flex-col gap-2 list-none">
                {videos.map((video) => (
                  <VideoListItem
                    key={video.id}
                    title={video.title}
                    description={video.description}
                    url={video.url}
                    onPlay={() => handlePlayVideo(video.url)}
                    onEdit={() => handleOpenEditModal(video)}
                    onDelete={() =>
                      handleOpenDeleteModal(video.id, video.title)
                    }
                  />
                ))}
              </ul>
            )}
          </section>
        </div>

        <FormModal
          open={isFormModalOpen}
          onClose={handleCloseFormModal}
          onSubmit={handleFormSubmit}
          videoData={editingVideo}
        />
        {messageModalData && (
          <MessageModal
            title={messageModalData.title}
            message={messageModalData.message}
            actionLabel={messageModalData.actionLabel}
            onClose={() => setMessageModalData(null)}
            onAction={messageModalData.onAction}
            open={true}
          />
        )}
      </main>
    </>
  )
}
