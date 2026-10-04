'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { EventRegistration, AdmissionApplication } from '../../lib/types';
import { api } from '../../lib/api';
import {
  User,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Shield,
  FileText,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedTicket, setCopiedTicket] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    async function loadUserData() {
      try {
        setLoading(true);
        const [regRes, admRes] = await Promise.allSettled([
          api.registrations.getMy(),
          api.admissions.getMy(),
        ]);

        if (regRes.status === 'fulfilled') {
          setRegistrations(regRes.value.results || []);
        }
        if (admRes.status === 'fulfilled') {
          setAdmissions(admRes.value.results || []);
        }
      } catch (e) {
        console.error('Error fetching dashboard items', e);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadUserData();
    }
  }, [user, isLoading]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTicket(text);
    setTimeout(() => setCopiedTicket(null), 2000);
  };

  if (isLoading || !user) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-slate-500 text-sm">Loading user portal...</p>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
      {/* Profile Overview Card */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-xl overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Top accent ray */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {user.name}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-emerald-500/10 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            {user.phone && <p className="text-xs text-slate-400">{user.phone}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/20">
            <div className="w-8 h-8 bg-white rounded-lg p-0.5 flex items-center justify-center shrink-0 shadow-xs">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Shahjahanpur Railway Open Scout Group</span>
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition"
            >
              <Shield className="w-4 h-4" />
              <span>Open Admin Dashboard</span>
            </Link>
          )}
        </div>
      </div>

      {/* Grid: 2 Columns (My Event Passes + My Admission Applications) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Event Passes */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>My Event Registrations & Passes</span>
            </h2>
            <Link
              href="/events"
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Browse Events &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : registrations.length > 0 ? (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/20 shadow-sm hover:border-emerald-500/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {reg.status}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {reg.event_title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        {reg.event_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        {reg.event_time?.slice(0, 5)}
                      </span>
                      <span className="flex items-center gap-1 truncate max-w-[180px]">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {reg.event_venue}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-right w-full sm:w-auto">
                    <p className="text-[10px] uppercase font-semibold text-slate-400">Ticket Number</p>
                    <div className="flex items-center justify-between sm:justify-end gap-2 mt-0.5">
                      <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        {reg.ticket_number}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(reg.ticket_number)}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                        title="Copy ticket"
                      >
                        {copiedTicket === reg.ticket_number ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
              <p className="text-slate-500 text-xs">
                You haven't registered for any events yet.
              </p>
              <Link
                href="/events"
                className="inline-block mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
              >
                Explore Upcoming Events
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Admission Status */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Membership Applications</span>
            </h2>
            <Link
              href="/admission"
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Apply &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
          ) : admissions.length > 0 ? (
            <div className="space-y-4">
              {admissions.map((adm) => (
                <div
                  key={adm.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {adm.application_number}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        adm.status === 'approved'
                          ? 'bg-emerald-600 text-white'
                          : adm.status === 'rejected'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {adm.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Category: <strong className="text-slate-800 dark:text-slate-200 uppercase">{adm.membership_type}</strong>
                  </p>
                  <p className="text-xs text-slate-400">
                    Submitted on {new Date(adm.submitted_at).toLocaleDateString()}
                  </p>

                  {adm.admin_notes && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <strong>Executive Review:</strong> {adm.admin_notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
              <p className="text-slate-500 text-xs">No active membership applications found.</p>
              <Link
                href="/admission"
                className="inline-block mt-3 px-4 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white text-xs font-semibold"
              >
                Apply for Membership
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
