'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { EventItem } from '../../lib/types';
import { api } from '../../lib/api';
import EventCard from '../../components/EventCard';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function EventsPage() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState<string>('all');
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const eventSlides = [
    {
      image: '/event-slide-1.png',
      alt: 'সাঁতার প্রশিক্ষণ কার্যক্রম- ২০২৬ - শাহজাহানপুর রেলওয়ে ওপেন স্কাউট গ্রুপ',
    },
    {
      image: '/event-slide-2.jpg',
      alt: 'হজ্ব যাত্রীদের সেবাদান ক্যাম্প - বাংলাদেশ স্কাউটস',
    },
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? 1 : 0));

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {};
      if (statusTab !== 'all') params.status = statusTab;
      if (category !== 'all') params.category = category;
      if (search) params.search = search;

      const data = await api.events.getAll(params);
      setEvents(data.results || []);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [statusTab, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  const statusTabs = [
    { id: 'all', label: t('tab_all') },
    { id: 'upcoming', label: t('tab_upcoming') },
    { id: 'ongoing', label: t('tab_ongoing') },
    { id: 'completed', label: t('tab_completed') },
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'tech', label: 'Technology' },
    { id: 'conference', label: 'Conferences' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'seminar', label: 'Seminars' },
    { id: 'networking', label: 'Networking' },
    { id: 'cultural', label: 'Cultural' },
  ];

  return (
    <div className="relative">
      {/* Full-Bleed Hero Header Banner with 2-Image Slider (Starts directly under Announcement Bar, edge-to-edge full width) */}
      <section className="relative w-full overflow-hidden min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] flex items-center border-b border-slate-200 dark:border-slate-800">
        {/* Sliding Background Images (z-0: fully visible above background, 100% screen width) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {eventSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlide === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className={`w-full h-full object-cover object-center filter contrast-[1.05] brightness-100 transition-transform duration-7000 ease-out ${
                  currentSlide === idx ? 'scale-100' : 'scale-105'
                }`}
              />
            </div>
          ))}

          {/* Gentle, balanced overlay so the image details & text are 100% clearly visible */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
        </div>

        {/* Content on Banner - Left Aligned */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16">
          <div className="max-w-2xl text-left space-y-4 text-white">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400 tracking-tight drop-shadow-lg">
              {t('events_page_title')}
            </h1>

            <p className="text-sm sm:text-base sm:text-lg text-slate-100 leading-relaxed drop-shadow-md font-medium">
              {t('events_page_sub')}
            </p>
          </div>
        </div>

        {/* Slider Controls (Bottom Right) */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 shadow-lg z-20">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition cursor-pointer active:scale-90"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5">
            {eventSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 cursor-pointer rounded-full ${
                  currentSlide === idx
                    ? 'w-5 h-2 bg-emerald-400'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/90'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition cursor-pointer active:scale-90"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] font-bold text-white/90 pl-1 font-mono">
            {currentSlide + 1} / {eventSlides.length}
          </span>
        </div>
      </section>

      {/* Main Content Area: Filter & Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Control Panel: Status Tabs & Search & Category Filter */}
        <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full md:w-auto overflow-x-auto">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusTab(tab.id)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  statusTab === tab.id
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event title, venue..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </form>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                category === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-emerald-500/15 dark:border-slate-800 hover:border-emerald-500/50 hover:text-emerald-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} onRegistered={fetchEvents} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-slate-500">No events found matching your selected filters.</p>
        </div>
      )}
    </div>
  </div>
);
}
