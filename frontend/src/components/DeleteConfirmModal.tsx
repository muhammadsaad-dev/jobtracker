interface DeleteConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDeleting?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 text-rose-600 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-xl">
            ⚠️
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition flex items-center gap-2 ${
              isDeleting ? "bg-rose-400 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
            }`}
          >
            {isDeleting && (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{isDeleting ? "Deleting..." : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
