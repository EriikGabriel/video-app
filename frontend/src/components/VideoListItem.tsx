import { PencilIcon, PlayIcon, TrashIcon } from "@phosphor-icons/react"

interface VideoListItemProps {
  title: string
  description: string
  url: string
  onPlay: () => void
  onEdit?: () => void
  onDelete?: () => void
}

function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

function getYouTubeThumbnail(url: string): string | null {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

export function VideoListItem({
  title,
  description,
  url,
  onPlay,
  onEdit,
  onDelete,
}: VideoListItemProps) {
  const thumbnail = getYouTubeThumbnail(url)

  return (
    <li className="w-full h-40 border-3 border-neutral-700 bg-neutral-700 rounded-md flex gap-4">
      <div className="h-full rounded-md w-60 bg-neutral-800 flex items-center justify-center overflow-hidden relative group shrink-0">
        {thumbnail ? (
          <>
            <img
              src={thumbnail}
              alt={`Thumbnail de ${title}`}
              className="w-full h-full object-cover absolute inset-0"
            />
            <button
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onPlay}
              aria-label="Assistir vídeo"
            >
              <PlayIcon
                className="size-16 text-orange-200 fill-orange-200 drop-shadow-lg"
                weight="fill"
                aria-hidden="true"
              />
            </button>
          </>
        ) : (
          <button
            className="p-0 bg-transparent"
            onClick={onPlay}
            aria-label="Assistir vídeo"
          >
            <PlayIcon
              className="size-10 text-orange-200 fill-orange-200"
              weight="fill"
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      <header className="flex flex-col justify-center gap-2 p-4">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="text-neutral-400">{description}</p>
      </header>

      <div className="ml-auto flex flex-col gap-2 items-center justify-center">
        <button
          className="text-yellow-500 hover:bg-yellow-500 hover:text-white"
          onClick={onEdit}
          aria-label="Editar vídeo"
        >
          <PencilIcon className="size-5 text-white m-4" aria-hidden="true" />
        </button>
        <button
          className="text-red-500 hover:bg-red-500 hover:text-white ml-auto"
          onClick={onDelete}
          aria-label="Excluir vídeo"
        >
          <TrashIcon className="size-5 text-white m-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}
