'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';
import {
  FacebookIcon,
  LinkedinIcon,
  YoutubeIcon,
  InstagramIcon,
} from './SocialIcons';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Organization Overview */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md">
                <img
                  src="/logo.png"
                  alt="Shahjahanpur Railway Open Scout Group Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold text-white tracking-tight block leading-snug">
                  {t('brand_title')}
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 block">
                  {t('brand_sub')}
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t('about_desc')}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-emerald-500 pl-2">
              {t('footer_quick_links')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                  {t('nav_home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/executive"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                  {t('nav_executive')}
                </Link>
              </li>
              <li>
                <Link
                  href="/members"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                  {t('nav_members')}
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                  {t('nav_events')}
                </Link>
              </li>
              <li>
                <Link
                  href="/admission"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                  {t('nav_admission')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-emerald-500 pl-2">
              {t('footer_contact_title')}
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-slate-300 text-xs sm:text-sm">
                  Shahjahanpur Railway Colony, Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="tel:01746792902"
                  className="text-slate-300 hover:text-emerald-400 transition-colors font-medium text-xs sm:text-sm"
                >
                  01746792902
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="mailto:srosg07@gmail.com"
                  className="text-slate-300 hover:text-emerald-400 transition-colors font-medium text-xs sm:text-sm"
                >
                  srosg07@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Social & Community */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 border-l-2 border-emerald-500 pl-2">
              {t('footer_social_title')}
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Stay connected with our upcoming activities and latest community updates.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{t('footer_rights')}</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              {t('footer_privacy')}
            </Link>
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              {t('footer_terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
