'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Executive } from '../../lib/types';
import { api } from '../../lib/api';
import ExecutiveCard from '../../components/ExecutiveCard';
import { Search } from 'lucide-react';

export default function ExecutivePage() {
  const { t } = useLanguage();
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadExecutives() {
      try {
        setLoading(true);
        const data = await api.executives.getAll();
        setExecutives(data.results || []);
      } catch (err) {
        console.error('Failed to load executives', err);
      } finally {
        setLoading(false);
      }
    }
    loadExecutives();
  }, []);

  const filtered = executives.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.designation.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('exec_title')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('exec_sub')}
        </p>

        {/* Search bar & counter */}
        <div className="max-w-md mx-auto pt-2 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search executive by name or role..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/20 bg-white/90 dark:bg-slate-900/90 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm text-slate-900 dark:text-white backdrop-blur-md"
            />
          </div>
          <div className="text-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Showing {filtered.length} leadership members
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((exec) => (
            <ExecutiveCard key={exec.id} executive={exec} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-slate-500">No executive members match your query.</p>
        </div>
      )}
    </div>
  );
}
