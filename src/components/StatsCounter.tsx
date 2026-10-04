'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Users, Calendar, Award, Clock } from 'lucide-react';
import { DashboardStats } from '../lib/types';

interface StatsProps {
  stats?: DashboardStats | null;
}

function Counter({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function StatsCounter({ stats }: StatsProps) {
  const { t } = useLanguage();

  const totalMembers = stats?.total_members ?? 500;
  const totalEvents = stats?.total_events ?? 48;
  const upcomingEvents = stats?.upcoming_events ?? 6;
  const yearsExperience = stats?.years_of_experience ?? 8;

  const items = [
    {
      label: t('stat_members'),
      value: totalMembers,
      suffix: '+',
      icon: Users,
      badge: 'Active Network',
      trend: '+24% this yr',
    },
    {
      label: t('stat_events'),
      value: totalEvents,
      suffix: '+',
      icon: Calendar,
      badge: 'Completed',
      trend: '100% Success',
    },
    {
      label: t('stat_upcoming'),
      value: upcomingEvents,
      suffix: '',
      icon: Clock,
      badge: 'Registrations Open',
      trend: 'High Demand',
    },
    {
      label: t('stat_experience'),
      value: yearsExperience,
      suffix: ' yrs',
      icon: Award,
      badge: 'Legacy',
      trend: 'National Impact',
    },
  ];

  return (
    <section className="pt-1 pb-6 sm:pt-2 sm:pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Top Subtle Emerald Gradient Ray */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-500/20 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{item.badge}</span>
                  </div>
                </div>

                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                  <Counter target={item.value} />
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{item.suffix}</span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-1">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {item.label}
                  </p>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 font-mono hidden sm:inline-block">
                    {item.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
