import { XIcon } from "@phosphor-icons/react"
import type { DataType } from "../types"

type FormModalProps = {
  onClose: () => void
  open?: boolean
  videoData: DataType | null
}

export function FormModal({
  onClose,
  open = false,
  videoData,
}: FormModalProps) {
  const handleClose = () => {
    onClose()
  }

  const addVideo = () => {
    // Lógica para adicionar vídeo
  }

  const editVideo = () => {
    // Lógica para editar vídeo
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (videoData) {
      editVideo()
    } else {
      addVideo()
    }

    handleClose()
  }

  if (!open) return null

  return (
    <div
      className="absolute top-0 left-0 bg-black/85 w-full h-full flex items-center justify-center z-30"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-zinc-800 absolute max-h-3/4 w-1/2 rounded-xl pointer-events-auto"
        role="document"
      >
        <header className="flex items-center justify-between pr-4 border-b border-neutral-600">
          <h2
            id="modal-title"
            className="text-2xl font-semibold  text-white p-4"
          >
            {videoData ? "Editar vídeo" : "Adicionar novo vídeo"}
          </h2>
          <button
            className="text-white"
            aria-label="Fechar modal"
            onClick={handleClose}
          >
            <XIcon className="size-5 text-white" aria-hidden="true" />
          </button>
        </header>

        <form className="p-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-sm text-neutral-400">
              Título do vídeo
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full p-2 rounded-md bg-neutral-700 border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-200"
              defaultValue={videoData?.title}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="url" className="text-sm text-neutral-400">
              URL do vídeo
            </label>
            <input
              type="url"
              id="url"
              name="url"
              className="w-full p-2 rounded-md bg-neutral-700 border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-200"
              defaultValue={videoData?.url}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm text-neutral-400">
              Descrição do vídeo
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full p-2 rounded-md bg-neutral-700 border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
              defaultValue={videoData?.description}
              required
            />
          </div>

          <button
            type="submit"
            className="self-end px-4 py-2 rounded-md bg-orange-200 text-neutral-900 font-semibold hover:bg-orange-300 transition-colors"
          >
            {videoData ? "Salvar alterações" : "Adicionar vídeo"}
          </button>
        </form>
      </div>
    </div>
  )
}
