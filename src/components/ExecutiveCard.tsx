'use client';

import React, { useState } from 'react';
import { Executive } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';
import { Mail, X } from 'lucide-react';
import { LinkedinIcon, FacebookIcon, TwitterIcon } from './SocialIcons';

interface ExecutiveCardProps {
  executive: Executive;
}

export default function ExecutiveCard({ executive }: ExecutiveCardProps) {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const avatar = executive.avatar || executive.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80';

  return (
    <>
      <div className="group rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/20 p-6 sm:p-7 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden">
        {/* Subtle accent ribbon */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-90"></div>

        {/* Profile Avatar with status halo */}
        <div className="relative mt-2 mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden ring-4 ring-emerald-500/15 dark:ring-emerald-500/25 group-hover:ring-emerald-500/50 transition-all duration-500 shadow-md">
            <img
              src={avatar}
              alt={executive.name}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <span className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-md">
            #{executive.display_order}
          </span>
        </div>

        {/* Names & Designation */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {executive.name}
        </h3>

        <div className="mt-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/70 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          {executive.designation}
        </div>

        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
          {executive.department}
        </p>

        <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
          {executive.biography}
        </p>

        {/* Social Links & Bio Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 w-full flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {executive.social_links?.linkedin && (
              <a
                href={executive.social_links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-xs"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {executive.social_links?.facebook && (
              <a
                href={executive.social_links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-xs"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {executive.social_links?.twitter && (
              <a
                href={executive.social_links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-xs"
              >
                <TwitterIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {executive.social_links?.email && (
              <a
                href={`mailto:${executive.social_links.email}`}
                aria-label="Email"
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-xs"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            {t('exec_view_bio')} &rarr;
          </button>
        </div>
      </div>

      {/* Executive Details Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/20 dark:border-emerald-500/30 p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mt-2">
              <img
                src={avatar}
                alt={executive.name}
                className="w-24 h-24 rounded-3xl mx-auto object-cover ring-4 ring-emerald-500/20 shadow-lg"
              />
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4">
                {executive.name}
              </h3>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {executive.designation}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {executive.department} {executive.term ? `• Term: ${executive.term}` : ''}
              </p>

              <div className="mt-5 text-left p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-emerald-500/10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
                {executive.biography}
              </div>

              {(executive.phone || executive.email) && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
                  {executive.phone && <span>📞 {executive.phone}</span>}
                  {executive.email && <span>✉️ {executive.email}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
