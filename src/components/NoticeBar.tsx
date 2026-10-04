'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, ChevronRight, X, Sparkles } from 'lucide-react';

export default function NoticeBar() {
  const { locale } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const isBengali = locale === 'bn';

  const badgeText = isBengali ? 'জরুরি বিজ্ঞপ্তি' : 'ANNOUNCEMENT';

  const noticeItems = isBengali
    ? [
        {
          text: 'শাহজাহানপুর রেলওয়ে ওপেন স্কাউট গ্রুপ: নতুন স্কাউট ও রোভার সদস্য সংগ্রহ কার্যক্রম চলছে!',
          link: '/admission',
          linkText: 'আবেদন করুন',
        },
        {
          text: 'বাংলাদেশ স্কাউটস, ঢাকা রেলওয়ে জেলা: বার্ষিক স্কাউট সমাবেশ ও ক্যাম্পিং প্রশিক্ষণের নিবন্ধন উন্মুক্ত।',
          link: '/events',
          linkText: 'নিবন্ধন করুন',
        },
        {
          text: 'জরুরি প্রয়োজনে যোগাযোগ: ০১৭৪৬৭৯২৯০২ | ইমেইল: srosg07@gmail.com',
          link: 'tel:01746792902',
          linkText: 'কল করুন',
        },
      ]
    : [
        {
          text: 'Shahjahanpur Railway Open Scout Group: New Scout & Rover Scout membership enrollment is open!',
          link: '/admission',
          linkText: 'Apply Now',
        },
        {
          text: 'Bangladesh Scouts, Dhaka Railway District: Annual Scout Camporee & Training registration commenced.',
          link: '/events',
          linkText: 'Register Pass',
        },
        {
          text: 'Official Helpline: Call 01746792902 | Email: srosg07@gmail.com',
          link: 'tel:01746792902',
          linkText: 'Call Now',
        },
      ];

  const renderNoticeContent = () => (
    <div className="flex items-center gap-12 pr-12 text-xs sm:text-sm font-semibold tracking-wide text-emerald-950 dark:text-emerald-100">
      {noticeItems.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-ping"></span>
          <span>{item.text}</span>
          {item.link && (
            <Link
              href={item.link}
              className="inline-flex items-center gap-0.5 ml-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all font-bold text-[11px] shadow-xs hover:shadow-emerald-500/20"
            >
              <span>{item.linkText}</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          )}
          <span className="text-emerald-400 dark:text-emerald-600 mx-3 font-bold">•</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative z-40 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/80 dark:from-[#06241b] dark:via-[#092e23] dark:to-[#072d22] text-emerald-950 dark:text-emerald-100 border-b border-emerald-200/90 dark:border-emerald-800/60 shadow-xs overflow-hidden py-2 sm:py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Fixed Left Badge */}
        <div className="shrink-0 flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-xs backdrop-blur-xs select-none border border-emerald-700/20 dark:border-emerald-400/40">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{badgeText}</span>
          </div>
        </div>

        {/* Scrolling Continuous Marquee */}
        <div className="relative flex-1 overflow-hidden mask-[linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] cursor-pointer">
          <div className="animate-marquee flex items-center">
            {renderNoticeContent()}
            {renderNoticeContent()}
          </div>
        </div>

        {/* Right Close Button */}
        <div className="shrink-0 hidden sm:flex items-center pl-2">
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-md text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50 transition cursor-pointer"
            title="Dismiss notice"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
