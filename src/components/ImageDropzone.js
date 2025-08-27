import * as React from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";

export default function ImageDropzone({
  onChange,
  initialPreviewUrl,
  disabled = false,
  maxSizeMB = 5,
  accept = "image/png,image/jpeg,image/jpg,image/webp,image/gif",
  className = "",
  label = "Перетащите изображение или нажмите, чтобы выбрать",
}) {
  const inputRef = React.useRef(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState(initialPreviewUrl || null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const openFileDialog = () => {
    if (disabled) return;
    if (inputRef.current) inputRef.current.click();
  };

  const validateFile = (f) => {
    const allowed = accept
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const typeOk = allowed.length === 0 || allowed.includes(f.type.toLowerCase());
    if (!typeOk) return "Недопустимый тип файла";

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (f.size > maxBytes) return `Файл больше ${maxSizeMB} МБ`;

    return null;
  };

  const handleFiles = async (files) => {
    const f = files[0];
    if (!f) return;

    const err = validateFile(f);
    if (err) {
      setError(err);
      return;
    }

    setError(null);
    setLoading(true);

    const url = URL.createObjectURL(f);
    setFile(f);
    setPreviewUrl((old) => {
      if (old && old.startsWith("blob:")) URL.revokeObjectURL(old);
      return url;
    });

    requestAnimationFrame(() => setLoading(false));
    if (onChange) onChange(f);
  };

  const onInputChange = (e) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;
    const dt = e.dataTransfer;
    if (dt?.files && dt.files.length) handleFiles(dt.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const clearImage = () => {
    setFile(null);
    setError(null);
    setPreviewUrl((old) => {
      if (old && old.startsWith("blob:")) URL.revokeObjectURL(old);
      return null;
    });
    if (inputRef.current) inputRef.current.value = "";
    if (onChange) onChange(null);
  };

  return (
    <div className={`w-full ${className}`}>
      <VisuallyHidden>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          aria-label="Выбрать изображение"
          onChange={onInputChange}
          disabled={disabled}
        />
      </VisuallyHidden>

      <motion.div
        layout
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        whileHover={!disabled ? { scale: 1.01 } : undefined}
        className={[
          "relative flex h-56 w-full cursor-pointer items-center justify-center overflow-hidden",
          "rounded-2xl border border-dashed transition-all",
          disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-sm",
          isDragOver ? "border-indigo-500 bg-indigo-50/60" : "border-neutral-300 bg-neutral-50",
        ].join(" ")}
        role="button"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={openFileDialog}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFileDialog();
          }
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.img
              key="preview"
              src={previewUrl}
              alt="Предпросмотр"
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0.6, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            />
          ) : (
            <motion.div
              key="empty"
              className="flex flex-col items-center gap-2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="rounded-xl border border-neutral-300 p-3">
                <ImageIcon className="h-6 w-6" aria-hidden />
              </div>
              <div className="text-sm text-neutral-700">{label}</div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Upload className="h-4 w-4" aria-hidden />
                <span>PNG, JPG, WEBP • до {maxSizeMB} МБ</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-none absolute right-2 top-2 flex gap-2">
          {loading && (
            <span className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-xs shadow">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Загрузка
            </span>
          )}
          {previewUrl && !disabled && (
            <button
              type="button"
              title="Очистить"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-white/90 p-1.5 shadow transition hover:bg-white"
            >
              <X className="h-4 w-4" aria-hidden />
              <span className="sr-only">Убрать изображение</span>
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-2 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}