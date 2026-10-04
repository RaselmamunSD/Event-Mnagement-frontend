'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { EventItem } from '../lib/types';
import { Calendar, Clock, MapPin, Users, ArrowUpRight, Ticket, Sparkles } from 'lucide-react';
import RegistrationModal from './RegistrationModal';

interface EventCardProps {
  event: EventItem;
  onRegistered?: () => void;
  isFeatured?: boolean;
}

export default function EventCard({ event, onRegistered, isFeatured = false }: EventCardProps) {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const getStatusBadge = () => {
    switch (event.status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            {t('status_upcoming')}
          </span>
        );
      case 'ongoing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full bg-amber-500 text-white shadow-md shadow-amber-500/25 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            {t('status_ongoing')}
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 text-[11px] font-semibold rounded-full bg-slate-600/90 text-white backdrop-blur-md">
            {t('status_completed')}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-rose-500 text-white">
            {event.status}
          </span>
        );
    }
  };

  // Format month and day for calendar date badge
  const eventDateObj = new Date(event.date);
  const monthStr = eventDateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const dayStr = eventDateObj.getDate();

  const bannerImg =
    event.banner ||
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';

  const capacityPercent = Math.min(100, Math.round((event.registered_count / (event.capacity || 100)) * 100));

  return (
    <>
      <div className={`group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col overflow-hidden relative card-hover ${
        isFeatured ? 'min-h-[580px] lg:min-h-[640px]' : ''
      }`}>
        {/* Banner with Calendar Chip & Category */}
        <div className={`relative w-full overflow-hidden bg-slate-100 dark:bg-slate-800 ${
          isFeatured ? 'h-72 sm:h-80 lg:h-96' : 'h-56'
        }`}>
          <img
            src={bannerImg}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

          {/* Floating Calendar Badge on top-left */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className={`flex flex-col items-center justify-center ${isFeatured ? 'w-14 h-16' : 'w-12 h-14'} rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white shadow-lg border border-white/40 dark:border-slate-700/60 leading-none`}>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                {monthStr}
              </span>
              <span className={`${isFeatured ? 'text-xl sm:text-2xl' : 'text-lg'} font-black mt-0.5`}>
                {dayStr}
              </span>
            </div>
          </div>

          {/* Status & Category pill top-right */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
            {getStatusBadge()}
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-900/70 text-emerald-300 backdrop-blur-md uppercase tracking-wider border border-emerald-500/30">
              {event.category}
            </span>
          </div>

          {/* Fee / Free badge bottom-left */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-600/90 text-white backdrop-blur-md shadow-xs">
              {Number(event.registration_fee) > 0 ? `৳${event.registration_fee}` : t('free_entry')}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className={`${isFeatured ? 'p-7 sm:p-8 space-y-5' : 'p-6 space-y-4'} flex-1 flex flex-col justify-between`}>
          <div>
            {/* Time & Venue meta tags */}
            <div className={`flex flex-wrap items-center gap-y-1.5 gap-x-4 ${isFeatured ? 'text-xs sm:text-sm' : 'text-xs'} font-semibold text-slate-500 dark:text-slate-400 mb-2.5`}>
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{event.start_time.slice(0, 5)} - {event.end_time?.slice(0, 5)}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{event.venue}</span>
              </div>
            </div>

            <h3 className={`${isFeatured ? 'text-xl sm:text-2xl' : 'text-lg'} font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug`}>
              <Link href={`/events/${event.slug}`}>{event.title}</Link>
            </h3>

            <p className={`${isFeatured ? 'text-xs sm:text-sm line-clamp-3' : 'text-xs line-clamp-2'} text-slate-600 dark:text-slate-400 mt-2 leading-relaxed`}>
              {event.short_description}
            </p>

            {/* Capacity Progress Bar */}
            {event.is_registration_open && (
              <div className={`${isFeatured ? 'mt-6 pt-4' : 'mt-4 pt-3'} border-t border-slate-100 dark:border-slate-800/80 space-y-1.5`}>
                <div className={`flex items-center justify-between ${isFeatured ? 'text-xs' : 'text-[11px]'} font-bold`}>
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Seat Availability</span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {event.available_seats} {t('seats_left')}
                  </span>
                </div>
                <div className={`${isFeatured ? 'h-2' : 'h-1.5'} w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden`}>
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${capacityPercent}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2.5">
            <Link
              href={`/events/${event.slug}`}
              className={`flex-1 ${isFeatured ? 'py-3 text-sm' : 'py-2.5 text-xs'} px-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-center transition-all flex items-center justify-center gap-1 bg-slate-50/50 dark:bg-slate-800/40`}
            >
              <span>{t('btn_view_details')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {event.is_registration_open ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className={`flex-1 ${isFeatured ? 'py-3 text-sm' : 'py-2.5 text-xs'} px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold transition-all shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/35 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95`}
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>{t('btn_register_now')}</span>
              </button>
            ) : (
              <span className={`flex-1 ${isFeatured ? 'py-3 text-sm' : 'py-2.5 text-xs'} px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-semibold text-center select-none`}>
                {t('registration_closed')}
              </span>
            )}
          </div>
        </div>
      </div>

      <RegistrationModal
        event={event}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onRegistered}
      />
    </>
  );
}
