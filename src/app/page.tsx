'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import Hero from '../components/Hero';
import StatsCounter from '../components/StatsCounter';
import EventCard from '../components/EventCard';
import { EventItem, DashboardStats } from '../lib/types';
import { api } from '../lib/api';
import {
  Compass,
  ArrowRight,
  Target,
  Eye,
  Flag,
  Network,
  Users2,
  CalendarCheck,
  GraduationCap,
  Award,
  Briefcase,
  Star,
  Quote,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, eventsRes] = await Promise.allSettled([
        api.stats.getDashboardStats(),
        api.events.getAll({ status: 'upcoming' }),
      ]);

      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
      }

      if (eventsRes.status === 'fulfilled') {
        const events = eventsRes.value.results || [];
        setUpcomingEvents(events.slice(0, 3));
        const featured = events.filter((e) => e.is_featured);
        setFeaturedEvents(featured.length ? featured.slice(0, 2) : events.slice(0, 2));
      }
    } catch (e) {
      console.error('Error fetching home page data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const whyJoinUsList = [
    {
      title: t('why_1_title'),
      desc: t('why_1_desc'),
      icon: Network,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: t('why_2_title'),
      desc: t('why_2_desc'),
      icon: Users2,
      color: 'from-teal-500 to-emerald-600',
    },
    {
      title: t('why_3_title'),
      desc: t('why_3_desc'),
      icon: CalendarCheck,
      color: 'from-green-500 to-teal-600',
    },
    {
      title: t('why_4_title'),
      desc: t('why_4_desc'),
      icon: GraduationCap,
      color: 'from-emerald-600 to-green-600',
    },
    {
      title: t('why_5_title'),
      desc: t('why_5_desc'),
      icon: Award,
      color: 'from-teal-600 to-emerald-700',
    },
    {
      title: t('why_6_title'),
      desc: t('why_6_desc'),
      icon: Briefcase,
      color: 'from-green-600 to-teal-800',
    },
  ];

  const testimonials = [
    {
      name: 'Tanvir Hossain',
      role: 'Senior Rover Mate & Software Engineer',
      quote:
        'Being a part of Shahjahanpur Railway Open Scout Group taught me lifelong discipline, crisis management, and the true spirit of selfless community service.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Nusrat Jahan',
      role: 'Assistant Scout Leader & Educator',
      quote:
        'The camps, jamborees, and youth leadership training arranged by our scout troop instill confidence and true moral values in every youngster.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Zubair Al Mahmud',
      role: 'Rover Scout & University Researcher',
      quote:
        'The outdoor pioneering skills, first aid masterclasses, and brotherhood in Dhaka Railway District have shaped my character and leadership capabilities.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div>
      {/* 1. Hero Section */}
      <Hero />

      <div className="space-y-14 sm:space-y-20 pt-2 sm:pt-4">
        {/* 2. Statistics Section (Animated Counters) */}
        <StatsCounter stats={stats} />

      {/* 3. Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>{t('section_upcoming_title')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('section_upcoming_title')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {t('section_upcoming_sub')}
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            <span>{t('btn_view_all_events')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800/60 animate-pulse"
              />
            ))}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} onRegistered={loadData} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8">
            <p className="text-slate-500">No upcoming events scheduled right now.</p>
          </div>
        )}
      </section>

      {/* 4. About Organization Split Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-emerald-500/5 via-teal-500/5 to-transparent dark:from-emerald-950/20 dark:via-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/80 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wide">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('about_title')}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {t('about_subtitle')}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('about_desc')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="group p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-emerald-500/20 dark:border-emerald-500/20 shadow-xs hover:border-emerald-500/60 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Flag className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('about_mission_title')}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {t('about_mission_desc')}
                  </p>
                </div>

                <div className="group p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-emerald-500/20 dark:border-emerald-500/20 shadow-xs hover:border-emerald-500/60 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('about_vision_title')}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {t('about_vision_desc')}
                  </p>
                </div>

                <div className="group p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-emerald-500/20 dark:border-emerald-500/20 shadow-xs hover:border-emerald-500/60 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <Target className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('about_goals_title')}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {t('about_goals_desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual Collage with Floating Badges */}
            <div className="lg:col-span-6 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    className="w-full h-64 sm:h-72 object-cover rounded-3xl shadow-xl ring-1 ring-emerald-500/20 hover:scale-[1.02] transition-transform duration-500"
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80"
                    alt="Community Conference"
                  />
                  <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-emerald-500/20 shadow-lg text-center">
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100+</p>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">National Summits Arranged</p>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/20 shadow-xl flex flex-col items-center text-center justify-center space-y-2.5">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl p-1.5 shadow-md border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                      <img src="/logo.png" alt="Shahjahanpur Railway Open Scout Group Emblem" className="w-full h-full object-contain filter drop-shadow-sm" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Official Group Emblem</span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight">শাহজাহানপুর রেলওয়ে ওপেন স্কাউট গ্রুপ</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">বাংলাদেশ স্কাউটস, ঢাকা রেলওয়ে জেলা</p>
                    </div>
                  </div>
                  <img
                    className="w-full h-56 sm:h-60 object-cover rounded-3xl shadow-xl ring-1 ring-emerald-500/20 hover:scale-[1.02] transition-transform duration-500"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
                    alt="Leadership Team"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Highlights Section */}
      {featuredEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('section_featured_title')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {t('section_featured_sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} onRegistered={loadData} isFeatured={true} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Why Join Us Section (Modern Bento-Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('why_title')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {t('why_sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyJoinUsList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-7 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle top indicator bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs font-extrabold text-emerald-600/60 dark:text-emerald-400/60">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>Explore Membership</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section className="py-20 bg-emerald-500/5 dark:bg-emerald-950/20 border-y border-emerald-500/10 dark:border-emerald-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('testimonials_title')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {t('testimonials_sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((tItem, i) => (
              <div
                key={i}
                className="group p-7 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm hover:shadow-xl hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{tItem.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
                  <img
                    src={tItem.avatar}
                    alt={tItem.name}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-xs"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {tItem.name}
                    </h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {tItem.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call to Action (CTA) Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 lg:p-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-2xl shadow-emerald-600/25 text-center">
          {/* Ambient Decorative Backing Circles */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {t('cta_title')}
            </h2>
            <p className="text-sm sm:text-base text-emerald-50 leading-relaxed max-w-2xl mx-auto">
              {t('cta_sub')}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/admission"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-emerald-800 font-bold text-sm shadow-xl hover:bg-emerald-50 hover:scale-105 transition-all cursor-pointer"
              >
                <span>{t('cta_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/events"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-700/60 hover:bg-emerald-700 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition-all cursor-pointer"
              >
                <span>{t('btn_view_all_events')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);
}
