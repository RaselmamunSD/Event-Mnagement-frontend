'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, ArrowRight, Users, CheckCircle2, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero() {
  const { t } = useLanguage();

  const slides = [
    {
      image: '/hero-slide-1.jpg',
      alt: 'Shahjahanpur Railway Open Scout Group Rally - Photo 1',
    },
    {
      image: '/hero-slide-2.jpg',
      alt: 'Shahjahanpur Railway Open Scout Group Gathering - Photo 2',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? 1 : 0));

  return (
    <section className="relative overflow-hidden min-h-[460px] md:min-h-[520px] lg:min-h-[560px] flex items-center pt-10 pb-8 md:pt-14 md:pb-10">
      {/* Background Slides with Smooth Transition */}
      <div className="absolute inset-0 -z-20 overflow-hidden bg-slate-950">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className={`w-full h-full object-cover object-[center_35%] filter contrast-[1.06] brightness-[1.0] transition-transform duration-7000 ease-out ${
                currentSlide === index ? 'scale-100' : 'scale-105'
              }`}
            />
          </div>
        ))}

        {/* Cinematic subtle dark gradient: ensures text readability without washing out any photo details */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-slate-950/15"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-2xl space-y-7 text-left">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.14] drop-shadow-md">
            <span className="block">{t('hero_title').split(' ')[0]}</span>
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
              {t('hero_title').split(' ').slice(1).join(' ')}
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-normal drop-shadow-sm max-w-xl">
            {t('hero_description')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link
              href="/events"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-xl shadow-emerald-500/30 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
            >
              <span>{t('hero_btn_explore')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link
              href="/admission"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-base border border-white/40 backdrop-blur-md shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>{t('hero_btn_join')}</span>
            </Link>
          </div>

          {/* Trust Metrics Bar */}
          <div className="pt-6 border-t border-white/20 flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('hero_badge_active')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Certified Passes & QR Check-in</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span>4.9/5 Member Rating</span>
            </div>
          </div>
        </div>

        {/* Interactive Slide Controls & Navigation at Bottom Right */}
        <div className="absolute bottom-3 right-4 sm:right-8 flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 cursor-pointer rounded-full ${
                  currentSlide === idx
                    ? 'w-6 h-2 bg-emerald-400'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-bold text-white/80 pl-1 tracking-wider">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>
    </section>
  );
}
