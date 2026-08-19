'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCarouselProps {
  images: string[];
  title: string;
}

const FALLBACK_TRAVEL_IMAGE = 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80';

export function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Feature Display */}
      <div className="relative h-[380px] sm:h-[500px] w-full overflow-hidden bg-[#EBE4D5]">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex] || FALLBACK_TRAVEL_IMAGE}
            alt={`${title} - Photo ${currentIndex + 1}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_TRAVEL_IMAGE;
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Quiet Prev/Next Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-[#FAF7F2]/90 text-[#1C242B] text-xs font-serif-heading hover:bg-[#FAF7F2] border border-[#E8E1D1] transition-all"
        >
          ← Prev
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-[#FAF7F2]/90 text-[#1C242B] text-xs font-serif-heading hover:bg-[#FAF7F2] border border-[#E8E1D1] transition-all"
        >
          Next →
        </button>

        {/* Photo counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-[#FAF7F2]/90 text-xs font-mono text-[#1C242B] border border-[#E8E1D1]">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails row */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative h-20 w-32 shrink-0 border-2 transition-all bg-[#EBE4D5] ${
              idx === currentIndex
                ? 'border-[#C86D51] opacity-100'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={img}
              alt={`Thumb ${idx}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_TRAVEL_IMAGE;
              }}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
