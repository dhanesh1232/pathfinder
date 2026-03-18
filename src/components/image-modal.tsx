"use client";

import {
  Check,
  FileText,
  Film,
  Grid2X2,
  ImagePlus,
  List,
  Loader2,
  Play,
  RefreshCcw,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import type { IconType } from "react-icons/lib";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface ImageFormat {
  url: string;
  name?: string;
  type?: string;
  fileName?: string;
  key?: string;
  lastModified?: Date;
  size?: number;
  thumbnail?: string;
  used?: boolean;
  usageCount?: number;
  usagePoints?: {
    category?: number;
    productFeatured?: number;
    productGallery?: number;
  };
}

interface ImageModalProps {
  onInsert?: (url: ImageFormat[]) => void;
  selected?: ImageFormat[];
  aspectRatio?: "square" | "portrait" | "landscape" | "free";
  maxSize?: number;
  multiple?: boolean;
  open?: boolean;
  setOpen?: (value: boolean) => void;
  trigger?: boolean;
  className?: string;
  selectedImages?: ImageFormat[];
  icon?: IconType;
  size?: string;
  folder?: string;
  apiUrl?: string;
  apiKey?: string;
  clientCode?: string;
}

function formatFileName(fileName: string) {
  if (!fileName) return "";
  let decoded = fileName;
  try {
    decoded = decodeURIComponent(fileName);
  } catch (_e) {}

  // Remove extension
  let cleanName = decoded.replace(/\.[^/.]+$/, "");

  // Replace underscores, hyphens, and special characters with spaces
  cleanName = cleanName.replace(/[-_]/g, " ");
  cleanName = cleanName.replace(/[^a-zA-Z0-9 ]/g, " ");

  // Collapse multiple spaces
  cleanName = cleanName.replace(/\s+/g, " ");

  // Capitalize first letter of each word
  cleanName = cleanName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return cleanName.trim();
}

const formatBytes = (bytes: number | undefined, decimals = 1) => {
  if (!bytes || !+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

const getDisplayName = (src: ImageFormat) => {
  if (src.fileName) return src.fileName;
  if (!src.url) return "";
  const decoded = decodeURIComponent(src.url.split("/").pop() || "");
  return decoded.replace(/_\d{13}(\.[^.]+)$/, "$1").replace(/\.[^/.]+$/, "");
};

export const ImageModal: React.FC<ImageModalProps> = ({
  onInsert,
  selected,
  maxSize = 5,
  multiple = false,
  open,
  setOpen,
  trigger = false,
  className,
  selectedImages: externalSelectedImages,
  icon: Icon = ImagePlus,
  size = "size-10",
  folder = "profile",
  apiUrl,
  apiKey,
  clientCode,
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [images, setImages] = React.useState<ImageFormat[]>([]);
  const [loadingImages, setLoadingImages] = React.useState(true);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedImages, setSelectedImage] = React.useState<ImageFormat[]>();

  React.useEffect(() => {
    if (open) {
      // console.log(selected);
      if (selected) {
        setSelectedImage([...selected]);
      } else {
        setSelectedImage([]);
      }
    } else {
      setSelectedImage([]);
    }
  }, [selected, open]);

  // ✅ Sync external selected images
  React.useEffect(() => {
    if (open && externalSelectedImages) {
      setSelectedImage([...externalSelectedImages]);
    }
  }, [externalSelectedImages, open]);

  const fetchImages = React.useCallback(async () => {
    try {
      setLoadingImages(true);
      // match API: param is `q`, not `search`
      const res = await fetch(
        `${apiUrl}/api/saas/images?q=${encodeURIComponent(searchQuery)}&folder=${folder}`,
        {
          headers: {
            "x-api-key": apiKey!,
            "x-client-code": clientCode!,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch images");

      const json = await res.json();
      // your SuccessHandles.Ok returns `{ message, data }`
      const list = json.data.images ?? [];

      setImages(list);
    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message);
    } finally {
      setLoadingImages(false);
    }
  }, [searchQuery, folder, apiKey, apiUrl, clientCode]);

  /** Simulated backend fetch */
  React.useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  /** Upload Simulation */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxSize * 1024 * 1024)
      return alert(`Max size is ${maxSize}MB`);
    if (
      !(
        file.type.startsWith("image/") ||
        file.type.startsWith("video/") ||
        file.type === "application/pdf"
      )
    )
      return alert("Please upload an image, video, or PDF file");

    setIsUploading(true);
    setUploadProgress(0);

    // fake progress bar while uploading
    const progress = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progress);
          return 90;
        }
        return prev + 5;
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch(`${apiUrl}/api/saas/images`, {
        method: "POST",
        body: formData,
        headers: {
          "x-api-key": apiKey!,
          "x-client-code": clientCode!,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed");
      }

      const json = await res.json();
      const data = json.data;

      const image: ImageFormat = data;

      setImages((prev) => [image, ...prev]);
      setSelectedImage([image]);

      setUploadProgress(100);
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message);
      setUploadProgress(0);
    } finally {
      clearInterval(progress);
      setIsUploading(false);
    }
  };

  /** Drag & Drop Upload */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  /** 🖱️ Choose from existing images */
  const handleSelectImage = (image: ImageFormat) => {
    if (multiple) {
      setSelectedImage((prev) =>
        prev?.some((item) => item.url === image.url)
          ? prev.filter((item) => item.url !== image.url)
          : [...(prev || []), image],
      );
    } else {
      setSelectedImage([image]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      const event = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleUpload(event);
    }
  };

  const isSelected = (src: ImageFormat) => {
    return selectedImages?.find((i) => i?.url === src?.url);
  };

  const handleDeleteMedia = async (e: React.MouseEvent, src: ImageFormat) => {
    e.stopPropagation();
    if (!src.key)
      return alert(
        "Cannot delete this media because it lacks an identifier key.",
      );
    if (!confirm("Are you sure you want to delete this media permanently?"))
      return;

    try {
      const res = await fetch(
        `${apiUrl}/api/saas/images?key=${encodeURIComponent(src.key)}`,
        {
          method: "DELETE",
          headers: {
            "x-api-key": apiKey!,
            "x-client-code": clientCode!,
          },
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete media");
      }

      setImages((prev) => prev.filter((img) => img.key !== src.key));
      setSelectedImage((prev) => prev?.filter((img) => img.key !== src.key));
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          <Button
            role="button"
            variant="image-outline"
            size="sm"
            aria-label="Upload Image"
            className={cn(
              "h-inherit flex h-full w-full cursor-pointer items-center justify-center border border-dashed focus-visible:ring-0",
              className,
            )}
          >
            <Icon className={cn(size, "text-primary/70")} />
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="flex max-h-[80vh] min-h-[65vh] flex-col gap-0 overflow-hidden rounded-md p-0 shadow-2xl sm:max-w-2xl">
        {/* Header */}
        <DialogHeader className="border-border/50 bg-background sticky top-0 z-0 border-b p-4">
          <DialogTitle className="text-lg font-semibold">
            Choose or Upload Media
          </DialogTitle>

          <div className="mt-3 flex items-center justify-between gap-2">
            {/* Search */}
            <div className="relative w-full">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-border focus:ring-primary/20 focus:border-primary w-full rounded-md border py-1.5 pr-4 pl-10 text-sm focus:ring-2"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={fetchImages}>
                {loadingImages ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
              </Button>
              <div className="border-border flex shrink-0 rounded-md border p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  data-active={viewMode === "grid"}
                  className={cn(
                    "data-[active=true]:bg-accent rounded-md border-0 transition-colors",
                  )}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  data-active={viewMode === "list"}
                  className={cn(
                    "data-[active=true]:bg-accent rounded-md border-0 p-1.5 transition-colors",
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="bg-background flex-1 space-y-2 overflow-y-auto p-4 py-2">
          {/* Upload Section */}
          <div
            className={cn(
              "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/60 hover:bg-primary/5",
              isUploading && "bg-muted/50",
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!isUploading ? (
              <>
                <Upload className="text-primary mb-2 h-8 w-8" />
                <p className="font-medium">
                  Drop your files or click to browse
                </p>
                <p className="text-muted-foreground text-sm">
                  Images, Videos & PDFs — Max {maxSize}MB
                </p>
                <input
                  type="file"
                  accept="image/*,video/*,application/pdf"
                  onChange={handleUpload}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="text-primary h-10 w-10 animate-spin" />
                <div className="bg-muted h-2 w-48 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-muted-foreground text-sm">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          {/* File Gallery */}
          <div className="flex flex-col">
            <p className="text-muted-foreground mb-1.5 text-sm font-medium">
              Your Media Files
            </p>
            {loadingImages ? (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-4 md:grid-cols-3 gap-2"
                    : "space-y-1.5",
                )}
              >
                {[...Array(6)].map((_, i) =>
                  viewMode === "grid" ? (
                    <Skeleton key={i} className="h-32 rounded-lg" />
                  ) : (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-16 w-16 rounded-lg" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ),
                )}
              </div>
            ) : images.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center py-12 text-center">
                <ImagePlus className="mb-3 h-10 w-10 opacity-40" />
                <p>No images found</p>
              </div>
            ) : (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-2"
                    : "flex flex-col space-y-2",
                )}
              >
                {images.map((src, i) => {
                  return (
                    <div
                      key={i}
                      onClick={() => handleSelectImage(src)}
                      className={cn(
                        "group relative cursor-pointer overflow-hidden rounded-md border transition-all duration-200",
                        isSelected(src)
                          ? "border-none ring-2 ring-blue-500"
                          : "border-border hover:border-blue-500/50 hover:shadow-sm",
                        viewMode === "list" && "flex items-center gap-4 p-1",
                      )}
                    >
                      <div
                        className={cn(
                          "relative p-0",
                          viewMode === "list" &&
                            "flex flex-1 items-center gap-4 w-full",
                        )}
                      >
                        <div
                          className={cn(
                            "bg-muted overflow-hidden shrink-0",
                            viewMode === "grid" ? "aspect-square" : "h-16 w-16",
                            "rounded-none relative",
                          )}
                        >
                          {src.url.match(/\.pdf$/i) ||
                          src.type === "application/pdf" ||
                          src.fileName?.match(/\.pdf$/i) ? (
                            <div className="h-full w-full relative flex flex-col items-center justify-center bg-muted/30 border border-border group/pdf cursor-pointer">
                              <FileText className="h-8 w-8 text-muted-foreground/60 transition-transform duration-200 group-hover/pdf:scale-110" />
                              <div className="absolute top-2 left-2 bg-red-500 text-white rounded px-1.5 py-0.5 flex items-center shadow-sm">
                                <span className="text-[9px] font-bold tracking-widest uppercase">
                                  PDF
                                </span>
                              </div>
                            </div>
                          ) : src.url.match(
                              /\.(mp4|webm|ogg|mov)$|^data:video\//,
                            ) ||
                            src.type?.startsWith("video/") ||
                            src.fileName?.match(/\.(mp4|webm|ogg|mov)$/) ? (
                            <div className="h-full w-full relative">
                              <video
                                src={src.url}
                                className="h-full w-full object-cover"
                                muted
                                onMouseOver={(e) => e.currentTarget.play()}
                                onMouseOut={(e) => {
                                  e.currentTarget.pause();
                                  e.currentTarget.currentTime = 0;
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                                <Play className="h-6 w-6 text-white drop-shadow-md" />
                              </div>
                              <div className="absolute top-1 left-1 bg-black/60 rounded px-1 flex items-center gap-1">
                                <Film className="h-3 w-3 text-white" />
                                <span className="text-[10px] text-white font-bold uppercase">
                                  Video
                                </span>
                              </div>
                            </div>
                          ) : (
                            <Image
                              width={100}
                              height={100}
                              loading="lazy"
                              src={src.url}
                              alt={src.name || `Media ${i}`}
                              className="h-full w-full transform object-cover transition-transform duration-150 ease-in-out group-hover:scale-105"
                            />
                          )}
                        </div>
                        {viewMode === "list" && (
                          <div className="min-w-0 flex-1">
                            <p
                              className="truncate text-sm font-medium"
                              title={formatFileName(getDisplayName(src))}
                            >
                              {formatFileName(getDisplayName(src)) ||
                                `Media ${i + 1}`}
                            </p>
                            <p className="text-muted-foreground truncate text-xs">
                              {src.size
                                ? formatBytes(src.size)
                                : "Unknown size"}
                              {src.lastModified &&
                                ` • ${new Date(src.lastModified).toLocaleDateString()}`}
                            </p>
                          </div>
                        )}

                        <div
                          className={cn(
                            "flex items-center gap-2",
                            viewMode === "grid" ? "" : "shrink-0 pr-2",
                          )}
                        >
                          {/* Delete Button */}
                          <button
                            onClick={(e) => handleDeleteMedia(e, src)}
                            className={cn(
                              "rounded-full bg-red-500 p-1.5 text-white shadow-md transition-all hover:bg-red-600 focus:opacity-100 z-10",
                              viewMode === "grid"
                                ? "absolute top-2 left-2 opacity-0 group-hover:opacity-100"
                                : "opacity-0 group-hover:opacity-100",
                            )}
                            title="Delete media"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>

                          {isSelected(src) ? (
                            <div
                              className={cn(
                                "bg-accent text-accent-foreground rounded-full p-1 shadow z-10",
                                viewMode === "grid"
                                  ? "absolute top-2 right-2"
                                  : "",
                              )}
                            >
                              <Check className="h-3 w-3" />
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "bg-accent text-accent-foreground transform rounded-full p-1 opacity-0 shadow transition-transform duration-100 ease-in-out group-hover:opacity-60 z-10",
                                viewMode === "grid"
                                  ? "absolute top-2 right-2"
                                  : "",
                              )}
                            >
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </div>
                      {viewMode === "grid" && (
                        <div className="px-2 py-1.5 border-t border-border bg-muted/30">
                          <p
                            className="truncate text-[11px] font-medium text-muted-foreground"
                            title={getDisplayName(src)}
                          >
                            {getDisplayName(src) || `Media ${i + 1}`}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-border bg-muted/10 sticky bottom-0 z-10 flex items-center justify-between border-t p-3">
          <span className="text-muted-foreground text-sm">
            {(selectedImages?.length ?? 0) > 0 ? (
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600" />
                Media selected{" "}
                <span className="font-bold text-blue-500">
                  {selectedImages?.length}
                </span>
              </span>
            ) : (
              "No media selected"
            )}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpen?.(!open);
                setSelectedImage([]);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={!selectedImages?.length || isUploading}
              onClick={() => {
                onInsert?.(selectedImages!);
                setOpen?.(!open);
                setSelectedImage([]);
              }}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                `Select`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
