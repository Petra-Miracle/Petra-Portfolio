"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/effect-cards";

import { cn } from "@/lib/utils";

const Skiper47 = () => {
  const images = [
    {
      src: "/images/x.com/11.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/13.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/32.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/20.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/21.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: "/images/x.com/19.jpeg",
      alt: "Illustrations by my fav AarzooAly",
    },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3]">
      <Carousel_001 className="" images={images} showPagination loop />
    </div>
  );
};

export { Skiper47 };

const Carousel_001 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 40,
  onActiveChange,
  onSlideClick,
}: {
  images: { src: string; alt: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
  /** Called with the real slide index whenever it changes (added by consumer). */
  onActiveChange?: (index: number) => void;
  /** Called with the real slide index when a slide is clicked (added by consumer). */
  onSlideClick?: (index: number) => void;
}) => {
  const css = `
  .Carousal_001 {
    padding-bottom: 50px !important;
  }
  .Carousal_001 .swiper-slide {
    opacity: 0.45;
    transition: opacity 0.35s ease, box-shadow 0.35s ease;
  }
  .Carousal_001 .swiper-slide-active {
    opacity: 1;
    box-shadow: 0 24px 56px rgba(21, 20, 15, 0.25);
  }
  `;
  function handleSlideClick(e: React.MouseEvent) {
    if (!onSlideClick) return;
    const el = (e.target as HTMLElement).closest("[data-swiper-slide-index]");
    const idx = Number(el?.getAttribute("data-swiper-slide-index"));
    if (!Number.isNaN(idx)) onSlideClick(idx);
  }
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("w-3xl relative", className)}
    >
      <style>{css}</style>

      <Swiper
        spaceBetween={spaceBetween}
        autoplay={
          autoplay
            ? {
                delay: 1500,
                disableOnInteraction: false,
              }
            : false
        }
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={loop}
        slidesPerView={2.43}
        breakpoints={{
          0: { slidesPerView: 1.25 },
          640: { slidesPerView: 1.6 },
          1024: { slidesPerView: 2.43 },
        }}
        onSlideChange={(swiper) => onActiveChange?.(swiper.realIndex)}
        coverflowEffect={{
          rotate: 0,
          slideShadows: false,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={
          showPagination
            ? {
                clickable: true,
              }
            : false
        }
        navigation={
          showNavigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }
            : false
        }
        className="Carousal_001"
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            onClick={handleSlideClick}
            className="!h-[260px] w-full overflow-hidden rounded-[20px] border border-border bg-surface-alt sm:!h-[320px]"
          >
            {image.src ? (
              <img
                className="h-full w-full object-cover"
                src={image.src}
                alt={image.alt}
                draggable={false}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-dark-surface p-6 text-center">
                <span className="font-display text-[15px] font-semibold leading-snug text-background">
                  {image.alt}
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-dark-muted">
                  No photo
                </span>
              </div>
            )}
          </SwiperSlide>
        ))}
        {showNavigation && (
          <div>
            <div className="swiper-button-next after:hidden">
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </div>
            <div className="swiper-button-prev after:hidden">
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </Swiper>
    </motion.div>
  );
};

export { Carousel_001 };

/**
  * Skiper 47 Carousel_001, React + Swiper
 * Built with Swiper.js - Read docs to learn more https://swiperjs.com/
 * Illustrations by AarzooAly - https://x.com/AarzooAly
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
