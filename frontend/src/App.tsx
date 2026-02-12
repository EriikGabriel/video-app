import { PlusIcon } from "@phosphor-icons/react"
import { useState } from "react"
import { FormModal } from "./components/FormModal"
import { VideoListItem } from "./components/VideoListItem"
import type { DataType } from "./types"

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editModalData, setEditModalData] = useState<DataType | null>(null)

  const handleOpenModal = (data: DataType | null) => {
    setEditModalData(data)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
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
              onClick={() => handleOpenModal(null)}
            >
              <PlusIcon
                className="inline text-neutral-900 size-5"
                aria-hidden="true"
              />
            </button>

            <article
              className="w-full h-full border-2 border-dashed border-neutral-600 rounded-md hidden flex-col items-center justify-center gap-4"
              aria-live="polite"
            >
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-2xl font-semibold text-white">
                  Nenhum vídeo adicionado
                </h2>
                <p className="text-center text-neutral-400">
                  Clique no botão <strong>+</strong> para adicionar um novo
                  vídeo
                </p>
              </div>
            </article>

            <ul className="flex flex-col gap-2 list-none">
              <VideoListItem
                title="Titulo do Vídeo 1"
                description="Descrição breve do vídeo para dar mais contexto ao usuário."
                url="https://example.com/video1"
                onEdit={() =>
                  handleOpenModal({
                    title: "Titulo do Vídeo 1",
                    description:
                      "Descrição breve do vídeo para dar mais contexto ao usuário.",
                    url: "https://example.com/video1",
                  })
                }
              />
              <VideoListItem
                title="Titulo do Vídeo 2"
                description="Descrição breve do vídeo para dar mais contexto ao usuário."
                url="https://example.com/video2"
              />
              <VideoListItem
                title="Titulo do Vídeo 3"
                description="Descrição breve do vídeo para dar mais contexto ao usuário."
                url="https://example.com/video3"
              />
            </ul>
          </section>
        </div>

        <FormModal
          open={isModalOpen}
          onClose={handleCloseModal}
          videoData={editModalData}
        />
      </main>
    </>
  )
}
