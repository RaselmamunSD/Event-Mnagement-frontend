'use client';

import React, { useState } from 'react';
import { Member } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Calendar, Briefcase, Building, X, Mail, Phone, MapPin } from 'lucide-react';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const avatar = member.avatar || member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="group rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/20 p-6 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
      >
        {/* Subtle accent ray */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-80" />

        <div>
          <div className="flex items-start justify-between gap-3 mb-4 mt-1">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-emerald-500/20 group-hover:ring-emerald-500 transition-all duration-300 shadow-sm">
                <img
                  src={avatar}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </span>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg bg-emerald-500/10 dark:bg-emerald-950/70 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                {member.member_id}
              </span>
              <div>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {member.membership_type}
                </span>
              </div>
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {member.name}
          </h3>

          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {member.designation}
          </p>

          <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            {member.organization && (
              <div className="flex items-center gap-1.5 truncate">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{member.organization}</span>
              </div>
            )}
            {member.profession && (
              <div className="flex items-center gap-1.5 truncate">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{member.profession}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3 text-emerald-500" />
            {t('member_joined')}: {member.joining_date}
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
            View &rarr;
          </span>
        </div>
      </div>

      {/* Member Profile Modal */}
      {modalOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/20 dark:border-emerald-500/30 p-6 sm:p-8 relative">
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
                alt={member.name}
                className="w-24 h-24 rounded-3xl mx-auto object-cover ring-4 ring-emerald-500/20 shadow-md"
              />
              <span className="inline-block mt-3 px-3 py-1 text-xs font-mono font-bold rounded-lg bg-emerald-500/10 dark:bg-emerald-950/70 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                {member.member_id}
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {member.name}
              </h3>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {member.designation}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">
                {member.membership_type} Member • {member.status}
              </p>

              {member.bio && (
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-emerald-500/10 text-xs text-slate-700 dark:text-slate-300 text-left leading-relaxed">
                  {member.bio}
                </div>
              )}

              <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300 text-left bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                {member.organization && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Organization:</strong> {member.organization}</span>
                  </div>
                )}
                {member.profession && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Profession:</strong> {member.profession}</span>
                  </div>
                )}
                {member.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Address:</strong> {member.address}</span>
                  </div>
                )}
                {member.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Email:</strong> {member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Phone:</strong> {member.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
