"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Film, ImageOff } from "lucide-react";

// ─── Media Type Detection ────────────────────────────────────────────────────

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|avi|mkv|m4v)(\?|$)/i;
const GIF_EXTENSION = /\.gif(\?|$)/i;

/** Returns the rendering strategy for a given URL. */
function getMediaType(url: string): "video" | "gif" | "image" {
  if (VIDEO_EXTENSIONS.test(url)) return "video";
  if (GIF_EXTENSION.test(url)) return "gif";
  return "image";
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface MediaRendererProps {
  /** The media URL to render. */
  src: string;
  /** Alt text for images/GIFs. */
  alt?: string;
  /** Additional CSS classes applied to the media element itself. */
  className?: string;
  /**
   * When true, videos auto-play on hover and pause on mouse-out.
   * @default true
   */
  hoverPlay?: boolean;
  /**
   * When true, videos loop.
   * @default true
   */
  loop?: boolean;
  /**
   * When true, videos are muted.
   * @default true
   */
  muted?: boolean;
  /** Poster image for videos (shown before playback). */
  poster?: string;
  /** Override object-fit. @default "cover" */
  objectFit?: "cover" | "contain" | "fill" | "none";
  /** If true, show a play icon overlay for videos. */
  showPlayIcon?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Universal media renderer that auto-detects file type from the URL
 * and renders the correct element (video, img for GIF, or img for static image).
 *
 * Features:
 * - Videos: hover-to-play, muted, looping, playsInline
 * - GIFs: rendered as <img> with no lazy loading (preserves animation)
 * - Images: rendered as <img> with lazy loading
 * - Broken media: fallback placeholder with icon
 */
export const MediaRenderer: React.FC<MediaRendererProps> = ({
  src,
  alt = "",
  className,
  hoverPlay = true,
  loop = true,
  muted = true,
  poster,
  objectFit = "cover",
  showPlayIcon = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-zinc-900/50 text-zinc-700",
          className,
        )}
      >
        <ImageOff className="h-6 w-6" />
      </div>
    );
  }

  const type = getMediaType(src);
  const fitClass =
    objectFit === "cover"
      ? "object-cover"
      : objectFit === "contain"
        ? "object-contain"
        : objectFit === "fill"
          ? "object-fill"
          : "";

  // ── Video ──────────────────────────────────────────────────────────────
  if (type === "video") {
    return (
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          loop={loop}
          playsInline
          preload="metadata"
          className={cn(fitClass, "w-full h-full", className)}
          onError={() => setHasError(true)}
          {...(hoverPlay
            ? {
                onMouseOver: (e) => {
                  e.currentTarget.play().catch(() => {});
                },
                onMouseOut: (e) => {
                  e.currentTarget.pause();
                },
              }
            : {})}
        />
        {showPlayIcon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/40 backdrop-blur-sm h-10 w-10 rounded-full flex items-center justify-center border border-white/10">
              <Film className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── GIF ────────────────────────────────────────────────────────────────
  if (type === "gif") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn(fitClass, className)}
        onError={() => setHasError(true)}
        // Don't lazy-load GIFs — they need to start immediately
      />
    );
  }

  // ── Static Image ──────────────────────────────────────────────────────
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn(fitClass, className)}
      onError={() => setHasError(true)}
    />
  );
};
