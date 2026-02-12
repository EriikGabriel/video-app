import { PencilIcon, PlayIcon, TrashIcon } from "@phosphor-icons/react"

interface VideoListItemProps {
  title: string
  description: string
  url: string
  onEdit?: () => void
  onDelete?: () => void
}

export function VideoListItem({
  title,
  description,
  url,
  onEdit,
  onDelete,
}: VideoListItemProps) {
  return (
    <li className="w-full min-h-40 border-3 border-neutral-700 bg-neutral-700 rounded-md flex gap-4">
      <div className="min-h-40 rounded-md w-60 bg-neutral-800 flex items-center justify-center">
        <button
          className="p-0 bg-transparent"
          onClick={() => window.open(url, "_blank")}
        >
          <PlayIcon
            className="size-10 text-orange-200 fill-orange-200"
            weight="fill"
          />
        </button>
      </div>

      <header className="flex flex-col justify-center gap-2 p-4">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="text-center text-neutral-400">{description}</p>
      </header>

      <div className="ml-auto flex flex-col items-center justify-center">
        <button
          className="text-yellow-500 hover:bg-yellow-500 hover:text-white"
          onClick={onEdit}
        >
          <PencilIcon className="size-6 text-white m-4" />
        </button>
        <button
          className="text-red-500 hover:bg-red-500 hover:text-white ml-auto"
          onClick={onDelete}
        >
          <TrashIcon className="size-6 text-white m-4" />
        </button>
      </div>
    </li>
  )
}
