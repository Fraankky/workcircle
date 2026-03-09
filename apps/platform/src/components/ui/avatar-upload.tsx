import { useRef, useState } from "react";
import { cn, getInitials } from "../../lib/utils";
import { uploadImage } from "../../lib/upload";

const sizes = {
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
} as const;

interface AvatarUploadProps {
  src?: string | null;
  name: string;
  size?: keyof typeof sizes;
  onUploaded: (publicUrl: string) => void;
  className?: string;
}

export function AvatarUpload({
  src,
  name,
  size = "lg",
  onUploaded,
  className,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displaySrc = preview ?? src;

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    setPreview(URL.createObjectURL(file));
    setError(null);
    setUploading(true);

    try {
      const publicUrl = await uploadImage(file, "avatar");
      onUploaded(publicUrl);
    } catch {
      setError("Upload gagal, coba lagi");
      setPreview(null);
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("relative inline-block shrink-0", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          "group relative rounded-full overflow-hidden flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-ascent focus:ring-offset-2 focus:ring-offset-bg",
          sizes[size],
        )}
        title="Ganti foto profil"
      >
        {/* Avatar image or initials */}
        {displaySrc ? (
          <img
            src={displaySrc}
            alt={name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-overlay text-fg font-semibold flex items-center justify-center">
            {getInitials(name)}
          </div>
        )}

        {/* Hover overlay */}
        {!uploading && (
          <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <CameraIcon />
          </div>
        )}

        {/* Uploading spinner */}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
            <svg
              className="animate-spin w-5 h-5 text-fg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
        )}
      </button>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />

      {/* Error tooltip */}
      {error && (
        <p className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] text-danger whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
}

function CameraIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
