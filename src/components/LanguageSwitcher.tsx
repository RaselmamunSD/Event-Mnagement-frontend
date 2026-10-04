'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="inline-flex items-stretch rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 shadow-xs overflow-hidden text-xs font-bold select-none p-0.5">
      <button
        type="button"
        onClick={() => setLocale('bn')}
        className={`px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
          locale === 'bn'
            ? 'bg-[#a7d8c2] dark:bg-emerald-800/80 text-[#0f382c] dark:text-emerald-100 font-extrabold shadow-2xs'
            : 'text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 bg-transparent'
        }`}
        aria-label="বাংলা"
        title="বাংলায় দেখুন"
      >
        বাং
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
          locale === 'en'
            ? 'bg-[#a7d8c2] dark:bg-emerald-800/80 text-[#0f382c] dark:text-emerald-100 font-extrabold shadow-2xs'
            : 'text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 bg-transparent'
        }`}
        aria-label="English"
        title="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
