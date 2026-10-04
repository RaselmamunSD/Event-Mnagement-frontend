'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../../context/LanguageContext';
import { EventItem } from '../../../lib/types';
import { api } from '../../../lib/api';
import RegistrationModal from '../../../components/RegistrationModal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  ChevronRight,
  Ticket,
  CheckCircle,
  Share2,
  CalendarCheck,
  Building,
} from 'lucide-react';

export default function EventDetailPage() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchDetail = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const data = await api.events.getBySlug(slug as string);
      setEvent(data);
    } catch (e) {
      console.error('Error fetching event details', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [slug]);

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-20 max-w-5xl mx-auto px-4 animate-pulse space-y-6">
        <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-96 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Event Not Found</h2>
        <p className="text-slate-500 mt-2 text-sm">
          The requested event may have been removed or has an invalid URL.
        </p>
        <Link
          href="/events"
          className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm"
        >
          Return to Events
        </Link>
      </div>
    );
  }

  const bannerImg = event.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-emerald-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/events" className="hover:text-emerald-600">Events</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px]">
          {event.title}
        </span>
      </nav>

      {/* Hero Banner with Overlay */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[340px] sm:h-[450px]">
        <img
          src={bannerImg}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

        <div className="absolute top-6 left-6 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white rounded-xl p-0.5 shadow-md flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md uppercase tracking-wider">
            {event.category}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
            {event.event_type.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        <div className="absolute top-6 right-6">
          <button
            type="button"
            onClick={copyShareLink}
            className="p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{copiedLink ? 'Copied Link' : 'Share'}</span>
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-4xl leading-tight">
            {event.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl line-clamp-2">
            {event.short_description}
          </p>
        </div>
      </div>

      {/* Grid: 2 Columns (Main Info + Registration Action Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          {/* Key Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                {t('event_details_date')}
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
                {event.date}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-500" />
                {t('event_details_time')}
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
                {event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                {t('event_details_venue')}
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1 truncate" title={event.venue}>
                {event.venue}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-500" />
                {t('event_details_organizer')}
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1 truncate" title={event.organizer}>
                {event.organizer}
              </p>
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              About This Event
            </h3>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {event.description || event.short_description}
            </div>
          </div>

          {/* Agenda & Schedule */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('event_details_agenda')}
              </h3>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-emerald-500/20">
                {event.agenda.map((item, index) => (
                  <div key={index} className="relative flex items-start gap-4 pl-8 group">
                    <span className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900"></span>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                          {item.time}
                        </span>
                      </div>
                      {item.speaker && (
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Speaker: {item.speaker}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Speakers */}
          {event.speakers && event.speakers.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('event_details_speakers')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {event.speakers.map((spk, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-2 shadow-xs"
                  >
                    <img
                      src={spk.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt={spk.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-emerald-500/20 shadow-sm"
                    />
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                      {spk.name}
                    </h4>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {spk.role}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {spk.company}
                    </p>
                    {spk.bio && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                        {spk.bio}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {event.gallery && event.gallery.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('event_details_gallery')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {event.gallery.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={`Gallery ${i}`}
                    className="w-full h-40 object-cover rounded-2xl shadow-sm hover:scale-105 transition-transform"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Registration Action Box */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="p-7 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/25 dark:border-emerald-500/30 shadow-2xl shadow-emerald-500/5 space-y-6 relative overflow-hidden">
            {/* Top highlight bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Admission Pass</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {Number(event.registration_fee) > 0 ? `৳${event.registration_fee}` : t('free_entry')}
              </span>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span>{t('event_capacity')}</span>
                <span className="font-bold text-slate-900 dark:text-white">{event.capacity} Attendees</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('event_seats_available')}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {event.available_seats} Seats Left
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('event_details_deadline')}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {new Date(event.registration_deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-2">
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (event.registered_count / (event.capacity || 1)) * 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-right">
                {event.registered_count} seats reserved ({Math.round((event.registered_count / (event.capacity || 1)) * 100)}%)
              </p>
            </div>

            {/* CTA Button */}
            {event.is_registration_open ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Ticket className="w-4 h-4" />
                <span>{t('btn_register_now')}</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs text-center font-medium">
                {t('registration_closed')}
              </div>
            )}

            <div className="pt-2 text-center text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Instant digital ticket generation with QR identification</span>
            </div>

            {/* Official Organizer Chip */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-11 h-11 bg-white rounded-xl p-0.5 shadow-xs border border-emerald-500/20 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="Shahjahanpur Railway Open Scout Group Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Official Organizer</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">Shahjahanpur Railway Open Scout Group</span>
                <span className="text-[10px] text-slate-500">Dhaka Railway District • Bangladesh Scouts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RegistrationModal
        event={event}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchDetail}
      />
    </div>
  );
}
