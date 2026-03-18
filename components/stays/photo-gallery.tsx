'use client';

import { useState } from 'react';
import Image from 'next/image';

export function PhotoGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  const maxThumbnails = 4;
  const visibleThumbnails = images.slice(0, maxThumbnails);
  const remainingCount = images.length - maxThumbnails;

  return (
    <div>
      {/* Hero image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-card">
        <Image
          src={images[activeIndex]}
          alt="Stay photo"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {visibleThumbnails.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-selected={activeIndex === i}
              className={`relative h-20 w-28 overflow-hidden rounded-small border-2 transition focus-visible:ring-2 focus-visible:ring-accent ${
                activeIndex === i
                  ? 'border-accent'
                  : 'border-transparent hover:border-accent/50'
              }`}
            >
              <Image src={img} fill alt={`Thumbnail ${i + 1}`} className="object-cover" sizes="112px" />
              {/* "+N" overlay on last thumbnail if more images */}
              {i === maxThumbnails - 1 && remainingCount > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-semibold text-sm" aria-label={`${remainingCount} more photos`}>
                  +{remainingCount}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
